import { Route } from "react-router-dom";

import TATDashboard from "../../pages/tat/TATDashboard";
import TATDetails from "../../pages/tat/TATDetails";
import RoleRoute from "../RoleRoute";

const TATRoutes = (
    <>
        <Route element={<RoleRoute allowedRoles={["ADMIN", "TECHNICIAN", "PATHOLOGIST", "QUALITY_MANAGER"]} />}>
            <Route path="/tat" element={<TATDashboard />} />
            <Route path="/tat/:caseId" element={<TATDetails />} />
        </Route>
    </>
);

export default TATRoutes;
