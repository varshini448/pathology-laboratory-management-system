import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, RefreshCw } from "lucide-react";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../../services/notificationService";

const safeActionPath = (path) => typeof path === "string" && path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\") ? path : "";

const NotificationMenu = () => {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionPending, setActionPending] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getNotifications();
      setItems(Array.isArray(response.notifications) ? response.notifications : []);
      setUnreadCount(Number(response.unreadCount) || 0);
    } catch (loadError) {
      setError(loadError.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const openMenu = () => {
    setOpen((current) => !current);
    if (!open) load();
  };

  const markRead = async (notification) => {
    const href = safeActionPath(notification.actionUrl);
    if (notification.isRead) return href;
    setActionPending(true);
    setError("");
    try {
      const response = await markNotificationAsRead(notification._id);
      setItems((current) => current.map((item) => item._id === notification._id ? (response.notification || { ...item, isRead: true }) : item));
      setUnreadCount((count) => Math.max(0, count - 1));
      return href;
    } catch (actionError) {
      setError(actionError.message || "Unable to update this notification.");
      return "";
    } finally {
      setActionPending(false);
    }
  };

  const markAllRead = async () => {
    setActionPending(true);
    setError("");
    try {
      await markAllNotificationsAsRead();
      setItems((current) => current.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (actionError) {
      setError(actionError.message || "Unable to update notifications.");
    } finally {
      setActionPending(false);
    }
  };

  return (
    <div className="notification-menu" ref={rootRef}>
      <button type="button" className="app-shell-icon-button notification-trigger" onClick={openMenu} aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`} aria-expanded={open} aria-controls="notification-panel">
        <Bell size={17} aria-hidden="true" />
        <span>Notifications</span>
        {unreadCount > 0 && <span className="notification-count" aria-label={`${unreadCount} unread`}>{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </button>
      {open && <section className="notification-panel" id="notification-panel" aria-label="Notifications">
        <header><div><strong>Notifications</strong><span>{unreadCount ? `${unreadCount} unread` : "Up to date"}</span></div><button type="button" onClick={load} aria-label="Refresh notifications" disabled={loading}><RefreshCw size={15} /></button></header>
        {unreadCount > 0 && <button type="button" className="notification-mark-all" onClick={markAllRead} disabled={actionPending}><Check size={14} /> Mark all as read</button>}
        {loading ? <p className="notification-state" role="status">Loading notifications…</p> : error ? <div className="notification-state" role="alert">{error}<button type="button" onClick={load}>Try again</button></div> : items.length === 0 ? <p className="notification-state">No notifications yet.</p> : <ul>{items.map((item) => <li key={item._id} className={item.isRead ? "is-read" : "is-unread"}>
          <button type="button" onClick={async () => { const href = await markRead(item); if (href) { setOpen(false); navigate(href); } }} disabled={actionPending}>
            <span className="notification-item-heading"><strong>{item.title}</strong>{!item.isRead && <span aria-label="Unread" />}</span>
            <span>{item.message}</span>
            <time dateTime={item.createdAt}>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</time>
          </button>
        </li>)}</ul>}
      </section>}
    </div>
  );
};

export default NotificationMenu;
