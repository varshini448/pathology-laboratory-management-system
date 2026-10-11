import OperationalDashboard from "./OperationalDashboard";
import { getCases } from "../../services/caseService";
import { getSpecimens } from "../../services/specimenService";
import { getBlocks } from "../../services/blockService";
import { getSlides } from "../../services/slideService";
import { ClipboardList, FileStack, FlaskConical, ScanLine } from "lucide-react";

const loaders = { cases: getCases, specimens: getSpecimens, blocks: getBlocks, slides: getSlides };
const metrics = [
  { title: "Cases", source: "cases", icon: <ClipboardList /> },
  { title: "Specimens", source: "specimens", icon: <FlaskConical /> },
  { title: "Blocks", source: "blocks", icon: <FileStack /> },
  { title: "Slides", source: "slides", icon: <ScanLine /> },
];
const queues = [
  { title: "Recent cases", source: "cases", description: "Current registered laboratory cases.", href: "/cases", getHref: (item) => `/cases/${encodeURIComponent(item.caseId)}`, getLabel: (item) => item.caseId, getMeta: (item) => `${item.status || "Status unavailable"} · ${item.caseType || "Case"}`, empty: "No cases recorded" },
  { title: "Recent specimens", source: "specimens", description: "Specimens available in the workflow.", href: "/specimens", getHref: (item) => `/specimens/${item._id}`, getLabel: (item) => item.specimenId || item._id, getMeta: (item) => item.status || "Status unavailable", empty: "No specimens recorded" },
];

const TechnicianDashboard = () => {
  return <OperationalDashboard title="Technician Dashboard" subtitle="Track case intake and specimen-to-slide processing across the laboratory." loaders={loaders} metrics={metrics} queues={queues} actions={[{ label: "View cases", to: "/cases" }, { label: "Add specimen", to: "/specimens/add" }, { label: "View blocks", to: "/blocks" }, { label: "View slides", to: "/slides" }, { label: "Quality control", to: "/qc" }, { label: "Monitor TAT", to: "/tat" }]} />;
};

export default TechnicianDashboard;
