import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  return (
    <main className="error-page">
      <section className="error-card" aria-labelledby="unauthorized-title">
        <div className="error-icon" aria-hidden="true"><ShieldAlert size={26} /></div>
        <p className="error-eyebrow">ACCESS CONTROL</p>
        <h1 id="unauthorized-title">Access not available</h1>
        <p>Your account does not have permission to open this page. Return to your workspace or contact an administrator if you think this is an error.</p>
        <Link to="/dashboard" className="error-action">Return to my workspace</Link>
      </section>
    </main>
  );
};

export default Unauthorized;
