# UniLog Product Intelligence

> **License — evaluation use only.** Public for judging/review of the UniLog /
> UniHack 2026 submission. You may **view and run** it for evaluation; you may
> **not** modify, redistribute, create derivatives, or use it commercially — all
> other rights reserved. *Note:* per the event terms, IP in a **winning** solution
> transfers to the organizers on award confirmation; otherwise all rights stay
> with the authors. See [`LICENSE`](LICENSE).

---

Industrial companies keep the same product in a dozen PDFs, four spreadsheets,
an old ERP, and someone's desktop folder named `FINAL_FINAL_V2`. Turning that
mess into clean, trustworthy, commerce-ready product data costs humans hours
per catalog — digital archaeology, paid by the hour.

This project automates it **without sacrificing trust.** It extracts product
data, normalizes units, validates physical constraints, resolves conflicts
between sources, and explains every single value with a citation back to the
document it came from.

## The idea in one line

We did not build an AI chatbot. We built a **trusted product-data pipeline**:
the AI *reads* the documents, the code *decides* what is true, and every
decision carries proof.

## What it does

- **Ingest** a messy product CSV + industrial PDF datasheets.
- **Extract** structured specs with verbatim evidence and page citations.
- **Normalize** units to a canonical set (`mm`, `kg`, `kN`, `rpm`).
- **Validate** with range checks and physical laws (e.g. outer Ø > bore Ø).
- **Resolve conflicts** when sources disagree, ranking by source authority.
- **Score confidence** with a transparent formula, not a black-box number.
- **Explain** every field: source, page, snippet, validation notes, reason.
- **Route uncertainty** to a human review queue (Accept / Reject / Edit).
- **Export** clean, commerce-ready JSON / CSV.

## How it works

A six-stage pipeline. The LLM is confined to **one** stage (extraction); every
other stage is deterministic, testable Python.

```text
PARSE → EXTRACT(LLM) → NORMALIZE → VALIDATE → RESOLVE → EXPORT
```
