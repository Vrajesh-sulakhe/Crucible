"""parsing/pdf_parser.py — STAGE 1 (deterministic). PDF -> PageBlock[].

Pure function, no LLM, no network. Preserves page numbers for citations
downstream. Tables are flattened to pipe-separated rows because LLMs read
those cleanly. Scanned / image-only pages (no extractable text) are skipped;
log those in data/parsing_report.csv instead of fighting OCR now.
"""

from __future__ import annotations

import os
from dataclasses import dataclass

import pdfplumber


@dataclass(frozen=True)
class PageBlock:
    """One page of one source, as clean text. The unit stage 2 extracts from."""
    source_name: str
    source_type: str        # one of schemas.models.SourceType values
    page: int
    text: str


def parse_pdf(
    path: str,
    source_name: str | None = None,
    source_type: str = "manufacturer_datasheet",
) -> list[PageBlock]:
    if source_name is None:
        source_name = os.path.basename(path)
    blocks: list[PageBlock] = []
    with pdfplumber.open(path) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            parts: list[str] = []
            body = (page.extract_text() or "").strip()
            if body:
                parts.append(body)
            try:
                for table in (page.extract_tables() or []):
                    for row in table:
                        cells = [(c or "").strip() for c in row]
                        cells = [c for c in cells if c]
                        if cells:
                            parts.append(" | ".join(cells))
            except Exception:
                pass  # one malformed table must not kill the whole page
            if parts:
                blocks.append(PageBlock(source_name, source_type, page_number, "\n".join(parts)))
    return blocks
