import React from "react";
import { Link, useParams } from "react-router-dom";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import DashboardSection from "../dashboard/components/DashboardSection";

const UserDetails = () => {
  const { userId } = useParams();

  const user = {
    id: userId || "USR001",
    name: "Dr. Priya Sharma",
    email: "priya.sharma@pathologylab.com",
    phone: "+91 98765 43210",
    role: "PATHOLOGIST",
    status: "ACTIVE",
    joinedDate: "15 September 2026",
  };

  return (
    <main className="dashboard-page">
      <DashboardHeader
        title="User Details"
        subtitle="View user account and role information."
      />

      <DashboardSection
        title="Account Information"
        subtitle={`User ID: ${user.id}`}
      >
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{user.name}</td>
              </tr>

              <tr>
                <th>Email</th>
                <td>{user.email}</td>
              </tr>

              <tr>
                <th>Phone</th>
                <td>{user.phone}</td>
              </tr>

              <tr>
                <th>Role</th>
                <td>{user.role}</td>
              </tr>

              <tr>
                <th>Status</th>
                <td>{user.status}</td>
              </tr>

              <tr>
                <th>Joined Date</th>
                <td>{user.joinedDate}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="form-actions">
          <Link to="/users" className="secondary-button">
            Back to Users
          </Link>
        </div>
      </DashboardSection>
    </main>
  );
};

export default UserDetails;