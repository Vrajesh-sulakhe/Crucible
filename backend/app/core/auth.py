"""core/auth.py — Rate limiter and optional demo token guard for live endpoints."""

from __future__ import annotations

from fastapi import Header, HTTPException, status
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import settings

limiter = Limiter(key_func=get_remote_address)


def require_demo_token(
    x_demo_token: str | None = Header(default=None, alias="X-Demo-Token"),
) -> None:
    """Optional token gate for public deployments. Bypassed in local development."""
    # If explicitly in baked mode or if no token requirement is strictly enforced locally, allow
    if settings.is_baked:
        return
    # If a custom demo_token is configured and not default dev token, check header
    if settings.demo_token and settings.demo_token not in ("unilog-demo", "", None):
        if not x_demo_token or x_demo_token != settings.demo_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or missing X-Demo-Token for live extraction pipeline.",
            )
