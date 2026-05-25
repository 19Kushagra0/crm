import React from 'react';

// Base SVG configurations for Lucide Icons
const baseSvgProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// Lucide Bell (Notification Icon)
export const Bell = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

// Lucide LayoutDashboard (Dashboard Icon)
export const LayoutDashboard = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

// Lucide Receipt (Orders Icon)
export const Receipt = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
    <path d="M16 8H8" />
    <path d="M16 12H8" />
    <path d="M15 16H8" />
  </svg>
);

// Lucide Utensils (Menu Icon)
export const Utensils = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v8c0 1.1.9 2 2 2h3Z" />
    <path d="M19 17v5" />
  </svg>
);

// Lucide CalendarDays (Tables Icon)
export const CalendarDays = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);

// Lucide Monitor (Kitchen Display Icon)
export const Monitor = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
);

// Lucide Users (Customers Icon)
export const Users = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// Lucide Award (Loyalty Icon)
export const Award = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

// Lucide Megaphone (Campaigns Icon)
export const Megaphone = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="m3 11 18-5v12L3 14v-3z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);

// Lucide BarChart3 (Analytics Icon)
export const BarChart3 = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

// Lucide Contact / UserSquare (Staff Icon)
export const Contact = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M16 2h2v20h-2z" />
    <path d="M18 6h3" />
    <path d="M18 11h2" />
    <path d="M18 16h3" />
    <rect x="2" y="2" width="14" height="20" rx="2" />
    <circle cx="9" cy="9" r="3" />
    <path d="M3 19c0-2.5 3-3 6-3s6 .5 6 3" />
  </svg>
);

// Lucide Settings (Settings Icon)
export const Settings = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Lucide Clock (Timer Icon)
export const Clock = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// Lucide Star (Star Icon)
export const Star = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Lucide Menu (Hamburger Mobile Menu Icon)
export const Menu = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

// Lucide X (Close Drawer Icon)
export const X = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <line x1="18" x2="6" y1="6" y2="18" />
    <line x1="6" x2="18" y1="6" y2="18" />
  </svg>
);
