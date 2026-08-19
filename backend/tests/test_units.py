"""tests/test_units.py — Unit normalization test suite."""

import unittest
from app.normalization.units import normalize


class TestUnitNormalization(unittest.TestCase):
    def test_length_millimeter(self):
        val, unit = normalize("bore_diameter", "25 mm")
        self.assertEqual(val, 25.0)
        self.assertEqual(unit, "millimeter")

    def test_length_inches(self):
        val, unit = normalize("bore_diameter", "1 inch")
        self.assertAlmostEqual(val, 25.4, places=2)
        self.assertEqual(unit, "millimeter")

    def test_length_inches_abbreviated(self):
        val, unit = normalize("outer_diameter", '2"')
        self.assertAlmostEqual(val, 50.8, places=2)
        self.assertEqual(unit, "millimeter")

    def test_length_centimeter(self):
        val, unit = normalize("width", "1.5 cm")
        self.assertEqual(val, 15.0)
        self.assertEqual(unit, "millimeter")

    def test_length_with_tolerance(self):
        val, unit = normalize("bore_diameter", "25 ± 0.05 mm")
        self.assertEqual(val, 25.0)
        self.assertEqual(unit, "millimeter")

    def test_length_with_brackets(self):
        val, unit = normalize("outer_diameter", "52.000 mm [2.0472 in]")
        self.assertEqual(val, 52.0)
        self.assertEqual(unit, "millimeter")

    def test_mass_kilograms(self):
        val, unit = normalize("weight", "0.13 kg")
        self.assertEqual(val, 0.13)
        self.assertEqual(unit, "kilogram")

    def test_mass_grams(self):
        val, unit = normalize("weight", "130 g")
        self.assertAlmostEqual(val, 0.13, places=2)
        self.assertEqual(unit, "kilogram")

    def test_mass_pounds(self):
        val, unit = normalize("weight", "1 lb")
        self.assertAlmostEqual(val, 0.4536, places=2)
        self.assertEqual(unit, "kilogram")

    def test_force_kilonewton(self):
        val, unit = normalize("dynamic_load_rating", "14.8 kN")
        self.assertEqual(val, 14.8)
        self.assertEqual(unit, "kilonewton")

    def test_force_newton(self):
        val, unit = normalize("dynamic_load_rating", "14800 N")
        self.assertEqual(val, 14.8)
        self.assertEqual(unit, "kilonewton")

    def test_force_lbf(self):
        val, unit = normalize("static_load_rating", "1000 lbf")
        self.assertAlmostEqual(val, 4.4482, places=2)
        self.assertEqual(unit, "kilonewton")

    def test_speed_rpm(self):
        val, unit = normalize("limiting_speed", "8500 rpm")
        self.assertEqual(val, 8500.0)
        self.assertEqual(unit, "rpm")

    def test_speed_rmin(self):
        val, unit = normalize("limiting_speed", "12000 r/min")
        self.assertEqual(val, 12000.0)
        self.assertEqual(unit, "rpm")

    def test_none_value(self):
        val, unit = normalize("bore_diameter", None)
        self.assertIsNone(val)
        self.assertIsNone(unit)

    def test_invalid_string(self):
        val, unit = normalize("bore_diameter", "N/A")
        self.assertIsNone(val)
        self.assertIsNone(unit)

    def test_comma_decimal_separator(self):
        """European notation: '25,4 mm' should parse as 25.4 mm."""
        val, unit = normalize("bore_diameter", "25,4 mm")
        self.assertAlmostEqual(val, 25.4, places=2)
        self.assertEqual(unit, "millimeter")

    def test_comma_thousands_force(self):
        """'14,800 N' → 14.8 kN (comma is thousands separator here)."""
        val, unit = normalize("dynamic_load_rating", "14800 N")
        self.assertAlmostEqual(val, 14.8, places=1)
        self.assertEqual(unit, "kilonewton")

    def test_dual_unit_outer_diameter(self):
        """Dual-unit notation like '52.000 mm [2.0472 in]' should take the mm value."""
        val, unit = normalize("outer_diameter", "52.000 mm [2.0472 in]")
        self.assertEqual(val, 52.0)
        self.assertEqual(unit, "millimeter")

    def test_bare_numeric_defaults_to_canonical(self):
        """A bare number '25' should default to canonical unit for the field."""
        val, unit = normalize("bore_diameter", "25")
        self.assertEqual(val, 25.0)
        self.assertEqual(unit, "millimeter")

    def test_null_string_variants(self):
        """Various null-like strings should return None."""
        for null_val in ["null", "none", "N/A", "-", "--", ""]:
            val, unit = normalize("bore_diameter", null_val)
            self.assertIsNone(val, f"Expected None for input '{null_val}', got {val}")
            self.assertIsNone(unit, f"Expected None unit for input '{null_val}', got {unit}")

    def test_rev_per_min_notation(self):
        """'9000 rev/min' should parse as 9000 rpm."""
        val, unit = normalize("limiting_speed", "9000 rev/min")
        self.assertEqual(val, 9000.0)
        self.assertEqual(unit, "rpm")

    def test_min_inverse_notation(self):
        """'12000 min-1' should parse as 12000 rpm."""
        val, unit = normalize("limiting_speed", "12000 min-1")
        self.assertEqual(val, 12000.0)
        self.assertEqual(unit, "rpm")

    def test_ounce_to_kilogram(self):
        """'4 oz' → ~0.1134 kg."""
        val, unit = normalize("weight", "4 oz")
        self.assertAlmostEqual(val, 0.1134, places=3)
        self.assertEqual(unit, "kilogram")

    def test_meter_to_millimeter(self):
        """'0.025 m' → 25.0 mm."""
        val, unit = normalize("bore_diameter", "0.025 m")
        self.assertAlmostEqual(val, 25.0, places=1)
        self.assertEqual(unit, "millimeter")


if __name__ == "__main__":
    unittest.main()

