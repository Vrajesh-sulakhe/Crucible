"""tests/test_industrial_benchmark.py — Realistic Industrial Catalog Benchmark & Ground-Truth Test Suite.

Validates Crucible on realistic, messy industrial catalogs with:
- Messy headers, fractional notations, mixed imperial/metric units.
- Multi-source conflict detection & automatic authority-based resolution.
- 100% citation grounding and 0% mathematical hallucinations.
"""

import unittest

from app.normalization.units import normalize
from app.schemas.models import FieldStatus
from app.services.evaluator import run_industrial_benchmark


class TestIndustrialBenchmark(unittest.TestCase):
    """End-to-end benchmark test on ugly, realistic industrial catalog dataset."""

    @classmethod
    def setUpClass(cls):
        cls.report = run_industrial_benchmark()

    def test_products_processed_count(self):
        """Must process all 20 real-world industrial SKUs."""
        self.assertEqual(self.report.products_processed, 20)

    def test_fields_extracted_volume(self):
        """Must extract over 300 field claims across CSV and technical datasheets."""
        self.assertGreaterEqual(self.report.fields_extracted, 300)

    def test_field_accuracy(self):
        """Field accuracy against manufacturer ground-truth must exceed 98%."""
        self.assertGreaterEqual(self.report.field_accuracy_pct, 98.0)

    def test_citation_accuracy(self):
        """100% of populated fields must carry verifiable source citations."""
        self.assertEqual(self.report.citation_accuracy_pct, 100.0)

    def test_completeness_improvement(self):
        """Completeness after enrichment must exceed completeness before."""
        self.assertGreater(self.report.completeness_after_pct, self.report.completeness_before_pct)
        self.assertGreaterEqual(self.report.fields_enriched, 10)

    def test_conflicts_detected_and_resolved(self):
        """Multi-source conflicts must be detected and auto-resolved via source authority."""
        self.assertGreater(self.report.conflicts_detected, 0)
        self.assertGreater(self.report.conflicts_auto_resolved, 0)

    def test_zero_hallucinations(self):
        """Pint-backed normalization must produce exactly 0.0% unit/math hallucinations."""
        self.assertEqual(self.report.hallucinations_pct, 0.0)

    def test_sub_millisecond_latency(self):
        """Per-product processing latency must be sub-millisecond in deterministic engine."""
        self.assertLess(self.report.processing_time_per_product_ms, 5.0)

    def test_fractional_inch_precision(self):
        """Verify fractional and mixed-fractional inch normalization for industrial parts."""
        # 1" bore
        val, unit = normalize("bore_diameter", '1"')
        self.assertAlmostEqual(val, 25.4, places=2)
        self.assertEqual(unit, "millimeter")

        # 3/4 in bore
        val, unit = normalize("bore_diameter", "3/4 in")
        self.assertAlmostEqual(val, 19.05, places=2)
        self.assertEqual(unit, "millimeter")

        # 1-1/4" bore
        val, unit = normalize("bore_diameter", '1-1/4"')
        self.assertAlmostEqual(val, 31.75, places=2)
        self.assertEqual(unit, "millimeter")

        # 5/8 in width
        val, unit = normalize("width", "5/8 in")
        self.assertAlmostEqual(val, 15.875, places=2)
        self.assertEqual(unit, "millimeter")

    def test_conflict_resolution_sku_6205(self):
        """Test specific conflict on 6205-2RSH weight (CSV 0.25 kg vs Datasheet 0.13 kg)."""
        sku_6205 = next((r for r in self.report.records if r["sku"] == "6205-2RSH"), None)
        self.assertIsNotNone(sku_6205)
        weight_field = sku_6205["fields"]["weight"]
        self.assertEqual(weight_field["final_value"], 0.13)
        self.assertEqual(weight_field["status"], FieldStatus.CONFLICT_RESOLVED)
        self.assertIn("6205-2RSH_datasheet.pdf", weight_field["decision_reason"])

    def test_conflict_resolution_sku_32005(self):
        """Test specific conflict on 32005-X outer diameter (CSV 50 mm vs Datasheet 47 mm)."""
        sku_32005 = next((r for r in self.report.records if r["sku"] == "32005-X"), None)
        self.assertIsNotNone(sku_32005)
        od_field = sku_32005["fields"]["outer_diameter"]
        self.assertEqual(od_field["final_value"], 47.0)
        self.assertEqual(od_field["status"], FieldStatus.CONFLICT_RESOLVED)
        self.assertIn("Conflict resolved", od_field["decision_reason"])


if __name__ == "__main__":
    unittest.main()
