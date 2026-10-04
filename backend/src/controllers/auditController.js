const {
  getAuditLogs,
  getAuditLogsByResource,
} = require("../services/auditService");

const getAuditLogsController = async (req, res) => {
  try {
    const {
      performedBy,
      action,
      module,
      resourceType,
      resourceId,
      status,
      limit,
      page,
    } = req.query;

    const result = await getAuditLogs({
      performedBy,
      action,
      module,
      resourceType,
      resourceId,
      status,
      limit,
      page,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch audit logs",
      error: error.message,
    });
  }
};

const getAuditLogsByResourceController = async (req, res) => {
  try {
    const { resourceType, resourceId } = req.params;

    const logs = await getAuditLogsByResource(
      resourceType,
      resourceId
    );

    res.json({
      logs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch audit history",
      error: error.message,
    });
  }
};

module.exports = {
  getAuditLogsController,
  getAuditLogsByResourceController,
};