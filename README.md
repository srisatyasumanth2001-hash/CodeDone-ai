<div align="center">

# ⚡ CodeDone AI

### An AI-powered full-stack developer platform for learning, building, debugging, and understanding software systems.

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat&logo=openai&logoColor=white)](https://openai.com/)

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📖 Overview

**CodeDone AI** is a production-grade, AI-powered SaaS platform built for developers, students, and engineers who want to learn, build, debug, and understand software systems faster using artificial intelligence.

It combines modern full-stack web development with real AI engineering — streaming chat, retrieval-augmented generation (RAG), semantic document search, and codebase analysis — into a single, cohesive developer workspace.

This is not a tutorial project. It is architected the way a real SaaS product is built: scalable backend structure, secure authentication, a proper database schema, clean separation of concerns, and deployment-ready infrastructure.

> **Why I built this:** I wanted to go beyond what my day-to-day work involved and prove — to myself and to anyone reviewing this — that I can design, build, and reason about a complete AI-powered product end to end. Every architectural decision in this repository has a reason behind it, and I can explain every one of them.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Secure Authentication** | JWT access + refresh tokens, bcrypt password hashing, protected routes |
| 💬 **AI Chat Assistant** | Real-time streaming responses via Server-Sent Events, persistent conversation history |
| 📄 **File Upload & Analysis** | Upload PDFs and code files, chat directly with file content |
| 🔎 **RAG-Powered Document Search** | Semantic search over your own documents using OpenAI embeddings + pgvector |
| 🗂️ **Repository Analysis** | Connect a GitHub repo and ask questions about its codebase |
| 📊 **Developer Dashboard** | Usage analytics, saved responses, project workspaces |
| 🌓 **Modern UI** | Responsive, accessible, dark-themed interface built with Tailwind CSS |

---

## 🏗️ Architecture

CodeDone follows a strict three-tier architecture with clean separation of concerns on both the frontend and backend.

```
┌─────────────────┐        HTTP/SSE        ┌──────────────────┐        SQL/Vector        ┌──────────────────┐
│   React + TS     │ ─────────────────────▶ │     FastAPI       │ ────────────────────────▶ │   PostgreSQL      │
│   (Frontend)      │ ◀───────────────────── │    (Backend)       │ ◀──────────────────────── │   + pgvector       │
└─────────────────┘                        └──────────────────┘                          └──────────────────┘
                                                      │
                                                      ▼
                                              ┌──────────────────┐
                                              │   OpenAI API       │
                                              │ GPT-4o + Embeddings │
                                              └──────────────────┘
```

**Backend — strict layering:**
```
Router  →  Service  →  Model
(HTTP)     (Logic)     (Database)
```
Routes never contain business logic. Services never know about HTTP. Models never know about either — they're pure database schema definitions.

**Frontend — mirrored pattern:**
```
Page  →  Custom Hook  →  API Function  →  Axios Instance
(UI)     (Logic)         (HTTP call)       (Transport)
```

This separation means every layer can be tested, modified, and reasoned about independently — the same principle that governs the backend.

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="33%">

**Frontend**
- React 18 + TypeScript
- Tailwind CSS
- Zustand (state management)
- React Router v6
- Axios (with interceptors)
- Vite

</td>
<td valign="top" width="33%">

**Backend**
- FastAPI (Python)
- SQLAlchemy ORM
- Alembic (migrations)
- Pydantic v2
- JWT + bcrypt
- Server-Sent Events

</td>
<td valign="top" width="33%">

**AI / Database**
- OpenAI GPT-4o
- OpenAI Embeddings
- PostgreSQL
- pgvector
- tiktoken
- PyMuPDF

</td>
</tr>
</table>

---

## 📂 Project Structure

```
CodeDone-ai/
├── frontend/
│   └── src/
│       ├── api/            # Axios instance + typed API functions
│       ├── components/     # Reusable UI components
│       ├── hooks/          # Custom hooks (business logic layer)
│       ├── pages/          # Route-level page components
│       ├── store/          # Zustand global state
│       └── types/          # TypeScript interfaces
│
├── backend/
│   └── app/
│       ├── api/v1/         # Route handlers (thin, HTTP-only)
│       ├── core/           # Config, database, security, prompts
│       ├── models/         # SQLAlchemy ORM models
│       ├── schemas/        # Pydantic request/response schemas
│       └── services/       # Business logic layer
│
├── migrations/              # Alembic migration history
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ with the `pgvector` extension
- An OpenAI API key

### 1. Clone the repository
```bash
git clone https://github.com/srisatyasumanth2001-hash/CodeDone-ai
cd CodeDone-ai
```

### 2. Backend setup
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

# Create .env with your own values
cp .env.example .env
```

`.env` should contain:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/CodeDone
SECRET_KEY=your-random-secret-key
OPENAI_API_KEY=sk-your-key-here
```

```bash
# Enable pgvector and run migrations
psql -U postgres -d CodeDone -c "CREATE EXTENSION IF NOT EXISTS vector;"
alembic upgrade head

# Run the server
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000` — interactive API docs at `http://localhost:8000/docs`.

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## 🧠 How It Works

### Authentication
JWT-based auth with short-lived access tokens (60 min) and long-lived refresh tokens (7 days). An Axios response interceptor silently refreshes expired access tokens — users are never unexpectedly logged out.

### Streaming AI Chat
Chat responses stream token-by-token using **Server-Sent Events**. The backend uses a Python generator with FastAPI's `StreamingResponse`; the frontend reads the response body as a `ReadableStream`, buffering and parsing SSE events in real time to render text as it arrives — just like ChatGPT.

### RAG Pipeline
1. **Ingest** — uploaded documents are extracted, split into ~500-token overlapping chunks, embedded with `text-embedding-3-small`, and stored as vectors in PostgreSQL via `pgvector`.
2. **Retrieve** — a user's query is embedded the same way, then compared against stored vectors using cosine similarity to find the most relevant chunks.
3. **Generate** — retrieved chunks are injected into the prompt as grounded context, and GPT-4o generates an answer based only on that context — with source citations shown in the UI.

### Why pgvector over a dedicated vector DB?
CodeDone already runs on PostgreSQL. Using `pgvector` keeps the entire system on one database — no extra infrastructure, no second set of credentials, and the ability to combine relational filtering (`WHERE user_id = ...`) with vector search in a single SQL query.

---

## 🗺️ Roadmap

- [x] **Phase 1** — Authentication, project architecture, dashboard shell
- [x] **Phase 2** — Streaming AI chat assistant with conversation memory
- [x] **Phase 3** — File upload, PDF extraction, file-based chat
- [ ] **Phase 4** — Full RAG pipeline with pgvector semantic search
- [ ] **Phase 5** — GitHub repository ingestion & codebase Q&A
- [ ] **Phase 6** — Developer dashboard, analytics, project workspaces
- [ ] **Phase 7** — Docker, CI/CD, production deployment

---

## 👤 Author

**Sumanth**
Building CodeDone AI to demonstrate full-stack and AI engineering skills beyond day-to-day work experience.

[GitHub](https://github.com/srisatyasumanth2001-hash/CodeDone-ai) · [LinkedIn](https://www.linkedin.com/in/sri-satya-sumanth-mandapalli-921299229/)

</div>
