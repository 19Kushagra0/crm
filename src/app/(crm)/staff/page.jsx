"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import styles from "@/style/staff.module.css";
import { Clock } from "@/lib/icons";
import StaffService from "@/services/StaffService";

// Lightweight custom inline icons for performance
const PlusIcon = ({ className, size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const CalendarIcon = ({ className, size = 13 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const TrashIcon = ({ className, size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

const timelineData = [
  {
    name: "Elena Rostova",
    left: "33%",
    right: "8%",
    hasBreak: true,
    breakLeft: "40%",
  },
  {
    name: "Thomas Chen",
    left: "16%",
    right: "40%",
    hasBreak: true,
    breakLeft: "60%",
  },
  { name: "Sarah Jenkins", left: "50%", right: "0%", hasBreak: false },
];

const performanceData = [
  {
    name: "Elena Rostova",
    orders: 142,
    revenue: "$4,250",
    rating: "4.9",
    hours: "38.5",
    highlight: true,
  },
  {
    name: "Marcus Kim",
    orders: 89,
    revenue: "$8,120",
    rating: "4.8",
    hours: "32.0",
    highlight: false,
  },
  {
    name: "Thomas Chen",
    orders: "-",
    revenue: "-",
    rating: "4.9",
    hours: "42.5",
    highlight: false,
  },
];

export default function StaffPage() {
  const { data: session } = useSession();
  const currentUserRole = session?.user?.role || "staff";

  const [filter, setFilter] = useState("All");
  const staffQueryResult = StaffService.useStaff();
  const staffList = staffQueryResult.data || [];
  const isLoading = staffQueryResult.isLoading;
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Waiter");
  const [category, setCategory] = useState("Waiter");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long");
      return;
    }

    setErrorMsg("");

    // Initials calculation
    const words = name.trim().split(" ");
    const initials =
      words
        .map((w) => w[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "S";

    const newStaff = {
      name: name.trim(),
      email: email.trim(),
      password,
      initials,
      role,
      category,
      onShift: false, // Default is false, flips on login
      orders: 0,
      tables: 0,
      rating: "5.0★",
      tenure: `Since ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
    };

    try {
      await StaffService.addStaff(newStaff);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("Waiter");
      setCategory("Waiter");
      setErrorMsg("");
      setShowAddModal(false);
    } catch (err) {
      setErrorMsg(err.message || "Failed to add staff member");
    }
  };

  const filteredStaff =
    filter === "All"
      ? staffList
      : staffList.filter(
          (s) =>
            s.category.toLowerCase() === filter.toLowerCase() ||
            s.role.toLowerCase().includes(filter.toLowerCase()),
        );

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.titleGroup}></div>
          <div className={styles.headerActions}>
            {currentUserRole !== "staff" && (
              <button
                className={styles.primaryBtn}
                onClick={() => setShowAddModal(true)}
              >
                <PlusIcon />
                Add Staff
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex" }}>
          <div className={styles.filterPills}>
            {["All", "Manager", "Waiter", "Kitchen", "Host"].map((tab) => (
              <button
                key={tab}
                className={`${styles.filterTab} ${filter === tab ? styles.filterTabActive : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Grid */}
        <div className={styles.staffGrid}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className={styles.cardLoading} />
              ))
            : filteredStaff.map((staff) => (
                <article key={staff.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div className={styles.avatarCircle}>{staff.initials}</div>
                    {staff.onShift ? (
                      <button
                        type="button"
                        className={styles.badgeOnShift}
                        onClick={() => {
                          if (currentUserRole !== "staff") {
                            StaffService.toggleShiftStatus(staff.id);
                          }
                        }}
                        style={{ border: "none", cursor: currentUserRole !== "staff" ? "pointer" : "default" }}
                      >
                        <span className={styles.badgeOnShiftDot} />
                        On Shift
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={styles.badgeOff}
                        onClick={() => {
                          if (currentUserRole !== "staff") {
                            StaffService.toggleShiftStatus(staff.id);
                          }
                        }}
                        style={{ border: "none", cursor: currentUserRole !== "staff" ? "pointer" : "default" }}
                      >
                        Off
                      </button>
                    )}
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <h3 className={styles.cardTitle}>{staff.name}</h3>
                    <span className={styles.roleBadge}>{staff.role}</span>
                  </div>

                  {/* Stats Row */}
                  <div
                    className={
                      staff.onShift ? styles.cardStats : styles.cardStatsMuted
                    }
                  >
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
                    <a href="#" className={styles.viewProfileLink}>
                      View Profile
                    </a>
                    
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {currentUserRole !== "staff" && (
                        (staff.category !== "Manager" || currentUserRole === "owner") ? (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove ${staff.name}? This will also delete their login account.`)) {
                                StaffService.deleteStaff(staff.id);
                              }
                            }}
                            className={styles.iconBtn}
                            style={{ color: "#ba1a1a", borderColor: "rgba(186, 26, 26, 0.2)" }}
                            title={`Remove ${staff.name}`}
                            aria-label={`Remove ${staff.name}`}
                          >
                            <TrashIcon size={16} />
                          </button>
                        ) : null
                      )}

                      <button
                        className={styles.iconBtn}
                        aria-label="View Shift Schedule"
                      >
                        <Clock size={16} />
                      </button>
                    </div>
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
                    className={
                      row.highlight ? styles.tableRowHighlight : styles.tableRow
                    }
                  >
                    <td className={styles.tableCellBold}>{row.name}</td>
                    <td className={styles.tableCellMono}>{row.orders}</td>
                    <td className={styles.tableCellMono}>{row.revenue}</td>
                    <td
                      className={
                        row.highlight
                          ? styles.tableCellAmber
                          : styles.tableCellMono
                      }
                    >
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
        <div
          className={styles.modalOverlay}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>Add Staff Member</h2>
            
            {errorMsg && (
              <div style={{ color: "#ffdad6", backgroundColor: "rgba(186, 26, 26, 0.8)", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>
                {errorMsg}
              </div>
            )}

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
                <label className={styles.formLabel}>Login Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. elena@dineflow.com"
                  className={styles.formInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  className={styles.formInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Confirm password"
                  className={styles.formInput}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Broad Category</label>
                <select
                  className={styles.formSelect}
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (e.target.value === "Manager")
                      setRole("General Manager");
                    else if (e.target.value === "Waiter") setRole("Waiter");
                    else if (e.target.value === "Kitchen") setRole("Sous Chef");
                    else if (e.target.value === "Host") setRole("Hostess");
                  }}
                >
                  {currentUserRole === "owner" && <option value="Manager">Manager</option>}
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
