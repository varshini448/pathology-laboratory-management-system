import { Link, useParams } from "react-router-dom";

const SignOutReport = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Final Sign-out</h1>

      <p>
        Final sign-out page for report: <strong>{id}</strong>
      </p>

      <p>
        Final sign-out functionality will be implemented after the
        reporting module is tested.
      </p>

      <Link to={`/reports/${id}`}>Back to Report</Link>
    </div>
  );
};

export default SignOutReport;