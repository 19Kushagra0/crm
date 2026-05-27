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

export default function Header({ onMenuToggle }) {
  const pathname = usePathname() || '';
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeOrders = OrderService.useActiveOrders();
  const tables = TablesService.useTables();
  const customers = CustomerService.useCustomers();

  // Modals state
  const activeModal = UIService.useActiveModal();
  const setActiveModal = (type) => type ? UIService.openModal(type) : UIService.closeModal();

  // New Reservation Form State
  const [resName, setResName] = useState('');
  const [resPartySize, setResPartySize] = useState('2');
  const [resTime, setResTime] = useState('19:30');
  const [resNotes, setResNotes] = useState('');

  // Seat Walk-In Form State
  const [walkInTableId, setWalkInTableId] = useState('');
  const [walkInPartySize, setWalkInPartySize] = useState('2');

  // Shift Note Form State
  const [noteContent, setNoteContent] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('Manager');

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
      status: 'CONFIRMED'
    });

    // Reset state & close
    setResName('');
    setResPartySize('2');
    setResTime('19:30');
    setResNotes('');
    setActiveModal(null);
  };

  const handleWalkInSubmit = (e) => {
    e.preventDefault();
    const tableId = walkInTableId || (availableTables[0]?.id);
    if (!tableId) return;

    // Transition table to occupied
    TablesService.setTableStatus(tableId, 'occupied');
    // Create new walk-in order
    OrderService.createWalkInOrder(tableId, parseInt(walkInPartySize, 10) || 2);

    // Reset state & close
    setWalkInTableId('');
    setWalkInPartySize('2');
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
    setNoteAuthor('Manager');
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
    subtitle = "12 staff members · 8 on shift today";
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
        onClose={() => setActiveModal(null)} 
        title="New Reservation"
      >
        <form onSubmit={handleReservationSubmit} className={modalStyles.form} id="new-reservation-form">
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="guest-name">Guest Name</label>
            <input 
              type="text" 
              id="guest-name" 
              className={modalStyles.input} 
              placeholder="e.g. John Doe"
              value={resName}
              onChange={(e) => setResName(e.target.value)}
              required
            />
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
            <label className={modalStyles.label} htmlFor="reservation-time">Reservation Time</label>
            <input 
              type="text" 
              id="reservation-time" 
              className={modalStyles.input} 
              placeholder="e.g. 19:30"
              value={resTime}
              onChange={(e) => setResTime(e.target.value)}
              required
            />
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
        onClose={() => setActiveModal(null)} 
        title="New Shift Note"
      >
        <form onSubmit={handleShiftNoteSubmit} className={modalStyles.form} id="new-shift-note-form">
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="note-author">Author / Role</label>
            <input 
              type="text" 
              id="note-author" 
              className={modalStyles.input} 
              placeholder="e.g. Manager / Head Chef"
              value={noteAuthor}
              onChange={(e) => setNoteAuthor(e.target.value)}
              required
            />
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
