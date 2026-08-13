"""tests/test_validation.py — Range and physical constraint validation test suite."""

import unittest
from app.validation.rules import cross_field_checks, validate_field


class TestValidationRules(unittest.TestCase):
    def test_valid_field_range(self):
        ok, notes = validate_field("bore_diameter", 25.0)
        self.assertTrue(ok)
        self.assertEqual(len(notes), 0)

    def test_out_of_range_bore(self):
        ok, notes = validate_field("bore_diameter", 5000.0)
        self.assertFalse(ok)
        self.assertTrue(any("outside plausible" in n for n in notes))

    def test_missing_value(self):
        ok, notes = validate_field("bore_diameter", None)
        self.assertFalse(ok)
        self.assertIn("missing value", notes)

    def test_cross_field_valid(self):
        norm = {
            "bore_diameter": 25.0,
            "outer_diameter": 52.0,
            "width": 15.0,
            "dynamic_load_rating": 14.8,
            "static_load_rating": 7.8,
            "limiting_speed": 8500.0,
        }
        issues = cross_field_checks(norm)
        self.assertEqual(len(issues), 0)

    def test_cross_field_outer_less_than_bore(self):
        norm = {
            "bore_diameter": 52.0,
            "outer_diameter": 25.0,
            "width": 15.0,
        }
        issues = cross_field_checks(norm)
        self.assertIn("outer_diameter", issues)
        self.assertTrue(any("must be greater than bore" in msg for msg in issues["outer_diameter"]))

    def test_cross_field_width_exceeds_outer(self):
        norm = {
            "bore_diameter": 25.0,
            "outer_diameter": 52.0,
            "width": 80.0,
        }
        issues = cross_field_checks(norm)
        self.assertIn("width", issues)
        self.assertTrue(any("cannot exceed outer diameter" in msg for msg in issues["width"]))


if __name__ == "__main__":
    unittest.main()
