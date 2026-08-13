"""extraction/llm_extractor.py — STAGE 2, the ONLY stage that calls an LLM.

Provider-agnostic via settings.llm_provider:
  - gemini: google-genai native structured output (response_schema = BearingExtraction).
  - openai: instructor + OpenAI (kept as fallback if you add credits later).
The AI reads; the code decides. Cost guards: lazy client + content-hash cache.
"""

from __future__ import annotations

import hashlib

from app.core.config import settings
from app.parsing.pdf_parser import PageBlock
from app.schemas.extraction import BearingExtraction
from . import prompts

_gemini_client = None
_openai_client = None
_cache: dict[str, BearingExtraction] = {}


def _get_gemini():
    global _gemini_client
    if _gemini_client is None:
        from google import genai
        _gemini_client = genai.Client(api_key=settings.gemini_api_key)
    return _gemini_client


def _get_openai():
    global _openai_client
    if _openai_client is None:
        import instructor
        from openai import OpenAI
        _openai_client = instructor.from_openai(OpenAI(api_key=settings.openai_api_key))
    return _openai_client


def _cache_key(block: PageBlock) -> str:
    return hashlib.sha256(f"{block.source_name}:{block.page}:{block.text}".encode()).hexdigest()


def extract_block(block: PageBlock, use_cache: bool = True) -> BearingExtraction:
    if settings.is_baked:
        raise RuntimeError("extract_block called in DEMO_MODE=baked; extraction only runs in live mode.")
    settings.ensure_live_ready()

    key = _cache_key(block)
    if use_cache and key in _cache:
        return _cache[key]

    prompt = prompts.EXTRACTION_PROMPT.format(
        source=block.source_name, page=block.page, text=block.text
    )

    if settings.llm_provider == "gemini":
        client = _get_gemini()
        resp = client.models.generate_content(
            model=settings.llm_model,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": BearingExtraction,
            },
        )
        result = resp.parsed
    else:
        client = _get_openai()
        result = client.chat.completions.create(
            model=settings.llm_model,
            response_model=BearingExtraction,
            max_retries=settings.extraction_max_retries,
            messages=[
                {"role": "system", "content": "Precise extraction engine. Prefer null over invention."},
                {"role": "user", "content": prompt},
            ],
        )

    if not isinstance(result, BearingExtraction):
        result = BearingExtraction.model_validate(result)

    if use_cache:
        _cache[key] = result
    return result
