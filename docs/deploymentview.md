┌─────────────────────────────────────────────────────────────────────┐
│  VERCEL  (the required public live URL)                             │
│  Next.js frontend  ·  DEMO_MODE=baked                               │
│  Serves pre-computed golden output → instant, no key, no abuse,     │
│  no serverless timeout. This is what judges click.                  │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │  NEXT_PUBLIC_API_URL (only for live runs)
┌──────────────────────────────────▼──────────────────────────────────┐
│  RENDER / RAILWAY  (real Python pipeline)                           │
│  FastAPI  ·  DEMO_MODE=live  ·  OPENAI_API_KEY in dashboard only    │
│  Token-gated + rate-limited /process. Used by the demo video and    │
│  controlled live runs — NOT the open public button.                 │
└─────────────────────────────────────────────────────────────────────┘

Local dev: uvicorn + npm run dev, DEMO_MODE=live, key in backend/.env (gitignored).
