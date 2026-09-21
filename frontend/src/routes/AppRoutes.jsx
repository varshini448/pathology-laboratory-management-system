import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Unauthorized from "../pages/auth/Unauthorized";

import Dashboard from "../pages/dashboard/Dashboard";

import Patients from "../pages/patients/Patients";
import PatientDetails from "../pages/patients/PatientDetails";
import AddPatient from "../pages/patients/AddPatient";

import Cases from "../pages/cases/Cases";
import CaseDetails from "../pages/cases/CaseDetails";
import AddCase from "../pages/cases/AddCase";

import Specimens from "../pages/specimens/Specimens";
import SpecimenDetails from "../pages/specimens/SpecimenDetails";
import AddSpecimen from "../pages/specimens/AddSpecimen";

import Blocks from "../pages/blocks/Blocks";
import BlockDetails from "../pages/blocks/BlockDetails";
import AddBlock from "../pages/blocks/AddBlock";

import Slides from "../pages/slides/Slides";
import SlideDetails from "../pages/slides/SlideDetails";
import AddSlide from "../pages/slides/AddSlide";

import QCDashboard from "../pages/qc/QCDashboard";
import AddQCRecord from "../pages/qc/AddQCRecord";
import QCRecords from "../pages/qc/QCRecords";

import Reports from "../pages/reports/Reports";
import CreateReport from "../pages/reports/CreateReport";
import ReportDetails from "../pages/reports/ReportDetails";
import SignOutReport from "../pages/reports/SignOutReport";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/" element={<Dashboard />} />

        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/add" element={<AddPatient />} />
        <Route path="/patients/:id" element={<PatientDetails />} />

        <Route path="/cases" element={<Cases />} />
        <Route path="/cases/add" element={<AddCase />} />
        <Route path="/cases/:id" element={<CaseDetails />} />

        <Route path="/specimens" element={<Specimens />} />
        <Route path="/specimens/add" element={<AddSpecimen />} />
        <Route path="/specimens/:id" element={<SpecimenDetails />} />

        <Route path="/blocks" element={<Blocks />} />
        <Route path="/blocks/add" element={<AddBlock />} />
        <Route path="/blocks/:id" element={<BlockDetails />} />

        <Route path="/slides" element={<Slides />} />
        <Route path="/slides/add" element={<AddSlide />} />
        <Route path="/slides/:id" element={<SlideDetails />} />

        <Route path="/qc" element={<QCDashboard />} />
        <Route path="/qc/add" element={<AddQCRecord />} />
        <Route path="/qc/:id" element={<QCRecords />} />

        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/create" element={<CreateReport />} />
        <Route path="/reports/:id" element={<ReportDetails />} />
        <Route path="/reports/:id/sign-out" element={<SignOutReport />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
