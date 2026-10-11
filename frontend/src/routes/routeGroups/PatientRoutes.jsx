import { Route } from "react-router-dom";

import Patients from "../../pages/patients/Patients";
import PatientDetails from "../../pages/patients/PatientDetails";
import AddPatient from "../../pages/patients/AddPatient";
import RoleRoute from "../RoleRoute";

const PatientRoutes = (
    <>
        <Route
            path="/patients"
            element={<Patients />}
        />

        <Route element={<RoleRoute allowedRoles={["ADMIN", "TECHNICIAN"]} />}>
            <Route path="/patients/add" element={<AddPatient />} />
        </Route>

        <Route
            path="/patients/:id"
            element={<PatientDetails />}
        />
    </>
);

export default PatientRoutes;
