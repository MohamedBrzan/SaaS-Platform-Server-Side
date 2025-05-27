# SaaS Platform Backend

Welcome to the backend codebase of the SaaS Platform project. This repository contains the server-side application built with **NestJS** and **TypeScript**, designed for scalability, maintainability, and multi-tenant support.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Testing Strategy](#testing-strategy)
- [Environment & Configuration](#environment--configuration)
- [Infrastructure as Code](#infrastructure-as-code)
- [Further Reading](#further-reading)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This backend services multiple tenants with isolated data and feature toggles. It is designed with **Clean Architecture** principles to ensure the business logic is independent of frameworks and infrastructure, allowing easy testing and extensibility.

The application integrates with MongoDB for data storage, Redis for caching, Kafka for messaging, and third-party APIs like Stripe and SendGrid.

---

## Architecture Overview

The project follows a modular, layered structure to cleanly separate concerns:

backend/
├── src/
│ ├── main.ts # NestJS bootstrap: app entry point starting the server
│ ├── app.module.ts # Root module wiring core, infra & features together
│ │
│ ├── config/ # Environment variables and feature flag management
│ │ ├── app-config.ts # Schema validation and config loader (Joi/Zod)
│ │ ├── feature-flags.ts # Feature toggle management (e.g., LaunchDarkly)
│ │ └── envs/ # Environment-specific config files (.env.development etc.)
│ │
│ ├── core/ # Pure business logic, independent of frameworks
│ │ ├── domain/ # Domain models: entities, value objects, domain services
│ │ │ ├── entities/ # Core business entities (User, Tenant)
│ │ │ ├── value-objects/ # Immutable domain objects (Email, Currency)
│ │ │ └── services/ # Domain services encapsulating domain logic
│ │ │
│ │ └── application/ # Use cases & interfaces (ports)
│ │ ├── ports/ # Abstract interfaces for repositories, services
│ │ └── use-cases/ # Application use-cases implementing business workflows
│ │
│ ├── shared/ # Cross-cutting concerns used app-wide
│ │ ├── tenant/ # Multi-tenant utilities: middleware, decorators, context
│ │ ├── decorators/ # Custom NestJS decorators (e.g., Roles, Public)
│ │ ├── filters/ # Exception filters to handle HTTP errors globally
│ │ ├── guards/ # Guards for auth, multi-tenancy, etc.
│ │ ├── interceptors/ # Request/response interceptors (logging, timing)
│ │ ├── pipes/ # Validation pipes for request data
│ │ └── utils/ # General utilities (string, date helpers)
│ │
│ ├── infrastructure/ # Framework-specific implementations & integrations
│ │ ├── database/ # DB connections & repositories implementing core ports
│ │ │ ├── mongo/ # MongoDB schemas and repository implementations
│ │ │ └── redis/ # Redis cache & pub/sub provider
│ │ ├── http/ # Controllers, middleware, exception handling
│ │ ├── messaging/ # Event bus integrations (Kafka, etc.)
│ │ ├── observability/ # Logging, metrics, tracing providers
│ │ └── providers/ # Third-party service clients (Stripe, SendGrid)
│ │
│ ├── modules/ # Feature modules wiring core & infra to HTTP
│ │ ├── tenant/ # Tenant management feature module
│ │ ├── auth/ # Authentication & authorization
│ │ ├── projects/ # Project-related domain logic
│ │ └── billing/ # Billing & subscription management
│ │
│ └── health/ # Kubernetes health probes (readiness/liveness)
│
├── test/ # Testing pyramid layers: unit, integration, e2e
│
├── infrastructure-as-code/ # Infrastructure automation (Terraform, Helm charts)
│
├── docker/ # Docker container configs
│
├── docs/ # Documentation & architecture decision records
│
└── README.md

### Why this architecture?

- **Separation of Concerns:** Isolates domain logic from infrastructure and framework code.
- **Testability:** Core logic is framework-agnostic, facilitating unit testing without mocks.
- **Modularity & Scalability:** Feature modules encapsulate related business logic.
- **Multi-Tenancy:** Shared tenant context utilities handle tenant isolation.
- **Extensibility:** Infrastructure adapters can be swapped without touching core business logic.
- **Maintainability:** Clear folder boundaries reduce cognitive load and increase onboarding speed.

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- pnpm >= 8.x
- Docker (optional, for containerized setup)
- MongoDB Atlas or local MongoDB
- Redis instance
- Kafka broker (optional for messaging)

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/MohamedBrzan/SaaS-Platform-Server-Side.git
   cd SaaS-Platform-Server-Side
   ```

If you want, I can help you generate complementary docs like `CONTRIBUTING.md`, API specs, or diagrams in your `docs/` folder. Just ask!
