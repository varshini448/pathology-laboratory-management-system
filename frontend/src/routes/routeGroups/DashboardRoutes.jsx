import { Route } from "react-router-dom";
import { lazyRoute } from "../lazyRoute";

const Dashboard = lazyRoute(() => import("../../pages/dashboard/Dashboard"));
const AdminDashboard = lazyRoute(() => import("../../pages/dashboard/AdminDashboard"));
const PathologistDashboard = lazyRoute(() => import("../../pages/dashboard/PathologistDashboard"));
const QualityDashboard = lazyRoute(() => import("../../pages/dashboard/QualityDashboard"));
const TechnicianDashboard = lazyRoute(() => import("../../pages/dashboard/TechnicianDashboard"));
const DoctorDashboard = lazyRoute(() => import("../../pages/doctor/DoctorDashboard"));
const PatientDashboard = lazyRoute(() => import("../../pages/patient/PatientDashboard"));
const DoctorCaseDetails = lazyRoute(() => import("../../pages/external/DoctorCaseDetails"));
const PatientCaseDetails = lazyRoute(() => import("../../pages/external/PatientCaseDetails"));
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
            <Route path="/doctor/assigned-cases" element={<DoctorDashboard />} />
            <Route path="/doctor/assigned-reports" element={<DoctorDashboard />} />
            <Route path="/doctor/cases/:caseId" element={<DoctorCaseDetails />} />
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
            <Route path="/patient/cases" element={<PatientDashboard />} />
            <Route path="/patient/reports" element={<PatientDashboard />} />
            <Route path="/patient/cases/:caseId" element={<PatientCaseDetails />} />
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
