"use client";

import React, { useState } from 'react';
import styles from '@/style/customers.module.css';
import { Star, Medal, UserPlus, AlertTriangle, Search, ChevronLeft, ChevronRight } from '@/lib/icons';

const initialCustomers = [
  {
    id: 1,
    name: "Aisha Rahman",
    contact: "+91 98765 43210",
    avatar: "AR",
    tier: "Gold",
    visits: 42,
    spent: "₹1,24,000",
    lastVisit: "2 days ago",
  },
  {
    id: 2,
    name: "Vikram Singh",
    contact: "+91 99887 76655",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWl_UrByzEEFa5krYteX3iFyvF5Eux-jK_Y0uF0IVp1gDCwDfyJWnNZorq0ej4LX-iSRnDz43PczNx9Z3w20VURDkL20St9JTQme_OmssrIYFH_CGsnCNIvqIESKszDMnwa7HiQM3YcYgbI95Dl265gV8lIBFGQqpp6paLrpShgPPpDA5fH9UGJVwmvbnyR5VgqRaKRvc3OflqCPLrN-034u5MQuiYq8MF9MxIc1DLR4k5VEzHle2m2ZZRm6pcmq1j4vhFmQUpu8w",
    tier: "Silver",
    visits: 18,
    spent: "₹48,000",
    lastVisit: "3 days ago",
  },
  {
    id: 3,
    name: "Maya Nambiar",
    contact: "+91 91234 56789",
    avatar: "MN",
    tier: "At Risk",
    visits: 2,
    spent: "₹8,500",
    lastVisit: "4 months ago",
  },
  {
    id: 4,
    name: "Priya Desai",
    contact: "priya.d@example.com",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB91iaVNd-RmdcS99OkJDf1Nxh5VvhceiOqq17ZucjQ-OQU1ZVFKBssnVYfW0T5-Uyix4LTxXTC3nnrJgJJOkiZlWgNfgIu8B5wUsFP1P1rfyCeuJp975qVfeQbyG8omNCGmUjsOmR-mCo7UjPktGF2OXipmmpycJWHbwz6qZ5mEmAa6_0bZASM56NUGdanya4fiKDqYjJuB1PEvh77aZX7we0X_YPIJ83WcM5m7pUR_WOfP0upSYfU9rwPaaVwy8X6pMf5H54JKrA",
    tier: "New",
    visits: 1,
    spent: "₹12,000",
    lastVisit: "Yesterday",
  },
  {
    id: 5,
    name: "Rahul Joshi",
    contact: "+91 98888 11111",
    avatar: "RJ",
    tier: "Bronze",
    visits: 5,
    spent: "₹15,200",
    lastVisit: "2 weeks ago",
  }
];

const segments = [
  { name: 'All', icon: null },
  { name: 'Gold', icon: Star },
  { name: 'Silver', icon: Medal },
  { name: 'Bronze', icon: Medal },
  { name: 'New', icon: UserPlus },
  { name: 'At Risk', icon: AlertTriangle }
];

