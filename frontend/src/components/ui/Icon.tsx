import React from "react";

export type IconName =
  | "dashboard"
  | "transactions"
  | "budget"
  | "reports"
  | "settings"
  | "logout"
  | "bell"
  | "wallet"
  | "income"
  | "expense"
  | "savings"
  | "plus"
  | "minus"
  | "arrow-right"
  | "arrow-left"
  | "chevron-down"
  | "chevron-up"
  | "chevron-left"
  | "chevron-right"
  | "search"
  | "close"
  | "calendar"
  | "category"
  | "credit-card"
  | "cash"
  | "bank"
  | "check"
  | "filter"
  | "trash"
  | "edit"
  | "pie-chart"
  | "bar-chart"
  | "trending-up"
  | "trending-down"
  | "user"
  | "mail"
  | "shield"
  | "moon"
  | "sun"
  | "refresh"
  | "menu"
  | "info"
  | "alert-triangle"
  | "rupee"
  | "dollar-sign"
  | "tag";

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  className = "",
}: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );

    case "transactions":
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h10" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );

    case "budget":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18" />
          <path d="M7 15h3" />
        </svg>
      );

    case "reports":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h17" />
          <path d="m7 15 4-4 3 2 5-6" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );

    case "logout":
      return (
        <svg {...common}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "wallet":
      return (
        <svg {...common}>
          <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
          <path d="M4 8h14a2 2 0 0 1 2 2v2h-5a2 2 0 0 0 0 4h5" />
          <path d="M15 14h.01" />
        </svg>
      );

    case "income":
      return (
        <svg {...common}>
          <path d="M12 19V5" />
          <path d="m6 11 6-6 6 6" />
        </svg>
      );

    case "expense":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="m6 13 6 6 6-6" />
        </svg>
      );

    case "savings":
      return (
        <svg {...common}>
          <path d="M4 8h16v11H4z" />
          <path d="M7 8V5h10v3" />
          <path d="M8 12h8" />
          <path d="M10 16h4" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );

    case "minus":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
        </svg>
      );

    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "arrow-left":
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="m11 18-6-6 6-6" />
        </svg>
      );

    case "chevron-down":
      return (
        <svg {...common}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      );

    case "chevron-up":
      return (
        <svg {...common}>
          <polyline points="18 15 12 9 6 15" />
        </svg>
      );

    case "chevron-left":
      return (
        <svg {...common}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      );

    case "chevron-right":
      return (
        <svg {...common}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );

    case "category":
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );

    case "credit-card":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18" />
          <path d="M7 15h3" />
        </svg>
      );

    case "cash":
      return (
        <svg {...common}>
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M6 12h.01M18 12h.01" />
        </svg>
      );

    case "bank":
      return (
        <svg {...common}>
          <path d="m2 9 10-6 10 6v2H2z" />
          <path d="M6 11v6M10 11v6M14 11v6M18 11v6" />
          <path d="M2 19h20v2H2z" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );

    case "filter":
      return (
        <svg {...common}>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      );

    case "trash":
      return (
        <svg {...common}>
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      );

    case "edit":
      return (
        <svg {...common}>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      );

    case "pie-chart":
      return (
        <svg {...common}>
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
          <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
      );

    case "bar-chart":
      return (
        <svg {...common}>
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
      );

    case "trending-up":
      return (
        <svg {...common}>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      );

    case "trending-down":
      return (
        <svg {...common}>
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
          <polyline points="17 18 23 18 23 12" />
        </svg>
      );

    case "user":
      return (
        <svg {...common}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

    case "mail":
      return (
        <svg {...common}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );

    case "moon":
      return (
        <svg {...common}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );

    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      );

    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );

    case "alert-triangle":
      return (
        <svg {...common}>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );

    case "rupee":
      return (
        <svg {...common}>
          <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4 4 0 0 0 0-8H6" />
        </svg>
      );

    case "dollar-sign":
      return (
        <svg {...common}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );

    case "tag":
      return (
        <svg {...common}>
          <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
          <path d="M7 7h.01" />
        </svg>
      );

    default:
      return null;
  }
}
