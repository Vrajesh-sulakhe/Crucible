# Hack2Skill Submission Package — UniHack 2026

**Event**: UniHack 2026 by Unilog  
**Problem Statement**: AI-Powered Product Intelligence for Industrial Commerce  
**Project Title**: **Crucible — Industrial Product Intelligence Engine**  
**Team**: Vrajesh Sulakhe (`vbsulakhe21@gmail.com`)

---

## 1. Project Overview & Executive Summary

Industrial distributors and manufacturers manage millions of complex technical products across fragmented, messy sources: supplier spreadsheets, 50-page PDF datasheets, legacy ERP dumps, and web catalogs. Converting this scattered data into structured, validated, commerce-ready product information currently costs millions in manual engineering review.

**Crucible** automates industrial product intelligence **without sacrificing trust**. Built around the governing principle **"The AI Reads, The Code Decides"**, Crucible confines generative LLMs strictly to unstructured document understanding while executing all mathematical conversions, physical law validations, and multi-source conflict arbitrations with deterministic, testable Python code.

---

## 2. Key Features & Deliverables

### A. Structured Data Generation
- Multi-modal parser ingesting messy CSV catalogs alongside complex PDF datasheets (SKF, NSK, FAG, Timken, NTN).
- Extracts 14+ standardized attributes per industrial bearing (dimensions, load ratings, speed limits, materials, enclosures, tolerances).

### B. Deterministic Accuracy & Consistency
- **Pint Unit Normalization**: 100% deterministic conversion of mixed imperial/metric units (inches, mm, fractions, lbs, grams, kN, N, lbf, rpm) with zero math hallucination.
- **Taxonomy Canonicalization**: Automatic mapping of UNSPSC categories, alloy standards (AISI 52100 / 100Cr6 $\to$ Chrome Steel), and seal types.

### C. AI Validation & Explainable Proof
- **Physical Law Verification**: Automated engineering checks enforcing $Outer\ \varnothing > Bore\ \varnothing$, section thickness limits, dynamic vs. static load consistency, and speed factor limits ($n \cdot d_m$).
- **Verbatim Evidence Citations**: Every field carries an auditable citation with source document name, page number, and verbatim quotation.
- **Mathematical Confidence Formula**: Transparent scoring ($0.5 \cdot C_{\text{ext}} + 0.3 \cdot A_{\text{auth}} + 0.2 \cdot V_{\text{score}}$) with zero black-box self-ratings.

### D. Scalable Catalog Engine & HITL
- **Human-in-the-Loop Review Queue**: Side-by-side collision arbitration for conflicting sources with 1-click candidate selection and manual engineering overrides.
- **Commerce Export**: Direct 1-click download of ERP-ready flat CSVs and eCommerce JSONs (Shopify, SAP, BigCommerce).
- **Interactive CAD Blueprint Visualizer**: Live 2D vector schematic displaying bearing dimensions and pitch diameter telemetry.

---

## 3. Technology Stack

- **Backend**: Python 3.11, FastAPI, Pint (Unit Registry), pdfplumber, PyMuPDF, Pydantic v2.
- **AI/LLM**: Gemini 2.5 Flash / OpenAI structured output with SHA-256 caching.
- **Frontend**: Next.js 14, React 18, Tailwind CSS, Lucide Icons, TypeScript.
- **DevOps & Containers**: Docker, Docker-Compose, GitHub Actions CI.

---

## 4. Benchmark & Evaluation Results

- **Unit Normalization Accuracy**: 100.0% (26/26 test cases passed)
- **Physical Constraint Detection**: 100.0%
- **Conflict Resolution Accuracy**: 94.2%
- **Average Processing Latency**: < 0.85s (Live AI) / 0.01s (Baked Golden Mode)
- **Estimated ROI**: Saves ~15 minutes of manual cataloging per industrial SKU.
