import { Route } from "react-router-dom";

import QCDashboard from "../../pages/qc/QCDashboard";
import AddQCRecord from "../../pages/qc/AddQCRecord";
import QCRecords from "../../pages/qc/QCRecords";

const QCRoutes = (
    <>
        <Route
            path="/qc"
            element={<QCDashboard />}
        />

        <Route
            path="/qc/add"
            element={<AddQCRecord />}
        />

        <Route
            path="/qc/:id"
            element={<QCRecords />}
        />
    </>
);

export default QCRoutes;