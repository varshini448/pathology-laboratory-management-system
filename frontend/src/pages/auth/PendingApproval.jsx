import { Link } from "react-router-dom";
import { Clock3, ShieldCheck, ArrowLeft, House, CheckCircle2 } from "lucide-react";
import "../../styles/auth/pending-approval.css";

const PendingApproval = () => {
return ( <main className="approval-page"> <section className="approval-card" aria-labelledby="approval-title"> <div className="approval-brand"> <div className="approval-brand-mark">P</div> <div> <strong>Pathology</strong> <span>Intelligence Platform</span> </div> </div>


    <div className="approval-illustration" aria-hidden="true">
      <div className="approval-illustration-ring">
        <Clock3 size={36} strokeWidth={1.8} />
      </div>
      <span className="approval-illustration-shield">
        <ShieldCheck size={20} />
      </span>
    </div>

    <span className="approval-eyebrow">REGISTRATION UPDATE</span>
    <h1 id="approval-title">Account pending approval</h1>

    <p className="approval-description">
      Your registration has been submitted successfully. An administrator
      must approve your account before you can sign in.
    </p>

    <div className="approval-status" role="status">
      <span className="approval-status-dot" />
      <span className="approval-status-label">Current status</span>
      <strong>Pending approval</strong>
    </div>

    <div className="approval-next-steps">
      <h2>What happens next?</h2>

      <div className="approval-step">
        <span className="approval-step-icon">
          <CheckCircle2 size={18} />
        </span>
        <div>
          <strong>Registration received</strong>
          <p>Your account details have been submitted.</p>
        </div>
      </div>

      <div className="approval-step">
        <span className="approval-step-icon approval-step-icon-pending">
          <Clock3 size={18} />
        </span>
        <div>
          <strong>Administrator review</strong>
          <p>Your account is waiting for an administrator's decision.</p>
        </div>
      </div>
    </div>

    <div className="approval-actions">
      <Link to="/login" className="approval-primary-button">
        <ArrowLeft size={17} />
        Back to Login
      </Link>

      <Link to="/" className="approval-secondary-button">
        <House size={17} />
        Home
      </Link>
    </div>

    <footer className="approval-footer">
      <ShieldCheck size={15} />
      <span>Secure laboratory workspace</span>
    </footer>
  </section>
</main>


);
};

export default PendingApproval;
