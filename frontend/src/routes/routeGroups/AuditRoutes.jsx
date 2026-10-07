import { Route } from "react-router-dom";

import AuditLogs from "../../pages/audit/AuditLogs";

const AuditRoutes = (
    <>
        <Route
            path="/audit-logs"
            element={<AuditLogs />}
        />
    </>
);

export default AuditRoutes;