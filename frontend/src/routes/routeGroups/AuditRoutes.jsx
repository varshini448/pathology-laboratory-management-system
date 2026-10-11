import { Route } from "react-router-dom";
import AuditLogs from "../../pages/audit/AuditLogs";
import RoleRoute from "../RoleRoute";

const AuditRoutes = (
  <>
    <Route element={<RoleRoute allowedRoles={["ADMIN", "QUALITY_MANAGER"]} />}>
      <Route path="/audit-logs" element={<AuditLogs />} />
    </Route>
  </>
);

export default AuditRoutes;
