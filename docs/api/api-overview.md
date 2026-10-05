# API Overview

## Pathology Intelligence Platform

The backend exposes REST APIs that allow the React frontend to communicate with laboratory services and MongoDB-backed resources.

---

## 1. API Architecture

```text
React Frontend
      ↓
Frontend Service Layer
      ↓
HTTP / REST API
      ↓
Express Routes
      ↓
Controllers / Services
      ↓
MongoDB
---

## 2. API Modules

| Module | Purpose |
|--------|---------|
| Auth | Login, registration, authentication |
| Patients | Patient records |
| Doctors | Doctor records |
| Cases | Case management |
| Specimens | Specimen management |
| Blocks | Tissue block management |
| Slides | Slide management |
| Workflow | Laboratory workflow events |
| TAT | Turnaround-time tracking |
| QC | Quality control |
| Reports | Report generation and sign-out |
| Audit | Activity and audit logs |
| Notifications | User notifications |

---

## 3. Authentication

Protected requests use JWT authentication.

```text
Authorization: Bearer <JWT_TOKEN>
## 4. Authorization

Role-based authorization controls access to protected operations.

Supported roles:

- ADMIN
- TECHNICIAN
- PATHOLOGIST
- QUALITY_MANAGER

Authorization is enforced on the backend.
---

## 5. Response and Error Handling

The API uses standard HTTP status codes including:

- `200` — successful request
- `201` — resource created
- `400` — invalid request
- `401` — authentication required
- `403` — insufficient permissions
- `404` — resource not found
- `500` — server error

Centralized backend error handling provides consistent responses to the frontend.

---

## 6. API Design Principles

The API follows:

- RESTful resource organization
- Authentication and authorization
- Request validation
- Consistent HTTP status codes
- Separation of controllers and services
- Centralized error handling
- Reusable frontend service functions

---
