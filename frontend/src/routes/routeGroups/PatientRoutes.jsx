import { Route } from "react-router-dom";

import Patients from "../../pages/patients/Patients";
import PatientDetails from "../../pages/patients/PatientDetails";
import AddPatient from "../../pages/patients/AddPatient";

const PatientRoutes = (
    <>
        <Route
            path="/patients"
            element={<Patients />}
        />

        <Route
            path="/patients/add"
            element={<AddPatient />}
        />

        <Route
            path="/patients/:id"
            element={<PatientDetails />}
        />
    </>
);

export default PatientRoutes;