import React from "react";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import DashboardStatCard from "../dashboard/components/DashboardStatCard";
import DashboardSection from "../dashboard/components/DashboardSection";

const DoctorDashboard = () => {
  return (
    <main className="dashboard-page">
      <DashboardHeader
        title="Doctor Dashboard"
        subtitle="Monitor patients, cases, and pathology activity."
      />

      <section className="dashboard-stat-grid">
        <DashboardStatCard
          title="Assigned Cases"
          value="12"
          subtitle="Active cases"
          icon="📋"
        />
        <DashboardStatCard
          title="Patients"
          value="24"
          subtitle="Registered patients"
          icon="👤"
        />
        <DashboardStatCard
          title="Pending Reviews"
          value="5"
          subtitle="Require attention"
          icon="🔍"
        />
        <DashboardStatCard
          title="Reports"
          value="8"
          subtitle="Recent reports"
          icon="📄"
        />
      </section>

      <DashboardSection
        title="Doctor Workspace"
        subtitle="Quick overview of your laboratory activity."
      >
        <div className="dashboard-empty-state">
          <h3>Clinical workspace ready</h3>
          <p>
            Use the main navigation to review assigned cases, patient
            information, and pathology reports.
          </p>
        </div>
      </DashboardSection>
    </main>
  );
};

export default DoctorDashboard;
