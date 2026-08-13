"""extraction/prompts.py — stage-2 prompt text. Tune HERE, not in the logic."""

EXTRACTION_PROMPT = """You are an industrial product-data extraction engine. Extract bearing specifications from the text below.

RULES:
- Return ONLY values that are present in the text. If a field is absent, leave its value as null. Never guess or invent.
- evidence must be a VERBATIM quote from the text, not a paraphrase.
- Do NOT convert units. Return each quantity exactly as written (e.g. "25 mm", "0.13 kg").
- confidence: 0.9+ only when the value is explicit and unambiguous; 0.5-0.7 when inferred from context; lower when uncertain.
- Fill sku if a designation/model number is present.

Source: {source}  Page: {page}

TEXT:
{text}"""
