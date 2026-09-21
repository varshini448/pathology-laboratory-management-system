import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCases } from "../../services/caseService";
import {
  createReport,
  generateReportData,
} from "../../services/reportService";

import ReportCaseSelector from "../../components/reports/ReportCaseSelector";
import ReportPatientInfo from "../../components/reports/ReportPatientInfo";
import ReportCaseInfo from "../../components/reports/ReportCaseInfo";
import ReportSpecimenInfo from "../../components/reports/ReportSpecimenInfo";
import ReportBlockInfo from "../../components/reports/ReportBlockInfo";
import ReportSlideInfo from "../../components/reports/ReportSlideInfo";
import ReportWorkflowInfo from "../../components/reports/ReportWorkflowInfo";
import ReportQCInfo from "../../components/reports/ReportQCInfo";
import PathologistReportForm from "../../components/reports/PathologistReportForm";

const CreateReport = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState("");
  const [reportData, setReportData] = useState(null);

  const [loadingCases, setLoadingCases] = useState(true);
  const [loadingReportData, setLoadingReportData] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    diagnosis: "",
    microscopicFindings: "",
    grossFindings: "",
    interpretation: "",
    recommendations: "",
  });

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setLoadingCases(true);
      setError("");

      const data = await getCases();
      setCases(data || []);
    } catch (err) {
      setError(err.message || "Failed to load cases.");
    } finally {
      setLoadingCases(false);
    }
  };

  const handleCaseChange = async (event) => {
    const caseId = event.target.value;

    setSelectedCase(caseId);
    setReportData(null);
    setError("");

    if (!caseId) {
      return;
    }

    try {
      setLoadingReportData(true);

      const data = await generateReportData(caseId);
      setReportData(data);
    } catch (err) {
      setError(err.message || "Failed to generate report data.");
    } finally {
      setLoadingReportData(false);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCase) {
      setError("Please select a case.");
      return;
    }

    if (!reportData) {
      setError("Report data is not loaded.");
      return;
    }

    if (!reportData.slides || reportData.slides.length === 0) {
      setError("A slide is required before creating the report.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const reportPayload = {
        reportId: `REP-${Date.now()}`,
        case: selectedCase,
        slide: reportData.slides[0]._id,
        diagnosis: formData.diagnosis,
        microscopicFindings: formData.microscopicFindings,
        grossFindings: formData.grossFindings,
        interpretation: formData.interpretation,
        recommendations: formData.recommendations,
        reportStatus: "DRAFT",
      };

      const createdReport = await createReport(reportPayload);

      navigate(`/reports/${createdReport._id}`);
    } catch (err) {
      setError(err.message || "Failed to create report.");
    } finally {
      setSaving(false);
    }
  };

  const patient = reportData?.case?.patient;

  return (
    <div>
      <h1>Create Pathology Report</h1>

      {error && (
        <p>
          <strong>Error:</strong> {error}
        </p>
      )}

      <ReportCaseSelector
        cases={cases}
        selectedCase={selectedCase}
        onCaseChange={handleCaseChange}
        loading={loadingCases}
      />

      {loadingReportData && <p>Loading complete case information...</p>}

      {reportData && (
        <>
          <ReportPatientInfo patient={patient} />

          <ReportCaseInfo caseData={reportData.case} />

          <ReportSpecimenInfo specimens={reportData.specimens || []} />

          <ReportBlockInfo blocks={reportData.blocks || []} />

          <ReportSlideInfo slides={reportData.slides || []} />

          <ReportWorkflowInfo
            workflowEvents={reportData.workflowEvents || []}
          />

          <ReportQCInfo
            qcRecords={reportData.qcRecords || []}
          />

          <PathologistReportForm
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            saving={saving}
          />
        </>
      )}
    </div>
  );
};

export default CreateReport;