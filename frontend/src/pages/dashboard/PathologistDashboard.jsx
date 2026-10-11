import OperationalDashboard from "./OperationalDashboard";
import { getCases } from "../../services/caseService";
import { getPendingSignOutReports } from "../../services/reportService";
import { ClipboardList, FileCheck2 } from "lucide-react";

const loaders = { cases: getCases, reports: getPendingSignOutReports };
const metrics = [
  { title: "Cases", source: "cases", icon: <ClipboardList /> },
  { title: "Reports pending sign-out", source: "reports", icon: <FileCheck2 /> },
];
const queues = [
  { title: "Recent cases", source: "cases", description: "Cases available for pathology review.", href: "/cases", getHref: (item) => `/cases/${encodeURIComponent(item.caseId)}`, getLabel: (item) => item.caseId, getMeta: (item) => `${item.status || "Status unavailable"} · ${item.caseType || "Case"}`, empty: "No cases available" },
  { title: "Reports pending sign-out", source: "reports", description: "Reports returned by the existing sign-out queue.", href: "/reports/sign-out", getHref: (item) => `/reports/${item._id}`, getLabel: (item) => item.reportId || item.case?.caseId || "Report", getMeta: (item) => item.reportStatus || "Awaiting sign-out", empty: "No reports pending sign-out" },
];

const PathologistDashboard = () => {
  return <OperationalDashboard title="Pathologist Dashboard" subtitle="Review current laboratory cases and complete report sign-out work." loaders={loaders} metrics={metrics} queues={queues} actions={[{ label: "Review cases", to: "/cases" }, { label: "Pathologist workspace", to: "/pathologist-workspace" }, { label: "Draft reports", to: "/reports/drafts" }, { label: "Sign-out queue", to: "/reports/sign-out" }]} />;
};

export default PathologistDashboard;
