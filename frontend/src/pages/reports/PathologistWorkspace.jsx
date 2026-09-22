import { Link } from "react-router-dom";

const PathologistWorkspace = () => {
  return (
    <div>
      <h1>Pathologist Workspace</h1>

      <p>
        Manage pathology report preparation and final sign-out
        from this workspace.
      </p>

      <section>
        <h2>Report Preparation</h2>

        <p>
          Create and prepare draft pathology reports for cases
          requiring pathologist review.
        </p>

        <Link to="/reports/create">
          Create Report Draft
        </Link>
      </section>

      <section>
        <h2>Draft Reports</h2>

        <p>
          Review and continue working on reports that are still
          in draft status.
        </p>

        <Link to="/reports/drafts">
          View Draft Reports
        </Link>
      </section>

      <section>
        <h2>Final Sign-out</h2>

        <p>
          Review reports that are ready for final pathologist
          sign-out.
        </p>

        <Link to="/reports/sign-out">
          View Reports for Sign-out
        </Link>
      </section>
    </div>
  );
};

export default PathologistWorkspace;