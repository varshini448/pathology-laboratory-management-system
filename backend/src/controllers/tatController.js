const tatService = require("../services/tatService");

const getCaseTAT = async (req, res) => {
  try {
    const { caseId } = req.params;

    const tatData = await tatService.getCaseTAT(caseId);

    res.status(200).json({
      success: true,
      data: tatData,
    });
  } catch (error) {
    console.error("Error calculating case TAT:", error);

    if (error.message === "Case not found") {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to calculate case TAT",
    });
  }
};

const getAllCaseTAT = async (req, res) => {
  try {
    const tatData = await tatService.getAllCaseTAT();

    res.status(200).json({
      success: true,
      data: tatData,
    });
  } catch (error) {
    console.error("Error calculating all case TAT:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate case TAT data",
    });
  }
};

const getStageTAT = async (req, res) => {
  try {
    const { caseId } = req.params;

    const stageData = await tatService.getStageTAT(caseId);

    res.status(200).json({
      success: true,
      data: stageData,
    });
  } catch (error) {
    console.error("Error calculating stage TAT:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate stage TAT",
    });
  }
};

module.exports = {
  getCaseTAT,
  getAllCaseTAT,
  getStageTAT,
};