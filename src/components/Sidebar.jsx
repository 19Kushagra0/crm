"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/style/sidebar.module.css';
import { 
  LayoutDashboard, 
  Receipt, 
  Utensils, 
  CalendarDays, 
  Monitor, 
  Users, 
  Award, 
  Megaphone, 
  Contact, 
  Clock,
  X 
} from '@/lib/icons';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close Sidebar">
        <X size={18} />
      </button>
      
      <div className={styles.brandSection}>
        <div>
          <h1 className={styles.brandTitle}>DineFlow</h1>
          <p className={styles.brandSubtitle}>Michelin Service</p>
        </div>
      </div>
      
      <nav className={styles.nav}>
        {/* Operations */}
        <div>
          <h2 className={styles.sectionTitle}>Operations</h2>
          <ul className={styles.menuList}>
            <li>
              <Link 
                className={isActive('/dashboard') ? styles.activeMenuItem : styles.menuItem} 
                href="/dashboard"
                onClick={onClose}
              >
                <span className={styles.menuIcon}><LayoutDashboard size={20} /></span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                className={isActive('/service') ? styles.activeMenuItem : styles.menuItem} 
                href="/service"
                onClick={onClose}
              >
                <span className={styles.menuIcon}><Clock size={20} /></span>
                Service
              </Link>
            </li>
            <li>
              <Link 
                className={isActive('/orders') ? styles.activeMenuItem : styles.menuItem} 
                href="/orders"
                onClick={onClose}
              >
                <span className={styles.menuIcon}><Receipt size={20} /></span>
                Orders
              </Link>
            </li>
            <li>
              <Link 
                className={isActive('/menu') ? styles.activeMenuItem : styles.menuItem} 
                href="/menu"
                onClick={onClose}
              >
                <span className={styles.menuIcon}><Utensils size={20} /></span>
                Menu
              </Link>
            </li>
            <li>
              <Link 
                className={isActive('/tables') ? styles.activeMenuItem : styles.menuItem} 
                href="/tables"
                onClick={onClose}
              >
                <span className={styles.menuIcon}><CalendarDays size={20} /></span>
                Tables
              </Link>
            </li>
            <li>
              <Link 
                className={isActive('/kds') ? styles.activeMenuItem : styles.menuItem} 
                href="/kds"
                onClick={onClose}
              >
                <span className={styles.menuIcon}><Monitor size={20} /></span>
                Kitchen Display
              </Link>
            </li>
          </ul>
        </div>
        {/* CRM */}
        <div>
          <h2 className={styles.sectionTitle}>CRM</h2>
          <ul className={styles.menuList}>
            <li>
              <Link 
                className={isActive('/customers') ? styles.activeMenuItem : styles.menuItem} 
                href="/customers"
                onClick={onClose}
              >
                <span className={styles.menuIcon}><Users size={20} /></span>
                Customers
              </Link>
            </li>
            <li>
              <Link 
                className={isActive('/loyalty') ? styles.activeMenuItem : styles.menuItem} 
                href="/loyalty"
                onClick={onClose}
              >
                <span className={styles.menuIcon}><Award size={20} /></span>
                Loyalty
              </Link>
            </li>
            <li>
              <Link 
                className={isActive('/campaigns') ? styles.activeMenuItem : styles.menuItem} 
                href="/campaigns"
                onClick={onClose}
              >
                <span className={styles.menuIcon}><Megaphone size={20} /></span>
                Campaigns
              </Link>
            </li>
          </ul>
        </div>
        {/* Business */}
        <div>
          <h2 className={styles.sectionTitle}>Business</h2>
          <ul className={styles.menuList}>
            <li>
              <Link 
                className={isActive('/staff') ? styles.activeMenuItem : styles.menuItem} 
                href="/staff"
                onClick={onClose}
              >
                <span className={styles.menuIcon}><Contact size={20} /></span>
                Staff
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className={styles.profileSection}>
        <div className={styles.profileContainer}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarText}>MC</div>
          </div>
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>Marie Curie</p>
            <div className={styles.profileStatus}>
              <span className={styles.statusDot} />
              <p className={styles.profileRole}>Maitre D'</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
