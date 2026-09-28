import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getReportById,
  updateReport,
} from "../../services/reportService";

import PathologistReportForm from "../../components/reports/PathologistReportForm";

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);

  const [formData, setFormData] = useState({
    diagnosis: "",
    microscopicFindings: "",
    grossFindings: "",
    interpretation: "",
    recommendations: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getReportById(id);

        setReport(data);

        setFormData({
          diagnosis: data?.diagnosis || "",
          microscopicFindings: data?.microscopicFindings || "",
          grossFindings: data?.grossFindings || "",
          interpretation: data?.interpretation || "",
          recommendations: data?.recommendations || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load report.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!report) {
      return;
    }

    if (report.reportStatus === "FINAL") {
      setError("Final reports cannot be edited.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedReport = await updateReport(id, formData);

      navigate(`/reports/${updatedReport._id}`);
    } catch (err) {
      setError(err.message || "Failed to update report.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading report...</div>;
  }

  if (!report) {
    return (
      <div>
        <h1>Edit Report</h1>
        <p>{error || "Report not found."}</p>
      </div>
    );
  }

  if (report.reportStatus === "FINAL") {
    return (
      <div>
        <h1>Edit Report</h1>

        <p>
          This report has been finalized and cannot be edited.
        </p>

        <button
          type="button"
          onClick={() => navigate(`/reports/${report._id}`)}
        >
          View Report
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Edit Pathology Report</h1>

      <p>
        <strong>Report ID:</strong> {report.reportId}
      </p>

      <p>
        <strong>Case:</strong> {report.case?.caseId || "-"}
      </p>

      <p>
        <strong>Slide:</strong> {report.slide?.slideId || "-"}
      </p>

      {error && (
        <p>
          <strong>Error:</strong> {error}
        </p>
      )}

      <PathologistReportForm
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        saving={saving}
      />
    </div>
  );
};

export default EditReport;