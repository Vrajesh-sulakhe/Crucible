"""main.py — FastAPI Application Entrypoint."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.export import router as export_router
from app.api.ingest import router as ingest_router
from app.api.products import router as products_router
from app.api.review import router as review_router
from app.core.config import settings
from app.core.store import store
from app.services.baked import load_golden_records

# Seed store immediately on import for instant readiness
_initial_records = load_golden_records()
if _initial_records:
    store.set_products(_initial_records)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Seed initial store with golden records on startup if needed."""
    if not store.get_all():
        initial = load_golden_records()
        if initial:
            store.set_products(initial)
    yield


app = FastAPI(
    title="Crucible — UniLog Product Intelligence",
    description="AI-powered product intelligence for industrial commerce. Focuses on data enrichment, validation, and explainable citations.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers
app.include_router(ingest_router)
app.include_router(products_router)
app.include_router(review_router)
app.include_router(export_router)


@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "ok",
        "service": "crucible-product-intelligence",
        "demo_mode": settings.demo_mode,
        "llm_provider": settings.llm_provider,
        "products_in_store": len(store.get_all()),
    }
