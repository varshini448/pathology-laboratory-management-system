import { Route } from "react-router-dom";
import RoleRoute from "../RoleRoute";
import PendingApprovals from "../../pages/admin/PendingApprovals";
import WorkflowConfiguration from "../../pages/admin/WorkflowConfiguration";
import Doctors from "../../pages/doctors/Doctors";
import DoctorDetails from "../../pages/doctors/DoctorDetails";

const ManagementRoutes = (
  <>
    <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
      <Route
        path="/admin/pending-approvals"
        element={<PendingApprovals />}
      />
      <Route
        path="/admin/workflow-configuration"
        element={<WorkflowConfiguration />}
      />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctors/:id" element={<DoctorDetails />} />
    </Route>
  </>
);

export default ManagementRoutes;
