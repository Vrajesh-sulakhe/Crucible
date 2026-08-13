# Crucible Data Layer

This folder houses raw datasets, tracking sheets, and pre-computed golden benchmarks for the Crucible Industrial Product Intelligence engine.

## Directory Structure

- `csv/`: Raw and messy tabular product catalogs (`sample_products.csv`).
- `golden/`: Ground-truth pre-computed `ProductRecord` JSON structures (`sample_baked.json`) for zero-latency, zero-spend demo mode.
- `pdfs/`: Industrial datasheets and technical catalogs (SKF, NSK, FAG, Timken, NTN).
- `pdf_tracker.csv`: Catalog metadata index recording extraction readiness and page specs.
