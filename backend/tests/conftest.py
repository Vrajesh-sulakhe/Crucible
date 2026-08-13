"""tests/conftest.py — Shared test fixtures."""

import pytest
from app.parsing.pdf_parser import PageBlock
from app.schemas.models import Candidate, Evidence, SourceType


@pytest.fixture
def sample_page_block() -> PageBlock:
    return PageBlock(
        source_name="SKF_6205.pdf",
        source_type="manufacturer_datasheet",
        page=1,
        text="SKF 6205-2RSH Deep groove ball bearing d=25mm D=52mm B=15mm mass=0.13kg",
    )


@pytest.fixture
def sample_candidate() -> Candidate:
    return Candidate(
        raw_value="25 mm",
        normalized_value=25.0,
        unit="millimeter",
        evidence=Evidence(
            source_name="SKF_6205.pdf",
            source_type=SourceType.MANUFACTURER_DATASHEET,
            page=2,
            snippet="Principal dimensions: d = 25 mm",
            extraction_confidence=0.98,
        ),
    )
