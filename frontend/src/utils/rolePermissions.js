import { ROLES } from "./constants";

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    "PATIENT_CREATE",
    "PATIENT_READ",
    "PATIENT_UPDATE",
    "CASE_CREATE",
    "CASE_READ",
    "CASE_UPDATE",
    "SPECIMEN_CREATE",
    "SPECIMEN_READ",
    "SPECIMEN_UPDATE",
    "BLOCK_CREATE",
    "BLOCK_READ",
    "BLOCK_UPDATE",
    "SLIDE_CREATE",
    "SLIDE_READ",
    "SLIDE_UPDATE",
    "REPORT_CREATE",
    "REPORT_READ",
    "REPORT_UPDATE",
    "REPORT_SIGN_OUT",
    "QC_CREATE",
    "QC_READ",
    "QC_UPDATE",
    "WORKFLOW_CREATE",
    "WORKFLOW_READ",
    "TAT_READ",
    "USER_MANAGE",
  ],

  [ROLES.TECHNICIAN]: [
    "PATIENT_CREATE",
    "PATIENT_READ",
    "PATIENT_UPDATE",
    "CASE_CREATE",
    "CASE_READ",
    "CASE_UPDATE",
    "SPECIMEN_CREATE",
    "SPECIMEN_READ",
    "SPECIMEN_UPDATE",
    "BLOCK_CREATE",
    "BLOCK_READ",
    "BLOCK_UPDATE",
    "SLIDE_CREATE",
    "SLIDE_READ",
    "SLIDE_UPDATE",
    "REPORT_READ",
    "QC_READ",
    "QC_UPDATE",
    "WORKFLOW_CREATE",
    "WORKFLOW_READ",
    "TAT_READ",
  ],

  [ROLES.PATHOLOGIST]: [
    "PATIENT_READ",
    "CASE_READ",
    "CASE_UPDATE",
    "SPECIMEN_READ",
    "BLOCK_READ",
    "BLOCK_UPDATE",
    "SLIDE_READ",
    "SLIDE_UPDATE",
    "REPORT_CREATE",
    "REPORT_READ",
    "REPORT_UPDATE",
    "REPORT_SIGN_OUT",
    "QC_CREATE",
    "QC_READ",
    "QC_UPDATE",
    "WORKFLOW_CREATE",
    "WORKFLOW_READ",
    "TAT_READ",
  ],

  [ROLES.QUALITY_MANAGER]: [
    "PATIENT_READ",
    "CASE_READ",
    "SPECIMEN_READ",
    "BLOCK_READ",
    "SLIDE_READ",
    "REPORT_READ",
    "QC_CREATE",
    "QC_READ",
    "QC_UPDATE",
    "WORKFLOW_READ",
    "TAT_READ",
  ],
};

export const hasRolePermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};