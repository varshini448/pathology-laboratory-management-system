# Backend Architecture

## Pathology Intelligence Platform

The backend is a Node.js and Express.js REST API responsible for authentication, authorization, business logic, validation, workflow processing, and database communication.

---

## 1. Backend Structure

```text
backend/
└── src/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── validators/
    ├── config/
    └── server.js
---

## 2. Request Flow

```text
Client Request
      ↓
Express Route
      ↓
Authentication
      ↓
Authorization
      ↓
Validation
      ↓
Controller
      ↓
Service
      ↓
Mongoose Model
      ↓
MongoDB
      ↓
API Response
---

## 3. Routes

The backend provides REST API modules for:

- Authentication
- Patients
- Doctors
- Cases
- Specimens
- Blocks
- Slides
- Workflow
- TAT
- Quality Control
- Reports
- Audit Logs
- Notifications

Routes define endpoints and connect requests to the appropriate controllers.

---

## 4. Controllers and Services

### Controllers

Controllers handle HTTP-specific responsibilities:

- Request parameters
- Request body
- Authentication context
- Service invocation
- HTTP responses

### Services

Services contain reusable business logic and database operations.

This separation keeps controllers smaller and makes business logic easier to maintain and test.

---

## 5. Middleware

The backend uses middleware for:

- JWT authentication
- Role-based authorization
- Request validation
- Centralized error handling
- Unknown route handling

---

## 6. Validation

Validation is performed before business operations are executed.

Validation modules cover important resources such as:

- Authentication
- Patients
- Cases
- Specimens
- Reports

This prevents malformed data from reaching business logic and database operations.

---
## 7. Error Handling

The backend uses centralized error handling for consistent API responses.

Supported error categories include:

- Validation errors
- Authentication errors
- Authorization errors
- Resource-not-found errors
- Database errors
- Unknown routes
- Unexpected server errors

Common HTTP responses include `400`, `401`, `403`, `404`, and `500`.

---

## 8. Security

Backend security includes:

- JWT authentication
- bcrypt password hashing
- Role-based access control
- Protected endpoints
- Input validation
- Environment-based secrets
- Centralized error handling
- Audit logging

The backend `.env` file is excluded from Git version control.

---
