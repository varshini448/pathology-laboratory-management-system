const AuditLog = require("../models/AuditLog");

/* =========================================================
   CREATE AUDIT LOG
   ========================================================= */

const createAuditLog = async ({
    performedBy,
    action,
    module,
    resourceType,
    resourceId,
    description,
    previousData = null,
    newData = null,
    ipAddress = null,
    userAgent = null,
    status = "SUCCESS",
}) => {
    try {
        if (!action) {
            throw new Error("Audit action is required");
        }

        if (!module) {
            throw new Error("Audit module is required");
        }

        const auditLog = await AuditLog.create({
            performedBy: performedBy || null,
            action,
            module,
            resourceType: resourceType || null,
            resourceId: resourceId || null,
            description: description || "",
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

/* =========================================================
   GET AUDIT LOGS
   ========================================================= */

const getAuditLogs = async ({
    page = 1,
    limit = 20,
    action,
    module,
    resourceType,
    resourceId,
    status,
    performedBy,
    startDate,
    endDate,
} = {}) => {
    try {
        const currentPage = Math.max(Number(page) || 1, 1);
        const currentLimit = Math.min(
            Math.max(Number(limit) || 20, 1),
            100
        );

        const skip = (currentPage - 1) * currentLimit;

        const filter = {};

        if (action) {
            filter.action = action;
        }

        if (module) {
            filter.module = module;
        }

        if (resourceType) {
            filter.resourceType = resourceType;
        }

        if (resourceId) {
            filter.resourceId = resourceId;
        }

        if (status) {
            filter.status = status;
        }

        if (performedBy) {
            filter.performedBy = performedBy;
        }

        if (startDate || endDate) {
            filter.createdAt = {};

            if (startDate) {
                filter.createdAt.$gte = new Date(startDate);
            }

            if (endDate) {
                filter.createdAt.$lte = new Date(endDate);
            }
        }

        const [logs, total] = await Promise.all([
            AuditLog.find(filter)
                .populate("performedBy", "name email role")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(currentLimit),

            AuditLog.countDocuments(filter),
        ]);

        return {
            logs,
            pagination: {
                page: currentPage,
                limit: currentLimit,
                total,
                totalPages: Math.ceil(total / currentLimit),
                hasNextPage:
                    currentPage < Math.ceil(total / currentLimit),
                hasPreviousPage: currentPage > 1,
            },
        };
    } catch (error) {
        console.error("Failed to fetch audit logs:", error.message);
        throw error;
    }
};

/* =========================================================
   GET AUDIT LOGS BY RESOURCE
   ========================================================= */

const getAuditLogsByResource = async (
    resourceType,
    resourceId,
    {
        page = 1,
        limit = 20,
    } = {}
) => {
    try {
        if (!resourceType) {
            throw new Error("Resource type is required");
        }

        if (!resourceId) {
            throw new Error("Resource ID is required");
        }

        return await getAuditLogs({
            page,
            limit,
            resourceType,
            resourceId,
        });
    } catch (error) {
        console.error(
            "Failed to fetch resource audit logs:",
            error.message
        );

        throw error;
    }
};

module.exports = {
    createAuditLog,
    getAuditLogs,
    getAuditLogsByResource,
};
