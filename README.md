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

Multi-Tenant Backend System

This is a highly scalable, multi-tenant backend system built with NestJS, TypeScript, and MongoDB. It follows clean architecture principles, supports microservices-ready modularity, and includes robust multi-tenancy features, observability, and modern deployment practices using Docker, Helm, and Terraform.

## Project Structure

Below is the folder structure of the backend:

```plaintext
backend/
├── src/
│   ├── main.ts                          # NestJS bootstrap
│   ├── app.module.ts                    # Root module wiring
│   │
│   ├── config/                          # Env & feature-flag management
│   │   ├── app-config.ts                # Joi/Zod schema & loader
│   │   ├── feature-flags.ts             # LaunchDarkly / local toggles
│   │   └── envs/
│   │       ├── .env.development
│   │       └── .env.production
│   │
│   ├── core/                            # Framework-agnostic business layers
│   │   ├── domain/                      # Pure entities, VOs, domain services
│   │   │   ├── entities/
│   │   │   │   ├── User.ts
│   │   │   │   └── Tenant.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── Email.ts
│   │   │   │   └── Currency.ts
│   │   │   └── services/
│   │   │       └── PaymentCalculator.ts
│   │   │
│   │   └── application/                 # Use-cases & port interfaces
│   │       ├── ports/
│   │       │   ├── IUserRepository.ts
│   │       │   └── IEmailService.ts
│   │       └── use-cases/
│   │           ├── CreateProjectUseCase.ts
│   │           └── CreateTenantUseCase.ts
│   │
│   ├── shared/                          # Cross-cutting concerns
│   │   ├── tenant/                      # Multi-tenant support
│   │   │   ├── tenant.middleware.ts     # extracts tenantId
│   │   │   ├── tenant.decorator.ts      # @CurrentTenant()
│   │   │   └── tenant-context.service.ts# getTenantId()
│   │   │
│   │   ├── decorators/                  # e.g. @Roles(), @Public()
│   │   │   └── Roles.decorator.ts
│   │   ├── filters/                     # Exception filters
│   │   │   └── AllExceptionsFilter.ts
│   │   ├── guards/                      # AuthGuard, TenantGuard
│   │   │   ├── AuthGuard.ts
│   │   │   └── TenantGuard.ts
│   │   ├── interceptors/                # Logging, timing, transform
│   │   │   └── LoggingInterceptor.ts
│   │   ├── pipes/                       # Validation pipes
│   │   │   └── ValidationPipe.ts
│   │   └── utils/                       # String, date, crypto helpers
│   │       ├── dateUtils.ts
│   │       └── stringUtils.ts
│   │
│   ├── infrastructure/                  # NestJS-bound adapters & integrations
│   │   ├── database/
│   │   │   ├── mongo/                   # MongoDB Atlas multi-tenant
│   │   │   │   ├── schemas/
│   │   │   │   │   ├── user.schema.ts
│   │   │   │   │   └── tenant.schema.ts
│   │   │   │   └── repositories/        # implement IUserRepository, ITenantRepository
│   │   │   │       ├── UserRepository.ts
│   │   │   │       └── TenantRepository.ts
│   │   │   └── redis/                   # Caching & pub/sub
│   │   │       └── RedisCacheProvider.ts
│   │   │
│   │   ├── http/                        # Controllers, middleware, HTTP errors
│   │   │   ├── controllers/
│   │   │   │   ├── UserController.ts
│   │   │   │   └── ProjectController.ts
│   │   │   ├── middleware/
│   │   │   │   ├── LoggingMiddleware.ts
│   │   │   │   └── RateLimitMiddleware.ts
│   │   │   └── exceptions/
│   │   │       └── HttpExceptionFactory.ts
│   │   │
│   │   ├── messaging/                   # Event bus adapters & handlers
│   │   │   ├── KafkaProvider.ts
│   │   │   └── event-handlers/
│   │   │       └── ProjectCreatedHandler.ts
│   │   │
│   │   ├── observability/               # Logging, tracing, metrics
│   │   │   ├── logging.provider.ts
│   │   │   ├── tracing.provider.ts
│   │   │   └── metrics.provider.ts
│   │   │
│   │   └── providers/                   # Third-party service clients
│   │       ├── stripe/
│   │       │   └── StripeClientProvider.ts
│   │       └── sendgrid/
│   │           └── SendGridMailProvider.ts
│   │
│   ├── modules/                         # Feature modules (wire Core↔Infra↔HTTP)
│   │   ├── tenant/
│   │   │   ├── application/
│   │   │   │   ├── commands/
│   │   │   │   │   └── CreateTenantCommand.ts
│   │   │   │   ├── queries/
│   │   │   │   │   └── GetTenantQuery.ts
│   │   │   │   └── dtos/
│   │   │   │       └── TenantDto.ts
│   │   │   ├── domain/
│   │   │   │   └── TenantEntity.ts
│   │   │   └── interface/
│   │   │       ├── TenantController.ts
│   │   │       └── TenantDto.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── application/
│   │   │   │   └── use-cases/
│   │   │   │       ├── LoginUseCase.ts
│   │   │   │       └── RefreshTokenUseCase.ts
│   │   │   └── interface/
│   │   │       ├── AuthController.ts
│   │   │       └── AuthDto.ts
│   │   │
│   │   ├── projects/
│   │   │   ├── application/
│   │   │   │   └── use-cases/
│   │   │   │       ├── CreateProjectUseCase.ts
│   │   │   │       └── UpdateProjectUseCase.ts
│   │   │   └── interface/
│   │   │       ├── ProjectController.ts
│   │   │       └── ProjectDto.ts
│   │   │
│   │   └── billing/
│   │       ├── application/
│   │       │   └── use-cases/
│   │       │       ├── CreateSubscriptionUseCase.ts
│   │       │       └── CancelSubscriptionUseCase.ts
│   │       └── interface/
│   │           ├── BillingController.ts
│   │           └── BillingDto.ts
│   │
│   └── health/                          # Kubernetes probes & lifecycle
│       ├── readiness.ts
│       └── liveness.ts
│
├── test/                                # Testing pyramid
│   ├── unit/                            # Core/domain & use-case tests
│   ├── integration/                     # Infra + DB tests
│   └── e2e/                             # Full-stack API flows
│
├── infrastructure-as-code/              # Declarative infra
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── helm/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│
├── docker/                              # Container definitions
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── docs/                                # Architecture & onboarding
│   ├── ADRs/
│   │   └── 0001-use-clean-architecture.md
│   └── diagrams/
│       └── system-sequence.puml
│
└── README.md
```

