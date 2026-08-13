# 3-Minute Video Demo Script: Crucible

## [0:00 - 0:30] Hook & Problem Statement
- **Visual**: Show a split screen of a messy, incomplete industrial CSV + a 50-page complex PDF datasheet.
- **Narrative**:
  > "Industrial companies manage millions of complex parts. But product data is trapped across messy CSVs, PDF engineering datasheets, and legacy ERPs. A single wrong spec—like a 25mm bore instead of 1-inch—leads to catastrophic equipment downtime and costly returns.
  > 
  > Current AI solutions fail because generic LLM chatbots hallucinate dimensions and can't be trusted.
  > Meet **Crucible**: AI-Powered Product Intelligence for Industrial Commerce. Our governing rule: **The AI reads, the code decides.**"

## [0:30 - 1:15] The 6-Stage Pipeline in Action
- **Visual**: Navigate to Crucible Workspace (`localhost:3000`). Highlight the 6-stage pipeline tracker.
- **Narrative**:
  > "Crucible operates across a 6-stage typed pipeline:
  > 1. **Parse**: Extracting multi-page tables from PDFs and CSVs.
  > 2. **Extract**: Gemini 2.5 extracts structured attributes with strict JSON schemas.
  > 3. **Normalize**: Deterministic Pint conversions standardize units to canonical millimeters, kilograms, kilonewtons, and RPM.
  > 4. **Validate**: Enforces physical laws—such as Outer Diameter must exceed Inner Bore, and dynamic load capacity bounds.
  > 5. **Resolve**: When sources conflict, authority ranking selects the true winner with mathematical proof.
  > 6. **Export**: Ready for ERP, PIM, or eCommerce import."

## [1:15 - 2:00] Deep Explainability & Evidence Inspector
- **Visual**: Click on SKU `6205-2RSH` -> click on `bore_diameter`. Open the Evidence Inspector drawer.
- **Narrative**:
  > "Notice that every single value in Crucible carries verifiable evidence. When we inspect the 25.0 mm bore diameter, we don't just get a number—we see the exact PDF datasheet name, Page 2 citation, verbatim quotation, and validation checks passed.
  > 
  > Our confidence score is not a black-box LLM rating; it's a transparent formula combining extraction clarity, source authority, and physical law compliance."

## [2:00 - 2:35] Human-in-the-Loop Review Queue
- **Visual**: Navigate to `/review` tab. Show `32005-X` rating discrepancy. Click "Select This Candidate" or apply manual override.
- **Narrative**:
  > "When sources conflict with equal ambiguity, Crucible doesn't guess. It routes the discrepancy directly to our **Human-in-the-Loop Review Queue**. 
  > Here, an engineer compares the side-by-side citations from Timken and ISO catalogs, makes an informed decision with one click, or inputs a custom override with instant catalog-wide recalculation."

## [2:35 - 3:00] Business Impact & Commerce Export
- **Visual**: Click "Export CSV" and "Export JSON". Show the downloaded file and the ROI savings metric.
- **Narrative**:
  > "With one click, Crucible exports commerce-ready structured JSON and ERP-compatible CSV catalogs, saving an estimated 15 minutes of manual engineering review per SKU.
  > 
  > Built with Python, FastAPI, Gemini 2.5, Pint, and Next.js, Crucible brings trust, speed, and precision to industrial commerce. Thank you."
