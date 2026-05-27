"use client";

import React, { useState, useEffect } from 'react';
import styles from '@/style/kds.module.css';
import OrderService from '@/services/OrderService';

const getMinutesAgo = (createdAt) => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  return `${diffMins}:00`;
};

const getStation = (itemName) => {
  const lower = itemName.toLowerCase();
  if (lower.includes('ribeye') || lower.includes('steak') || lower.includes('sliders') || lower.includes('grill') || lower.includes('fries') || lower.includes('tartare')) {
    return 'GRILL';
  }
  if (lower.includes('salad') || lower.includes('crudo') || lower.includes('cold')) {
    return 'COLD';
  }
  return 'HOT';
};

export default function KitchenDisplayPage() {
  const tickets = OrderService.useActiveOrders();
  const completedOrders = OrderService.useCompletedOrders();
  const [selectedStation, setSelectedStation] = useState('ALL STATIONS');
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
    OrderService.transitionOrder(ticketId, 'preparing');
  };

  const handleBumpTicket = (ticketId) => {
    OrderService.transitionOrder(ticketId, 'ready');
  };

  const activeTickets = tickets.filter(t => t.status === 'incoming' || t.status === 'preparing');

  const filteredTickets = activeTickets.filter(t => {
    if (selectedStation === 'ALL STATIONS') return true;
    return t.items.some(item => getStation(item.name) === selectedStation);
  });

  const completedCount = 38 + completedOrders.length;

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
        <div className={styles.timeDisplay}>
          {time}
        </div>
      </div>
      {/* Ticket Grid */}
      <div className={styles.ticketGridContainer}>
        <div className={styles.ticketGridRow}>
          {filteredTickets.map((t) => {
            const isUrgent = t.isDelayed || (Date.now() - new Date(t.createdAt).getTime() > 15 * 60 * 1000);
            const isWarning = !isUrgent && (Date.now() - new Date(t.createdAt).getTime() > 10 * 60 * 1000);
            const isNew = !isUrgent && !isWarning && (Date.now() - new Date(t.createdAt).getTime() < 3 * 60 * 1000);

            const cardClass = isUrgent 
              ? styles.ticketCardUrgent 
              : styles.ticketCard;
            
            const badgeClass = isUrgent
              ? styles.tableBadgeUrgent
              : styles.tableBadge;

            const durationClass = isUrgent
              ? styles.ticketDurationUrgent
              : isWarning
                ? styles.ticketDurationWarning
                : styles.ticketDurationNew;

            const indicatorBarClass = isUrgent
              ? styles.indicatorBarUrgent
              : isWarning
                ? styles.indicatorBarWarning
                : styles.indicatorBarNew;

            return (
              <article key={t.id} className={cardClass} suppressHydrationWarning>
                <header className={styles.ticketHeader}>
                  <div className={styles.ticketHeaderGroup}>
                    <span className={styles.ticketNum}>
                      #{t.id.replace('ORD-', '')}
                    </span>
                    <span className={badgeClass} suppressHydrationWarning>
                      {t.table}
                    </span>
                  </div>
                  <span className={durationClass} suppressHydrationWarning>
                    {getMinutesAgo(t.createdAt)}
                  </span>
                </header>
                <div className={styles.ticketBody}>
                  {t.items.map((item, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <div className={styles.itemDivider} />}
                      <div className={styles.itemRow}>
                        <span className={styles.itemQty}>
                          {item.name.match(/^\d+x/)?.[0] || ""}
                        </span>
                        <div className={styles.itemDetails}>
                          <p className={styles.itemName}>
                            {item.name.replace(/^\d+x\s*/, '')}
                          </p>
                          {item.meta && <p className={styles.itemNotes}>{item.meta}</p>}
                          <span className={styles.stationTag}>
                            {getStation(item.name)}
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <footer className={styles.ticketFooter}>
                  {t.status === 'preparing' ? (
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
                <div className={indicatorBarClass} suppressHydrationWarning />
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
