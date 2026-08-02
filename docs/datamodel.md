```text
ProductRecord
 ├── sku
 ├── product_name
 ├── overall_confidence
 ├── overall_status
 └── fields : { field_name ──► FieldDecision }
                                       ├── field
                                       ├── final_value
                                       ├── status            (validated / conflict_resolved / needs_review / missing)
                                       ├── confidence        (a FORMULA, not the model's self-rating)
                                       ├── decision_reason   (human-readable "why")
                                       ├── validation_notes[]
                                       └── candidates[] ──► Candidate
                                                              ├── raw_value
                                                              ├── normalized_value
                                                              ├── unit
                                                              └── evidence ──► Evidence
                                                                                 ├── source_name
                                                                                 ├── source_type   (datasheet / catalog / erp / web / csv)
                                                                                 ├── page
                                                                                 ├── snippet       (VERBATIM quote)
                                                                                 └── extraction_confidence
```
