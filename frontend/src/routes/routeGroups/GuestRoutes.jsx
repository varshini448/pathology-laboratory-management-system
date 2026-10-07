import { Route } from "react-router-dom";

import RegisterSelector from "../../pages/auth/RegisterSelector";
import InternalRegister from "../../pages/auth/InternalRegister";
import PatientRegister from "../../pages/auth/PatientRegister";
import DoctorRegister from "../../pages/auth/DoctorRegister";
import Login from "../../pages/auth/Login";
import ForgotPassword from "../../pages/auth/ForgotPassword";
import ResetPassword from "../../pages/auth/ResetPassword";
import VerifyEmail from "../../pages/auth/VerifyEmail";

const GuestRoutes = (
    <>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterSelector />} />
        <Route path="/register/internal" element={<InternalRegister />} />
        <Route path="/register/patient" element={<PatientRegister />} />
        <Route path="/register/doctor" element={<DoctorRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
    </>
);

export default GuestRoutes;
