import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "./PageHeader";
import LoadingState from "../ui/LoadingState";
import "../../styles/workflow-entry-form.css";

export const RecordField = ({ label, children }) => (
  <div className="workflow-detail-field">
    <dt>{label}</dt>
    <dd>{children || "—"}</dd>
  </div>
);

const RecordDetailsPage = ({ title, description, backTo, loading, error, notFound, children }) => (
  <main className="workflow-detail-page">
    <PageHeader
      eyebrow="LABORATORY RECORD"
      title={title}
      description={description}
      actions={<Link className="record-list-action" to={backTo}>Back to records</Link>}
    />
    {loading ? <LoadingState message={`Loading ${title.toLowerCase()}...`} /> : error || notFound ? (
      <section className="record-list-error" role={error ? "alert" : "status"}>
        <div>
          <h2>{error ? `Unable to load ${title.toLowerCase()}` : `${title} not found`}</h2>
          <p>{error || `This ${title.toLowerCase()} record may have been removed or is unavailable.`}</p>
        </div>
      </section>
    ) : (
      <dl className="workflow-detail-grid">{children}</dl>
    )}
  </main>
);

export default RecordDetailsPage;
