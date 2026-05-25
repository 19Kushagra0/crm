import React from 'react';
import styles from '@/style/header.module.css';
import { Bell, Menu } from '@/lib/icons';
import { usePathname } from 'next/navigation';

export default function Header({ onMenuToggle }) {
  const pathname = usePathname() || '';

  let title = "Dashboard";
  let subtitle = "Saturday, 24 May 2026";

  if (pathname.startsWith('/service')) {
    title = "Service";
    subtitle = "Saturday, 24 May 2026";
  } else if (pathname.startsWith('/orders')) {
    title = "Orders";
    subtitle = "14 active orders";
  } else if (pathname.startsWith('/menu')) {
    title = "Menu";
    subtitle = "48 items across 6 categories";
  } else if (pathname.startsWith('/customers')) {
    title = "Customers";
    subtitle = "1,247 guests · 84 active this month";
  } else if (pathname.startsWith('/tables')) {
    title = "Tables";
    subtitle = "9 of 14 tables occupied · Next reservation in 28 min";
  } else if (pathname.startsWith('/kds')) {
    title = "Kitchen Display";
    subtitle = "Dinner Service · 19:42 · 9 tickets open";
  } else if (pathname.startsWith('/staff')) {
    title = "Staff";
    subtitle = "12 staff members · 8 on shift today";
  } else if (pathname.startsWith('/campaigns')) {
    title = "Campaigns";
    subtitle = "3 active · 12 sent this month · 68% avg open rate";
  }

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Open Sidebar">
          <Menu size={20} />
        </button>
        <div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.notificationBtn} aria-label="Notifications">
          <Bell size={20} />
        </button>
        {!pathname.startsWith('/menu') && (
          <button className={styles.newOrderBtn}>
            New Order
          </button>
        )}
      </div>
    </header>
  );
}
