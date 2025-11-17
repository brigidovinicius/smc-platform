# Repository Guidelines

## Project Structure & Module Organization
Keep ingestion, transformation, and presentation layers isolated so SaaS market-cap calculations stay reproducible. Runtime code lives in `src/` with subpackages such as `ingestion/` (API + HTML clients), `pipelines/` (batch jobs), `services/` (valuation math), and `api/` (FastAPI/Streamlit entry points). Store immutable data in `data/raw/`, derived tables in `data/processed/`, notebooks in `notebooks/`, dashboard assets in `dashboards/`, and config templates in `config/`. Tests mirror the runtime tree inside `tests/unit/` and `tests/integration/`. Expected skeleton:
```
src/{ingestion,pipelines,services,api}
tests/{unit,integration}
data/{raw,processed}
dashboards/
docs/
```

## Build, Test, and Development Commands
- `python -m pip install -r requirements.txt` – install dependencies; rerun whenever the lockfile changes.
- `python -m src.pipelines.sync --days 30` – refresh processed parquet files from the latest SaaS tickers.
- `python -m src.api.main --reload` – run the service at http://localhost:8000 for manual QA.
- `streamlit run dashboards/overview.py` – inspect the investor dashboard using cached metrics.
- `python -m pytest --cov=src --cov-report=term-missing` – execute the suite and surface coverage regressions.

## Coding Style & Naming Conventions
Target Python 3.11+, four-space indents, full type hints, and prefer dataclasses over loose dicts. Run `ruff check src tests` and `black src tests` before committing. Modules/files follow `snake_case`, classes `PascalCase`, CLI entry points `src/cli_<verb>.py`, and async helpers end in `_async`. Keep reusable SQL in `src/queries/` and describe each job with a short module docstring.

## Testing Guidelines
Pytest drives unit and integration coverage. Name files `test_<module>.py`, centralize fixtures in `tests/fixtures/`, and use parametrized cases for rounding/currency rules. Each pipeline must include an integration test that reads from the mocked SaaS payload in `tests/data/market_sample.json`. Maintain ≥85% coverage via `pytest --cov`, and fail fast on schema drift by validating against the column map stored in `tests/schemas.py`.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `chore:`) and mention the market/ticker touched in the subject. PR descriptions must include purpose, a short change list, test output snippets, and screenshots/CSV diffs when dashboards or metrics shift. Link to the issue, call out config or migration steps, and describe rollback expectations if pipelines mutate storage.

## Security & Configuration Tips
Secrets live in `.env.local` and are loaded through `config/settings.py`; update `config/.env.example` whenever variables change. Never commit raw API payloads or BI exports—keep `data/raw/`, `*.parquet`, and `.env*` ignored. Rotate vendor keys quarterly, document permissions in `docs/security.md`, and sanitise log samples before attaching them to issues.
