"use client";

import React from 'react';
import styles from '@/style/header.module.css';
import { Bell, Menu } from '@/lib/icons';
import { usePathname } from 'next/navigation';
import OrderService from '@/services/OrderService';
import TablesService from '@/services/TablesService';
import CustomerService from '@/services/CustomerService';

export default function Header({ onMenuToggle }) {
  const pathname = usePathname() || '';

  const activeOrders = OrderService.useActiveOrders();
  const tables = TablesService.useTables();
  const customers = CustomerService.useCustomers();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  let title = "Dashboard";
  let subtitle = formattedDate;

  if (pathname.startsWith('/service')) {
    title = "Service";
    subtitle = formattedDate;
  } else if (pathname.startsWith('/orders')) {
    title = "Orders";
    subtitle = `${activeOrders.length} active orders`;
  } else if (pathname.startsWith('/menu')) {
    title = "Menu";
    subtitle = "48 items across 6 categories";
  } else if (pathname.startsWith('/customers')) {
    title = "Customers";
    subtitle = `${customers.length} guests`;
  } else if (pathname.startsWith('/tables')) {
    title = "Tables";
    subtitle = `${tables.filter(t => t.status === 'occupied').length} of ${tables.length} tables occupied`;
  } else if (pathname.startsWith('/kds')) {
    title = "Kitchen Display";
    subtitle = `Dinner Service · ${activeOrders.length} tickets open`;
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
