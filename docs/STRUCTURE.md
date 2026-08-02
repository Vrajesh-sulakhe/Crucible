# Structure — complete file tree

> The definitive file-by-file map. This is the "architecture as folders" view:
> one folder per pipeline stage, one file per responsibility, every file with an
> owner and a phase. Create the **now** set today; create the **[FE]** set in
> Phase 8 only.

## Legend

- *(no tag)* → **create now** as a stub: module docstring + function signatures
  taken from `ARCHITECTURE.md`; fill the body in its phase. This gives every
  file an owner and prevents merge conflicts.
- `[FE]` → **frontend — Phase 8 only.** Do not scaffold today.
- `[DATA]` → **fill in its phase** (not a code stub).

---

## 1. Full tree

```text
unilog-product-intelligence/
│
├── README.md                          # public face (banner + setup + live + security)
├── .gitignore                         # python/node/env/ide ignores (.env MUST be listed)
├── LICENSE                            # custom "evaluation use only" + organizer carve-out
├── Makefile                           # one-command: make backend / make frontend / make demo
│
├── docs/
│   ├── ARCHITECTURE.md                # the blueprint (planes, spine, model, deploy)
│   ├── STRUCTURE.md                   # this file
│   ├── demo_script.md                 # 3-min demo flow, timed beats
│   ├── evaluation.md                  # golden-dataset metrics table (fill Phase 9)
│   └── decisions.md                   # ADR-lite: why no RAG / no fine-tune / LLM-in-one-stage / baked live
│
├── data/
│   ├── README.md                      # what goes in each subfolder + naming rules
│   ├── pdf_tracker.csv                # [DATA] Beginner A: file/sku/text_extractable/notes
│   ├── pdfs/
│   │   └── .gitkeep                   # drop real datasheets here
│   ├── csv/
│   │   └── sample_products.csv        # [DATA] template messy CSV (intentional errors)
│   └── golden/
│       ├── .gitkeep
│       └── sample_baked.json          # [DATA] one ProductRecord[] so baked mode works day one
│
├── backend/
│   ├── requirements.txt               # fastapi, uvicorn[standard], python-multipart, pydantic,
│   │                                  #   python-dotenv, pdfplumber, pymupdf, pint, instructor,
│   │                                  #   openai, slowapi
│   ├── .env.example                   # OPENAI_API_KEY / DEMO_MODE / DEMO_TOKEN placeholders
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # API plane entry: FastAPI app + CORS + /health
│   │   │
│   │   ├── core/                      # config + storage + gate (no business logic)
│   │   │   ├── __init__.py
│   │   │   ├── config.py              # settings from .env: DEMO_MODE, DEMO_TOKEN, OPENAI_API_KEY
│   │   │   │                          #   + startup guard (live mode needs a real key)
│   │   │   ├── store.py               # in-memory ProductRecord store + audit log (sqlite later)
│   │   │   └── auth.py                # require_demo_token() FastAPI dep + slowapi rate-limit (live only)
│   │   │
│   │   ├── schemas/                   # THE contracts between stages (typed, shared)
│   │   │   ├── __init__.py
│   │   │   ├── models.py              # enums, SOURCE_AUTHORITY, Evidence, Candidate, FieldDecision, ProductRecord
│   │   │   └── extraction.py          # LLM-facing model only: RawField + BearingExtraction
│   │   │
│   │   ├── api/                       # thin routes — one file per screen, NO logic
│   │   │   ├── __init__.py
│   │   │   ├── deps.py                # shared deps: get_store(), get_settings()
│   │   │   ├── ingest.py              # POST /process  (baked branch or live pipeline)
│   │   │   ├── products.py            # GET /products, /products/{sku}, /products/{sku}/explain/{field}
│   │   │   ├── review.py              # GET /review, POST /products/{sku}/review/{field}
│   │   │   └── export.py              # GET /export/json, /export/csv, /metrics
│   │   │
│   │   ├── parsing/                   # STAGE 1 — deterministic
│   │   │   ├── __init__.py
│   │   │   ├── pdf_parser.py          # text + tables → PageBlock[] (page numbers preserved)
│   │   │   └── csv_parser.py          # csv → list[dict], tolerant of messy rows
│   │   │
│   │   ├── extraction/                # STAGE 2 — the ONLY LLM stage
│   │   │   ├── __init__.py
│   │   │   ├── llm_extractor.py       # instructor + schema enforcement + content-hash cache
│   │   │   └── prompts.py             # extraction prompt text (tune here, not in logic)
│   │   │
│   │   ├── normalization/             # STAGE 3 — deterministic
│   │   │   ├── __init__.py
│   │   │   ├── units.py               # pint-based canonical units (mm/kg/kN/rpm)
│   │   │   └── cleaners.py            # SKU / category / material string normalization
│   │   │
│   │   ├── validation/                # STAGE 4 — deterministic
│   │   │   ├── __init__.py
│   │   │   ├── rules.py               # required-field + cross-field physical laws (outer Ø > bore Ø)
│   │   │   └── ranges.py              # per-field expected ranges table
│   │   │
│   │   ├── merging/                   # STAGE 5 — deterministic trust layer
│   │   │   ├── __init__.py
│   │   │   ├── source_ranking.py      # confidence formula + authority scoring
│   │   │   └── conflict_resolver.py   # resolve_field: compare candidates → FieldDecision
│   │   │
│   │   └── services/                  # orchestrator + STAGE 6 + baked
│   │       ├── __init__.py
│   │       ├── pipeline.py            # process_or_baked(): wires 1→5 OR returns baked; owns the cache
│   │       ├── baked.py               # load_golden_records(): data/golden/*.json → list[ProductRecord]
│   │       └── exporter.py            # ProductRecord → commerce-ready JSON / CSV
│   │
│   └── tests/                         # one test file per deterministic stage (beginner-friendly)
│       ├── __init__.py
│       ├── conftest.py                # shared fixtures: sample PageBlock, sample csv row
│       ├── test_units.py              # 50 unit-conversion cases (Beginner A fills cases)
│       ├── test_validation.py         # range + physical-rule cases (Beginner A fills cases)
│       └── test_pipeline.py           # end-to-end smoke: 1 csv + 1 pdf → ProductRecord shape
│
└── frontend/                          # [FE] PRESENTATION PLANE — Phase 8 only (Vercel)
    ├── package.json                   # [FE] next, react, tailwind, shadcn deps
    ├── next.config.js                 # [FE]
    ├── tsconfig.json                  # [FE]
    ├── tailwind.config.ts             # [FE]
    ├── postcss.config.js              # [FE]
    ├── .env.local.example             # [FE] NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
    │
    ├── app/
    │   ├── layout.tsx                 # [FE] root layout + global styles
    │   ├── page.tsx                   # [FE] Workspace screen (upload + table + log + Load Demo)
    │   ├── globals.css                # [FE]
    │   ├── product/
    │   │   └── [sku]/
    │   │       └── page.tsx           # [FE] Product detail screen
    │   └── review/
    │       └── page.tsx               # [FE] Review queue / conflict resolver screen
    │
    ├── components/                    # [FE] one component per UI block
    │   ├── UploadPanel.tsx            # [FE] csv + pdf dropzone + "Load Demo Data" action
    │   ├── PipelineTracker.tsx        # [FE] the top spine: INGEST→…→EXPORT
    │   ├── ProcessingLog.tsx          # [FE] right-side live log (SSE)
    │   ├── ProductTable.tsx           # [FE] workspace dense table
    │   ├── StatusBadge.tsx            # [FE] validated / conflict / needs_review / missing
    │   ├── ConfidenceBar.tsx          # [FE] colored confidence meter
    │   ├── EvidenceInspector.tsx      # [FE] PDF snippet + page + validation checks
    │   └── ConflictResolver.tsx       # [FE] two candidate cards + Accept/Reject/Edit
    │
    └── lib/
        ├── api.ts                     # [FE] fetch wrappers matching backend endpoints
        ├── types.ts                   # [FE] TS mirror of backend schemas/models.py
        └── utils.ts                   # [FE] cn() + formatters
```
