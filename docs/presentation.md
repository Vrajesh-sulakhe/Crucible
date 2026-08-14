# CRUCIBLE — Pitch Presentation Deck

> **AI-Powered Product Intelligence for Industrial Commerce**  
> *UniHack 2026 / Unilog Hackathon Submission*

---

## Slide 1: Title & Vision
- **Project**: CRUCIBLE
- **Tagline**: Transforming scattered industrial data into verifiable, accurate, commerce-ready product intelligence.
- **The Governing Rule**: *"The AI Reads. The Code Decides."*

---

## Slide 2: The Core Industry Problem
- **The $100M Catalog Bottleneck**: Industrial distributors and manufacturers manage millions of complex SKUs across messy CSVs, 50-page PDF datasheets, and legacy ERP dumps.
- **The Risk of Generic AI**:
  - LLMs hallucinate numbers and units (e.g. converting 1" to 25mm instead of 25.4mm).
  - A single incorrect bore dimension causes catastrophic machine failure, unplanned downtime, and expensive product returns.
  - Black-box confidence ratings provide zero verifiable evidence for catalog managers.

---

## Slide 3: The Solution — 6-Stage Hybrid Architecture
1. **Stage 1 (Parse)**: `pdfplumber` & `PyMuPDF` extract multi-page tables while preserving bounding box and page number coordinates.
2. **Stage 2 (Extract - LLM)**: Gemini 2.5 Flash / OpenAI extracts structured attributes with strict JSON schemas and verbatim quotes.
3. **Stage 3 (Normalize - Deterministic)**: `pint` unit registry standardizes mixed imperial/metric units to canonical values (mm, kg, kN, rpm) with **0% math error**.
4. **Stage 4 (Validate - Physics)**: Automated physical law verification ($Outer\ \varnothing > Bore\ \varnothing$, section thickness, speed limit factors).
5. **Stage 5 (Resolve - Trust Layer)**: Authority-weighted candidate ranking (Datasheets $1.0 >$ Catalogs $0.8 >$ ERP $0.6 >$ CSV $0.2$) with transparent mathematical confidence proof.
6. **Stage 6 (Export)**: Instant eCommerce JSON and ERP-compatible flat CSV.

---

## Slide 4: Innovation & Unfair Advantages
- **Verbatim Grounding**: Every single attribute is tied to an exact PDF document name, page number, and verbatim quotation.
- **Physical Law Verification**: Impossible mechanical specs are rejected before they pollute e-commerce catalogs.
- **Human-in-the-Loop Review Queue**: Discrepancies and rating collisions (e.g. ISO vs. Timken load standards) are isolated for 1-click engineering arbitration.
- **Dual-Engine Design**: Instant zero-latency Baked Golden Demo mode for evaluation + live AI extraction pipeline with SHA-256 caching.

---

## Slide 5: Business ROI for Unilog & Industrial Commerce
- **85% Labor Reduction**: Eliminates ~15 minutes of manual cataloging per SKU.
- **Zero Math Hallucinations**: 100% deterministic unit conversion.
- **Rapid Commerce Sync**: Direct compatibility with Shopify, BigCommerce, SAP, and Unilog PIM.
