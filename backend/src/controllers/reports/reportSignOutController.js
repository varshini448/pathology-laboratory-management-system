const Report = require("../../models/Report");
const { createAuditEntry, notifyWithoutBlocking } = require("../../services/lifecycleEventService");

// Get reports waiting for final sign-out
const getPendingSignOutReports = async (req, res) => {
  try {
    const reports = await Report.find({
      reportStatus: "DRAFT",
    })
      .populate({
        path: "case",
        populate: {
          path: "patient",
        },
      })
      .populate("slide")
      .populate("preparedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reports,
    });
  } catch (error) {
    console.error("Get pending sign-out reports error:", error);

    res.status(500).json({
      message: "Failed to fetch reports pending sign-out",
      error: error.message,
    });
  }
};

// Final sign-out of a report
const signOutReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (report.reportStatus === "FINAL") {
      return res.status(400).json({
        message: "Report has already been signed out.",
      });
    }

    if (!report.diagnosis || !report.diagnosis.trim()) {
      return res.status(400).json({
        message: "Diagnosis is required before final sign-out.",
      });
    }

    report.reportStatus = "FINAL";
    report.reviewedBy = req.user.id;
    report.reviewedAt = new Date();

    await report.save();

    await createAuditEntry({
      req,
      action: "SIGN_OUT",
      module: "Reports",
      resourceType: "Report",
      resourceId: report._id,
      description: "Pathology report finalized and signed out",
      previousData: { reportStatus: "DRAFT" },
      newData: { reportStatus: "FINAL", case: String(report.case), signedOutBy: String(req.user.id) },
    });

    const signedOutReport = await Report.findById(report._id)
      .populate({
        path: "case",
        select: "_id caseId doctor patient",
        populate: [
          { path: "patient", select: "_id" },
          { path: "doctor", select: "_id" },
        ],
      })
      .populate("slide")
      .populate("preparedBy", "name email role")
      .populate("reviewedBy", "name email role");

    const recipientCase = signedOutReport.case;
    const recipients = [
      ...(recipientCase?.doctor?._id ? [{ id: recipientCase.doctor._id, model: "Doctor" }] : []),
      ...(recipientCase?.patient?._id ? [{ id: recipientCase.patient._id, model: "Patient" }] : []),
    ];
    await notifyWithoutBlocking({
      recipients,
      eventKey: `report-final:${report._id}`,
      title: "A pathology report is ready",
      message: "A finalized report is available in your secure dashboard.",
      type: "REPORT_ALERT",
      module: "Reports",
      resourceType: "Report",
      resourceId: report._id,
      actionUrl: "/dashboard",
    });

    res.status(200).json({
      message: "Report signed out successfully",
      report: signedOutReport,
    });
  } catch (error) {
    console.error("Sign-out report error:", error);

    res.status(500).json({
      message: "Failed to sign out report",
      error: error.message,
    });
  }
};

module.exports = {
  getPendingSignOutReports,
  signOutReport,
};
