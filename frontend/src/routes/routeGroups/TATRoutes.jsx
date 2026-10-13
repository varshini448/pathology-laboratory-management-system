import { Route } from "react-router-dom";

import TATDashboard from "../../pages/tat/TATDashboard";
import TATDetails from "../../pages/tat/TATDetails";
import WorkflowBottlenecks from "../../pages/workflow/WorkflowBottlenecks";
import RoleRoute from "../RoleRoute";

const TATRoutes = (
    <>
        <Route element={<RoleRoute allowedRoles={["ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"]} />}>
            <Route path="/tat" element={<TATDashboard />} />
            <Route path="/tat/:caseId" element={<TATDetails />} />
            <Route path="/workflow/bottlenecks" element={<WorkflowBottlenecks />} />
        </Route>
    </>
);

export default TATRoutes;
