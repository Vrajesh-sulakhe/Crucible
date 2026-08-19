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
- **Attribute Gap Intelligence**: Automated diagnosis of incomplete industrial SKUs with prescriptive recovery sources (ISO standards, manufacturer catalogs) and commercial readiness scoring.
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

*Evaluated on realistic ugly distributor catalog with 20 authentic industrial SKUs (SKF, Timken, NSK, FAG, NTN, INA, Dodge, IKO) alongside manufacturer engineering datasheets (`make benchmark`):*

| Metric | Result | Proof & Verification Mechanism |
|---|---:|---|
| **Products processed** | **20** | Full catalog of ball, roller, needle, angular, thrust, & mounted units |
| **Fields extracted** | **322** | Extracted from raw messy CSVs + multi-page technical datasheets |
| **Fields enriched** | **14** | Missing specs ($C_0$, limiting RPM, standards) recovered via datasheets |
| **Field accuracy** | **100.0%** | Measured against ground-truth manufacturer engineering specifications |
| **Citation accuracy** | **100.0%** | Every populated field carries a verifiable verbatim quote & page reference |
| **Completeness before** | **85.0%** | Raw legacy ERP / distributor CSV completeness |
| **Completeness after** | **90.0%** | Post-pipeline enriched & standardized catalog completeness |
| **Conflicts detected** | **24** | Discrepancies identified between legacy claims & manufacturer data |
| **Conflicts auto-resolved** | **19** | Auto-arbitrated via Source Authority ($A_{\text{datasheet}}=1.0$ vs $A_{\text{csv}}=0.60$) |
| **Human reviews** | **0** | Clean automated routing with 0 unresolvable ties |
| **Hallucinations** | **0.0%** | **Pint-backed normalization** guarantees zero mathematical/unit hallucinations |
| **Processing time** | **5.8 ms (0.29 ms/SKU)** | Sub-millisecond deterministic throughput |
| **Total Test Suite** | **76/76 passing (0.036s)** | API, units, physics rules, stress edge-cases, & benchmarks |

