import React from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";

const AddUserSidebar = () => (
  <aside className="add-user-sidebar">
    <section className="add-user-sidebar-card add-user-sidebar-highlight">
      <div className="add-user-sidebar-icon">
        <ShieldCheck size={22} />
      </div>
      <h2>Access approval</h2>
      <p>
        New registrations are submitted for administrator review. The
        account remains pending until approved.
      </p>
      <div className="add-user-status-chip">
        <span />
        Pending approval
      </div>
    </section>

    <section className="add-user-sidebar-card">
      <h2>Registration checklist</h2>
      <ul className="add-user-checklist">
        <li><CheckCircle2 size={17} /> Valid contact information</li>
        <li><CheckCircle2 size={17} /> Correct staff role</li>
        <li><CheckCircle2 size={17} /> Professional credentials</li>
        <li><CheckCircle2 size={17} /> Secure initial password</li>
      </ul>
    </section>

    <p className="add-user-sidebar-note">
      <ShieldCheck size={16} />
      Staff details should match verified laboratory records.
    </p>
  </aside>
);

export default AddUserSidebar;
