```text
CSV row ──┐
           ├──►[1 PARSE]──►[2 EXTRACT]──►[3 NORMALIZE]──►[4 VALIDATE]──►[5 RESOLVE]──►[6 EXPORT]
 PDFs ─────┘      │            │ (LLM)        │              │             │             │
              PageBlock[]  RawExtract[]  NormalizedField  ValidationResult  FieldDecision[]  JSON/CSV

 DEMO_MODE=baked  ──►  bypass 1–5  ──►  load data/golden/*.json  ──►  [6 EXPORT / serve]
```
