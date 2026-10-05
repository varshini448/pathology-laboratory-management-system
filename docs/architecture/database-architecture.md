# Database Architecture

## Pathology Intelligence Platform

The platform uses MongoDB as its database and Mongoose as the Object Data Modeling (ODM) layer.

---

## 1. Database Structure

The database is organized around pathology laboratory entities.

```text
Patient
  ↓
Case
  ├── Specimen
  │     └── Block
  │           └── Slide
  ├── Workflow Events
  ├── TAT Records
  ├── QC Records
  └── Reports
---

## 2. Core Collections

The main collections include:

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

---

## 3. Relationships

Cases act as the central laboratory entity.

A patient can have multiple cases, while each case can contain specimens, blocks, slides, workflow events, TAT information, QC records, and reports.

Mongoose references are used where relationships between documents are required.

---

## 4. Domain Identifiers

The system uses domain-specific identifiers such as:

- `patientId`
- `caseId`
- `specimenId`
- `blockId`
- `slideId`

These identifiers provide stable business references while MongoDB ObjectIds handle database-level document relationships.

---

## 5. Data Integrity

Mongoose schemas provide:

- Required fields
- Data types
- Enumerated values
- Unique identifiers
- Document references
- Automatic timestamps
- Database indexes

This structure helps maintain consistent laboratory data and supports efficient querying.

---
