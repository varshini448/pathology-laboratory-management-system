import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import DashboardSection from "../dashboard/components/DashboardSection";

const DEMO_USERS = [
  {
    id: "USR001",
    name: "Admin User",
    email: "admin@pathologylab.com",
    role: "ADMIN",
    status: "ACTIVE",
  },
  {
    id: "USR002",
    name: "Dr. Priya Sharma",
    email: "priya.sharma@pathologylab.com",
    role: "PATHOLOGIST",
    status: "ACTIVE",
  },
  {
    id: "USR003",
    name: "Lab Technician",
    email: "technician@pathologylab.com",
    role: "TECHNICIAN",
    status: "ACTIVE",
  },
  {
    id: "USR004",
    name: "Quality Manager",
    email: "quality@pathologylab.com",
    role: "QUALITY_MANAGER",
    status: "ACTIVE",
  },
];

const Users = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return DEMO_USERS.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.id.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter]);

  return (
    <main className="dashboard-page">
      <DashboardHeader
        title="Users"
        subtitle="Manage internal pathology laboratory system users."
        actions={
          <Link to="/users/add" className="primary-button">
            Add User
          </Link>
        }
      />

      <DashboardSection
        title="User Management"
        subtitle={`${filteredUsers.length} users displayed`}
      >
        <div className="audit-filters">
          <input
            type="search"
            placeholder="Search users..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search users"
          />

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            aria-label="Filter users by role"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="TECHNICIAN">Technician</option>
            <option value="PATHOLOGIST">Pathologist</option>
            <option value="QUALITY_MANAGER">Quality Manager</option>
          </select>
        </div>

        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>
                    <Link to={`/users/${user.id}`}>View</Link>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashboardSection>
    </main>
  );
};

export default Users;