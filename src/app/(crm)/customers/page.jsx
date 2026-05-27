"use client";

import React, { useState, useEffect } from 'react';
import styles from '@/style/customers.module.css';
import { Star, Medal, UserPlus, Search, ChevronLeft, ChevronRight } from '@/lib/icons';
import CustomerService from '@/services/CustomerService';

const segments = [
  { name: 'All', icon: null },
  { name: 'Platinum', icon: Star },
  { name: 'VIP', icon: Medal },
  { name: 'Standard', icon: UserPlus }
];

export default function Page() {
  const customers = CustomerService.useCustomers();
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSegment]);

  const getBadgeClass = (tier) => {
    if (tier === 'Platinum') return styles.badgeGold;
    if (tier === 'VIP') return styles.badgeSilver;
    if (tier === 'Standard') return styles.badgeNew;
    return '';
  };

  const getInitials = (name) => {
    if (!name) return 'G';
    const parts = name.trim().split(/\s+/);
    return parts.map(p => p[0]).join('').substring(0, 2).toUpperCase() || 'G';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatLastVisit = (date) => {
    if (!date) return 'Never';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Never';
    
    const diffMs = Date.now() - d.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredCustomers = customers.filter(c => {
    if (selectedSegment !== 'All' && c.tier !== selectedSegment) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestTier, setNewGuestTier] = useState('Standard');

  const handleOpenAddClick = () => {
    setNewGuestName('');
    setNewGuestEmail('');
    setNewGuestPhone('');
    setNewGuestTier('Standard');
    setEditingCustomerId(null);
    setIsEditing(false);
    setShowAddModal(true);
  };

  const handleEditClick = (customer) => {
    setNewGuestName(customer.name);
    setNewGuestEmail(customer.email || '');
    setNewGuestPhone(customer.phone || '');
    setNewGuestTier(customer.tier);
    setEditingCustomerId(customer.id);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      CustomerService.deleteCustomer(id);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newGuestName.trim() || !newGuestEmail.trim() || !newGuestPhone.trim()) return;

    if (isEditing && editingCustomerId) {
      CustomerService.updateCustomer(editingCustomerId, {
        name: newGuestName.trim(),
        email: newGuestEmail.trim(),
        phone: newGuestPhone.trim(),
        tier: newGuestTier
      });
    } else {
      const newCust = {
        id: `CUST-${Date.now()}`,
        name: newGuestName.trim(),
        email: newGuestEmail.trim(),
        phone: newGuestPhone.trim(),
        tier: newGuestTier,
        visits: 1,
        lastVisit: new Date(),
        totalSpend: 0
      };
      CustomerService.addCustomer(newCust);
    }

    setNewGuestName('');
    setNewGuestEmail('');
    setNewGuestPhone('');
    setNewGuestTier('Standard');
    setEditingCustomerId(null);
    setIsEditing(false);
    setShowAddModal(false);
  };

  return (
    <main className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* Page Header */}
        <section className={styles.pageHeader} style={{ justifyContent: 'flex-end', paddingTop: 0 }}>
          <button className={styles.addBtn} onClick={handleOpenAddClick}>+ Add Customer</button>
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
              {paginatedCustomers.map((c, index) => (
                <div key={c.id} className={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <div className={styles.guestCell}>
                    {c.avatarUrl ? (
                      <img
                        alt="Customer Avatar"
                        className={styles.avatarImage}
                        src={c.avatarUrl}
                      />
                    ) : (
                      <div className={styles.avatar}>{getInitials(c.name)}</div>
                    )}
                    <div className={styles.guestInfo}>
                      <div className={styles.guestName}>{c.name}</div>
                      <div className={styles.guestContact}>
                        <div>{c.email}</div>
                        <div>{c.phone}</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.tierCell}>
                    <span className={getBadgeClass(c.tier)}>{c.tier}</span>
                  </div>
                  <div className={styles.visitsCell}>
                    <span className={styles.visitsValue}>{c.visits}</span>
                  </div>
                  <div className={styles.spentCell}>
                    <span className={styles.spentValue}>{formatCurrency(c.totalSpend)}</span>
                  </div>
                  <div className={styles.lastVisitCell}>
                    <span className={styles.lastVisitValue}>{formatLastVisit(c.lastVisit)}</span>
                  </div>
                  <div className={styles.actionCell} style={{ display: 'flex', gap: '16px' }}>
                    <button className={styles.actionBtn} onClick={() => handleEditClick(c)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteClick(c.id)}>Delete</button>
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
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  className={styles.paginationBtn}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <div className={styles.pageNumbers}>
                  {getPageNumbers().map((page, idx) => {
                    if (page === '...') {
                      return <span key={`ellipsis-${idx}`} className={styles.ellipsis}>…</span>;
                    }
                    return (
                      <button
                        key={`page-${page}`}
                        className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button 
                  className={styles.paginationBtn}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <ChevronRight size={16} />
                  </span>
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{isEditing ? "Edit Customer" : "Add Customer"}</h2>
            <form onSubmit={handleFormSubmit}>
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
                <label className={styles.formLabel}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. name@example.com"
                  className={styles.formInput}
                  value={newGuestEmail}
                  onChange={(e) => setNewGuestEmail(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  className={styles.formInput}
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tier Segment</label>
                <select
                  className={styles.formSelect}
                  value={newGuestTier}
                  onChange={(e) => setNewGuestTier(e.target.value)}
                >
                  <option value="Standard">Standard</option>
                  <option value="VIP">VIP</option>
                  <option value="Platinum">Platinum</option>
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
                  {isEditing ? "Save Changes" : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
