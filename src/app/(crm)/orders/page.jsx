"use client";

import React, { useState } from 'react';
import styles from '@/style/orders.module.css';
import { Clock } from '@/lib/icons';

const initialActiveOrders = [
  {
    id: "ORD-9012",
    table: "T-12",
    items: [
      { name: "2x Wagyu Tartare" },
      { name: "1x Scallop Crudo" }
    ],
    status: "incoming",
    timer: "2m ago",
    price: "$64.00"
  },
  {
    id: "ORD-9013",
    table: "Bar-2",
    items: [
      { name: "1x Truffle Fries" },
      { name: "2x Negroni" }
    ],
    status: "incoming",
    timer: "4m ago",
    price: "$48.00"
  },
  {
    id: "ORD-8998",
    table: "T-4",
    items: [
      { name: "1x Tomahawk Ribeye", meta: "Med Rare" },
      { name: "2x Lobster Mac" },
      { name: "1x Grilled Asparagus" }
    ],
    status: "preparing",
    timer: "18m elapsed",
    price: "$215.00",
    isDelayed: true
  },
  {
    id: "ORD-9005",
    table: "T-8",
    items: [
      { name: "2x Duck Breast" },
      { name: "1x Pommes Purée" }
    ],
    status: "preparing",
    timer: "12m elapsed",
    price: "$88.00"
  },
  {
    id: "ORD-8990",
    table: "T-1",
    items: [
      { name: "1x Châteaubriand" },
      { name: "2x Caesar Salad" }
    ],
    status: "ready",
    timer: "Waiting: 3m",
    price: "$145.00"
  }
];

const initialCompletedOrders = [
  { id: "ORD-8985", table: "T-6", price: "$320.00" },
  { id: "ORD-8984", table: "Bar-1", price: "$45.00" }
];

