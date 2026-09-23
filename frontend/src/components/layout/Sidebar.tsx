import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Icon, { type IconName } from "../ui/Icon";
import Modal from "../ui/Modal";

interface NavigationItem {
  label: string;
  path: string;
  icon: IconName;
}

const navigation: NavigationItem[] = [
  { label: "Dashboard", path: "/", icon: "dashboard" },
  { label: "Transactions", path: "/transactions", icon: "transactions" },
  { label: "Budgets", path: "/budgets", icon: "budget" },
  { label: "Goals", path: "/goals", icon: "goals" },
  { label: "Recurring", path: "/recurring", icon: "recurring" },
  { label: "Accounts", path: "/accounts", icon: "accounts" },
  { label: "Reports", path: "/reports", icon: "reports" },
];

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ isOpenMobile = false, onCloseMobile }: SidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      <aside className={`sidebar ${isOpenMobile ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">F</div>

          <div>
            <strong>Finora</strong>
            <span>Personal Finance</span>
          </div>

          {onCloseMobile && (
            <button
              type="button"
              className="sidebar-close-mobile-btn"
              onClick={onCloseMobile}
              aria-label="Close menu"
            >
              <Icon name="close" size={18} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav" aria-label="Main Navigation">
          <span className="nav-label">MAIN WORKSPACE</span>

          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <NavLink
            to="/settings"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon name="settings" size={17} />
            <span>Settings</span>
          </NavLink>

          <button
            className="logout-button"
            type="button"
            onClick={() => setShowLogoutModal(true)}
          >
            <Icon name="logout" size={17} />
            <span>Logout</span>
          </button>

          <div className="environment">
            <span className="environment-dot" aria-hidden="true" />
            <div>
              <strong>FA1 Live Workspace</strong>
              <small>Frontend Mock State</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Logout Information Modal */}
      {showLogoutModal && (
        <Modal
          title="Account Session"
          kicker="AUTHENTICATION"
          onClose={() => setShowLogoutModal(false)}
        >
          <div className="logout-modal-content">
            <p>
              You are currently using the <strong>Finora FA1 Demo Workspace</strong>. Full
              user session logout, registration, and credential authentication will be enabled
              in FA2 upon Spring Boot backend integration.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => setShowLogoutModal(false)}
              >
                Got It
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
