import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "./PageHeader";
import Card from "../ui/Card";
import Button from "../ui/Button";
import DataTable from "../ui/DataTable";
import "../../styles/record-list-page.css";

const RecordListPage = ({
  title,
  description,
  actionTo,
  actionLabel,
  columns,
  records,
  loading,
  error,
  onRetry,
  emptyTitle,
  emptyMessage,
}) => {
  const safeRecords = Array.isArray(records) ? records : [];

  return <main className="record-list-page">
    <PageHeader
      eyebrow="LABORATORY RECORDS"
      title={title}
      description={description}
      actions={actionTo ? <Link className="record-list-action" to={actionTo}>{actionLabel}</Link> : null}
    />
    {error ? (
      <section className="record-list-error" role="alert">
        <div>
          <h2>Unable to load {title.toLowerCase()}</h2>
          <p>{error}</p>
        </div>
        {onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
      </section>
    ) : (
      <Card title={`${title} directory`} subtitle={`${safeRecords.length} ${safeRecords.length === 1 ? "record" : "records"}`} className="record-list-card">
        <DataTable
          columns={columns}
          data={safeRecords}
          loading={loading}
          emptyTitle={emptyTitle}
          emptyMessage={emptyMessage}
        />
      </Card>
    )}
  </main>;
};

export default RecordListPage;
