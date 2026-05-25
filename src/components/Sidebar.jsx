import React from 'react';
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
  BarChart3, 
  Contact, 
  Settings, 
  X 
} from '@/lib/icons';

export default function Sidebar({ isOpen, onClose }) {
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
              <a className={styles.activeMenuItem} href="#">
                <span className={styles.menuIcon}><LayoutDashboard size={20} /></span>
                Dashboard
              </a>
            </li>
            <li>
              <a className={styles.menuItem} href="#">
                <span className={styles.menuIcon}><Receipt size={20} /></span>
                Orders
              </a>
            </li>
            <li>
              <a className={styles.menuItem} href="#">
                <span className={styles.menuIcon}><Utensils size={20} /></span>
                Menu
              </a>
            </li>
            <li>
              <a className={styles.menuItem} href="#">
                <span className={styles.menuIcon}><CalendarDays size={20} /></span>
                Tables
              </a>
            </li>
            <li>
              <a className={styles.menuItem} href="#">
                <span className={styles.menuIcon}><Monitor size={20} /></span>
                Kitchen Display
              </a>
            </li>
          </ul>
        </div>
        {/* CRM */}
        <div>
          <h2 className={styles.sectionTitle}>CRM</h2>
          <ul className={styles.menuList}>
            <li>
              <a className={styles.menuItem} href="#">
                <span className={styles.menuIcon}><Users size={20} /></span>
                Customers
              </a>
            </li>
            <li>
              <a className={styles.menuItem} href="#">
                <span className={styles.menuIcon}><Award size={20} /></span>
                Loyalty
              </a>
            </li>
            <li>
              <a className={styles.menuItem} href="#">
                <span className={styles.menuIcon}><Megaphone size={20} /></span>
                Campaigns
              </a>
            </li>
          </ul>
        </div>
        {/* Business */}
        <div>
          <h2 className={styles.sectionTitle}>Business</h2>
          <ul className={styles.menuList}>
            <li>
              <a className={styles.menuItem} href="#">
                <span className={styles.menuIcon}><BarChart3 size={20} /></span>
                Analytics
              </a>
            </li>
            <li>
              <a className={styles.menuItem} href="#">
                <span className={styles.menuIcon}><Contact size={20} /></span>
                Staff
              </a>
            </li>
            <li>
              <a className={styles.menuItem} href="#">
                <span className={styles.menuIcon}><Settings size={20} /></span>
                Settings
              </a>
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
