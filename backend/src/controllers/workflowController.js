const workflowService = require("../services/workflowService");
const { createAuditEntry, notifyRolesWithoutBlocking } = require("../services/lifecycleEventService");

const createWorkflowEvent = async (req, res) => {
  try {
    const workflowEvent = await workflowService.createWorkflowEvent({
      ...req.body,
      performedBy: req.user.id,
    });

    await createAuditEntry({
      req,
      action: "UPDATE",
      module: "Workflow",
      resourceType: "Case",
      resourceId: workflowEvent.case,
      description: `Workflow stage ${workflowEvent.stage} ${workflowEvent.status.toLowerCase()}`,
      newData: {
        eventId: String(workflowEvent._id),
        stage: workflowEvent.stage,
        status: workflowEvent.status,
        specimen: workflowEvent.specimen ? String(workflowEvent.specimen) : undefined,
        block: workflowEvent.block ? String(workflowEvent.block) : undefined,
        slide: workflowEvent.slide ? String(workflowEvent.slide) : undefined,
      },
    });
    if (workflowEvent.stage === "SCANNING" && workflowEvent.status === "COMPLETED") {
      await notifyRolesWithoutBlocking({
        roles: ["PATHOLOGIST"],
        eventKey: `workflow-scan-complete:${workflowEvent.case}:${workflowEvent.slide}`,
        title: "A slide is ready for review",
        message: "A slide has completed scanning and is ready for pathologist review.",
        type: "WORKFLOW_ALERT",
        module: "Workflow",
        resourceType: "Case",
        resourceId: workflowEvent.case,
        actionUrl: "/pathologist-workspace",
      });
    }

    res.status(201).json(workflowEvent);
  } catch (error) {
    console.error("Create workflow event error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Failed to create workflow event",
    });
  }
};

const getWorkflowEventsByCase = async (req, res) => {
  try {
    const workflowEvents =
      await workflowService.getWorkflowEventsByCase(req.params.caseId);

    res.status(200).json(workflowEvents);
  } catch (error) {
    console.error("Get workflow events error:", error);

    return res.status(error.statusCode || 500).json({
      message: "Failed to fetch workflow events",
    });
  }
};

module.exports = {
  createWorkflowEvent,
  getWorkflowEventsByCase,
};
