import { Route } from "react-router-dom";
import { lazyRoute } from "../lazyRoute";

const Reports = lazyRoute(() => import("../../pages/reports/Reports"));
const CreateReport = lazyRoute(() => import("../../pages/reports/CreateReport"));
const ReportDetails = lazyRoute(() => import("../../pages/reports/ReportDetails"));
const EditReport = lazyRoute(() => import("../../pages/reports/EditReport"));
const SignOutReport = lazyRoute(() => import("../../pages/reports/SignOutReport"));
const PathologistWorkspace = lazyRoute(() => import("../../pages/reports/PathologistWorkspace"));
const DraftReports = lazyRoute(() => import("../../pages/reports/DraftReports"));
const SignOutReports = lazyRoute(() => import("../../pages/reports/SignOutReports"));

import RoleRoute from "../RoleRoute";

const ReportRoutes = (
    <>
        <Route
            path="/reports"
            element={<Reports />}
        />

        <Route element={<RoleRoute allowedRoles={["ADMIN", "PATHOLOGIST"]} />}>
            <Route path="/reports/create" element={<CreateReport />} />
            <Route path="/reports/:id/sign-out" element={<SignOutReport />} />
            <Route path="/pathologist-workspace" element={<PathologistWorkspace />} />
            <Route path="/reports/drafts" element={<DraftReports />} />
            <Route path="/reports/sign-out" element={<SignOutReports />} />
        </Route>

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

    </>
);

export default ReportRoutes;
