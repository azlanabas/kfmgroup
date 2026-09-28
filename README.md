# KFM Group — kfmgroup.my

Next.js + Express + SQLite corporate site.
**Repo:** https://github.com/azlanabas/kfmgroup

The full as-built documentation — install, run, the decisions log, and the open items — is in
**[`website.md`](website.md)** in this directory.

| | |
|---|---|
| Stack | Next 16.3.5 · React 19.2.8 · Tailwind 4 · Express 5 · `node:sqlite` |
| **Node** | **22.5+ required** — `node:sqlite` has no fallback driver; Node 20 throws `ERR_UNKNOWN_BUILTIN_MODULE` |
| Frontend | [`frontend/`](frontend/) — App Router, 8 routes |
| Backend | [`backend/`](backend/) — 4 API endpoints |
| Database | [`data/kfm.db`](data/) — gitignored |
| Docs | [`docs/`](docs/) — 12-document corpus |
| Images | [`media/`](media/) — master copy; `frontend/public/media` is a generated mirror |

```bash
cd backend  && npm install && npm run migrate && npm run seed
cd frontend && npm install
```

Start the backend first — `/`, `/sectors` and `/people` read from the API.

*This file is the GitHub landing page. `website.md` is the working document; keep edits there.*
