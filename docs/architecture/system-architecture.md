# System Architecture

## Pathology Intelligence Platform

The Pathology Intelligence Platform is a full-stack web application designed to digitize pathology laboratory operations, provide end-to-end case traceability, support quality management, and create a foundation for AI-assisted laboratory intelligence.

The system follows a modular client-server architecture using the MERN stack.

---

## 1. Architecture Overview

The platform is divided into four primary layers:

```text
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│                  React + Vite Frontend                   │
└────────────────────────────┬────────────────────────────┘
                             │
                             │ REST API / HTTP
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                    │
│                Node.js + Express Backend                │
│                                                         │
│  Routes → Controllers → Services → Validation/Middleware│
└────────────────────────────┬────────────────────────────┘
                             │
                             │ Mongoose
                             ▼
┌─────────────────────────────────────────────────────────┐
│                       Data Layer                         │
│                    MongoDB Database                      │
│                                                         │
│ Patients • Doctors • Cases • Specimens • Blocks         │
│ Slides • Workflow • TAT • QC • Reports • Audit Logs     │
│ Notifications • Users                                    │
└─────────────────────────────────────────────────────────┘

                         Future Layer
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│              AI-Assisted Intelligence Layer              │
│                                                         │
│ Case Intelligence • TAT Prediction • Bottleneck         │
│ Detection • QC Anomaly Detection • Report Assistance    │
│ Priority Prediction • Data Quality • Analytics          │
└─────────────────────────────────────────────────────────┘
---

## 2. Technology Stack

### Frontend

- React
- Vite
- React Router
- Lucide React
- CSS
- REST API service layer
- React Context where application-wide state is required
- Vitest
- React Testing Library

### Backend

- Node.js
- Express.js
- REST APIs
- JWT authentication
- bcrypt password hashing
- Mongoose
- Validation middleware
- Authentication middleware
- Authorization middleware
- Centralized error handling

### Database

- MongoDB
- Mongoose ODM

### Development Tools

- Git
- GitHub
- VS Code
- npm
- MongoDB / MongoDB Compass

---

## 3. Frontend Architecture

The frontend follows a component-based architecture.

```text
frontend/
└── src/
    ├── components/
    ├── contexts/
    ├── hooks/
    ├── layouts/
    ├── pages/
    ├── routes/
    ├── services/
    ├── styles/
    ├── utils/
    ├── validators/
    └── __tests__/
---

## 4. Application Shell

The application uses a shared application shell for authenticated users.

The shell provides:

- Sidebar navigation
- Top navigation
- Workspace navigation
- Notification access
- User information
- Role-aware navigation
- Consistent page layout

The application shell separates global navigation concerns from individual feature pages.

---
## 5. Backend Architecture

The backend uses a layered Express.js architecture.

```text
Client
  ↓
Routes
  ↓
Authentication / Authorization
  ↓
Validation
  ↓
Controllers
  ↓
Services
  ↓
Mongoose Models
  ↓
MongoDB
## 6. Database Architecture

The system uses MongoDB with Mongoose ODM.

### Core Collections

- Users
- Patients
- Doctors
- Cases
- Specimens
- Blocks
- Slides
- Workflow Events
- TAT Records
- QC Records
- Reports
- Audit Logs
- Notifications

### Entity Relationships

```text
Patient
  ↓
Case
  ├── Specimen → Block → Slide
  ├── Workflow Events
  ├── TAT Records
  ├── QC Records
  └── Reports
## 7. Authentication and Authorization

The platform uses JWT authentication with role-based access control (RBAC).

### Authentication Flow

```text
Login
  ↓
Credential Validation
  ↓
Password Verification
  ↓
JWT Generation
  ↓
Authenticated API Request
  ↓
JWT Middleware
  ↓
Authorized User
