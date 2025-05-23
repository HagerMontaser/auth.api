# Auth API

A robust authentication API built with [NestJS](https://nestjs.com/), providing user registration, login, JWT-based authentication, token refresh, and protected endpoints.

---

## Implemented Best Practices

### 1. Security

- ✅ **JWT with dual tokens**
    - Short-lived access tokens (15-30 mins)
    - Long-lived refresh tokens (7 days) with strict storage requirements
- ✅ **Token pairing**
    - `jti` claim linking access/refresh tokens
- ✅ **Credential protection**
    - BCrypt password hashing
    - Auto-escaped MongoDB queries
- ✅ **Defense in depth**
    - Token rotation
    - Rate limiting on auth endpoints

### 2. Code Quality

- 🏗 **Clean architecture**
    - Repository pattern for data access
    - Dependency injection
    - Single Responsibility controllers
- 🔒 **Type safety**
    - Strict DTO validation
    - Interface-driven development
    - Compile-time type checking
- 🧩 **Modular design**
    - Feature-based organization
    - Shared core library
    - Loose coupling

### 3. Reliability

- ⏱ **Token expiration**
    - Configurable per environment
- 🗄 **Session management**
    - Complete token audit trail
    - Granular revocation
- 🛡 **Input validation**
    - Class-validator DTOs
    - Schema-level MongoDB validation
    - Anti-injection measures

## Features

- **User Registration**: Register new users with validation.
- **Login**: Obtain JWT access and refresh tokens.
- **Token Refresh**: Securely refresh access tokens.
- **Logout**: Invalidate refresh tokens.
- **Protected Endpoints**: Access resources with a valid JWT.
- **Swagger API Docs**: Interactive documentation at `/api`.

---

## Project Setup

```bash
npm install
```

---

## Running the Project

```bash
# Development
npm run start

# Watch mode (auto-reload)
npm run start:dev

# Production
npm run start:prod
```

---

## Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## Authentication Flow

1. **Login**: POST `/auth/login` with email and password

    - Returns access_token (15min expiry) and refresh_token (7d expiry)

2. **Protected Routes**: Add `Authorization: Bearer <access_token>` header

3. **Refresh Token**: POST `/auth/refresh` with expired access token
    - Include `Authorization: Bearer <refresh_token>` header
    - Returns new access_token

## API Documentation

After starting the server, visit [http://localhost:3000/api](http://localhost:3000/api) for interactive Swagger documentation.

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
APP_ENV = dev # local | dev | test | stage | prod
SERVER_HOST = 127.0.0.1
SERVER_PORT = 3000
DATABASE_HOST = localhost
DATABASE_PORT = 27017
DATABASE_NAME =  auth
JWT_ACCESS_TOKEN_SECRET = ___ReplaceWithYourSecretKey___
JWT_ACCESS_TOKEN_EXPIRATION_TIME = 15m
JWT_REFRESH_TOKEN_SECRET = ___ReplaceWithYourSecretKey___
JWT_REFRESH_TOKEN_EXPIRATION_TIME = 7d

```

---

## Deployment

See [NestJS deployment docs](https://docs.nestjs.com/deployment) for best practices.

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Discord Community](https://discord.gg/G7Qnnhy)
- [Official Courses](https://courses.nestjs.com/)
- [NestJS Devtools](https://devtools.nestjs.com)
- [Jobs Board](https://jobs.nestjs.com)

---

## License

MIT
