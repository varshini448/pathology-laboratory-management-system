import React from "react";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import DashboardStatCard from "../dashboard/components/DashboardStatCard";
import DashboardSection from "../dashboard/components/DashboardSection";

const PatientDashboard = () => {
  return (
    <main className="dashboard-page">
      <DashboardHeader
        title="Patient Dashboard"
        subtitle="View your pathology cases, reports, and laboratory updates."
      />

      <section className="dashboard-stat-grid">
        <DashboardStatCard
          title="My Cases"
          value="2"
          subtitle="Registered cases"
          icon="📋"
        />
        <DashboardStatCard
          title="Active Cases"
          value="1"
          subtitle="Currently processing"
          icon="🔬"
        />
        <DashboardStatCard
          title="Reports"
          value="1"
          subtitle="Available reports"
          icon="📄"
        />
        <DashboardStatCard
          title="Shared Records"
          value="2"
          subtitle="Accessible records"
          icon="🔐"
        />
      </section>

      <DashboardSection
        title="Patient Workspace"
        subtitle="Access your laboratory information from the main navigation."
      >
        <div className="dashboard-empty-state">
          <h3>Your pathology information is available</h3>
          <p>
            View case progress, laboratory reports, and shared medical records
            using the available patient services.
          </p>
        </div>
      </DashboardSection>
    </main>
  );
};

export default PatientDashboard;
