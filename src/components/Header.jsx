import React from 'react';
import styles from '@/style/header.module.css';
import { Bell, Menu } from '@/lib/icons';

export default function Header({ onMenuToggle }) {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Open Sidebar">
          <Menu size={20} />
        </button>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Saturday, 24 May 2026</p>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.notificationBtn} aria-label="Notifications">
          <Bell size={20} />
        </button>
        <button className={styles.newOrderBtn}>
          New Order
        </button>
      </div>
    </header>
  );
}
