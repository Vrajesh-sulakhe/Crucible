# Architectural Decision Records (ADRs) — Crucible

## ADR 001: Hybrid Deterministic + LLM Architecture ("The AI Reads, The Code Decides")
- **Context**: In industrial commerce and Master Data Management (MDM), precision is critical. Hallucinating a 25mm bore diameter instead of 25.4mm causes catastrophic machine failures and expensive returns.
- **Decision**: Confine LLMs (Gemini / OpenAI) strictly to unstructured parsing and synthesis. All unit conversions, physical law validations, and conflict arbitrations are executed by deterministic, testable Python code.
- **Consequences**: Zero unit conversion hallucinations, 100% auditable decisions, deterministic regression testing.

## ADR 002: Deterministic Unit Canonicalization with Pint
- **Context**: Industrial datasheets use mixed metric and imperial units (inches, mm, lbs, grams, kN, N, lbf, rpm).
- **Decision**: Use `pint` with canonical target dimensions (`length=millimeter`, `mass=kilogram`, `force=kilonewton`, `speed=rpm`).
- **Consequences**: Consistent, normalized values across the entire catalog without relying on LLM math.

## ADR 003: Formula-Driven Confidence Scoring vs. Model Self-Rating
- **Context**: LLMs exhibit overconfidence bias and produce arbitrary self-ratings.
- **Decision**: Calculate confidence via a transparent mathematical formula:
  $$\text{Confidence} = 0.5 \cdot C_{\text{ext}} + 0.3 \cdot A_{\text{source}} + 0.2 \cdot V_{\text{score}}$$
  Where $A_{\text{source}}$ weights manufacturer datasheets (1.0) above technical catalogs (0.8), ERP dumps (0.6), websites (0.4), and legacy CSVs (0.2).
- **Consequences**: Explainable, monotonic, and calibratable trust metric.

## ADR 004: Dual-Engine Deployment (Live AI + Baked Demo Mode)
- **Context**: Public hackathon submissions and judge evaluation links cannot expose spend-keys on the public internet and must never fail due to cold starts or rate limits.
- **Decision**: Provide pre-computed golden benchmark records (`data/golden/sample_baked.json`) for zero-latency instant demoing, while supporting full live AI pipelines in authenticated local/cloud environments.
- **Consequences**: Instant, 100% reliable judging experience.
