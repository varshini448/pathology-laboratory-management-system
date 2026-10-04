/* =========================================================
   APPLICATION CONSTANTS
   ========================================================= */

/* =========================================================
   USER ROLES
   ========================================================= */

export const USER_ROLES = Object.freeze({
    ADMIN: "ADMIN",
    TECHNICIAN: "TECHNICIAN",
    PATHOLOGIST: "PATHOLOGIST",
    QUALITY_MANAGER: "QUALITY_MANAGER",
});

/* =========================================================
   CASE PRIORITIES
   ========================================================= */

export const CASE_PRIORITIES = Object.freeze({
    NORMAL: "NORMAL",
    URGENT: "URGENT",
    STAT: "STAT",
});

/* =========================================================
   CASE STATUS
   ========================================================= */

export const CASE_STATUS = Object.freeze({
    REGISTERED: "REGISTERED",
    SPECIMEN_COLLECTED: "SPECIMEN_COLLECTED",
    IN_PROCESS: "IN_PROCESS",
    COMPLETED: "COMPLETED",
    REPORTED: "REPORTED",
});

/* =========================================================
   SPECIMEN STATUS
   ========================================================= */

export const SPECIMEN_STATUS = Object.freeze({
    COLLECTED: "COLLECTED",
    RECEIVED: "RECEIVED",
    ACCESSIONED: "ACCESSIONED",
    PROCESSING: "PROCESSING",
    COMPLETED: "COMPLETED",
});

/* =========================================================
   SLIDE STATUS
   ========================================================= */

export const SLIDE_STATUS = Object.freeze({
    CREATED: "CREATED",
    STAINING: "STAINING",
    STAINED: "STAINED",
    SCANNED: "SCANNED",
    UNDER_REVIEW: "UNDER_REVIEW",
    COMPLETED: "COMPLETED",
});

/* =========================================================
   REPORT STATUS
   ========================================================= */

export const REPORT_STATUS = Object.freeze({
    DRAFT: "DRAFT",
    FINAL: "FINAL",
    READY_FOR_REVIEW: "READY_FOR_REVIEW",
    PENDING_QA: "PENDING_QA",
    READY_FOR_SIGNOUT: "READY_FOR_SIGNOUT",
    SIGNED_OUT: "SIGNED_OUT",
    AMENDED: "AMENDED",
    CANCELLED: "CANCELLED",
});

/* =========================================================
   WORKFLOW STAGES
   ========================================================= */

export const WORKFLOW_STAGES = Object.freeze({
    SPECIMEN_COLLECTION: "SPECIMEN_COLLECTION",
    ACCESSIONING: "ACCESSIONING",
    GROSSING: "GROSSING",
    EMBEDDING: "EMBEDDING",
    SECTIONING: "SECTIONING",
    STAINING: "STAINING",
    SCANNING: "SCANNING",
    PATHOLOGIST_REVIEW: "PATHOLOGIST_REVIEW",
});

/* =========================================================
   WORKFLOW EVENT STATUS
   ========================================================= */

export const WORKFLOW_EVENT_STATUS = Object.freeze({
    STARTED: "STARTED",
    COMPLETED: "COMPLETED",
});

/* =========================================================
   COMMON UI STATES
   ========================================================= */

export const UI_STATUS = Object.freeze({
    IDLE: "IDLE",
    LOADING: "LOADING",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
});

/* =========================================================
   PAGINATION
   ========================================================= */

export const PAGINATION = Object.freeze({
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
});

/* =========================================================
   APPLICATION ROUTES
   ========================================================= */

export const APP_ROUTES = Object.freeze({
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    PATIENTS: "/patients",
    CASES: "/cases",
    REPORTS: "/reports",
    WORKFLOW: "/workflow",
    AUDIT: "/audit",
    NOTIFICATIONS: "/notifications",
});

/* =========================================================
   STORAGE KEYS
   ========================================================= */

export const STORAGE_KEYS = Object.freeze({
    TOKEN: "token",
    USER: "user",
});
