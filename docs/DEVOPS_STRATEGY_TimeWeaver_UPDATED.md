# ⏳ TimeWeaver -- DevOps Strategy Document

------------------------------------------------------------------------

## 1️⃣ Purpose

This document defines the DevOps strategy for the **TimeWeaver
AI-powered timetable generation system**, covering:

-   Backend (FastAPI + PostgreSQL)
-   Frontend (Express.js + Vanilla JS)

The frontend and backend currently operate independently and are not yet
integrated.

------------------------------------------------------------------------

## 2️⃣ Source Code Repositories

  Component   Repository
  ----------- ------------------------------------------------------
  Backend     https://github.com/Pranathi-N-47/timeweaver_backend
  Frontend    https://github.com/Pranathi-N-47/timeweaver_frontend

### Branching Strategy

-   `main` → Production-ready code\
-   `feature/*` → Development branches

------------------------------------------------------------------------

## 3️⃣ Current System Architecture

    Frontend (Express - Port 3000)
            |
            | pg (direct DB access for auth)
            v
    PostgreSQL (timeweaver_db)

    Backend (FastAPI - Port 8000)
            |
            | asyncpg (SQLAlchemy async)
            v
    PostgreSQL (timeweaver_db)

------------------------------------------------------------------------

## 4️⃣ Deployment Strategy

### Backend Deployment

Target Environment: - Cloud VM (AWS EC2 / Azure VM / GCP Compute
Engine) - Ubuntu 22.04 - Python 3.12 - PostgreSQL (Managed recommended)

Deployment Steps: 1. Pull latest code 2. Install dependencies 3. Run
Alembic migrations 4. Start Uvicorn service 5. Configure Nginx reverse
proxy 6. Enable HTTPS

------------------------------------------------------------------------

### Frontend Deployment

Current: - Node.js Express server - Port 3000 - Direct PostgreSQL
connection for authentication

Future: - Static-only frontend - Served via Nginx - All data via backend
API

------------------------------------------------------------------------

## 5️⃣ CI/CD Strategy

GitHub Actions will be used for automation.

### Backend CI Pipeline

1.  Checkout code
2.  Setup Python 3.12
3.  Install dependencies
4.  Run Ruff (lint)
5.  Run pytest
6.  Run coverage check

### Frontend CI Pipeline

1.  Checkout repository
2.  Install dependencies
3.  Run Jest tests
4.  Generate coverage report

------------------------------------------------------------------------

## 6️⃣ ## 6️⃣ Pre-Deployment Tests & Checks

| Item | Status |
|------|--------|
| **Backend Unit Tests (pytest)** | ✅ Implemented |
| **Backend Async Tests (pytest-asyncio)** | ✅ Implemented |
| **Backend Test Coverage (pytest-cov)** | ✅ Implemented |
| **Backend Linting (Ruff)** | ✅ Implemented |
| **Database Migration Validation (Alembic)** | ✅ Implemented |
| **Backend Health Check Endpoint (`/health`)** | ✅ Implemented |
| **Frontend Unit Tests (Jest)** | ✅ Implemented |
| **Frontend DOM Testing (@testing-library/dom)** | ✅ Implemented |
| **Frontend Test Coverage** | ✅ Implemented |
| **Frontend Server Startup Validation** | ✅ Implemented |


## 7️⃣ Database & Environment Strategy

Database: - PostgreSQL - Port 5432 - Alembic migrations - asyncpg
(backend) - node-postgres (frontend current state)

Security Rules: - No secrets committed - Use GitHub Secrets - Dedicated
DB user in production - Disable DEBUG in production

------------------------------------------------------------------------

## 8️⃣ Missing DevOps Components

| Item | Status |
|------|--------|
| **Dockerfile** | ❌ Not created |
| **docker-compose.yml** | ❌ Not created |
| **CI/CD Pipeline** | ❌ No GitHub Actions / Jenkins configuration |
| **Nginx / Reverse Proxy Configuration** | ❌ Not configured |
| **Production `.env` Template** | ❌ Only development `.env.example` exists |
| **Logging to File / Logging Service** | ❌ Console-only logging |
| **Rate Limiting** | ❌ Not implemented |
| **HTTPS / SSL** | ❌ Not configured |
| **Database Backups** | ❌ No backup strategy |
| **Monitoring / Alerting System** | ❌ Only `/health` endpoint exists |
| **Load Balancing** | ❌ Not configured |


## 9️⃣ Security Strategy

-   JWT authentication (HS256)
-   bcrypt password hashing
-   CORS middleware
-   Audit logging middleware

Production: - HTTPS via Nginx - Strong SECRET_KEY - Disable DEBUG - Rate
limiting

------------------------------------------------------------------------

## 🔟 Performance Considerations

Timetable generation uses a CPU-intensive Genetic Algorithm.

Future Improvements: - Background worker (Celery) - Task queue (Redis) -
Separate worker instance

------------------------------------------------------------------------

## 1️⃣1️⃣ Target Production Architecture

    Internet
       |
    Nginx (HTTPS)
       |
    Frontend (Static) → Backend (FastAPI)
                             |
                        PostgreSQL

------------------------------------------------------------------------

## 1️⃣2️⃣ Rollback Strategy

  Component   Rollback Method
  ----------- ------------------------------------------------------------
  Backend     Revert Git commit, restart service, `alembic downgrade -1`
  Frontend    Redeploy previous build, restart Node service

------------------------------------------------------------------------

## 1️⃣3️⃣ Monitoring Strategy

  Area             Current State        Recommended Improvement
  ---------------- -------------------- -----------------------------
  Service Health   `/health` endpoint   Uptime monitoring
  Resource Usage   Not monitored        CPU & memory monitoring
  Logs             Console logs only    Log rotation & persistence
  Alerts           Not configured       Failure alert notifications

------------------------------------------------------------------------

## 1️⃣4️⃣ Final Summary

The TimeWeaver DevOps strategy ensures:

-   Automated testing using pytest and Jest
-   Code quality enforcement using Ruff
-   Controlled PostgreSQL migrations via Alembic
-   Secure JWT authentication
-   Clear service separation
-   Defined roadmap toward production deployment
