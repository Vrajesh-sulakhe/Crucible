"""core/config.py — runtime knobs. Import-pure: importing this NEVER raises."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

_VALID_MODES = ("baked", "live")
_VALID_PROVIDERS = ("gemini", "openai")


@dataclass(frozen=True)
class Settings:
    demo_mode: str = "live"
    demo_token: str | None = None

    # Provider + keys. Default is Gemini (free tier) — best for a student build.
    llm_provider: str = "gemini"
    gemini_api_key: str | None = None
    openai_api_key: str | None = None

    llm_model: str = "gemini-2.5-flash"
    extraction_max_retries: int = 2

    # Confidence weights — named, tunable, NOT magic numbers. Must sum to 1.0.
    conf_w_extraction: float = 0.5
    conf_w_authority: float = 0.3
    conf_w_validation: float = 0.2

    def __post_init__(self) -> None:
        if self.demo_mode not in _VALID_MODES:
            raise ValueError(f"DEMO_MODE must be one of {_VALID_MODES}, got {self.demo_mode!r}")
        if self.llm_provider not in _VALID_PROVIDERS:
            raise ValueError(f"LLM_PROVIDER must be one of {_VALID_PROVIDERS}, got {self.llm_provider!r}")
        for name, w in (
            ("conf_w_extraction", self.conf_w_extraction),
            ("conf_w_authority", self.conf_w_authority),
            ("conf_w_validation", self.conf_w_validation),
        ):
            if not (0.0 <= w <= 1.0):
                raise ValueError(f"{name} must be in [0, 1], got {w}")
        total = self.conf_w_extraction + self.conf_w_authority + self.conf_w_validation
        if abs(total - 1.0) > 1e-6:
            raise ValueError(
                f"confidence weights must sum to 1.0 (got {total:.4f}); otherwise "
                "FieldDecision.confidence can exceed its [0, 1] bound downstream"
            )

    @property
    def is_live(self) -> bool:
        return self.demo_mode == "live"

    @property
    def is_baked(self) -> bool:
        return self.demo_mode == "baked"

    def ensure_live_ready(self) -> None:
        """Startup guard. Checks the key for the ACTIVE provider."""
        if not self.is_live:
            return
        if self.llm_provider == "gemini":
            key, name = self.gemini_api_key, "GEMINI_API_KEY"
        else:
            key, name = self.openai_api_key, "OPENAI_API_KEY"
        if not key or key.strip().startswith(("sk-REPLACE", "REPLACE", "your-", "<")):
            raise RuntimeError(
                f"DEMO_MODE=live with LLM_PROVIDER={self.llm_provider} requires a real {name}. "
                "Set it in backend/.env, or set DEMO_MODE=baked to serve pre-computed output."
            )

    @classmethod
    def from_env(cls) -> "Settings":
        env_path = Path(__file__).resolve().parents[2] / ".env"
        load_dotenv(dotenv_path=env_path, override=True)
        
        # Check if keys exist in environment
        g_key = os.getenv("GEMINI_API_KEY") or None
        o_key = os.getenv("OPENAI_API_KEY") or None
        mode = os.getenv("DEMO_MODE", "live" if (g_key or o_key) else "baked").strip().lower()

        return cls(
            demo_mode=mode if mode in _VALID_MODES else "live",
            demo_token=os.getenv("DEMO_TOKEN") or None,
            llm_provider=os.getenv("LLM_PROVIDER", "gemini").strip().lower(),
            gemini_api_key=g_key,
            openai_api_key=o_key,
            llm_model=os.getenv("LLM_MODEL", "gemini-2.5-flash"),
            extraction_max_retries=int(os.getenv("EXTRACTION_MAX_RETRIES", "2")),
            conf_w_extraction=float(os.getenv("CONF_W_EXTRACTION", "0.5")),
            conf_w_authority=float(os.getenv("CONF_W_AUTHORITY", "0.3")),
            conf_w_validation=float(os.getenv("CONF_W_VALIDATION", "0.2")),
        )


settings = Settings.from_env()
