import { Route } from "react-router-dom";

import Reports from "../../pages/reports/Reports";
import CreateReport from "../../pages/reports/CreateReport";
import ReportDetails from "../../pages/reports/ReportDetails";
import EditReport from "../../pages/reports/EditReport";
import SignOutReport from "../../pages/reports/SignOutReport";
import PathologistWorkspace from "../../pages/reports/PathologistWorkspace";
import DraftReports from "../../pages/reports/DraftReports";
import SignOutReports from "../../pages/reports/SignOutReports";

import RoleRoute from "../RoleRoute";

const ReportRoutes = (
    <>
        <Route
            path="/reports"
            element={<Reports />}
        />

        <Route
            path="/reports/create"
            element={<CreateReport />}
        />

        <Route
            path="/reports/:id"
            element={<ReportDetails />}
        />

        <Route
            element={
                <RoleRoute
                    allowedRoles={[
                        "ADMIN",
                        "PATHOLOGIST",
                    ]}
                />
            }
        >
            <Route
                path="/reports/:id/edit"
                element={<EditReport />}
            />
        </Route>

        <Route
            path="/reports/:id/sign-out"
            element={<SignOutReport />}
        />

        <Route
            path="/pathologist-workspace"
            element={<PathologistWorkspace />}
        />

        <Route
            path="/reports/drafts"
            element={<DraftReports />}
        />

        <Route
            path="/reports/sign-out"
            element={<SignOutReports />}
        />
    </>
);

export default ReportRoutes;