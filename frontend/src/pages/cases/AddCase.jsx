import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createCase } from "../../services/caseService";
import { getPatients } from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";

import AddCaseHeader from "./add-case/AddCaseHeader";
import AddCaseMessages from "./add-case/AddCaseMessages";
import AddCaseForm from "./add-case/AddCaseForm";

import "../../styles/add-case.css";

const AddCase = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    caseId: "",
    patient: "",
    doctor: "",
    caseType: "",
    clinicalHistory: "",
    priority: "NORMAL",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setLoading(true);
        setError("");

        const [patientData, doctorData] = await Promise.all([
          getPatients(),
          getDoctors(),
        ]);

        setPatients(patientData || []);
        setDoctors(doctorData || []);
      } catch (err) {
        setError(
          err?.message || "Failed to load patients and doctors."
        );
      } finally {
        setLoading(false);
      }
    };

    loadFormData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const createdCase = await createCase(formData);

      setSuccess("Case registered successfully.");

      setTimeout(() => {
        navigate(`/cases/${createdCase.caseId}`);
      }, 700);
    } catch (err) {
      setError(
        err?.message || "Failed to register the case."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="add-case-page">
        <div className="add-case-state">
          <p>Loading case registration data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-case-page">
      <AddCaseHeader onBack={() => navigate("/cases")} />

      <AddCaseMessages error={error} success={success} />

      <AddCaseForm
        formData={formData}
        patients={patients}
        doctors={doctors}
        saving={saving}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/cases")}
      />
    </div>
  );
};

export default AddCase;
