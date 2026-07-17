import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon } from "@heroicons/react/24/outline";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  subscribeToNotifications,
} from "../services/notificationService";
import { useAuth } from "../hooks/useAuth";

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    if (!user) return;

    getNotifications(user.id).then(setNotifications).catch(() => {});

    const unsubscribe = subscribeToNotifications(user.id, (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
    }
    setIsOpen(false);
    if (notification.link) navigate(notification.link);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-md hover:bg-surface transition-colors"
      >
        <BellIcon className="h-5 w-5 text-slate" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 bg-danger text-white text-[10px] font-medium rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-card">
            <h3 className="font-medium text-slate-900 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-emerald font-medium hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-sm text-slate-light text-center py-8">
              No notifications yet.
            </p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-surface transition-colors ${
                  !n.is_read ? "bg-emerald/5" : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  {!n.is_read && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald mt-1.5 shrink-0" />
                  )}
                  <div className={!n.is_read ? "" : "ml-3.5"}>
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    <p className="text-xs text-slate-light mt-0.5">{n.message}</p>
                    <p className="text-xs text-slate-light mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}