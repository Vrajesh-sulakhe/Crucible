"""api/deps.py — Shared FastAPI dependencies."""

from __future__ import annotations

from app.core.config import Settings, settings
from app.core.store import ProductStore, store


def get_store() -> ProductStore:
    return store


def get_settings() -> Settings:
    return settings
