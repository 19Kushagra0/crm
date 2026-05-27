"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/style/header.module.css';
import modalStyles from '@/style/modal.module.css';
import { Menu, Plus, CalendarDays, Users, FileText } from '@/lib/icons';
import { usePathname } from 'next/navigation';
import OrderService from '@/services/OrderService';
import TablesService from '@/services/TablesService';
import CustomerService from '@/services/CustomerService';
import ReservationService from '@/services/ReservationService';
import ShiftNoteService from '@/services/ShiftNoteService';
import UIService from '@/services/UIService';
import Modal from '@/components/Modal';
import StaffService from '@/services/StaffService';

export default function Header({ onMenuToggle }) {
  const pathname = usePathname() || '';
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeOrdersQueryResult = OrderService.useActiveOrders();
  const activeOrders = activeOrdersQueryResult.data || [];

  const tablesQueryResult = TablesService.useTables();
  const tables = tablesQueryResult.data || [];

  const customersQueryResult = CustomerService.useCustomers();
  const customers = customersQueryResult.data || [];

  const staffQueryResult = StaffService.useStaff();
  const staff = staffQueryResult.data || [];

  // Modals state
  const activeModal = UIService.useActiveModal();
  const setActiveModal = (type) => type ? UIService.openModal(type) : UIService.closeModal();

  // New Reservation Form State
  const [resName, setResName] = useState('');
  const [resPartySize, setResPartySize] = useState('2');
  const [resTime, setResTime] = useState('19:30');
  const [resNotes, setResNotes] = useState('');
  const [resCustomerId, setResCustomerId] = useState('');
  const [resSearchQuery, setResSearchQuery] = useState('');
  const [showResSearchResults, setShowResSearchResults] = useState(false);

  // Parse resTime ("19:30") to 12-hour components
  const parseResTime = () => {
    if (!resTime) return { hour: 7, minute: "30", ampm: "PM" };
    const [hour24Str, minuteStr] = resTime.split(':');
    const hour24 = parseInt(hour24Str, 10) || 0;
    const ampm = hour24 >= 12 ? "PM" : "AM";
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    return {
      hour: hour12,
      minute: minuteStr || "00",
      ampm
    };
  };

  const { hour: selectedHour, minute: selectedMinute, ampm: selectedAmPm } = parseResTime();

  const handleTimeChange = (h, m, ampm) => {
    let hour24 = parseInt(h, 10);
    if (ampm === "PM" && hour24 < 12) hour24 += 12;
    if (ampm === "AM" && hour24 === 12) hour24 = 0;
    const hourStr = hour24.toString().padStart(2, '0');
    setResTime(`${hourStr}:${m}`);
  };

  // Seat Walk-In Form State
  const [walkInTableId, setWalkInTableId] = useState('');
  const [walkInPartySize, setWalkInPartySize] = useState('2');
  const [walkInTab, setWalkInTab] = useState('anonymous'); // 'anonymous' | 'search' | 'new'
  const [walkInCustomerId, setWalkInCustomerId] = useState('');
  const [walkInSearchQuery, setWalkInSearchQuery] = useState('');
  const [showWalkInSearchResults, setShowWalkInSearchResults] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInEmail, setWalkInEmail] = useState('');

  // Shift Note Form State
  const [noteContent, setNoteContent] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('');

  // Automatically select the default author when Shift Note modal is opened
  useEffect(() => {
    if (activeModal === 'SHIFT_NOTE' && !noteAuthor && staff && staff.length > 0) {
      const activeStaff = staff.filter(s => s.onShift);
      const defaultStaff = activeStaff.length > 0 ? activeStaff[0] : staff[0];
      if (defaultStaff) {
        setNoteAuthor(`${defaultStaff.name} (${defaultStaff.role})`);
      }
    }
  }, [activeModal, staff, noteAuthor]);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Preselect first available table on mount or when tables change
  const availableTables = tables.filter(t => t.status === 'available');
  useEffect(() => {
    if (availableTables.length > 0 && !walkInTableId) {
      setWalkInTableId(availableTables[0].id);
    }
  }, [tables, walkInTableId, availableTables]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCreateMenuOpen(false);
      }
    }

    if (isCreateMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCreateMenuOpen]);

  const handleCreateAction = (action) => {
    if (action === 'reservation') {
      setActiveModal('RESERVATION');
    } else if (action === 'walk-in') {
      setActiveModal('WALK_IN');
    } else if (action === 'shift-note') {
      setActiveModal('SHIFT_NOTE');
    }
    setIsCreateMenuOpen(false);
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    if (!resName.trim() || !resTime.trim()) return;

    const detailsStr = `Party of ${resPartySize}${resNotes.trim() ? ` • ${resNotes.trim()}` : ''}`;
    ReservationService.addReservation({
      guest: resName.trim(),
      details: detailsStr,
      time: resTime.trim(),
      status: 'CONFIRMED',
      customerId: resCustomerId || undefined
    });

    // Reset state & close
    setResName('');
    setResPartySize('2');
    setResTime('19:30');
    setResNotes('');
    setResCustomerId('');
    setResSearchQuery('');
    setActiveModal(null);
  };

  const handleWalkInSubmit = (e) => {
    e.preventDefault();
    const tableId = walkInTableId || (availableTables[0]?.id);
    if (!tableId) return;

    let finalCustomerId = undefined;

    if (walkInTab === 'new' && walkInName.trim()) {
      const newCustId = `CUST-${Date.now()}`;
      const newCust = {
        id: newCustId,
        name: walkInName.trim(),
        email: walkInEmail.trim() || `${walkInName.trim().toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: walkInPhone.trim() || 'N/A',
        tier: 'Standard',
        visits: 1,
        lastVisit: new Date(),
        totalSpend: 0
      };
      CustomerService.addCustomer(newCust);
      finalCustomerId = newCustId;
    } else if (walkInTab === 'search' && walkInCustomerId) {
      finalCustomerId = walkInCustomerId;
    }

    if (finalCustomerId) {
      // Seat customer (transitions table to occupied and links currentCustomerId)
      TablesService.seatCustomer(tableId, finalCustomerId);
    } else {
      // Transition table to occupied anonymously
      TablesService.setTableStatus(tableId, 'occupied');
    }

    // Create walk-in order (which now stores the customerId!)
    OrderService.createWalkInOrder(tableId, parseInt(walkInPartySize, 10) || 2, finalCustomerId);

    // Reset state & close
    setWalkInTableId('');
    setWalkInPartySize('2');
    setWalkInTab('anonymous');
    setWalkInCustomerId('');
    setWalkInSearchQuery('');
    setWalkInName('');
    setWalkInPhone('');
    setWalkInEmail('');
    setActiveModal(null);
  };

  const handleShiftNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    ShiftNoteService.addNote({
      content: noteContent.trim(),
      author: noteAuthor.trim() || 'Manager'
    });

    // Reset state & close
    setNoteContent('');
    setNoteAuthor('');
    setActiveModal(null);
  };


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
    subtitle = `${staff.length} staff members · ${staff.filter(s => s.onShift).length} on shift today`;
  } else if (pathname.startsWith('/campaigns')) {
    title = "Campaigns";
    subtitle = "3 active · 12 sent this month · 68% avg open rate";
  } else if (pathname.startsWith('/loyalty')) {
    title = "Loyalty & Rewards";
    subtitle = "Points, tier management & rewards program";
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Open Sidebar">
            <Menu size={20} />
          </button>
          <div>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle} suppressHydrationWarning>{subtitle}</p>
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.dropdownContainer} ref={dropdownRef}>
            <button 
              className={styles.createBtn} 
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              aria-expanded={isCreateMenuOpen}
              aria-haspopup="true"
            >
              <Plus size={16} className={styles.createBtnIcon} />
              <span>Create</span>
            </button>
            
            {isCreateMenuOpen && (
              <div className={styles.dropdownMenu}>
                <button className={styles.dropdownItem} onClick={() => handleCreateAction('reservation')}>
                  <CalendarDays size={16} className={styles.dropdownItemIcon} />
                  <span>New Reservation</span>
                </button>
                <button className={styles.dropdownItem} onClick={() => handleCreateAction('walk-in')}>
                  <Users size={16} className={styles.dropdownItemIcon} />
                  <span>Seat Walk-In</span>
                </button>
                <button className={styles.dropdownItem} onClick={() => handleCreateAction('shift-note')}>
                  <FileText size={16} className={styles.dropdownItemIcon} />
                  <span>Shift Note</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* NEW RESERVATION MODAL */}
      <Modal 
        isOpen={activeModal === 'RESERVATION'} 
        onClose={() => {
          setResCustomerId('');
          setResName('');
          setResSearchQuery('');
          setActiveModal(null);
        }} 
        title="New Reservation"
      >
        <form onSubmit={handleReservationSubmit} className={modalStyles.form} id="new-reservation-form">
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="guest-name">Guest Name</label>
            {resCustomerId ? (
              <div className={styles.linkedBadge}>
                <div className={styles.linkedInfo}>
                  <span className={styles.linkedGuestName}>{resName}</span>
                  <span className={styles.linkedGuestMeta}>
                    {customers.find(c => c.id === resCustomerId)?.phone} • {customers.find(c => c.id === resCustomerId)?.tier} Segment
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.unlinkBtn}
                  onClick={() => {
                    setResCustomerId('');
                    setResName('');
                    setResSearchQuery('');
                  }}
                >
                  Unlink
                </button>
              </div>
            ) : (
              <>
                <input 
                  type="text" 
                  id="guest-name" 
                  className={modalStyles.input} 
                  placeholder="e.g. John Doe"
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  required
                />
                
                <div className={styles.searchGroup} style={{ marginTop: '8px' }}>
                  <label className={modalStyles.label} style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Or Search CRM Guest to Link
                  </label>
                  <input
                    type="text"
                    className={modalStyles.input}
                    placeholder="Search by name or phone..."
                    value={resSearchQuery}
                    onChange={(e) => {
                      setResSearchQuery(e.target.value);
                      setShowResSearchResults(true);
                    }}
                    onFocus={() => setShowResSearchResults(true)}
                  />
                  {showResSearchResults && resSearchQuery.trim() && (
                    <div className={styles.searchResultsList}>
                      {customers
                        .filter(c => 
                          c.name.toLowerCase().includes(resSearchQuery.toLowerCase()) || 
                          c.phone.includes(resSearchQuery)
                        )
                        .slice(0, 5)
                        .map(c => (
                          <button
                            key={c.id}
                            type="button"
                            className={styles.searchResultItem}
                            onClick={() => {
                              setResCustomerId(c.id);
                              setResName(c.name);
                              setShowResSearchResults(false);
                            }}
                          >
                            <div>
                              <div className={styles.searchResultName}>{c.name}</div>
                              <div className={styles.searchResultPhone}>{c.phone}</div>
                            </div>
                            <span className={`${styles.searchResultTier} ${
                              c.tier === 'Platinum' ? styles.tierPlatinum :
                              c.tier === 'VIP' ? styles.tierVip :
                              styles.tierStandard
                            }`}>
                              {c.tier}
                            </span>
                          </button>
                        ))}
                      {customers.filter(c => 
                        c.name.toLowerCase().includes(resSearchQuery.toLowerCase()) || 
                        c.phone.includes(resSearchQuery)
                      ).length === 0 && (
                        <div style={{ padding: '8px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
                          No guests found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="party-size">Party Size</label>
            <select 
              id="party-size" 
              className={modalStyles.select}
              value={resPartySize}
              onChange={(e) => setResPartySize(e.target.value)}
            >
              <option value="1">1 Person</option>
              <option value="2">2 People</option>
              <option value="3">3 People</option>
              <option value="4">4 People</option>
              <option value="5">5 People</option>
              <option value="6">6 People</option>
              <option value="8">8 People</option>
              <option value="10">10+ People</option>
            </select>
          </div>
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label}>Reservation Time</label>
            <div className={styles.timeSelectorRow}>
              <select
                className={styles.timeDropdown}
                value={selectedHour.toString().padStart(2, '0')}
                onChange={(e) => handleTimeChange(e.target.value, selectedMinute, selectedAmPm)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                  <option key={h} value={h.toString().padStart(2, '0')}>{h}</option>
                ))}
              </select>
              <span className={styles.timeColon}>:</span>
              <select
                className={styles.timeDropdown}
                value={selectedMinute}
                onChange={(e) => handleTimeChange(selectedHour, e.target.value, selectedAmPm)}
              >
                {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                className={styles.timeAmPmDropdown}
                value={selectedAmPm}
                onChange={(e) => handleTimeChange(selectedHour, selectedMinute, e.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="special-notes">Special Notes (Optional)</label>
            <input 
              type="text" 
              id="special-notes" 
              className={modalStyles.input} 
              placeholder="e.g. Anniversary / Window Table"
              value={resNotes}
              onChange={(e) => setResNotes(e.target.value)}
            />
          </div>
          <div className={modalStyles.footer}>
            <button 
              type="button" 
              className={modalStyles.cancelBtn} 
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={modalStyles.submitBtn}
            >
              Confirm Reservation
            </button>
          </div>
        </form>
      </Modal>

      {/* SEAT WALK-IN MODAL */}
      <Modal 
        isOpen={activeModal === 'WALK_IN'} 
        onClose={() => setActiveModal(null)} 
        title="Seat Walk-In"
      >
        <form onSubmit={handleWalkInSubmit} className={modalStyles.form} id="seat-walk-in-form">
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="walk-in-table">Select Available Table</label>
            {availableTables.length > 0 ? (
              <select 
                id="walk-in-table" 
                className={modalStyles.select}
                value={walkInTableId}
                onChange={(e) => setWalkInTableId(e.target.value)}
                required
              >
                {availableTables.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.id} - {t.zone} Zone ({t.seats} seats)
                  </option>
                ))}
              </select>
            ) : (
              <p style={{ color: '#8f482f', fontSize: '14px', margin: '4px 0 0 0', fontWeight: '500' }}>
                No tables currently available for walk-ins.
              </p>
            )}
          </div>
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="walk-in-size">Party Size</label>
            <select 
              id="walk-in-size" 
              className={modalStyles.select}
              value={walkInPartySize}
              onChange={(e) => setWalkInPartySize(e.target.value)}
            >
              <option value="1">1 Person</option>
              <option value="2">2 People</option>
              <option value="3">3 People</option>
              <option value="4">4 People</option>
              <option value="5">5 People</option>
              <option value="6">6 People</option>
              <option value="8">8 People</option>
            </select>
          </div>

          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label}>Guest Profile Association</label>
            <div className={styles.tabsContainer}>
              <button
                type="button"
                className={`${styles.tabBtn} ${walkInTab === 'anonymous' ? styles.tabBtnActive : ''}`}
                onClick={() => setWalkInTab('anonymous')}
              >
                Anonymous Walk-in
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${walkInTab === 'search' ? styles.tabBtnActive : ''}`}
                onClick={() => setWalkInTab('search')}
              >
                Link Existing Guest
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${walkInTab === 'new' ? styles.tabBtnActive : ''}`}
                onClick={() => setWalkInTab('new')}
              >
                New Profile
              </button>
            </div>

            {walkInTab === 'search' && (
              <div className={styles.searchGroup}>
                {walkInCustomerId ? (
                  <div className={styles.linkedBadge}>
                    <div className={styles.linkedInfo}>
                      <span className={styles.linkedGuestName}>
                        {customers.find(c => c.id === walkInCustomerId)?.name}
                      </span>
                      <span className={styles.linkedGuestMeta}>
                        {customers.find(c => c.id === walkInCustomerId)?.phone} • {customers.find(c => c.id === walkInCustomerId)?.tier}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.unlinkBtn}
                      onClick={() => {
                        setWalkInCustomerId('');
                        setWalkInSearchQuery('');
                      }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      className={modalStyles.input}
                      placeholder="Search existing guest by name or phone..."
                      value={walkInSearchQuery}
                      onChange={(e) => {
                        setWalkInSearchQuery(e.target.value);
                        setShowWalkInSearchResults(true);
                      }}
                      onFocus={() => setShowWalkInSearchResults(true)}
                    />
                    {showWalkInSearchResults && walkInSearchQuery.trim() && (
                      <div className={styles.searchResultsList}>
                        {customers
                          .filter(c => 
                            c.name.toLowerCase().includes(walkInSearchQuery.toLowerCase()) || 
                            c.phone.includes(walkInSearchQuery)
                          )
                          .slice(0, 5)
                          .map(c => (
                            <button
                              key={c.id}
                              type="button"
                              className={styles.searchResultItem}
                              onClick={() => {
                                setWalkInCustomerId(c.id);
                                setShowWalkInSearchResults(false);
                              }}
                            >
                              <div>
                                <div className={styles.searchResultName}>{c.name}</div>
                                <div className={styles.searchResultPhone}>{c.phone}</div>
                              </div>
                              <span className={`${styles.searchResultTier} ${
                                c.tier === 'Platinum' ? styles.tierPlatinum :
                                c.tier === 'VIP' ? styles.tierVip :
                                styles.tierStandard
                              }`}>
                                {c.tier}
                              </span>
                            </button>
                          ))}
                        {customers.filter(c => 
                          c.name.toLowerCase().includes(walkInSearchQuery.toLowerCase()) || 
                          c.phone.includes(walkInSearchQuery)
                        ).length === 0 && (
                          <div style={{ padding: '8px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
                            No guests found
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {walkInTab === 'new' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text"
                  className={modalStyles.input}
                  placeholder="Full Name"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  className={modalStyles.input}
                  placeholder="Phone Number (e.g. +91 99999 88888)"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  required
                />
                <input
                  type="email"
                  className={modalStyles.input}
                  placeholder="Email Address (Optional)"
                  value={walkInEmail}
                  onChange={(e) => setWalkInEmail(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className={modalStyles.footer}>
            <button 
              type="button" 
              className={modalStyles.cancelBtn} 
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={modalStyles.submitBtn}
              disabled={availableTables.length === 0}
              style={availableTables.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              Seat Party
            </button>
          </div>
        </form>
      </Modal>

      {/* SHIFT NOTE MODAL */}
      <Modal 
        isOpen={activeModal === 'SHIFT_NOTE'} 
        onClose={() => {
          setNoteContent('');
          setNoteAuthor('');
          setActiveModal(null);
        }} 
        title="New Shift Note"
      >
        <form onSubmit={handleShiftNoteSubmit} className={modalStyles.form} id="new-shift-note-form">
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="note-author">Author / Role</label>
            <select 
              id="note-author" 
              className={modalStyles.select}
              value={noteAuthor}
              onChange={(e) => setNoteAuthor(e.target.value)}
              required
            >
              <option value="" disabled>Select Staff Member...</option>
              {(staff.filter(s => s.onShift).length > 0 ? staff.filter(s => s.onShift) : staff).map(s => (
                <option key={s.id} value={`${s.name} (${s.role})`}>
                  {s.name} ({s.role}) {s.onShift ? '• On Shift' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="note-content">Note Content</label>
            <textarea 
              id="note-content" 
              className={modalStyles.textarea} 
              placeholder="Write shift notes here... e.g. Kitchen exhaust fans serviced. Special guest VIP Cook at 19:30."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              required
            />
          </div>
          <div className={modalStyles.footer}>
            <button 
              type="button" 
              className={modalStyles.cancelBtn} 
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={modalStyles.submitBtn}
            >
              Save Note
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
