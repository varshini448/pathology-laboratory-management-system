const workflowBottleneckService = require("../services/workflowBottleneckService");

const getWorkflowBottleneckSummary = async (_req, res) => {
  try {
    const data = await workflowBottleneckService.getWorkflowBottlenecks();
    return res.status(200).json({ success: true, data });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unable to evaluate workflow bottlenecks right now.",
    });
  }
};

module.exports = { getWorkflowBottleneckSummary };
