"use client";

import React, { useState, useEffect } from 'react';
import styles from '@/style/orders.module.css';
import { Clock, Plus } from '@/lib/icons';
import OrderService from '@/services/OrderService';
import TablesService from '@/services/TablesService';
import UIService from '@/services/UIService';
import Modal from '@/components/Modal';
import modalStyles from '@/style/modal.module.css';

const getMinutesAgo = (createdAt) => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  return `${diffMins}m`;
};

export default function Page() {
  const activeOrders = OrderService.useActiveOrders();
  const completedOrders = OrderService.useCompletedOrders();
  const [activeFilter, setActiveFilter] = useState('All');

  const incomingCount = activeOrders.filter(o => o.status === 'incoming').length;
  const preparingCount = activeOrders.filter(o => o.status === 'preparing').length;
  const readyCount = activeOrders.filter(o => o.status === 'ready').length;
  const totalActive = activeOrders.length;

  // New Order Modal States
  const activeModal = UIService.useActiveModal();
  const tables = TablesService.useTables();
  const [newOrderTableId, setNewOrderTableId] = useState('');
  const [newOrderPartySize, setNewOrderPartySize] = useState('2');
  const [newOrderItems, setNewOrderItems] = useState('');

  const availableTables = tables.filter(t => t.status === 'available');

  useEffect(() => {
    if (activeModal === 'NEW_ORDER' && availableTables.length > 0 && !newOrderTableId) {
      setNewOrderTableId(availableTables[0].id);
    }
  }, [activeModal, availableTables, newOrderTableId]);

  const transitionOrder = (orderId, newStatus) => {
    OrderService.transitionOrder(orderId, newStatus);
  };

  const serveAndCloseOrder = (order) => {
    OrderService.serveAndClose(order);
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const tableId = newOrderTableId || (availableTables[0]?.id);
    if (!tableId) return;

    const itemsList = newOrderItems.trim() 
      ? newOrderItems.split(',').map(item => ({ name: item.trim() }))
      : [{ name: `Walk-In (Party of ${newOrderPartySize})` }];

    // Generate random realistic price
    const randomPrice = `$${(Math.floor(Math.random() * 80) + 20)}.00`;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      table: tableId,
      items: itemsList,
      status: "incoming",
      createdAt: new Date(),
      price: randomPrice
    };

    // Transition table to occupied
    TablesService.setTableStatus(tableId, 'occupied');
    OrderService.addOrder(newOrder);

    // Reset state & close
    setNewOrderTableId('');
    setNewOrderPartySize('2');
    setNewOrderItems('');
    UIService.closeModal();
  };


  return (
    <>
      {/* Main Canvas Area */}
      <main className={styles.main}>
        {/* Kanban Board */}
        <div className={styles.boardContainer}>
          {/* Controls Row with Filters and New Order */}
          <div className={styles.controlsRow}>
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

            <button 
              className={styles.newOrderBtn}
              onClick={() => UIService.openModal('NEW_ORDER')}
              id="new-order-btn"
            >
              <Plus size={16} />
              New Order
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
                          <span className={styles.cardTimer} suppressHydrationWarning>
                            {getMinutesAgo(o.createdAt)}
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
                          <span className={o.isDelayed ? styles.cardTimerDelayed : styles.cardTimer} suppressHydrationWarning>
                            {getMinutesAgo(o.createdAt)}
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
                          <span className={styles.cardTimer} suppressHydrationWarning>
                            {getMinutesAgo(o.createdAt)}
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

      {/* NEW ORDER MODAL */}
      <Modal 
        isOpen={activeModal === 'NEW_ORDER'} 
        onClose={() => UIService.closeModal()} 
        title="Create New Order"
      >
        <form onSubmit={handleCreateOrder} className={modalStyles.form} id="new-order-form">
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="new-order-table">Select Table</label>
            {availableTables.length > 0 ? (
              <select 
                id="new-order-table" 
                className={modalStyles.select}
                value={newOrderTableId}
                onChange={(e) => setNewOrderTableId(e.target.value)}
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
                No tables currently available.
              </p>
            )}
          </div>
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="new-order-size">Party Size</label>
            <select 
              id="new-order-size" 
              className={modalStyles.select}
              value={newOrderPartySize}
              onChange={(e) => setNewOrderPartySize(e.target.value)}
            >
              <option value="1">1 Person</option>
              <option value="2">2 People</option>
              <option value="3">3 People</option>
              <option value="4">4 People</option>
              <option value="5">5 People</option>
              <option value="6">6 People</option>
              <option value="8">8 People</option>
              <option value="10">10 People</option>
            </select>
          </div>
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="new-order-items">Order Items (Comma-separated, optional)</label>
            <input 
              type="text"
              id="new-order-items" 
              className={modalStyles.input}
              placeholder="e.g. Ribeye Steak, Caesar Salad, Pinot Noir"
              value={newOrderItems}
              onChange={(e) => setNewOrderItems(e.target.value)}
            />
          </div>
          <div className={modalStyles.footer}>
            <button 
              type="button" 
              className={modalStyles.cancelBtn} 
              onClick={() => UIService.closeModal()}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={modalStyles.submitBtn}
              disabled={availableTables.length === 0}
              style={availableTables.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              Create Order
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
