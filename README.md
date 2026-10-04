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
