"""tests/test_api.py — API-level integration tests using FastAPI TestClient.

Tests every HTTP endpoint end-to-end with the baked golden records,
verifying response codes, content-types, and JSON structure.
"""

import unittest

from fastapi.testclient import TestClient

from app.main import app


class TestHealthEndpoint(unittest.TestCase):
    """Test the /health endpoint."""

    def setUp(self):
        self.client = TestClient(app)

    def test_health_returns_ok(self):
        resp = self.client.get("/health")
        self.assertEqual(resp.status_code, 200)
        body = resp.json()
        self.assertEqual(body["status"], "ok")
        self.assertEqual(body["service"], "crucible-product-intelligence")
        self.assertIn("products_in_store", body)

    def test_health_has_products_loaded(self):
        resp = self.client.get("/health")
        body = resp.json()
        self.assertGreater(body["products_in_store"], 0)


class TestProductsEndpoint(unittest.TestCase):
    """Test /products list and detail endpoints."""

    def setUp(self):
        self.client = TestClient(app)

    def test_list_products_returns_array(self):
        resp = self.client.get("/products")
        self.assertEqual(resp.status_code, 200)
        products = resp.json()
        self.assertIsInstance(products, list)
        self.assertGreaterEqual(len(products), 3)

    def test_list_products_have_required_fields(self):
        resp = self.client.get("/products")
        products = resp.json()
        for prod in products:
            self.assertIn("sku", prod)
            self.assertIn("fields", prod)
            self.assertIn("overall_confidence", prod)
            self.assertIn("overall_status", prod)

    def test_get_product_by_sku(self):
        resp = self.client.get("/products/6205-2RSH")
        self.assertEqual(resp.status_code, 200)
        prod = resp.json()
        self.assertEqual(prod["sku"], "6205-2RSH")
        self.assertIn("bore_diameter", prod["fields"])

    def test_get_product_not_found(self):
        resp = self.client.get("/products/NONEXISTENT-SKU-999")
        self.assertEqual(resp.status_code, 404)

    def test_search_filter(self):
        resp = self.client.get("/products", params={"search": "groove"})
        self.assertEqual(resp.status_code, 200)
        products = resp.json()
        for prod in products:
            name_lower = (prod.get("product_name") or "").lower()
            sku_lower = prod["sku"].lower()
            self.assertTrue(
                "groove" in name_lower or "groove" in sku_lower,
                f"Product {prod['sku']} does not match search 'groove'",
            )

    def test_status_filter(self):
        resp = self.client.get("/products", params={"status": "validated"})
        self.assertEqual(resp.status_code, 200)
        products = resp.json()
        for prod in products:
            self.assertEqual(prod["overall_status"], "validated")

    def test_confidence_filter(self):
        resp = self.client.get("/products", params={"min_confidence": "0.9"})
        self.assertEqual(resp.status_code, 200)
        products = resp.json()
        for prod in products:
            self.assertGreaterEqual(prod["overall_confidence"], 0.9)


class TestExplainEndpoint(unittest.TestCase):
    """Test /products/{sku}/explain/{field} deep evidence trail."""

    def setUp(self):
        self.client = TestClient(app)

    def test_explain_field_returns_decision(self):
        resp = self.client.get("/products/6205-2RSH/explain/bore_diameter")
        self.assertEqual(resp.status_code, 200)
        decision = resp.json()
        self.assertEqual(decision["field"], "bore_diameter")
        self.assertIn("final_value", decision)
        self.assertIn("candidates", decision)
        self.assertIn("decision_reason", decision)
        self.assertIsInstance(decision["candidates"], list)

    def test_explain_field_has_evidence_citations(self):
        resp = self.client.get("/products/6205-2RSH/explain/bore_diameter")
        decision = resp.json()
        for cand in decision["candidates"]:
            evidence = cand["evidence"]
            self.assertIn("source_name", evidence)
            self.assertIn("snippet", evidence)
            self.assertIn("extraction_confidence", evidence)

    def test_explain_invalid_field(self):
        resp = self.client.get("/products/6205-2RSH/explain/nonexistent_field")
        self.assertEqual(resp.status_code, 404)

    def test_explain_invalid_sku(self):
        resp = self.client.get("/products/FAKE-SKU/explain/bore_diameter")
        self.assertEqual(resp.status_code, 404)


class TestReviewEndpoint(unittest.TestCase):
    """Test /review queue and decision submission."""

    def setUp(self):
        self.client = TestClient(app)

    def test_review_queue_returns_list(self):
        resp = self.client.get("/review")
        self.assertEqual(resp.status_code, 200)
        queue = resp.json()
        self.assertIsInstance(queue, list)

    def test_review_queue_items_have_required_fields(self):
        resp = self.client.get("/review")
        queue = resp.json()
        for item in queue:
            self.assertIn("sku", item)
            self.assertIn("field", item)
            self.assertIn("candidates", item)
            self.assertIn("decision_reason", item)


class TestExportEndpoints(unittest.TestCase):
    """Test /export/json, /export/csv, and /metrics."""

    def setUp(self):
        self.client = TestClient(app)

    def test_export_json(self):
        resp = self.client.get("/export/json")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

    def test_export_csv_content_type(self):
        resp = self.client.get("/export/csv")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("text/csv", resp.headers.get("content-type", ""))
        self.assertIn("sku,product_name", resp.text)
        self.assertIn("6205-2RSH", resp.text)

    def test_export_csv_has_disposition_header(self):
        resp = self.client.get("/export/csv")
        self.assertIn("content-disposition", resp.headers)
        self.assertIn("crucible_commerce_catalog.csv", resp.headers["content-disposition"])

    def test_metrics_endpoint(self):
        resp = self.client.get("/metrics")
        self.assertEqual(resp.status_code, 200)
        metrics = resp.json()
        self.assertIn("total_products", metrics)
        self.assertIn("avg_confidence", metrics)
        self.assertIn("enrichment_rate_pct", metrics)
        self.assertIn("estimated_hours_saved", metrics)
        self.assertGreater(metrics["total_products"], 0)
        self.assertGreater(metrics["avg_confidence"], 0.5)

    def test_metrics_consistency(self):
        """Verify metrics math: validated + conflict_resolved + needs_review should relate to total."""
        resp = self.client.get("/metrics")
        metrics = resp.json()
        status_sum = (
            metrics["validated_count"]
            + metrics["conflict_resolved_count"]
            + metrics["needs_review_count"]
        )
        self.assertEqual(status_sum, metrics["total_products"])


if __name__ == "__main__":
    unittest.main()
