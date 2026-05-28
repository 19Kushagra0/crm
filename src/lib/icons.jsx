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

// Lucide TrendingUp (Trending Up Icon)
export const TrendingUp = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

// Lucide ArrowUp (Arrow Up Icon)
export const ArrowUp = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

// Lucide CheckCircle (Check Circle Icon)
export const CheckCircle = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// Lucide Sliders (Sliders/Tune Icon)
export const Sliders = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="2" y1="14" x2="6" y2="14" />
    <line x1="10" y1="8" x2="14" y2="8" />
    <line x1="18" y1="16" x2="22" y2="16" />
  </svg>
);

// Lucide Heart (Heart/Loyalty Icon)
export const Heart = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

// Lucide FileText (Report/Summary Icon)
export const FileText = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

// Lucide BookOpen (Book Open/Reservation Icon)
export const BookOpen = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

// Lucide AlertTriangle (At Risk Icon)
export const AlertTriangle = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

// Lucide UserPlus (New Customer Icon)
export const UserPlus = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

// Lucide Sparkles (Premium Icon)
export const Sparkles = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
    <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z" />
    <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
  </svg>
);

// Lucide Medal (Silver/Bronze Icon)
export const Medal = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
    <circle cx="12" cy="15" r="5" />
    <path d="M12 18v-2" />
  </svg>
);

// Lucide Plus
export const Plus = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

// Lucide Search
export const Search = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// Lucide Pencil (Edit)
export const Pencil = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

// Lucide Trash2 (Delete)
export const Trash2 = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

// Lucide ChevronLeft
export const ChevronLeft = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

// Lucide ChevronRight
export const ChevronRight = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// Lucide Lock
export const Lock = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// Lucide Unlock
export const Unlock = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);

// Lucide Save
export const Save = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

// Lucide LogOut
export const LogOut = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

// Lucide Mail
export const Mail = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

// Lucide MessageSquare
export const MessageSquare = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// Lucide ArrowRight
export const ArrowRight = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// Lucide Edit (Pencil in Square)
export const Edit = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
);

// Lucide CheckAll (Double Check)
export const CheckAll = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M17 6 7 17l-5-5" />
    <path d="m22 10-7.5 7.5L13 16" />
  </svg>
);

// Lucide Rocket
export const Rocket = ({ className, size = 24 }) => (
  <svg {...baseSvgProps} width={size} height={size} className={className}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

