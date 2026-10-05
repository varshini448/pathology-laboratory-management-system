# Software Requirements Specification

## Pathology Intelligence Platform

This document defines the functional and non-functional requirements of the Pathology Intelligence Platform.

---

## 1. Purpose

The system is designed to digitize pathology laboratory operations and provide centralized management of patients, cases, specimens, tissue blocks, slides, workflows, quality control, reports, and operational intelligence.

---

## 2. Scope

The platform covers the pathology case lifecycle:

```text
Patient Registration
        ↓
Case Creation
        ↓
Specimen Collection
        ↓
Specimen Processing
        ↓
Block Preparation
        ↓
Slide Preparation
        ↓
Laboratory Workflow
        ↓
Quality Control
        ↓
Pathologist Review
        ↓
Report
        ↓
Final Sign-out
The system also provides authentication, role-based access, audit logging, notifications, TAT monitoring, analytics, and AI-assisted decision support.

3. Intended Users

The primary users are:

ADMIN
TECHNICIAN
PATHOLOGIST
QUALITY_MANAGER

The platform may also support controlled patient and doctor access where applicable.

4. Functional Requirements
4.1 Authentication

The system shall:

Allow authorized users to log in.
Validate user credentials.
Generate JWT-based authentication tokens.
Protect authenticated API routes.
Support role-based authorization.
Reject invalid or expired authentication credentials.
4.2 Patient Management

The system shall:

Register patients.
Store structured patient information.
Retrieve patient records.
Associate patients with pathology cases.
Display patient-case relationships.
4.3 Doctor Management

The system shall:

Store referring doctor information.
Retrieve doctor records.
Associate doctors with cases.
Support doctor-case relationships.
4.4 Case Management

The system shall:

Create pathology cases.
Associate cases with patients and doctors.
Assign case priorities.
Track case status.
Store clinical history.
Provide case-level workflow visibility.

Supported priorities include:

NORMAL
URGENT
STAT
4.5 Specimen Management

The system shall:

Register specimens.
Associate specimens with cases.
Record collection details.
Record collection site and clinical notes.
Track specimen quality.
Track specimen processing status.
4.6 Tissue Block Management

The system shall:

Create tissue block records.
Associate blocks with specimens and cases.
Maintain block traceability.
Support block-level laboratory tracking.
4.7 Digital Slide Management

The system shall:

Create slide records.
Associate slides with tissue blocks and cases.
Track staining status.
Track scanning status.
Track review status.
Maintain slide traceability.
4.8 Laboratory Workflow

The system shall:

Track laboratory workflow stages.
Record workflow events.
Record stage status transitions.
Record responsible users.
Maintain workflow history.
Display current workflow progress.

Supported workflow stages include:

SPECIMEN_COLLECTION
ACCESSIONING
GROSSING
EMBEDDING
SECTIONING
STAINING
SCANNING
PATHOLOGIST_REVIEW
4.9 Turnaround Time Management

The system shall:

Calculate case turnaround time.
Track workflow duration.
Compare cases against priority-based targets.
Identify delayed cases.
Provide TAT-related operational information.

Target TAT values include:

Priority	Target
NORMAL	72 hours
URGENT	48 hours
STAT	24 hours
4.10 Quality Control

The system shall:

Create QC records.
Associate QC activity with laboratory workflows.
Record quality status.
Support verification.
Track accepted or rejected quality evaluations.
Support quality-related alerts.
4.11 Pathology Reporting

The system shall:

Create pathology reports.
Associate reports with cases and slides.
Store diagnostic and laboratory findings.
Support draft reports.
Support report review.
Support final sign-out.
Record report preparation and review information.
4.12 Audit Logging

The system shall:

Record important system activities.
Associate activities with users.
Record affected resources.
Store operation status.
Maintain timestamps.
Support audit-log retrieval for authorized users.
4.13 Notifications

The system shall:

Generate user-specific notifications.
Support workflow notifications.
Support TAT alerts.
Support QC alerts.
Support report and case notifications.
Track read and unread notification states.
5. Non-Functional Requirements
5.1 Security

The system shall:

Use JWT-based authentication.
Hash passwords securely.
Enforce role-based authorization.
Validate incoming requests.
Protect sensitive environment variables.
Maintain audit records for important operations.
5.2 Performance

The system should:

Return common API requests within reasonable response times.
Use indexed database fields where appropriate.
Avoid unnecessary database queries.
Support efficient pagination for large datasets.
5.3 Usability

The interface should:

Provide clear navigation.
Display meaningful workflow states.
Provide responsive layouts.
Present errors clearly.
Maintain consistent visual patterns.
5.4 Maintainability

The system should:

Use modular frontend components.
Separate backend routes, controllers, services, and models.
Use reusable validation logic.
Maintain focused documentation.
Support automated testing.
5.5 Reliability

The system should:

Handle invalid requests safely.
Provide centralized error handling.
Preserve important workflow and audit information.
Prevent unauthorized operations.
6. AI Requirements

The platform is designed to support AI-assisted capabilities including:

Case Intelligence
TAT Prediction
Workflow Bottleneck Detection
QC Anomaly Detection
Report Assistance
Priority Prediction
Data Quality Detection
Laboratory Analytics

AI functionality shall operate as decision support.

The system shall not treat AI output as an autonomous clinical diagnosis or replace qualified professional judgment.

7. Data Requirements

The system shall maintain structured records for:

Users
Patients
Doctors
Cases
Specimens
Tissue blocks
Slides
Workflow events
TAT information
QC records
Reports
Audit logs
Notifications

Records should maintain appropriate relationships and traceability throughout the laboratory lifecycle.

8. System Constraints

The current implementation uses:

React and Vite for the frontend
Node.js and Express for the backend
MongoDB and Mongoose for data management
JWT and bcrypt for authentication
REST APIs for frontend-backend communication

The system is developed primarily as an academic and demonstration project and requires further clinical validation before any real-world clinical deployment.

9. Acceptance Criteria

The platform should be considered functionally ready when:

Authentication works correctly.
Role-based access is enforced.
Core laboratory entities can be managed.
Workflow stages can be tracked.
TAT information can be monitored.
QC activity can be recorded and verified.
Reports can be created and signed out by authorized users.
Audit and notification functionality operates correctly.
Critical frontend tests pass.
Documentation accurately reflects the implemented architecture.
10. Disclaimer

This system is developed for educational, demonstration, and software engineering purposes.

It is not intended to replace professional medical judgment, laboratory standards, clinical validation, or regulatory requirements.

AI-assisted functionality is intended only to support authorized laboratory professionals.

