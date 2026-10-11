import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getReportById,
  updateReport,
} from "../../services/reportService";

import PathologistReportForm from "../../components/reports/PathologistReportForm";
import PageHeader from "../../components/layout/PageHeader";
import LoadingState from "../../components/ui/LoadingState";

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
    return <main className="report-workspace-page"><LoadingState message="Loading report..." /></main>;
  }

  if (!report) {
    return (
      <main className="report-workspace-page">
        <PageHeader eyebrow="PATHOLOGY REPORTING" title="Edit report" />
        <p className="workflow-form-error" role="alert">{error || "Report not found."}</p>
      </main>
    );
  }

  if (report.reportStatus === "FINAL") {
    return (
      <main className="report-workspace-page">
        <PageHeader eyebrow="PATHOLOGY REPORTING" title="Final report" description="This report has been finalized and cannot be edited." />
        <button
          type="button"
          onClick={() => navigate(`/reports/${report._id}`)}
        >
          View Report
        </button>
      </main>
    );
  }

  return (
    <main className="report-workspace-page">
      <PageHeader eyebrow="PATHOLOGY REPORTING" title="Edit pathology report" description={`Report ${report.reportId || ""}`} />

      {error && (
        <p className="workflow-form-error" role="alert">{error}</p>
      )}

      <section className="report-info-panel">
        <p><strong>Case:</strong> {report.case?.caseId || "—"}</p>
        <p><strong>Slide:</strong> {report.slide?.slideId || "—"}</p>
      </section>

      <PathologistReportForm
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        saving={saving}
      />
    </main>
  );
};

export default EditReport;
