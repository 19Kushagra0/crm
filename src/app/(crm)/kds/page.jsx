"use client";

import React, { useState, useEffect } from 'react';
import styles from '@/style/kds.module.css';
import { Award, Utensils, FileText } from '@/lib/icons';

const initialTickets = [
  {
    id: 1,
    num: "1042",
    table: "T-4",
    duration: "18:45",
    isUrgent: true,
    isStarted: true,
    items: [
      { name: "Bone-in Ribeye", qty: "2x", notes: "Medium Rare, No compound butter", station: "GRILL" },
      { name: "Charred Asparagus", qty: "1x", station: "GRILL" },
      { name: "Pommes Purée", qty: "1x", station: "HOT" }
    ]
  },
  {
    id: 2,
    num: "1045",
    table: "T-12",
    duration: "12:10",
    isWarning: true,
    isStarted: false,
    items: [
      { name: "Diver Scallops", qty: "1x", notes: "Allergy: Dairy (Use oil prep)", station: "HOT" },
      { name: "Heirloom Tomato Salad", qty: "2x", station: "COLD" }
    ]
  },
  {
    id: 3,
    num: "1048",
    table: "Bar",
    duration: "04:30",
    isNew: true,
    isStarted: false,
    items: [
      { name: "Truffle Fries", qty: "1x", station: "FRYER" },
      { name: "Wagyu Sliders", qty: "1x", notes: "Medium, no pickles", station: "GRILL" }
    ]
  }
];

export default function KitchenDisplayPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedStation, setSelectedStation] = useState('ALL STATIONS');
  const [completedCount, setCompletedCount] = useState(38);
  const [time, setTime] = useState('19:42:05');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartTicket = (ticketId) => {
    setTickets(prev =>
      prev.map(t => t.id === ticketId ? { ...t, isStarted: true } : t)
    );
  };

  const handleBumpTicket = (ticketId) => {
    setTickets(prev => prev.filter(t => t.id !== ticketId));
    setCompletedCount(prev => prev + 1);
  };

  const filteredTickets = tickets.filter(t => {
    if (selectedStation === 'ALL STATIONS') return true;
    return t.items.some(item => item.station === selectedStation);
  });

  return (
    <main className={styles.container}>
      {/* Controls Row */}
      <div className={styles.controlsRow}>
        <div className={styles.stationsWrapper}>
          <button 
            className={selectedStation === 'ALL STATIONS' ? styles.stationBtnActive : styles.stationBtn}
            onClick={() => setSelectedStation('ALL STATIONS')}
          >
            ALL STATIONS
          </button>
          <button 
            className={selectedStation === 'GRILL' ? styles.stationBtnActive : styles.stationBtn}
            onClick={() => setSelectedStation('GRILL')}
          >
            GRILL
          </button>
          <button 
            className={selectedStation === 'COLD' ? styles.stationBtnActive : styles.stationBtn}
            onClick={() => setSelectedStation('COLD')}
          >
            COLD
          </button>
        </div>
        <div className={styles.quickActions}>
          <button className={styles.quickActionBtn}>
            <Award size={15} />
            Create Reward
          </button>
          <button className={styles.quickActionBtn}>
            <Utensils size={15} />
            New Service
          </button>
          <button className={styles.quickActionBtnPrimary}>
            <FileText size={15} />
            Shift Report
          </button>
        </div>
        <div className={styles.timeDisplay}>
          {time}
        </div>
      </div>
      {/* Ticket Grid */}
      <div className={styles.ticketGridContainer}>
        <div className={styles.ticketGridRow}>
          {filteredTickets.map((t) => {
            const cardClass = t.isUrgent 
              ? styles.ticketCardUrgent 
              : styles.ticketCard;
            
            const badgeClass = t.isUrgent
              ? styles.tableBadgeUrgent
              : styles.tableBadge;

            const durationClass = t.isUrgent
              ? styles.ticketDurationUrgent
              : t.isWarning
                ? styles.ticketDurationWarning
                : styles.ticketDurationNew;

            const indicatorBarClass = t.isUrgent
              ? styles.indicatorBarUrgent
              : t.isWarning
                ? styles.indicatorBarWarning
                : styles.indicatorBarNew;

            return (
              <article key={t.id} className={cardClass}>
                <header className={styles.ticketHeader}>
                  <div className={styles.ticketHeaderGroup}>
                    <span className={styles.ticketNum}>
                      #{t.num}
                    </span>
                    <span className={badgeClass}>
                      {t.table}
                    </span>
                  </div>
                  <span className={durationClass}>
                    {t.duration}
                  </span>
                </header>
                <div className={styles.ticketBody}>
                  {t.items.map((item, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <div className={styles.itemDivider} />}
                      <div className={styles.itemRow}>
                        <span className={styles.itemQty}>
                          {item.qty}
                        </span>
                        <div className={styles.itemDetails}>
                          <p className={styles.itemName}>
                            {item.name}
                          </p>
                          {item.notes && <p className={styles.itemNotes}>{item.notes}</p>}
                          <span className={styles.stationTag}>
                            {item.station}
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <footer className={styles.ticketFooter}>
                  {t.isStarted ? (
                    <button 
                      className={styles.bumpBtn}
                      onClick={() => handleBumpTicket(t.id)}
                    >
                      Bump Ticket
                    </button>
                  ) : (
                    <button 
                      className={styles.startBtn}
                      onClick={() => handleStartTicket(t.id)}
                    >
                      Start
                    </button>
                  )}
                </footer>
                {/* Timer Bar */}
                <div className={indicatorBarClass} />
              </article>
            );
          })}

          {filteredTickets.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888', gridColumn: '1 / -1', fontFamily: 'Inter, sans-serif' }}>
              No active tickets for this station.
            </div>
          )}
        </div>
      </div>
      {/* Bottom Status Bar */}
      <footer className={styles.statusBar}>
        <div className={styles.statusBarStats}>
          <div className={styles.statusBarGroup}>
            <span className={styles.statusBarLabel}>
              OPEN TICKETS:
            </span>
            <span className={styles.statusBarValue}>
              {tickets.length}
            </span>
          </div>
          <div className={styles.statusBarDivider} />
          <div className={styles.statusBarGroup}>
            <span className={styles.statusBarLabel}>
              AVG TIME:
            </span>
            <span className={styles.statusBarValue}>
              14 min
            </span>
          </div>
          <div className={styles.statusBarDivider} />
          <div className={styles.statusBarGroup}>
            <span className={styles.statusBarLabel}>
              LONGEST WAITING:
            </span>
            <span className={styles.statusBarValue} style={{ color: '#e8a55a' }}>
              22 min
            </span>
          </div>
          <div className={styles.statusBarDivider} />
          <div className={styles.statusBarGroup}>
            <span className={styles.statusBarLabel}>
              COMPLETED TODAY:
            </span>
            <span className={styles.statusBarValue}>
              {completedCount}
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
