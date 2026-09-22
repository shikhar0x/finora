import React from "react";
import Icon, { type IconName } from "../ui/Icon";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  positive?: boolean;
  icon?: IconName;
}

export default function StatCard({
  label,
  value,
  change,
  positive = true,
  icon = "wallet",
}: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span>{label}</span>
        <span className="stat-icon" aria-hidden="true">
          <Icon name={icon} size={17} strokeWidth={2} />
        </span>
      </div>

      <strong>{value}</strong>

      <p className={positive ? "stat-change positive" : "stat-change negative"}>
        {change}
      </p>
    </article>
  );
}
