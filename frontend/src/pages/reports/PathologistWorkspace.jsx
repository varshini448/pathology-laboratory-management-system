import { Link } from "react-router-dom";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/ui/Card";

const PathologistWorkspace = () => {
  return (
    <main className="report-composer-page">
      <PageHeader eyebrow="PATHOLOGY REPORTING" title="Pathologist workspace" description="Prepare report drafts, continue in-progress work, and review reports ready for final sign-out." />
      <section className="report-workspace-actions" aria-label="Report tasks">
        <Card title="Prepare a report" subtitle="Start a draft using linked case and slide information.">
          <Link className="record-list-action" to="/reports/create">Create report draft</Link>
        </Card>
        <Card title="Draft reports" subtitle="Review reports still being prepared.">
          <Link className="record-list-action" to="/reports/drafts">View draft reports</Link>
        </Card>
        <Card title="Final sign-out" subtitle="Review reports awaiting final pathologist sign-out.">
          <Link className="record-list-action" to="/reports/sign-out">Review pending reports</Link>
        </Card>
      </section>
    </main>
  );
};

export default PathologistWorkspace;
