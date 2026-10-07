# Database Design

## Pathology Intelligence Platform

The platform uses MongoDB with Mongoose to store structured laboratory, user, workflow, quality, reporting, audit, and notification data.

---

## 1. Database

The primary database is:

```text
pathology_laboratory

MongoDB is used because the laboratory platform contains multiple related domains while requiring flexible document structures for workflow, reporting, and audit information.

2. Core Collections

The main collections include:

Collection	Purpose
Users	Internal user accounts and roles
Patients	Patient information
Doctors	Referring doctor information
Cases	Pathology case records
Specimens	Collected laboratory specimens
Blocks	Tissue block records
Slides	Digital or laboratory slide records
WorkflowEvents	Laboratory workflow history
QCRecords	Quality control records
Reports	Pathology reports
AuditLogs	System activity history
Notifications	User-specific notifications
3. Entity Relationships
Patient
   │
   └── Cases
          │
          ├── Specimens
          │      └── Blocks
          │             └── Slides
          │
          ├── Workflow Events
          │
          ├── QC Records
          │
          └── Reports

Users
   ├── Workflow Events
   ├── QC Records
   ├── Reports
   ├── Audit Logs
   └── Notifications

Doctors
   └── Cases
4. User Data

User records support:

Authentication
Role assignment
Account status
Password security
User identification

Supported internal roles:

ADMIN
TECHNICIAN
PATHOLOGIST
QUALITY_MANAGER
5. Patient and Doctor Data

Patient records contain structured demographic and contact information.

Doctor records contain referring doctor information and support association with pathology cases.

Cases maintain references to their related patient and doctor records.

6. Case Data

Case records support:

Case identifier
Patient reference
Doctor reference
Case type
Clinical history
Priority
Case status
Timestamps

Case identifiers such as CASE001 provide a human-readable domain identifier while MongoDB maintains the internal document _id.


---

## 7. Specimen, Block, and Slide Data

Specimens are associated with pathology cases and store collection and processing information.

Tissue blocks maintain their relationship with specimens and cases.

Slides maintain their relationship with tissue blocks and cases and track laboratory processing states such as staining, scanning, and review.

This hierarchy provides end-to-end specimen traceability.

---

## 8. Workflow Data

Workflow events record laboratory processing activity.

Workflow information can include:

- Case reference
- Workflow stage
- Status
- Performing user
- Start time
- Completion time
- Notes
- Timestamps

Workflow events provide the historical record required for process monitoring and TAT calculation.

---

## 9. Quality Control Data

QC records are associated with laboratory processing and support:

- Quality evaluation
- Verification
- Quality status
- Responsible user
- Related case
- Related workflow activity
- Verification timestamps

QC information provides traceability for quality-related decisions.

---

## 10. Report Data

Report records support:

- Report identifier
- Case reference
- Slide reference
- Diagnosis
- Gross findings
- Microscopic findings
- Interpretation
- Recommendations
- Report status
- Prepared-by information
- Reviewed-by information
- Timestamps

Reports remain associated with the underlying laboratory case.

---

## 11. Audit Data

Audit records maintain historical information about important system operations.

Audit information can include:

- Performing user
- Action
- Module
- Resource type
- Resource identifier
- Previous data
- New data
- IP address
- User agent
- Success or failure status
- Timestamp

Audit records support accountability and traceability.

---

## 12. Notification Data

Notification records support user-specific communication.

Notification data can include:

- Recipient
- Title
- Message
- Notification type
- Priority
- Related module
- Related resource
- Action URL
- Read status
- Read timestamp
- Expiration timestamp


---

## 13. Data Integrity

The database design emphasizes:

- Required fields
- Unique identifiers where appropriate
- Schema validation
- References between related entities
- Enumerated status values
- Timestamp tracking
- Indexed query fields

---

## 14. Traceability Model

The primary laboratory traceability chain is:

```text
Patient
   ↓
Case
   ↓
Specimen
   ↓
Block
   ↓
Slide
   ↓
Workflow
   ↓
QC
   ↓
Report
   ↓
Sign-out
This structure allows laboratory users to understand the history and current state of a pathology case.

15. Database Design Principles

The database follows these principles:

Domain-oriented collections
Clear entity relationships
Human-readable laboratory identifiers
MongoDB document flexibility
Mongoose schema validation
Traceability across laboratory stages
Auditability of important operations
Separation of operational and historical information