export default function Page() {
  const [activeOrders, setActiveOrders] = useState(initialActiveOrders);
  const [completedOrders, setCompletedOrders] = useState(initialCompletedOrders);
  const [activeFilter, setActiveFilter] = useState('All');

  const incomingCount = activeOrders.filter(o => o.status === 'incoming').length;
  const preparingCount = activeOrders.filter(o => o.status === 'preparing').length;
  const readyCount = activeOrders.filter(o => o.status === 'ready').length;
  const totalActive = activeOrders.length;

  const transitionOrder = (orderId, newStatus) => {
    setActiveOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );
  };

  const serveAndCloseOrder = (order) => {
    // Remove from active list
    setActiveOrders(prev => prev.filter(o => o.id !== order.id));
    // Add to completed list
    setCompletedOrders(prev => [
      { id: order.id, table: order.table, price: order.price },
      ...prev
    ]);
  };

  return (
    <>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <title>DineFlow - Orders</title>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap"
        rel="stylesheet"
      />
      {/* Material Symbols */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n        body { background-color: theme('colors.canvas'); color: theme('colors.on-background'); }\n    "
        }}
      />
      {/* Main Canvas Area */}
      <main className={styles.main}>
        {/* Kanban Board */}
        <div className={styles.boardContainer}>
          {/* Filters */}
          <div className={styles.filtersContainer}>
            <button 
              className={activeFilter === 'All' ? styles.activeFilterBtn : styles.filterBtn}
              onClick={() => setActiveFilter('All')}
            >
              All ({totalActive})
            </button>
            <button 
              className={activeFilter === 'Incoming' ? styles.activeFilterBtn : styles.filterBtn}
              onClick={() => setActiveFilter('Incoming')}
            >
              Incoming ({incomingCount})
            </button>
            <button 
              className={activeFilter === 'Preparing' ? styles.activeFilterBtn : styles.filterBtn}
              onClick={() => setActiveFilter('Preparing')}
            >
              Preparing ({preparingCount})
            </button>
            <button 
              className={activeFilter === 'Ready' ? styles.activeFilterBtn : styles.filterBtn}
              onClick={() => setActiveFilter('Ready')}
            >
              Ready ({readyCount})
            </button>
            <button 
              className={activeFilter === 'Completed' ? styles.activeFilterBtn : styles.filterBtn}
              onClick={() => setActiveFilter('Completed')}
            >
              Completed
            </button>
          </div>
          <div className={styles.kanbanBoard}>
            {/* Incoming Column */}
            {(activeFilter === 'All' || activeFilter === 'Incoming') && (
              <div className={styles.kanbanColumn}>
                <div className={styles.columnHeader}>
                  <div className={styles.columnHeaderTitle}>
                    <span className={`${styles.columnDot} ${styles.bgAmber}`} />
                    <h3 className={styles.columnTitleText}>
                      INCOMING
                    </h3>
                  </div>
                  <span className={styles.columnCount}>
                    {incomingCount}
                  </span>
                </div>
                <div className={styles.cardsList}>
                  {activeOrders.filter(o => o.status === 'incoming').map(o => (
                    <div key={o.id} className={styles.orderCard}>
                      <div className={styles.cardHeader}>
                        <span className={styles.orderId}>
                          #{o.id}
                        </span>
                        <span className={styles.tableBadge}>
                          {o.table}
                        </span>
                      </div>
                      <div className={styles.cardBody}>
                        <ul className={styles.itemsList}>
                          {o.items.map((it, idx) => (
                            <li key={idx} className={styles.itemsRow}>
                              <span>{it.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.cardFooter}>
                        <div className={styles.cardTimerRow}>
                          <Clock size={14} className={styles.timerIcon} />
                          <span className={styles.cardTimer}>
                            {o.timer}
                          </span>
                        </div>
                        <span className={styles.cardPrice}>
                          {o.price}
                        </span>
                      </div>
                      <button 
                        className={styles.primaryActionBtn}
                        onClick={() => transitionOrder(o.id, 'preparing')}
                      >
                        Start Preparing
                      </button>
                    </div>
                  ))}
                  {incomingCount === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 16px', color: '#888', fontFamily: 'Inter, sans-serif' }}>
                      No incoming orders.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preparing Column */}
            {(activeFilter === 'All' || activeFilter === 'Preparing') && (
              <div className={styles.kanbanColumn}>
                <div className={styles.columnHeader}>
                  <div className={styles.columnHeaderTitle}>
                    <span className={`${styles.columnDot} ${styles.bgTeal}`} />
                    <h3 className={styles.columnTitleText}>
                      PREPARING
                    </h3>
                  </div>
                  <span className={styles.columnCount}>
                    {preparingCount}
                  </span>
                </div>
                <div className={styles.cardsList}>
                  {activeOrders.filter(o => o.status === 'preparing').map(o => (
                    <div key={o.id} className={styles.orderCard}>
                      <div className={styles.cardHeader}>
                        <span className={styles.orderId}>
                          #{o.id}
                        </span>
                        <span className={styles.tableBadge}>
                          {o.table}
                        </span>
                      </div>
                      <div className={styles.cardBody}>
                        <ul className={styles.itemsList}>
                          {o.items.map((it, idx) => (
                            <li key={idx} className={styles.itemsRow}>
                              <span>{it.name}</span>{" "}
                              {it.meta && (
                                <span style={{ fontSize: '12px', color: 'var(--color-secondary, #605e5b)' }}>
                                  {it.meta}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.cardFooter}>
                        <div className={styles.cardTimerRow}>
                          <Clock size={14} className={o.isDelayed ? styles.timerIconDelayed : styles.timerIcon} />
                          <span className={o.isDelayed ? styles.cardTimerDelayed : styles.cardTimer}>
                            {o.timer}
                          </span>
                        </div>
                        <span className={styles.cardPrice}>
                          {o.price}
                        </span>
                      </div>
                      <button 
                        className={styles.secondaryActionBtn}
                        onClick={() => transitionOrder(o.id, 'ready')}
                      >
                        Mark Ready
                      </button>
                    </div>
                  ))}
                  {preparingCount === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 16px', color: '#888', fontFamily: 'Inter, sans-serif' }}>
                      No orders in preparation.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ready Column */}
            {(activeFilter === 'All' || activeFilter === 'Ready') && (
              <div className={styles.kanbanColumn}>
                <div className={styles.columnHeader}>
                  <div className={styles.columnHeaderTitle}>
                    <span className={`${styles.columnDot} ${styles.bgTertiary}`} />
                    <h3 className={styles.columnTitleText}>
                      READY
                    </h3>
                  </div>
                  <span className={styles.columnCount}>
                    {readyCount}
                  </span>
                </div>
                <div className={styles.cardsList}>
                  {activeOrders.filter(o => o.status === 'ready').map(o => (
                    <div key={o.id} className={styles.orderCard}>
                      <div className={styles.cardHeader}>
                        <span className={styles.orderId}>
                          #{o.id}
                        </span>
                        <span className={styles.tableBadge}>
                          {o.table}
                        </span>
                      </div>
                      <div className={styles.cardBody}>
                        <ul className={styles.itemsList}>
                          {o.items.map((it, idx) => (
                            <li key={idx} className={styles.itemsRow}>
                              <span>{it.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.cardFooter}>
                        <div className={styles.cardTimerRow}>
                          <Clock size={14} className={styles.timerIcon} />
                          <span className={styles.cardTimer}>
                            {o.timer}
                          </span>
                        </div>
                        <span className={styles.cardPrice}>
                          {o.price}
                        </span>
                      </div>
                      <button 
                        className={styles.readyActionBtn}
                        onClick={() => serveAndCloseOrder(o)}
                      >
                        Serve &amp; Close
                      </button>
                    </div>
                  ))}
                  {readyCount === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 16px', color: '#888', fontFamily: 'Inter, sans-serif' }}>
                      No orders ready to serve.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Completed Filter View fallback */}
            {activeFilter === 'Completed' && (
              <div style={{ flex: 1, padding: '24px', fontFamily: 'Inter, sans-serif', color: 'var(--color-ink, #141413)', backgroundColor: 'var(--color-surface-card, #efe9de)', borderRadius: '12px', border: '1px solid var(--color-border-hairline, #e6dfd8)' }}>
                <h3 style={{ fontFamily: 'Newsreader, serif', fontSize: '20px', marginBottom: '16px' }}>All Completed Orders Today</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {completedOrders.map(o => (
                    <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#faf9f5', borderRadius: '6px', border: '1px solid var(--color-border-hairline, #e6dfd8)' }}>
                      <div>
                        <strong>#{o.id}</strong> <span style={{ color: '#666', marginLeft: '12px' }}>Table: {o.table}</span>
                      </div>
                      <div style={{ fontWeight: '500' }}>{o.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Dark Band Bottom Summary */}
        <div className={styles.summaryBar}>
          <div className={styles.metricsCol}>
            <h4 className={styles.summarySectionTitle}>
              TODAY'S METRICS
            </h4>
            <div className={styles.metricsGrid}>
              <div>
                <span className={styles.metricLabel}>
                  Total Orders
                </span>
                <span className={styles.metricValue}>142</span>
              </div>
              <div>
                <span className={styles.metricLabel}>
                  Avg Ticket Time
                </span>
                <span className={styles.metricValue}>22m</span>
              </div>
            </div>
          </div>
          <div className={styles.completedSection}>
            <div className={styles.completedHeader}>
              <h4 className={styles.summarySectionTitle}>
                RECENTLY COMPLETED
              </h4>
              <a className={styles.viewAllLink} href="#" onClick={(e) => { e.preventDefault(); setActiveFilter('Completed'); }}>
                View All
              </a>
            </div>
            <div className={styles.miniCardsList}>
              {completedOrders.slice(0, 3).map(o => (
                <div key={o.id} className={styles.miniCard}>
                  <div className={styles.miniCardHeader}>
                    <span className={styles.miniCardId}>
                      #{o.id}
                    </span>
                    <span className={styles.miniCardTable}>
                      {o.table}
                    </span>
                  </div>
                  <div className={styles.miniCardPrice}>
                    {o.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
