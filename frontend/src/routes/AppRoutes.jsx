import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home/Home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Unauthorized from "../pages/auth/Unauthorized";

import Dashboard from "../pages/dashboard/Dashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import PathologistDashboard from "../pages/dashboard/PathologistDashboard";
import QualityDashboard from "../pages/dashboard/QualityDashboard";
import TechnicianDashboard from "../pages/dashboard/TechnicianDashboard";

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
import PathologistWorkspace from "../pages/reports/PathologistWorkspace";
import DraftReports from "../pages/reports/DraftReports";
import SignOutReports from "../pages/reports/SignOutReports";

import TATDashboard from "../pages/tat/TATDashboard";
import TATDetails from "../pages/tat/TATDetails";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/unauthorized" element={<Unauthorized />} />


        {/* =========================
            PROTECTED ROUTES
        ========================= */}

        <Route element={<ProtectedRoute />}>

          {/* General dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />


          {/* =========================
              ROLE-SPECIFIC DASHBOARDS
          ========================= */}

          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route
              path="/admin-dashboard"
              element={<AdminDashboard />}
            />
          </Route>

          <Route element={<RoleRoute allowedRoles={["TECHNICIAN"]} />}>
            <Route
              path="/technician-dashboard"
              element={<TechnicianDashboard />}
            />
          </Route>

          <Route element={<RoleRoute allowedRoles={["PATHOLOGIST"]} />}>
            <Route
              path="/pathologist-dashboard"
              element={<PathologistDashboard />}
            />
          </Route>

          <Route element={<RoleRoute allowedRoles={["QUALITY_MANAGER"]} />}>
            <Route
              path="/quality-dashboard"
              element={<QualityDashboard />}
            />
          </Route>


          {/* =========================
              PATIENT MANAGEMENT
          ========================= */}

          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/add" element={<AddPatient />} />
          <Route path="/patients/:id" element={<PatientDetails />} />


          {/* =========================
              CASE MANAGEMENT
          ========================= */}

          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/add" element={<AddCase />} />
          <Route path="/cases/:id" element={<CaseDetails />} />


          {/* =========================
              SPECIMEN MANAGEMENT
          ========================= */}

          <Route path="/specimens" element={<Specimens />} />
          <Route path="/specimens/add" element={<AddSpecimen />} />
          <Route path="/specimens/:id" element={<SpecimenDetails />} />


          {/* =========================
              BLOCK MANAGEMENT
          ========================= */}

          <Route path="/blocks" element={<Blocks />} />
          <Route path="/blocks/add" element={<AddBlock />} />
          <Route path="/blocks/:id" element={<BlockDetails />} />


          {/* =========================
              SLIDE MANAGEMENT
          ========================= */}

          <Route path="/slides" element={<Slides />} />
          <Route path="/slides/add" element={<AddSlide />} />
          <Route path="/slides/:id" element={<SlideDetails />} />


          {/* =========================
              QA / QC
          ========================= */}

          <Route path="/qc" element={<QCDashboard />} />
          <Route path="/qc/add" element={<AddQCRecord />} />
          <Route path="/qc/:id" element={<QCRecords />} />


          {/* =========================
              REPORTS
          ========================= */}

          <Route path="/reports" element={<Reports />} />

          <Route
            path="/reports/create"
            element={<CreateReport />}
          />

          <Route
            path="/reports/:id"
            element={<ReportDetails />}
          />

          <Route
            path="/reports/:id/sign-out"
            element={<SignOutReport />}
          />

          <Route
            path="/pathologist-workspace"
            element={<PathologistWorkspace />}
          />

          <Route
            path="/reports/drafts"
            element={<DraftReports />}
          />

          <Route
            path="/reports/sign-out"
            element={<SignOutReports />}
          />


          {/* =========================
              TURNAROUND TIME
          ========================= */}

          <Route path="/tat" element={<TATDashboard />} />

          <Route
            path="/tat/:caseId"
            element={<TATDetails />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;