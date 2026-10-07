import { Route } from "react-router-dom";

import AuditLogs from "../../pages/audit/AuditLogs";

import ConsentDetails from "../../pages/consent/ConsentDetails";
import ConsentRequests from "../../pages/consent/ConsentRequests";
import SharedRecords from "../../pages/consent/SharedRecords";

import Users from "../../pages/users/Users";
import AddUser from "../../pages/users/AddUser";
import UserDetails from "../../pages/users/UserDetails";

import Patients from "../../pages/patients/Patients";
import PatientDetails from "../../pages/patients/PatientDetails";
import AddPatient from "../../pages/patients/AddPatient";

import RoleRoute from "../RoleRoute";

const ManagementRoutes = (
    <>
        {/* Audit */}
        <Route
            path="/audit-logs"
            element={<AuditLogs />}
        />

        {/* Consent */}
        <Route
            path="/consent"
            element={<ConsentRequests />}
        />

        <Route
            path="/consent/:id"
            element={<ConsentDetails />}
        />

        <Route
            path="/shared-records"
            element={<SharedRecords />}
        />

        {/* User Management */}
        <Route
            element={
                <RoleRoute allowedRoles={["ADMIN"]} />
            }
        >
            <Route
                path="/users"
                element={<Users />}
            />

            <Route
                path="/users/add"
                element={<AddUser />}
            />

            <Route
                path="/users/:id"
                element={<UserDetails />}
            />
        </Route>

        {/* Patient Management */}
        <Route
            path="/patients"
            element={<Patients />}
        />

        <Route
            path="/patients/add"
            element={<AddPatient />}
        />

        <Route
            path="/patients/:id"
            element={<PatientDetails />}
        />
    </>
);

export default ManagementRoutes;
