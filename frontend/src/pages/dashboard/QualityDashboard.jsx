import OperationalDashboard from "./OperationalDashboard";
import { getQCRecords } from "../../services/qcService";
import { getCases } from "../../services/caseService";
import { ClipboardList, ShieldCheck } from "lucide-react";

const loaders = { qcRecords: getQCRecords, cases: getCases };
const metrics = [
  { title: "QC records", source: "qcRecords", icon: <ShieldCheck /> },
  { title: "Cases", source: "cases", icon: <ClipboardList /> },
];
const queues = [
  { title: "Recent QC records", source: "qcRecords", description: "Records returned by the quality-control service.", href: "/qc/records", getLabel: (item) => item.qcId || item.case?.caseId || "Quality record", getMeta: (item) => item.overallStatus || "Status unavailable", empty: "No quality records available" },
  { title: "Recent cases", source: "cases", description: "Current cases available for quality oversight.", href: "/cases", getHref: (item) => `/cases/${encodeURIComponent(item.caseId)}`, getLabel: (item) => item.caseId, getMeta: (item) => `${item.status || "Status unavailable"} · ${item.priority || "Normal priority"}`, empty: "No cases available" },
];

const QualityDashboard = () => {
  return <OperationalDashboard title="Quality Manager Dashboard" subtitle="Review recorded quality activity and case status across the laboratory." loaders={loaders} metrics={metrics} queues={queues} actions={[{ label: "QC dashboard", to: "/qc" }, { label: "Review QC records", to: "/qc/records" }, { label: "Add QC record", to: "/qc/add" }, { label: "Monitor TAT", to: "/tat" }]} />;
};

export default QualityDashboard;
