import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Stethoscope } from "lucide-react";
import { getDoctorById } from "../../services/doctorService";
import "./doctors.css";

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    getDoctorById(id).then((result) => { if (active) setDoctor(result); })
      .catch((err) => { if (active) setError(err.message || "Unable to load doctor profile."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  const fields = [
    ["Doctor ID", doctor?.doctorId], ["Specialization", doctor?.specialization],
    ["Qualification", doctor?.qualification], ["Medical registration ID", doctor?.medicalRegistrationId],
    ["Registration authority", doctor?.registrationAuthority], ["Hospital", doctor?.hospital],
    ["Hospital address", doctor?.hospitalAddress], ["Phone", doctor?.phone],
    ["Email", doctor?.email], ["Status", doctor?.status?.replaceAll("_", " ")],
  ];
  return <main className="doctor-directory-page">
    <Link className="doctor-directory-back" to="/doctors"><ArrowLeft size={16} /> Doctor Directory</Link>
    {loading ? <p className="doctor-directory-state" role="status">Loading doctor profile…</p> : error ? <p className="doctor-directory-state" role="alert">{error}</p> : !doctor ? <p className="doctor-directory-state">Doctor record not found.</p> : <>
      <header className="doctor-directory-header"><div><span>ADMINISTRATION · PROFESSIONAL PROFILE</span><h1>{doctor.name}</h1><p>{doctor.doctorId} · {doctor.specialization}</p></div><Stethoscope size={30} aria-hidden="true" /></header>
      <section className="doctor-directory-card"><h2>Professional details</h2><dl className="doctor-details-grid">{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "Not provided"}</dd></div>)}</dl></section>
    </>}
  </main>;
};

export default DoctorDetails;
