import { Route } from "react-router-dom";

import QCDashboard from "../../pages/qc/QCDashboard";
import AddQCRecord from "../../pages/qc/AddQCRecord";
import QCRecords from "../../pages/qc/QCRecords";
import RoleRoute from "../RoleRoute";

const QCRoutes = (
  <>
    <Route element={<RoleRoute allowedRoles={["ADMIN", "QUALITY_MANAGER", "PATHOLOGIST", "TECHNICIAN"]} />}>
      <Route path="/qc" element={<QCDashboard />} />
      <Route path="/qc/records" element={<QCRecords />} />
      <Route path="/qc/:id" element={<QCRecords />} />
    </Route>
    <Route element={<RoleRoute allowedRoles={["ADMIN", "QUALITY_MANAGER", "PATHOLOGIST"]} />}>
      <Route path="/qc/add" element={<AddQCRecord />} />
    </Route>
  </>
);

export default QCRoutes;
