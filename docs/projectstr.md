```text
backend/app/
  api/            # thin routes (one per screen)
  schemas/        # typed contracts between stages
  parsing/        # stage 1 — PDF/CSV parsing
  extraction/     # stage 2 — LLM extraction (the only AI stage)
  normalization/  # stage 3 — unit canonicalization
  validation/     # stage 4 — rules, ranges, physical laws
  merging/        # stage 5 — conflict resolution
  services/       # pipeline orchestrator + exporter + baked loader
  core/           # config (DEMO_MODE/DEMO_TOKEN), store, auth gate
data/
  pdfs/  csv/  golden/   # inputs + expected outputs; golden/ = baked store
docs/
  ARCHITECTURE.md  STRUCTURE.md  demo_script.md  evaluation.md  decisions.md
```
