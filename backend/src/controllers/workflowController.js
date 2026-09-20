const workflowService = require("../services/workflowService");

const createWorkflowEvent = async (req, res) => {
  try {
    const workflowEvent = await workflowService.createWorkflowEvent({
      ...req.body,
      performedBy: req.user.id,
    });

    res.status(201).json(workflowEvent);
  } catch (error) {
    console.error("Create workflow event error:", error);

    res.status(500).json({
      message: "Failed to create workflow event",
      error: error.message,
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

    res.status(500).json({
      message: "Failed to fetch workflow events",
      error: error.message,
    });
  }
};

module.exports = {
  createWorkflowEvent,
  getWorkflowEventsByCase,
};