export default function Page() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const getBadgeClass = (tier) => {
    if (tier === 'Gold') return styles.badgeGold;
    if (tier === 'Silver') return styles.badgeSilver;
    if (tier === 'Bronze') return styles.badgeBronze;
    if (tier === 'New') return styles.badgeNew;
    if (tier === 'At Risk') return styles.badgeAtRisk;
    return '';
  };

  const filteredCustomers = customers.filter(c => {
    if (selectedSegment !== 'All' && c.tier !== selectedSegment) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q);
    }
    return true;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestContact, setNewGuestContact] = useState('');
  const [newGuestTier, setNewGuestTier] = useState('New');

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newGuestName.trim() || !newGuestContact.trim()) return;

    // Get initials for avatar
    const words = newGuestName.trim().split(' ');
    const avatar = words.map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'G';

    const newCust = {
      id: Date.now(),
      name: newGuestName,
      contact: newGuestContact,
      avatar,
      tier: newGuestTier,
      visits: newGuestTier === 'New' ? 1 : 0,
      spent: '₹0',
      lastVisit: 'Just now'
    };

    setCustomers([newCust, ...customers]);
    setNewGuestName('');
    setNewGuestContact('');
    setNewGuestTier('New');
    setShowAddModal(false);
  };

  return (
    <main className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* Page Header */}
        <section className={styles.pageHeader} style={{ justifyContent: 'flex-end', paddingTop: 0 }}>
          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>+ Add Customer</button>
        </section>

        {/* Search & Filters */}
        <section className={styles.controlsRow}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search by name, phone, email…"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className={styles.filtersWrapper}>
            {segments.map((seg) => {
              const Icon = seg.icon;
              const isActive = selectedSegment === seg.name;
              return (
                <button
                  key={seg.name}
                  className={`${styles.filterBadge} ${isActive ? styles.filterBadgeActive : ''}`}
                  onClick={() => setSelectedSegment(seg.name)}
                >
                  {Icon && <Icon size={16} />} {seg.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Customers Table container */}
        <section className={styles.tableContainer}>
          <div className={styles.tableInner}>
            {/* Table Header */}
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>Guest</div>
              <div className={styles.headerCell}>Tier</div>
              <div className={styles.headerCell}>Visits</div>
              <div className={styles.headerCell}>Total Spent</div>
              <div className={styles.headerCell}>Last Visit</div>
              <div className={styles.headerCell}>Action</div>
            </div>

            {/* Table Body */}
            <div className={styles.tableBody}>
              {filteredCustomers.map((c, index) => (
                <div key={c.id} className={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <div className={styles.guestCell}>
                    {c.avatarUrl ? (
                      <img
                        alt="Customer Avatar"
                        className={styles.avatarImage}
                        src={c.avatarUrl}
                      />
                    ) : (
                      <div className={styles.avatar}>{c.avatar}</div>
                    )}
                    <div className={styles.guestInfo}>
                      <div className={styles.guestName}>{c.name}</div>
                      <div className={styles.guestContact}>{c.contact}</div>
                    </div>
                  </div>
                  <div className={styles.tierCell}>
                    <span className={getBadgeClass(c.tier)}>{c.tier}</span>
                  </div>
                  <div className={styles.visitsCell}>
                    <span className={styles.visitsValue}>{c.visits}</span>
                  </div>
                  <div className={styles.spentCell}>
                    <span className={styles.spentValue}>{c.spent}</span>
                  </div>
                  <div className={styles.lastVisitCell}>
                    <span className={styles.lastVisitValue}>{c.lastVisit}</span>
                  </div>
                  <div className={styles.actionCell}>
                    <button className={styles.actionBtn}>View Profile</button>
                  </div>
                </div>
              ))}
              
              {filteredCustomers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888', gridColumn: '1 / -1', fontFamily: 'Inter, sans-serif' }}>
                  No customers found matching this segment or query.
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
              <button className={styles.paginationBtn}>
                <ChevronLeft size={16} />
                Previous
              </button>
              <div className={styles.pageNumbers}>
                <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
                <span className={styles.ellipsis}>…</span>
                <button className={styles.pageBtn}>42</button>
              </div>
              <button className={styles.paginationBtn}>
                Next
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <ChevronRight size={16} />
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Add Customer</h2>
            <form onSubmit={handleAddCustomer}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Guest Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aisha Rahman"
                  className={styles.formInput}
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Contact (Phone or Email)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98765 43210 or name@example.com"
                  className={styles.formInput}
                  value={newGuestContact}
                  onChange={(e) => setNewGuestContact(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tier Segment</label>
                <select
                  className={styles.formSelect}
                  value={newGuestTier}
                  onChange={(e) => setNewGuestTier(e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Bronze">Bronze</option>
                  <option value="At Risk">At Risk</option>
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
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
