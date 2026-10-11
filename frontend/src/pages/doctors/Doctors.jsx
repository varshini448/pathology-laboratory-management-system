import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw, Search, Stethoscope } from "lucide-react";
import { getDoctors } from "../../services/doctorService";
import "./doctors.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    setLoading(true); setError("");
    try { setDoctors(await getDoctors()); }
    catch (err) { setError(err.message || "Unable to load doctor directory."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return doctors;
    return doctors.filter((doctor) => [doctor.name, doctor.doctorId, doctor.specialization, doctor.hospital]
      .some((value) => String(value || "").toLocaleLowerCase().includes(term)));
  }, [doctors, search]);

  return <main className="doctor-directory-page">
    <header className="doctor-directory-header"><div><span>ADMINISTRATION · PROFESSIONAL ACCESS</span><h1>Doctor Directory</h1><p>Search doctor accounts and review their professional profile.</p></div></header>
    <section className="doctor-directory-card" aria-label="Doctor directory">
      <label className="doctor-directory-search"><Search size={17} aria-hidden="true" /><span className="visually-hidden">Search doctors</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, ID, specialization, or hospital" aria-label="Search doctors" /></label>
      {loading ? <p className="doctor-directory-state" role="status">Loading doctor directory…</p> : error ? <div className="doctor-directory-state" role="alert"><p>{error}</p><button type="button" onClick={load}><RefreshCw size={15} /> Retry</button></div> : filtered.length === 0 ? <p className="doctor-directory-state">{doctors.length ? "No doctors match your search." : "No doctor records are available."}</p> : <div className="doctor-directory-table-scroll"><table><thead><tr><th>Doctor</th><th>Doctor ID</th><th>Specialization</th><th>Organization</th><th>Status</th><th><span className="visually-hidden">Action</span></th></tr></thead><tbody>{filtered.map((doctor) => <tr key={doctor._id}><td><span className="doctor-directory-name"><Stethoscope size={17} />{doctor.name}</span></td><td>{doctor.doctorId}</td><td>{doctor.specialization}</td><td>{doctor.hospital || "—"}</td><td><span className={`doctor-status doctor-status-${String(doctor.status || "unknown").toLowerCase()}`}>{String(doctor.status || "Unknown").replaceAll("_", " ")}</span></td><td><Link to={`/doctors/${doctor._id}`}>Details <ArrowRight size={15} /></Link></td></tr>)}</tbody></table></div>}
      {!loading && !error && <footer>Showing {filtered.length} of {doctors.length} doctor records</footer>}
    </section>
  </main>;
};

export default Doctors;
