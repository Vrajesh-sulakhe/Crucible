# Architecture — UniLog Product Intelligence

> The blueprint. Draw it before you build it.
> Every ASCII block below is meant to be redrawn clean in Excalidraw / draw.io —
> a crisp diagram in the README and the deck is a real judging asset.

## 0. The one-sentence design

A six-stage deterministic pipeline, the LLM confined to a single stage,
exposed through a thin API, rendered by a stateless UI, and shipped to the
public as a **credential-free baked build**.

The governing rule:

> **The AI reads. The code decides.**

A second rule, born of the public-URL requirement:

> **An env var is secret from git. It is not secret from the internet.**
> So the live URL never holds a spend-key — it serves baked output.

---

## 1. The four planes

Keep them separate in your head and in your folders. A bug in one plane
fails inside its own box and cannot corrupt the others.

```text
┌───────────────────────────────────────────────────────────────┐
│  PRESENTATION PLANE  (frontend — Next.js, on Vercel)          │
│  Stateless. Renders pipeline state. Computes nothing.         │
│  [Workspace] [Product Detail] [Review Queue] [Export]         │
└───────────────────────────────┬───────────────────────────────┘
                                │  HTTP / SSE
┌───────────────────────────────▼───────────────────────────────┐
│  API PLANE  (FastAPI, on Render/Railway)                      │
│  Thin shell. One endpoint per screen. NO business logic.      │
│  /process  /products  /explain  /review  /export              │
└───────────────────────────────┬───────────────────────────────┘
                                │  calls
┌───────────────────────────────▼───────────────────────────────┐
│  PIPELINE PLANE  (the engine — pure Python functions)         │
│  PARSE → EXTRACT → NORMALIZE → VALIDATE → RESOLVE → EXPORT    │
│  Each stage = pure function, typed Pydantic in & out.         │
│  LLM lives ONLY inside EXTRACT.                               │
│  A demo-mode branch can short-circuit to baked output.        │
└───────────────────────────────┬───────────────────────────────┘
                                │  reads / writes
┌───────────────────────────────▼───────────────────────────────┐
│  STORAGE PLANE  (in-memory dict for MVP, SQLite/PG later)     │
│  ProductRecord store  +  Audit log  +  Baked golden store     │
└───────────────────────────────────────────────────────────────┘
```
