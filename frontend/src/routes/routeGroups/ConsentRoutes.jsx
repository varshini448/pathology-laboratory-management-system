import { Route } from "react-router-dom";

import ConsentRequests from "../../pages/consent/ConsentRequests";
import ConsentDetails from "../../pages/consent/ConsentDetails";
import SharedRecords from "../../pages/consent/SharedRecords";

const ConsentRoutes = (
    <>
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
    </>
);

export default ConsentRoutes;