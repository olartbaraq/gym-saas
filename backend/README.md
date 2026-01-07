# Gym-SaaS Backend

A comprehensive backend solution for the Gym-SaaS platform, built with **NestJS**. This system is designed as a scalable microservices architecture to manage gym operations, memberships, workouts, and more.

## 🚀 Project Overview

Gym-SaaS is a multi-tenant platform designed to streamline gym operations. The backend handles complex logic for multi-location gym chains, role-based access control (RBAC), and member engagement.

### Architecture

The project follows a **Microservices Architecture** using a Monorepo structure managed by NestJS.

*   **API Gateway**: The single entry point for all client requests. It aggregates data and routes requests to appropriate microservices.
*   **Auth Service**: Manages user identities, authentication (JWT, OAuth), and authorization.
*   **Gym Service**: Handles gym-specific logic, locations, and resources.

## 🛠 Tech Stack

*   **Framework**: [NestJS](https://nestjs.com/) (Node.js)
*   **Languages**: TypeScript
*   **Databases**: PostgreSQL (managed via TypeORM and Sequelize)
*   **Communication**: gRPC, GraphQL, REST API
*   **Documentation**: Swagger (OpenAPI), GraphQL Playground

## 📡 Communication Protocols

The backend utilizes a hybrid approach to communication to leverage the best tools for specific scenarios:

### 1. REST API
Standard RESTful endpoints are exposed via the **API Gateway** for general client operations.
*   **Base URL**: `/api/v1`
*   **Documentation**: Interactive Swagger documentation is available at `/api` when running the server.
*   **Use Case**: Authentication, standard CRUD operations where simple caching and HTTP semantics are beneficial.

### 2. GraphQL
A flexible data query layer is provided for complex data fetching requirements.
*   **Endpoint**: `/graphql`
*   **Playground**: Apollo Sandbox/Playground is enabled in development.
*   **Schema**: Auto-generated code-first schema.
*   **Use Case**: Fetching nested data (e.g., A Gym with all its Locations and associated Trainers) in a single request to avoid over-fetching or under-fetching.

### 3. gRPC (Internal Communication)
High-performance inter-service communication between the **API Gateway** and **Microservices** (Auth, Gym).
*   **Protocol**: Protocol Buffers (protobuf)
*   **Definition**: `.proto` files are located in `proto/`.
*   **Error Handling**: Custom mapping strategies are implemented to translate gRPC status codes to HTTP exceptions for the client.
*   **Use Case**: Low-latency, strongly-typed communication between the Gateway and internal services.

## 📂 Project Structure

```
backend/
├── apps/
│   ├── apigateway/   # Main entry point (REST + GraphQL)
│   ├── auth/         # Authentication Microservice (gRPC)
│   └── gym/          # Gym Management Microservice (gRPC)
├── libs/             # Shared libraries (DTOs, decorators, filters)
├── proto/            # gRPC Protocol Buffer definitions
└── ...
```

## 🚦 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Yarn
*   PostgreSQL

### Installation

```bash
# Install dependencies
$ yarn install
```

### Running the Application

Since this is a monorepo, you can run apps individually or concurrently.

```bash
# Run API Gateway (Development)
$ yarn start:dev apigateway

# Run Auth Service
$ yarn start:dev auth

# Run Gym Service
$ yarn start:dev gym
```

### Database Migrations

```bash
# Run migrations for Auth service
$ yarn migration_auth:run

# Run migrations for Gym service
$ yarn migration_gym:run
```

## 🔐 Environment Variables

Create a `.env` file in the root of `backend/` based on the `.env.example` (if available) or ensure the following configurations are set:

*   **Database Credentials** (Host, Port, User, Password, DB Name)
*   **JWT Secret**
*   **Google OAuth Credentials**
*   **Service Ports** (Gateway, gRPC ports)

## 🧪 Testing

```bash
# Unit tests
$ yarn test

# E2E tests
$ yarn test:e2e
```

## 📄 License

This project is [MIT licensed](LICENSE).
