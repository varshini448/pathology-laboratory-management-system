import { BrowserRouter, Routes, Route } from "react-router-dom";

// Route Groups
import PublicRoutes from "./routeGroups/PublicRoutes";
import GuestRoutes from "./routeGroups/GuestRoutes";
import DashboardRoutes from "./routeGroups/DashboardRoutes";
import ManagementRoutes from "./routeGroups/ManagementRoutes";
import LaboratoryRoutes from "./routeGroups/LaboratoryRoutes";
import AuditRoutes from "./routeGroups/AuditRoutes";
import ConsentRoutes from "./routeGroups/ConsentRoutes";
import QCRoutes from "./routeGroups/QCRoutes";
import ReportRoutes from "./routeGroups/ReportRoutes";
import TATRoutes from "./routeGroups/TATRoutes";
import SystemRoutes from "./routeGroups/SystemRoutes";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// Layout
import AppShell from "../layouts/AppShell";

// System
import NotFound from "../pages/errors/NotFound";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* =====================================================
                    PUBLIC ROUTES
                ====================================================== */}

                {PublicRoutes}


                {/* =====================================================
                    GUEST ROUTES
                ====================================================== */}

                <Route element={<GuestRoute />}>
                    {GuestRoutes}
                </Route>


                {/* =====================================================
                    PROTECTED ROUTES
                ====================================================== */}

                <Route element={<ProtectedRoute />}>
                    <Route element={<AppShell />}>

                        {/* =================================================
                            DASHBOARDS
                        ================================================== */}

                        {DashboardRoutes}


                        {/* =================================================
                            MANAGEMENT
                        ================================================== */}

                        {ManagementRoutes}


                        {/* =================================================
                            AUDIT
                        ================================================== */}

                        {AuditRoutes}


                        {/* =================================================
                            CONSENT
                        ================================================== */}

                        {ConsentRoutes}


                        {/* =================================================
                            LABORATORY
                        ================================================== */}

                        {LaboratoryRoutes}


                        {/* =================================================
                            QUALITY CONTROL
                        ================================================== */}

                        {QCRoutes}


                        {/* =================================================
                            REPORTS
                        ================================================== */}

                        {ReportRoutes}


                        {/* =================================================
                            TURNAROUND TIME
                        ================================================== */}

                        {TATRoutes}


                        {/* =================================================
                            SYSTEM
                        ================================================== */}

                        {SystemRoutes}

                    </Route>
                </Route>


                {/* =====================================================
                    FALLBACK
                ====================================================== */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;