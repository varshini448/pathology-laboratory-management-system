# Pathology Intelligence Platform

A professional full-stack **Pathology Laboratory Management and Intelligence Platform** designed to digitize laboratory workflows, improve operational visibility, support quality management, and provide AI-assisted insights for pathology laboratory teams.

The platform manages the complete pathology case lifecycle — from patient registration and specimen collection to workflow processing, quality control, pathology reporting, and final sign-out.

> **Project Type:** Full-Stack Academic / Final-Year Project  
> **Architecture:** MERN Stack  
> **Status:** Active Development  
> **License:** MIT

---

## Overview

Traditional pathology laboratory workflows often involve disconnected records, manual status tracking, limited turnaround-time visibility, and fragmented quality information.

The Pathology Intelligence Platform provides a centralized system for managing:

- Patients
- Doctors
- Pathology cases
- Specimens
- Tissue blocks
- Slides
- Laboratory workflow stages
- Turnaround time (TAT)
- Quality control
- Pathology reports
- Report sign-out
- Audit logs
- Notifications
- Role-based access control
- AI-assisted laboratory intelligence

The platform is designed with a strong focus on **traceability, workflow visibility, data quality, security, and maintainable software architecture**.

---

## Key Features

### 1. Patient Management

- Patient registration
- Patient profile management
- Patient information viewing
- Patient-case association
- Structured patient records

### 2. Doctor Management

- Doctor records
- Referring doctor association
- Doctor-case relationships
- Doctor-specific access workflows

### 3. Case Management

- Case creation and tracking
- Case priority management
- Case status tracking
- Patient and doctor association
- Clinical history
- Case-level workflow visibility
- Case Intelligence workspace

Supported priorities:

- `NORMAL`
- `URGENT`
- `STAT`

Supported case statuses:

- `REGISTERED`
- `SPECIMEN_COLLECTED`
- `IN_PROCESS`
- `COMPLETED`
- `REPORTED`

---

### 4. Specimen Management

The specimen module supports laboratory specimen tracking throughout the processing lifecycle.

Features include:

- Specimen registration
- Case association
- Collection details
- Collection site
- Clinical notes
- Specimen quality
- Accessioning status

---

### 5. Tissue Block Management

The platform tracks tissue blocks generated during laboratory processing and maintains their association with cases and specimens.

---

### 6. Digital Slide Management

Slide management supports:

- Slide creation
- Staining status
- Scanning status
- Review status
- Slide-to-block association
- Slide-to-case traceability

---

### 7. Laboratory Workflow Management

The platform models the pathology laboratory workflow:

```text
Patient Registration
        ↓
Case Creation
        ↓
Specimen Collection
        ↓
Accessioning
        ↓
Grossing
        ↓
Embedding
        ↓
Sectioning
        ↓
Staining
        ↓
Scanning
        ↓
Pathologist Review
        ↓
QA / QC
        ↓
Report
        ↓
Final Sign-out
```

---

## 8. Technology Stack

### Frontend
- React
- Vite
- React Router
- Lucide React
- Vitest and Testing Library

### Backend
- Node.js
- Express
- MongoDB and Mongoose
- JWT authentication
- bcryptjs for password hashing
- Multer for file uploads

## 9. Project Structure

```text
pathology-laboratory-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   ├── integration/
│   ├── scripts/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   └── __tests__/
│   └── package.json
├── docs/
├── README.md
└── .gitignore
```

## 10. Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB running locally or an accessible MongoDB instance
- Git

## 11. Local Setup

### Clone the repository

```bash
git clone https://github.com/varshini448/pathology-laboratory-management-system.git
cd pathology-laboratory-management-system
```

### Configure the backend

Install backend dependencies:

```bash
cd backend
npm install
```

Create a local environment file by copying the example:

```bash
cp .env.example .env
```

Update `.env` with your local MongoDB connection string and a strong, unique JWT secret. Never commit `.env` or share its secret values.

The default local database connection example is:

```text
mongodb://127.0.0.1:27017/pathology_laboratory
```

Return to the repository root when finished:

```bash
cd ..
```

### Install frontend dependencies

```bash
cd frontend
npm install
```

## 12. Running the Application

Ensure MongoDB is running and the backend environment is configured.

### Start the backend

In a terminal:

```bash
cd backend
npm start
```

The backend listens on `http://localhost:5001`.

The root API endpoint can be checked at:

```text
http://localhost:5001/
```

### Start the frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

The frontend API service currently calls `http://localhost:5001` directly.

## 13. Testing and Production Build

### Backend tests

From the repository root:

```bash
cd backend
npm test
```

MongoDB integration tests use a separate test configuration. Follow `backend/.env.test.example` and the integration-test safety requirements before running them:

```bash
npm run test:integration
```

Use only a disposable test database. Do not point integration tests at a production or personal data database.

### Frontend tests

From the repository root:

```bash
cd frontend
npm test
```

Vitest runs in watch mode by default. Use the test runner's supported run-once option when you need a non-interactive test run.

### Build the frontend

```bash
npm run build
```

Run this command from the `frontend` directory. Vite writes the production build to `frontend/dist/`.

## 14. API Overview

The backend exposes REST endpoints for the following areas:

| Base path | Purpose |
|---|---|
| `/auth` | Authentication |
| `/password-reset` | Password recovery |
| `/email-verification` | Email verification |
| `/external-auth` | Patient and doctor authentication |
| `/external-dashboard` | External user dashboard data |
| `/users` | Staff user management |
| `/patients` | Patient records |
| `/doctors` | Doctor records and verification |
| `/cases` | Laboratory cases |
| `/specimens` | Specimen management |
| `/blocks` | Tissue block management |
| `/slides` | Digital slide management |
| `/workflow` | Laboratory workflow |
| `/qc` | Quality control |
| `/reports` | Reports and sign-out |
| `/tat` | Turnaround-time monitoring |
| `/audit` | Audit history |
| `/notifications` | Notifications |
| `/search` | Search |

See `docs/api/api-documentation.md` and `docs/api/api-overview.md` for further details.

## 15. Security Notes

- Keep environment files and secrets out of version control.
- Use a unique, strong JWT secret in each environment.
- Use role-based access controls for protected operations.
- Use only synthetic or appropriately de-identified data for demonstrations and testing.
- Treat AI-assisted outputs as decision support for qualified laboratory professionals, not autonomous diagnoses.
- Use a separate, disposable database for integration tests.

## 16. Documentation

Additional project documentation is available under `docs/`, including:

- Requirements specification: `docs/requirements/SRS.md`
- System architecture: `docs/architecture/system-architecture.md`
- Database design: `docs/database/database-design.md`
- API documentation: `docs/api/api-documentation.md`
- Security architecture: `docs/security/security-architecture.md`
- Testing strategy: `docs/testing/testing-strategy.md`
- Laboratory workflow: `docs/workflow/laboratory-workflow.md`
- Project overview and roadmap: `docs/project/`

## 17. Troubleshooting

**Backend cannot connect to MongoDB**
- Confirm MongoDB is running.
- Check `MONGO_URI` in `backend/.env`.
- Confirm the database host and port are reachable.

**Frontend cannot reach the backend**
- Confirm the backend is running on port `5001`.
- Check that `frontend/src/services/api.js` uses the expected API URL.
- Review the browser console and backend terminal for errors.

**Authentication or authorization errors**
- Sign in with an account that has the required role.
- Confirm the backend is running and the token is valid.
- Check the API response and backend logs before changing access-control code.

**Tests fail**
- Review the first failing test and its error output.
- For integration tests, verify the test environment and disposable database configuration.
- Do not disable database safety checks to force tests to pass.
