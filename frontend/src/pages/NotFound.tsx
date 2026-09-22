import React from "react";
import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon";

export default function NotFound() {
  return (
    <section className="page">
      <div className="empty-dashboard not-found-card">
        <div className="empty-icon-circle">
          <Icon name="info" size={32} />
        </div>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="primary-button add-btn" style={{ marginTop: "18px" }}>
          <Icon name="dashboard" size={16} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </section>
  );
}
