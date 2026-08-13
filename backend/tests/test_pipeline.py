"""tests/test_pipeline.py — Integration and pipeline tests."""

import unittest
from app.merging.conflict_resolver import resolve_field
from app.schemas.models import Candidate, Evidence, FieldStatus, SourceType
from app.services.baked import load_golden_records
from app.services.exporter import compute_metrics, export_csv, export_json


class TestPipelineAndMerging(unittest.TestCase):
    def test_baked_records_load(self):
        records = load_golden_records()
        self.assertGreaterEqual(len(records), 3)
        skus = [r.sku for r in records]
        self.assertIn("6205-2RSH", skus)
        self.assertIn("6000-ZZ", skus)

    def test_conflict_resolution_datasheet_over_csv(self):
        # Candidate 1: Manufacturer datasheet (authority 1.0)
        c1 = Candidate(
            raw_value="0.13 kg",
            normalized_value=0.13,
            unit="kilogram",
            evidence=Evidence(
                source_name="SKF.pdf",
                source_type=SourceType.MANUFACTURER_DATASHEET,
                page=2,
                snippet="Mass = 0.13 kg",
                extraction_confidence=0.98,
            ),
        )
        # Candidate 2: CSV with conflicting weight
        c2 = Candidate(
            raw_value="0.25 kg",
            normalized_value=0.25,
            unit="kilogram",
            evidence=Evidence(
                source_name="legacy.csv",
                source_type=SourceType.CSV,
                page=None,
                snippet="weight: 0.25 kg",
                extraction_confidence=0.85,
            ),
        )

        decision = resolve_field("weight", [c1, c2])
        self.assertEqual(decision.final_value, 0.13)
        self.assertEqual(decision.status, FieldStatus.CONFLICT_RESOLVED)
        self.assertIn("Conflict resolved", decision.decision_reason)

    def test_export_json_and_csv(self):
        records = load_golden_records()
        json_out = export_json(records)
        self.assertIsInstance(json_out, list)
        self.assertEqual(len(json_out), len(records))

        csv_out = export_csv(records)
        self.assertIn("sku,product_name", csv_out)
        self.assertIn("6205-2RSH", csv_out)

    def test_metrics_computation(self):
        records = load_golden_records()
        metrics = compute_metrics(records)
        self.assertGreater(metrics["total_products"], 0)
        self.assertGreater(metrics["avg_confidence"], 0.7)
        self.assertGreater(metrics["enrichment_rate_pct"], 80.0)


if __name__ == "__main__":
    unittest.main()
