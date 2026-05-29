# 🥗 NutriHelp API

**Personalised Recipe, Meal Planning & Nutrient Suggestion REST API**

A production-ready Node.js/Express backend powering the NutriHelp mobile app. Built with a full 7-stage DevOps pipeline using Jenkins.

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Running Locally](#running-locally)
- [Running with Docker](#running-with-docker)
- [Jenkins Pipeline](#jenkins-pipeline)
- [Monitoring](#monitoring)

---

## Project Overview

NutriHelp helps users achieve their health goals through:
- **Personalised Recipes** — filtered by dietary needs, calories, and macros
- **Meal Planning** — create, manage, or auto-generate weekly meal plans
- **Nutrient Guidance** — goal-based nutrient suggestions and intake analysis

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18 (LTS) |
| Framework | Express.js 4.x |
| Testing | Jest + Supertest |
| Code Quality | ESLint + SonarQube |
| Security | npm audit + Trivy |
| Containerisation | Docker + Docker Compose |
| Monitoring | Prometheus + Grafana |
| CI/CD | Jenkins |

---

## API Endpoints

### Recipes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/recipes` | List all recipes (filter: category, dietaryTag, maxCalories, minProtein) |
| GET | `/api/recipes/:id` | Get single recipe |
| GET | `/api/recipes/recommendations` | Personalised recommendations (filter: goal, calories, dietaryPreferences) |
| GET | `/api/recipes/tags` | All dietary tags |
| GET | `/api/recipes/categories` | All categories |

### Meal Plans
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/meals` | List all meal plans |
| GET | `/api/meals/:id` | Get single plan (enriched with recipe data) |
| POST | `/api/meals` | Create a meal plan |
| PUT | `/api/meals/:id` | Update a meal plan |
| DELETE | `/api/meals/:id` | Delete a meal plan |
| POST | `/api/meals/generate` | Auto-generate a meal plan |

### Nutrients
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/nutrients` | List all nutrients |
| GET | `/api/nutrients/:id` | Get single nutrient |
| GET | `/api/nutrients/suggestions/:goal` | Goal-based nutrient suggestions |
| POST | `/api/nutrients/calculate` | Calculate intake from recipe IDs |
| GET | `/api/nutrients/categories` | All nutrient categories |

### System
| Endpoint | Description |
|---|---|
| `GET /health` | Health check |
| `GET /metrics` | Prometheus metrics |

---

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

API available at: `http://localhost:3000`

---

## Running with Docker

```bash
# Build and start all services (API + Prometheus + Grafana)
docker-compose up -d

# Check logs
docker-compose logs -f nutrihelp-api

# Stop all services
docker-compose down
```

| Service | URL |
|---|---|
| NutriHelp API | http://localhost:3000 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 (admin / nutrihelp123) |

---

## Jenkins Pipeline

The pipeline has **7 stages**:

| # | Stage | Description |
|---|---|---|
| 1 | **Build** | `npm ci`, Docker image build, artefact creation |
| 2 | **Test** | Jest unit + integration tests with coverage |
| 3 | **Code Quality** | ESLint + SonarQube analysis with quality gate |
| 4 | **Security** | npm audit + Trivy Docker image scan |
| 5 | **Deploy** | Automated staging deployment with health checks |
| 6 | **Release** | Production promotion, Docker tagging, release notes |
| 7 | **Monitoring** | Prometheus + Grafana stack verification |

### Jenkins Setup

1. Install Jenkins plugins: **Pipeline**, **SonarQube Scanner**, **HTML Publisher**, **Docker Pipeline**
2. Configure SonarQube server: `Manage Jenkins → Configure System → SonarQube`
3. Install Node.js 18: `Manage Jenkins → Global Tool Configuration → NodeJS`
4. Create a **Pipeline** job pointing to this repository
5. Set **Jenkinsfile** as the pipeline script

---

## Monitoring

**Prometheus** scrapes metrics from `/metrics` every 15 seconds.

**Key metrics tracked:**
- `nutrihelp_http_request_duration_seconds` — request latency histogram
- `nutrihelp_http_requests_total` — total requests by route/status
- `nutrihelp_active_connections` — live connection count
- Default Node.js metrics (heap, CPU, event loop)

**Alert rules** (in `prometheus/alert_rules.yml`):
- API down for > 1 minute → **CRITICAL**
- Error rate > 5% for > 2 minutes → **WARNING**
- P95 latency > 2s for > 5 minutes → **WARNING**
- Heap usage > 90% → **WARNING**

**Grafana** dashboard is available at `http://localhost:3001` (admin/nutrihelp123).
Add dashboards using the pre-configured Prometheus datasource.

---

## Project Structure

```
nutrihelp/
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Entry point
│   ├── routes/                # Route definitions
│   ├── controllers/           # Business logic
│   ├── data/                  # In-memory data store
│   ├── middleware/            # Error handler
│   └── metrics/               # Prometheus setup
├── tests/
│   ├── unit/                  # Unit tests (controllers)
│   └── integration/           # Integration tests (API)
├── prometheus/
│   ├── prometheus.yml         # Scrape config
│   ├── alert_rules.yml        # Alert definitions
│   └── grafana-datasource.yml # Grafana provisioning
├── scripts/
│   ├── deploy.sh              # Staging deploy script
│   └── release.sh             # Production release script
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml         # Staging stack
├── docker-compose.prod.yml    # Production stack
├── Jenkinsfile                # 7-stage CI/CD pipeline
├── sonar-project.properties   # SonarQube config
└── .eslintrc.js               # ESLint rules
```
