.PHONY: backend frontend test demo install benchmark

backend:
	cd backend && PYTHONPATH=. .venv/bin/uvicorn app.main:app --reload --port 8000

frontend:
	cd frontend && npm run dev

test:
	cd backend && PYTHONPATH=. .venv/bin/python -m unittest discover -s tests -v

benchmark:
	cd backend && PYTHONPATH=. .venv/bin/python -m app.services.evaluator

install:
	cd backend && .venv/bin/pip install -r requirements.txt
	cd frontend && npm install

demo:
	@echo "============================================================"
	@echo "Crucible — AI-Powered Product Intelligence for Industrial Commerce"
	@echo "============================================================"
	@echo "1. Start Backend:  make backend   (runs on http://127.0.0.1:8000)"
	@echo "2. Start Frontend: make frontend  (runs on http://localhost:3000)"
	@echo "3. Run Tests:      make test"
	@echo "4. Run Benchmark:  make benchmark"
	@echo "============================================================"

