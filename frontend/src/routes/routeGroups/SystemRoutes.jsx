import { Route } from "react-router-dom";

import ServerError from "../../pages/errors/ServerError";
import Maintenance from "../../pages/errors/Maintenance";

const SystemRoutes = (
    <>
        <Route
            path="/server-error"
            element={<ServerError />}
        />

        <Route
            path="/maintenance"
            element={<Maintenance />}
        />
    </>
);

export default SystemRoutes;
