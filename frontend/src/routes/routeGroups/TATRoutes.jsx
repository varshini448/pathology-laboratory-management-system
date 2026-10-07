import { Route } from "react-router-dom";

import TATDashboard from "../../pages/tat/TATDashboard";
import TATDetails from "../../pages/tat/TATDetails";

const TATRoutes = (
    <>
        <Route
            path="/tat"
            element={<TATDashboard />}
        />

        <Route
            path="/tat/:caseId"
            element={<TATDetails />}
        />
    </>
);

export default TATRoutes;