## Overview

This backend is designed for a multi-tenant system, supporting features like portfolio management, customer purchases, and project workflows. It uses:

- **NestJS** and **TypeScript** for a robust, type-safe backend.
- **MongoDB** for flexible, scalable data storage with tenant isolation.
- **Redis** for caching and pub/sub.
- **Kafka** for event-driven architecture.
- **Stripe** and **SendGrid** for payments and email integrations.
- **Docker**, **Helm**, and **Terraform** for deployment.

The architecture follows clean architecture principles, ensuring modularity, scalability, and maintainability.

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment**:

   - Copy `.env.example` to `.env.development` or `.env.production`.
   - Update variables (e.g., MongoDB URI, Stripe API key).

4. **Run Locally**:

   ```bash
   npm run start:dev
   ```

5. **Run Tests**:

   ```bash
   npm run test
   npm run test:integration
   npm run test:e2e
   ```

6. **Deploy with Docker**:

   ```bash
   docker-compose up -d
   ```

7. **Deploy to Kubernetes**:
   - Use Helm charts in `infrastructure-as-code/helm/`.
   ```bash
   helm install my-app ./infrastructure-as-code/helm
   ```

## Key Features

- **Multi-Tenancy**: Tenant-aware middleware and repositories ensure data isolation.
- **Clean Architecture**: Separates domain logic from infrastructure.
- **Event-Driven**: Kafka handles asynchronous tasks like project creation events.
- **Observability**: Logging, tracing, and metrics for production monitoring.
- **Testing**: Comprehensive unit, integration, and end-to-end tests.
- **Deployment**: Containerized with Docker and orchestrated with Kubernetes.

## Contributing

- Follow the coding standards in `docs/`.
- Submit pull requests with clear descriptions and tests.
- Update ADRs for architectural changes.

### Explanation of Key Folders

- **`src/core/`**  
  Contains business domain logic independent of any frameworks or infrastructure. This includes entities (e.g., User, Tenant), value objects (e.g., Email, Currency), and application use cases (business workflows). This separation enforces the **Clean Architecture** principle.

- **`src/infrastructure/`**  
  Implements framework-specific adapters and external system integrations (e.g., database, messaging, HTTP controllers). This layer translates between domain abstractions and technical details.

- **`src/modules/`**  
  Groups related features into modules (tenant management, authentication, projects, billing). Each module wires together core domain logic with infrastructure adapters and HTTP controllers to keep features encapsulated and maintainable.

- **`src/shared/`**  
  Contains reusable utilities, guards, decorators, pipes, and middleware shared across modules such as authentication guards, validation pipes, and tenant context management.

- **`src/config/`**  
  Manages application configuration, environment variables, and feature toggles using schema validation to ensure correctness.

- **`test/`**  
  Structured testing with unit tests (core logic), integration tests (infrastructure), and end-to-end tests (full system flow).

- **`infrastructure-as-code/`**  
  Contains Terraform and Helm manifests for provisioning cloud resources and deploying to Kubernetes, enabling infrastructure automation.

---

### Why this architecture?

- **Separation of Concerns:** Domain logic is decoupled from external frameworks, making the system easier to maintain and test.
- **Modularity:** Features are isolated in modules improving scalability and team collaboration.
- **Testability:** Core business logic can be tested without mocking infrastructure.
- **Multi-Tenancy:** Shared tenant context supports isolation of data per tenant, crucial for SaaS.
- **Extensibility:** Infrastructure adapters can be replaced or extended without impacting core business rules.

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

## License

MIT License
