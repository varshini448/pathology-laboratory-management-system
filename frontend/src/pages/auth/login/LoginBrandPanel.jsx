import { Microscope, ShieldCheck, LockKeyhole } from "lucide-react";

const LoginBrandPanel = () => {
  return (
    <section className="login-brand-panel">
      <div className="auth-brand-icon">
        <Microscope size={30} />
      </div>

      <div className="login-brand-label">
        PATHOLOGY LIS
      </div>

      <h1>
        Laboratory
        <br />
        Management
        <br />
        System
      </h1>

      <p>
        Securely manage patients, specimens, laboratory workflows,
        quality control, and pathology reports in one centralized
        system.
      </p>

      <div className="login-security-list">
        <div>
          <ShieldCheck size={20} />
          <span>Role-based access control</span>
        </div>

        <div>
          <LockKeyhole size={20} />
          <span>Secure authentication</span>
        </div>

        <div>
          <ShieldCheck size={20} />
          <span>Protected laboratory data</span>
        </div>
      </div>
    </section>
  );
};

export default LoginBrandPanel;
