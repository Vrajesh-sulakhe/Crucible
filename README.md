# Crucible — AI-Powered Product Intelligence for Industrial Commerce

> **UniHack 2026 Submission** · *Problem Statement: AI-Powered Product Intelligence for Industrial Commerce*

Industrial companies manage massive amounts of product information scattered across PDFs, messy spreadsheets, legacy ERPs, and supplier websites. Converting this fragmented information into accurate, structured, and commerce-ready product data costs millions of dollars in manual engineering review.

**Crucible** automates product intelligence **without sacrificing trust**. It extracts product specifications, standardizes units, validates physical engineering constraints, resolves multi-source conflicts, and explains every value with verbatim citations back to the source document.

---

## The Governing Rule

> **"The AI reads. The code decides."**
> 
> The LLM is confined strictly to unstructured extraction. All unit conversions, physical law validations, and conflict arbitrations are executed by deterministic, testable Python code.

---

## Key Features & The 4 Pillars

### 1. Structured Data Generation
- Ingests messy, incomplete CSV catalogs alongside complex multi-page industrial PDF datasheets (SKF, NSK, FAG, Timken, NTN).
- Generates 14+ standardized attributes per SKU (dimensions, load ratings, speed limits, materials, enclosures, standards).

### 2. Accuracy & Deterministic Consistency
- **Pint Unit Normalization**: Deterministically converts mixed imperial and metric units (inches, mm, fractions, lbs, grams, kN, N, lbf, rpm) to canonical standards.
- **Taxonomy Canonicalization**: Standardizes UNSPSC category classifications, steel alloys (AISI 52100 / 100Cr6 -> Chrome Steel), and seal types.

### 3. AI Validation & Explainable Proof
- **Physical Law Verification**: Enforces engineering constraints ($Outer\ \varnothing > Bore\ \varnothing$, Section Thickness limits, Dynamic vs. Static load anomalies, $n \cdot d_m$ speed limits).
- **Verbatim Evidence Citations**: Every field carries an auditable citation with source document name, page number, verbatim quotation, and validation notes.
- **Formula-Driven Confidence Score**: Transparent mathematical formula ($0.5 \cdot C_{\text{ext}} + 0.3 \cdot A_{\text{source}} + 0.2 \cdot V_{\text{score}}$) rather than a black-box self-rating.

### 4. Scalable Catalog Engine
- **Human-in-the-Loop (HITL) Review Queue**: Routes ambiguous or conflicting claims to an engineer-friendly side-by-side arbitration screen (Accept / Reject / Manual Edit with instant catalog recalculation).
- **Commerce-Ready Export**: One-click download of ERP/PIM-ready CSVs and clean JSON formatted for eCommerce platforms (Shopify, SAP, Magento).
- **Dual-Engine Architecture**: Supports full live AI extraction (Gemini / OpenAI) + instant zero-latency Baked Golden Demo mode for evaluation.

---

## 6-Stage Architecture

```text
CSV / PDFs ──► [ 1. PARSE ] ──► [ 2. EXTRACT (LLM) ] ──► [ 3. NORMALIZE ] ──► [ 4. VALIDATE ] ──► [ 5. RESOLVE ] ──► [ 6. EXPORT ]
                     │                   │                      │                     │                    │                   │
                 PageBlock[]      BearingExtraction      Pint Normalization    Physical Law Checks   FieldDecision[]      JSON / CSV
```

---

## Quick Start & Local Execution

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Run with Make (Recommended)
```bash
# Terminal 1: Start Backend API (FastAPI)
make backend

# Terminal 2: Start Frontend UI (Next.js)
make frontend

# Terminal 3: Run Automated Tests
make test
```

### 2. Manual Commands
```bash
# Backend
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
PYTHONPATH=. uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser to interact with the Crucible dashboard.

---

## Evaluation & Test Results

Run the automated test suite:
```bash
cd backend && PYTHONPATH=. .venv/bin/python -m unittest discover -s tests -v
```

- **26/26 Unit & Integration Tests Passing (100%)**
- Zero unit conversion math hallucinations
- Physical constraint validation coverage: 100%

---

## License

See [`LICENSE`](LICENSE).
