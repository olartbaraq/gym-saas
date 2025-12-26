# GraphQL API Implementation

## Overview

This directory contains the GraphQL implementation for Users and Gyms resources that interact with gRPC microservices.

## Structure

```
graphql/
├── users/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── users.entity.ts
│   │   ├── social-media.entity.ts
│   │   ├── find-all-users-response.entity.ts
│   │   └── message.entity.ts
│   ├── dto/
│   │   ├── find-all-users.input.ts
│   │   ├── filter-users.input.ts
│   │   └── update-user.input.ts
│   ├── users.resolver.ts
│   ├── users-graphql.service.ts
│   └── users-graphql.module.ts
└── gyms/
    ├── entities/
    │   ├── gym.entity.ts
    │   ├── gyms.entity.ts
    │   ├── gym-config.entity.ts
    │   ├── find-all-gyms-response.entity.ts
    │   └── message.entity.ts
    ├── dto/
    │   ├── find-all-gyms.input.ts
    │   ├── filter-gyms.input.ts
    │   └── update-gym.input.ts
    ├── gyms.resolver.ts
    ├── gyms-graphql.service.ts
    └── gyms-graphql.module.ts
```

## GraphQL Endpoints

### Users Queries & Mutations

- **findAllUsers**: Query to get paginated list of users
- **findOneUser**: Query to get a user by ID
- **findOneUserByEmail**: Query to get a user by email
- **updateUser**: Mutation to update user information
- **removeUser**: Mutation to soft delete a user

### Gyms Queries & Mutations

- **findAllGyms**: Query to get paginated list of gyms
- **findOneGym**: Query to get a gym by ID
- **updateGym**: Mutation to update gym information
- **removeGym**: Mutation to soft delete a gym

## Accessing GraphQL Playground

After starting the API Gateway, access GraphQL Playground at:
```
http://localhost:{GATEWAY_PORT}/graphql
```

## Example Queries

### Find All Users
```graphql
query {
  findAllUsers(input: { page: 1, limit: 10 }) {
    data {
      users {
        id
        email
        firstName
        lastName
        role
      }
    }
    total
    page
    limit
  }
}
```

### Find One User
```graphql
query {
  findOneUser(id: "user-id") {
    id
    email
    firstName
    lastName
    location
    role
  }
}
```

### Update User
```graphql
mutation {
  updateUser(input: {
    id: "user-id"
    location: "New Location"
    role: "ADMIN"
  }) {
    id
    location
    role
    updatedAt
  }
}
```

### Find All Gyms
```graphql
query {
  findAllGyms(input: { page: 1, limit: 10, search: "fitness" }) {
    data {
      gyms {
        id
        name
        slug
        config {
          logoUrl
          email
        }
      }
    }
    total
  }
}
```

## gRPC Integration

Both modules use NestJS microservices to communicate with gRPC services:
- **Users GraphQL** → Auth gRPC Service (`AUTH_PACKAGE_NAME`)
- **Gyms GraphQL** → Gyms gRPC Service (`GYMS_PACKAGE_NAME`)

The services handle:
- gRPC client initialization
- Observable to Promise conversion
- Error handling and transformation

## Notes

- User creation and login remain REST-only endpoints
- All GraphQL operations require proper authentication (JWT)
- Error handling follows the same pattern as REST API endpoints
- Proto files are located in `backend/proto/` directory


