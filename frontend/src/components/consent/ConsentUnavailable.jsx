import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const ConsentUnavailable = ({ title, description }) => (
  <section className="consent-unavailable" role="status">
    <span className="consent-unavailable-icon" aria-hidden="true"><ShieldAlert size={21} /></span>
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <p className="consent-unavailable-note">Consent data is not connected to the backend in this build. No sample patient records are being shown.</p>
      <Link to="/dashboard">Return to workspace</Link>
    </div>
  </section>
);

export default ConsentUnavailable;
