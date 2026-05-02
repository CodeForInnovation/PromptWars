# NexusFlow: AI-Orchestrated Operational Platform

## 📖 Overview
NexusFlow is an intelligent, event-driven microservices platform designed to eliminate communication silos across cross-functional teams. It shifts project management from manual tracking to **predictive coordination** by acting as a "Single Source of Truth."

Instead of asking employees to manually enter tickets and update statuses, NexusFlow sits in the background, listens to organizational communications (simulated via webhooks), and automatically orchestrates the work.

## 🏗️ Architecture
NexusFlow is decoupled into two primary layers, fully containerized and deployable to Google Cloud Run.

### 1. Intelligence Layer (FastAPI Backend)
- **Tech Stack:** Python 3.11, FastAPI, Pydantic, Pytest.
- **Functionality:** Features a webhook ingestion engine that processes natural language inputs. It simulates LLM-based intent classification to automatically categorize inputs (e.g., `create_task` or `update_status`) and maintains real-time organizational state.
- **Security:** Protected by strict CORS policies and API Key authentication.

### 2. Radical Visibility Layer (Next.js Frontend)
- **Tech Stack:** Next.js 16 (React 19), TypeScript, Tailwind CSS, SWR.
- **Functionality:** A dynamic UI with a dark-mode, glassmorphism aesthetic. It continuously polls the backend to ensure live status propagation without manual page refreshes.

## 🚀 Features
*   **Executive Heatmap:** A high-level, real-time view of Project Health metrics, Active AI Bots, and Blocked Dependencies, featuring a live Activity Stream.
*   **Focus Mode:** A granular, personalized queue of actionable items for individual execution.
*   **Webhook Simulator (In-line Actioning):** Built directly into the UI, allowing users to type natural language commands (e.g., *"Delay the design delivery by 2 days"*) to instantly trigger backend orchestration and watch the dashboard update live.

## 📦 Deployment
The application is pre-configured with `Dockerfile`s and a `deploy.sh` script for seamless deployment to Google Cloud Run.
