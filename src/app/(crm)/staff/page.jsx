"use client";
import React, { useState } from 'react';
import styles from '@/style/staff.module.css';
import { Clock } from '@/lib/icons';
import StaffService from '@/services/StaffService';

// Lightweight custom inline icons for performance
const PlusIcon = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const CalendarIcon = ({ className, size = 13 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const timelineData = [
  { name: "Elena Rostova", left: "33%", right: "8%", hasBreak: true, breakLeft: "40%" },
  { name: "Thomas Chen", left: "16%", right: "40%", hasBreak: true, breakLeft: "60%" },
  { name: "Sarah Jenkins", left: "50%", right: "0%", hasBreak: false }
];

const performanceData = [
  { name: "Elena Rostova", orders: 142, revenue: "$4,250", rating: "4.9", hours: "38.5", highlight: true },
  { name: "Marcus Kim", orders: 89, revenue: "$8,120", rating: "4.8", hours: "32.0", highlight: false },
  { name: "Thomas Chen", orders: "-", revenue: "-", rating: "4.9", hours: "42.5", highlight: false }
];

export default function StaffPage() {
  const [filter, setFilter] = useState('All');
  const staffList = StaffService.useStaff();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('Waiter');
  const [category, setCategory] = useState('Waiter');
  const [onShift, setOnShift] = useState(true);

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Initials calculation
    const words = name.trim().split(' ');
    const initials = words.map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'S';

    const newStaff = {
      id: Date.now(),
      name,
      initials,
      role,
      category,
      onShift,
      orders: 0,
      tables: 0,
      rating: "5.0★",
      tenure: "Since May 2026",
    };

    StaffService.addStaff(newStaff);
    setName('');
    setRole('Waiter');
    setCategory('Waiter');
    setOnShift(true);
    setShowAddModal(false);
  };

  const filteredStaff = filter === 'All'
    ? staffList
    : staffList.filter(s => s.category.toLowerCase() === filter.toLowerCase() || s.role.toLowerCase().includes(filter.toLowerCase()));

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.titleGroup}>
            
          </div>
          <div className={styles.headerActions}>
            <button className={styles.primaryBtn} onClick={() => setShowAddModal(true)}>
              <PlusIcon />
              Add Staff
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex' }}>
          <div className={styles.filterPills}>
            {['All', 'Manager', 'Waiter', 'Kitchen', 'Host'].map(tab => (
              <button
                key={tab}
                className={`${styles.filterTab} ${filter === tab ? styles.filterTabActive : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Grid */}
        <div className={styles.staffGrid}>
          {filteredStaff.map(staff => (
            <article key={staff.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.avatarCircle}>
                  {staff.initials}
                </div>
                {staff.onShift ? (
                  <button
                    type="button"
                    className={styles.badgeOnShift}
                    onClick={() => StaffService.toggleShiftStatus(staff.id)}
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    <span className={styles.badgeOnShiftDot} />
                    On Shift
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.badgeOff}
                    onClick={() => StaffService.toggleShiftStatus(staff.id)}
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    Off
                  </button>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h3 className={styles.cardTitle}>{staff.name}</h3>
                <span className={styles.roleBadge}>{staff.role}</span>
              </div>

              {/* Stats Row */}
              <div className={staff.onShift ? styles.cardStats : styles.cardStatsMuted}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>
                    {staff.customLabels?.ordersLabel || "Orders Today"}
                  </span>
                  <span className={styles.statValue}>{staff.orders}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>
                    {staff.customLabels?.tablesLabel || "Tables"}
                  </span>
                  <span className={styles.statValue}>{staff.tables}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>
                    {staff.customLabels?.ratingLabel || "Avg Rating"}
                  </span>
                  <span className={styles.statValue}>{staff.rating}</span>
                </div>
              </div>

              {/* Tenure Info */}
              <div className={styles.tenureText}>
                <CalendarIcon />
                <span>{staff.tenure}</span>
              </div>

              {/* Footer */}
              <div className={styles.cardFooter}>
                <a href="#" className={styles.viewProfileLink}>View Profile</a>
                <button className={styles.iconBtn} aria-label="View Shift Schedule">
                  <Clock size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Today's Shift Schedule */}
        <section className={styles.scheduleSection}>
          <h3 className={styles.sectionTitle}>Today's Shift</h3>
          <div className={styles.timelineContainer}>
            <div className={styles.timelineInner}>
              {/* Timeline Header */}
              <div className={styles.timelineHeader}>
                <div className={styles.timelineLabelSpacer} />
                <div className={styles.timelineHours}>
                  <span>12pm</span>
                  <span>2pm</span>
                  <span>4pm</span>
                  <span>6pm</span>
                  <span>8pm</span>
                  <span>10pm</span>
                  <span>12am</span>
                </div>
              </div>
              {/* Schedule Rows */}
              <div className={styles.scheduleRows}>
                {timelineData.map((row, index) => (
                  <div key={index} className={styles.scheduleRow}>
                    <div className={styles.scheduleRowName}>{row.name}</div>
                    <div className={styles.timelineTrack}>
                      <div 
                        className={styles.shiftBar}
                        style={{ left: row.left, right: row.right }}
                      >
                        {row.hasBreak && (
                          <div 
                            className={styles.breakGap} 
                            style={{ left: row.breakLeft }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Performance Summary */}
        <section className={styles.performanceSection}>
          <h3 className={styles.performanceTitle}>This Week's Performance</h3>
          <div className={styles.tableContainer}>
            <table className={styles.performanceTable}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th className={styles.tableHeaderCell}>Staff Name</th>
                  <th className={styles.tableHeaderCell}>Orders Handled</th>
                  <th className={styles.tableHeaderCell}>Revenue</th>
                  <th className={styles.tableHeaderCell}>Rating</th>
                  <th className={styles.tableHeaderCell}>Hours</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((row, index) => (
                  <tr 
                    key={index} 
                    className={row.highlight ? styles.tableRowHighlight : styles.tableRow}
                  >
                    <td className={styles.tableCellBold}>{row.name}</td>
                    <td className={styles.tableCellMono}>{row.orders}</td>
                    <td className={styles.tableCellMono}>{row.revenue}</td>
                    <td className={row.highlight ? styles.tableCellAmber : styles.tableCellMono}>
                      {row.rating}
                    </td>
                    <td className={styles.tableCellMuted}>{row.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Add Staff Member</h2>
            <form onSubmit={handleAddStaff}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  className={styles.formInput}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Broad Category</label>
                <select
                  className={styles.formSelect}
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (e.target.value === 'Manager') setRole('General Manager');
                    else if (e.target.value === 'Waiter') setRole('Waiter');
                    else if (e.target.value === 'Kitchen') setRole('Sous Chef');
                    else if (e.target.value === 'Host') setRole('Hostess');
                  }}
                >
                  <option value="Manager">Manager</option>
                  <option value="Waiter">Waiter</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Host">Host</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Specific Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Head Waiter, Sous Chef"
                  className={styles.formInput}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Initial Shift Status</label>
                <select
                  className={styles.formSelect}
                  value={onShift ? 'true' : 'false'}
                  onChange={(e) => setOnShift(e.target.value === 'true')}
                >
                  <option value="true">On Shift Today</option>
                  <option value="false">Off Shift Today</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalSaveBtn}>
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
