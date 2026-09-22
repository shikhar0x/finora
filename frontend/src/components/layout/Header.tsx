import React, { useState, useRef, useEffect } from "react";
import Icon from "../ui/Icon";
import { useFinance } from "../../context/FinanceContext";

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    title: "Food Budget Alert",
    desc: "You have used 73% of your monthly dining budget.",
    time: "2h ago",
    icon: "budget" as const,
  },
  {
    id: 2,
    title: "Salary Credited",
    desc: "₹50,000 corporate payroll credit recorded.",
    time: "1d ago",
    icon: "income" as const,
  },
  {
    id: 3,
    title: "Bill Reminder",
    desc: "Electricity utility bill due next week.",
    time: "2d ago",
    icon: "bell" as const,
  },
];

export default function Header({ onToggleMobileMenu }: HeaderProps) {
  const { userProfile } = useFinance();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const initials = userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="header">
      <div className="header-left">
        {onToggleMobileMenu && (
          <button
            type="button"
            className="mobile-menu-trigger"
            onClick={onToggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            <Icon name="menu" size={18} />
          </button>
        )}

        <span className="topbar-context">
          FINORA · PERSONAL FINANCE
        </span>

        <h1>Welcome back, {userProfile.name}</h1>
      </div>

      <div className="header-actions">
        {/* Notifications Popover */}
        <div className="notification-wrapper" ref={notifRef}>
          <button
            className={`icon-button ${showNotifications ? "active" : ""}`}
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="View notifications"
            aria-expanded={showNotifications}
          >
            <Icon name="bell" size={16} />
            <span className="notification-badge-dot" />
          </button>

          {showNotifications && (
            <div className="notifications-dropdown" role="menu">
              <div className="notifications-header">
                <strong>Notifications</strong>
                <span className="notif-count">3 New</span>
              </div>

              <div className="notifications-list">
                {SAMPLE_NOTIFICATIONS.map((item) => (
                  <div className="notification-item" key={item.id} role="menuitem">
                    <div className="notif-icon-circle">
                      <Icon name={item.icon} size={14} />
                    </div>
                    <div className="notif-text">
                      <strong>{item.title}</strong>
                      <p>{item.desc}</p>
                      <span className="notif-time">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div className="profile">
          <div className="avatar" aria-hidden="true">{initials}</div>

          <div>
            <strong>{userProfile.name}</strong>
            <span>{userProfile.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
