import { Route } from "react-router-dom";

import Dashboard from "../../pages/dashboard/Dashboard";
import AdminDashboard from "../../pages/dashboard/AdminDashboard";
import PathologistDashboard from "../../pages/dashboard/PathologistDashboard";
import QualityDashboard from "../../pages/dashboard/QualityDashboard";
import TechnicianDashboard from "../../pages/dashboard/TechnicianDashboard";
import DoctorDashboard from "../../pages/doctor/DoctorDashboard";
import PatientDashboard from "../../pages/patient/PatientDashboard";
import RoleRoute from "../RoleRoute";

const DashboardRoutes = (
    <>
        <Route
            path="/dashboard"
            element={<Dashboard />}
        />

        <Route
            element={
                <RoleRoute allowedRoles={["DOCTOR"]} />
            }
        >
            <Route
                path="/doctor-dashboard"
                element={<DoctorDashboard />}
            />
        </Route>

        <Route
            element={
                <RoleRoute allowedRoles={["PATIENT"]} />
            }
        >
            <Route
                path="/patient-dashboard"
                element={<PatientDashboard />}
            />
        </Route>

        <Route
            element={
                <RoleRoute allowedRoles={["ADMIN"]} />
            }
        >
            <Route
                path="/admin-dashboard"
                element={<AdminDashboard />}
            />
        </Route>

        <Route
            element={
                <RoleRoute allowedRoles={["TECHNICIAN"]} />
            }
        >
            <Route
                path="/technician-dashboard"
                element={<TechnicianDashboard />}
            />
        </Route>

        <Route
            element={
                <RoleRoute allowedRoles={["PATHOLOGIST"]} />
            }
        >
            <Route
                path="/pathologist-dashboard"
                element={<PathologistDashboard />}
            />
        </Route>

        <Route
            element={
                <RoleRoute allowedRoles={["QUALITY_MANAGER"]} />
            }
        >
            <Route
                path="/quality-dashboard"
                element={<QualityDashboard />}
            />
        </Route>
    </>
);

export default DashboardRoutes;
