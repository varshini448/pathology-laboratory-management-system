const Case = require("../models/Case");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const searchCases = async (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (query.length < 2 || query.length > 64) {
    return res.status(400).json({ message: "Search query must be between 2 and 64 characters." });
  }

  const matcher = new RegExp(escapeRegex(query), "i");
  try {
    const [patients, doctors] = await Promise.all([
      Patient.find({ $or: [{ name: matcher }, { patientId: matcher }] }).select("_id").limit(50),
      Doctor.find({ $or: [{ name: matcher }, { doctorId: matcher }] }).select("_id").limit(50),
    ]);
    const clauses = [{ caseId: matcher }];
    if (patients.length) clauses.push({ patient: { $in: patients.map((item) => item._id) } });
    if (doctors.length) clauses.push({ doctor: { $in: doctors.map((item) => item._id) } });
    const cases = await Case.find({ $or: clauses })
      .select("caseId caseType status priority patient doctor")
      .populate("patient", "name patientId")
      .populate("doctor", "name doctorId")
      .sort({ updatedAt: -1 })
      .limit(8);

    return res.json({ results: cases.map((item) => ({
      type: "CASE",
      id: item._id,
      label: item.caseId,
      description: [item.patient?.name, item.caseType, item.status].filter(Boolean).join(" · "),
      href: `/cases/${encodeURIComponent(item.caseId)}`,
    })) });
  } catch (_error) {
    return res.status(500).json({ message: "Unable to search cases." });
  }
};

module.exports = { searchCases, escapeRegex };
