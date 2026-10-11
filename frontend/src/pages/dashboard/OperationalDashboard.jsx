import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardHeader from "./components/DashboardHeader";
import DashboardSection from "./components/DashboardSection";
import DashboardStatCard from "./components/DashboardStatCard";
import "./dashboard.css";

const OperationalDashboard = ({ title, subtitle, loaders, metrics, queues, actions }) => {
  const [data, setData] = useState({});
  const [sourceErrors, setSourceErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all(Object.entries(loaders).map(async ([key, loader]) => {
      try { return [key, await loader(), ""]; }
      catch (error) { return [key, null, error.message || "Unable to load this section."]; }
    })).then((entries) => {
      if (!active) return;
      setData(Object.fromEntries(entries.map(([key, result]) => [key, result])));
      setSourceErrors(Object.fromEntries(entries.filter(([, , error]) => error).map(([key, , error]) => [key, error])));
      setLoading(false);
    });
    return () => { active = false; };
  }, [loaders, reloadKey]);

  return <main className="dashboard-page operational-dashboard">
    <DashboardHeader title={title} subtitle={subtitle} />
    <nav className="operational-dashboard-actions" aria-label={`${title} shortcuts`}>
      {actions.map(({ label, to }) => <Link key={to} to={to}>{label}<span aria-hidden="true"> →</span></Link>)}
    </nav>
    {loading ? <p className="operational-dashboard-state" role="status">Loading your operational workspace…</p> : <>
      <section className="dashboard-stat-grid" aria-label={`${title} summary`}>
        {metrics.map(({ title: label, source, icon }) => <DashboardStatCard key={source} title={label} value={sourceErrors[source] ? "—" : (data[source]?.length ?? 0)} subtitle={sourceErrors[source] ? "Data unavailable" : "Current records"} icon={icon} />)}
      </section>
      {queues.map(({ title: sectionTitle, source, description, href, getHref, getLabel, getMeta, empty }) => <DashboardSection key={source} title={sectionTitle} subtitle={description} actions={<Link to={href}>View all</Link>}>
        {sourceErrors[source] ? <div className="dashboard-empty-state" role="alert"><h3>Section unavailable</h3><p>{sourceErrors[source]}</p><button type="button" onClick={() => setReloadKey((key) => key + 1)}>Retry</button></div> : data[source]?.length ? <ul className="operational-dashboard-list">{data[source].slice(0, 5).map((item) => <li key={item._id || item.caseId || item.reportId}><Link to={getHref ? getHref(item) : href}>{getLabel(item)}</Link><span>{getMeta(item)}</span></li>)}</ul> : <div className="dashboard-empty-state"><h3>{empty}</h3><p>New items will appear here when they are recorded.</p></div>}
      </DashboardSection>)}
    </>}
  </main>;
};

export default OperationalDashboard;
