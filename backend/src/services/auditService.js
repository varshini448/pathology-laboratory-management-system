const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
  performedBy,
  action,
  module,
  resourceType,
  resourceId,
  description,
  previousData = null,
  newData = null,
  ipAddress,
  userAgent,
  status = "SUCCESS",
}) => {
  try {
    if (!performedBy) {
      throw new Error("performedBy is required");
    }

    if (!action) {
      throw new Error("Audit action is required");
    }

    if (!module) {
      throw new Error("Audit module is required");
    }

    if (!description) {
      throw new Error("Audit description is required");
    }

    const auditLog = await AuditLog.create({
      performedBy,
      action,
      module,
      resourceType,
      resourceId,
      description,
      previousData,
      newData,
      ipAddress,
      userAgent,
      status,
    });

    return auditLog;
  } catch (error) {
    console.error("Audit log creation failed:", error.message);
    throw error;
  }
};

const getAuditLogs = async (filters = {}) => {
  const {
    performedBy,
    action,
    module,
    resourceType,
    resourceId,
    status,
    limit = 50,
    page = 1,
  } = filters;

  const query = {};

  if (performedBy) query.performedBy = performedBy;
  if (action) query.action = action;
  if (module) query.module = module;
  if (resourceType) query.resourceType = resourceType;
  if (resourceId) query.resourceId = resourceId;
  if (status) query.status = status;

  const parsedLimit = Math.min(Number(limit) || 50, 100);
  const parsedPage = Math.max(Number(page) || 1, 1);
  const skip = (parsedPage - 1) * parsedLimit;

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .populate("performedBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),

    AuditLog.countDocuments(query),
  ]);

  return {
    logs,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
};

const getAuditLogsByResource = async (resourceType, resourceId) => {
  if (!resourceType || !resourceId) {
    throw new Error("Resource type and resource ID are required");
  }

  return AuditLog.find({
    resourceType,
    resourceId,
  })
    .populate("performedBy", "name email role")
    .sort({ createdAt: -1 });
};

module.exports = {
  createAuditLog,
  getAuditLogs,
  getAuditLogsByResource,
};