"use client";

import React, { useState, useEffect } from 'react';
import styles from '@/style/orders.module.css';
import { Clock, Plus } from '@/lib/icons';
import OrderService from '@/services/OrderService';
import TablesService from '@/services/TablesService';
import MenuService from '@/services/MenuService';
import UIService from '@/services/UIService';
import Modal from '@/components/Modal';
import modalStyles from '@/style/modal.module.css';

const getMinutesAgo = (createdAt) => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  return `${diffMins}m`;
};

export default function Page() {
  const activeOrdersQueryResult = OrderService.useActiveOrders();
  const activeOrders = activeOrdersQueryResult.data || [];
  const isLoading = activeOrdersQueryResult.isLoading;

  const completedOrdersQueryResult = OrderService.useCompletedOrders();
  const completedOrders = completedOrdersQueryResult.data || [];
  
  const [activeFilter, setActiveFilter] = useState('All');

  const incomingCount = activeOrders.filter(o => o.status === 'incoming').length;
  const preparingCount = activeOrders.filter(o => o.status === 'preparing').length;
  const readyCount = activeOrders.filter(o => o.status === 'ready').length;
  const totalActive = activeOrders.length;

  // New Order Modal States
  const activeModal = UIService.useActiveModal();
  const tablesQueryResult = TablesService.useTables();
  const tables = tablesQueryResult.data || [];

  const menuItemsQueryResult = MenuService.useMenuItems();
  const menuItems = menuItemsQueryResult.data || [];
  const [newOrderTableId, setNewOrderTableId] = useState('');
  const [newOrderPartySize, setNewOrderPartySize] = useState('2');
  const [selectedItems, setSelectedItems] = useState({}); // { [itemId]: quantity }
  const [modalCategory, setModalCategory] = useState('Starters');

  const orderableTables = tables.filter(t => t.status === 'occupied');

  useEffect(() => {
    if (activeModal === 'NEW_ORDER' && orderableTables.length > 0 && !newOrderTableId) {
      setNewOrderTableId(orderableTables[0].id);
    }
  }, [activeModal, orderableTables, newOrderTableId]);

  const transitionOrder = (orderId, newStatus) => {
    OrderService.transitionOrder(orderId, newStatus);
  };

  const serveAndCloseOrder = (order) => {
    OrderService.serveAndClose(order);
  };

  const handleCloseModal = () => {
    setNewOrderTableId('');
    setNewOrderPartySize('2');
    setSelectedItems({});
    setModalCategory('Starters');
    UIService.closeModal();
  };

  const incrementItem = (itemId) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const decrementItem = (itemId) => {
    setSelectedItems(prev => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return {
        ...prev,
        [itemId]: current - 1
      };
    });
  };

  const selectedItemsList = Object.entries(selectedItems).map(([itemId, qty]) => {
    const item = menuItems.find(mi => mi.id === itemId);
    return item ? { ...item, quantity: qty } : null;
  }).filter(Boolean);

  const subtotal = selectedItemsList.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const tableId = newOrderTableId || (orderableTables[0]?.id);
    if (!tableId) return;

    if (selectedItemsList.length === 0) {
      alert("Please select at least one menu item.");
      return;
    }

    const itemsList = selectedItemsList.map(item => ({
      name: `${item.quantity}x ${item.name}`
    }));

    // Formatted Price string in Rupees (en-IN)
    const orderPrice = `₹${subtotal.toFixed(2)}`;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      table: tableId,
      items: itemsList,
      status: "incoming",
      createdAt: new Date(),
      price: orderPrice
    };

    // Transition table to occupied
    TablesService.setTableStatus(tableId, 'occupied');
    OrderService.addOrder(newOrder);

    // Reset state & close
    handleCloseModal();
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
                    {isLoading ? '...' : incomingCount}
                  </span>
                </div>
                <div className={styles.cardsList}>
                  {isLoading ? (
                    Array.from({ length: 2 }).map((_, idx) => (
                      <div key={`incoming-skeleton-${idx}`} className={styles.skeletonCard}>
                        <div className={styles.skeletonHeader}>
                          <div className={styles.skeletonId} />
                          <div className={styles.skeletonTableBadge} />
                        </div>
                        <div className={styles.skeletonText} />
                        <div className={styles.cardFooter} style={{ borderTop: '1px solid var(--color-border-hairline, #e6dfd8)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                          <div className={styles.skeletonTextShort} />
                          <div className={styles.skeletonPrice} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
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
                          <div className={styles.statusText}>
                            Sent to Kitchen...
                          </div>
                        </div>
                      ))}
                      {incomingCount === 0 && (
                        <div style={{ textAlign: 'center', padding: '32px 16px', color: '#888', fontFamily: 'Inter, sans-serif' }}>
                          No incoming orders.
                        </div>
                      )}
                    </>
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
                    {isLoading ? '...' : preparingCount}
                  </span>
                </div>
                <div className={styles.cardsList}>
                  {isLoading ? (
                    Array.from({ length: 2 }).map((_, idx) => (
                      <div key={`preparing-skeleton-${idx}`} className={styles.skeletonCard}>
                        <div className={styles.skeletonHeader}>
                          <div className={styles.skeletonId} />
                          <div className={styles.skeletonTableBadge} />
                        </div>
                        <div className={styles.skeletonText} />
                        <div className={styles.cardFooter} style={{ borderTop: '1px solid var(--color-border-hairline, #e6dfd8)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                          <div className={styles.skeletonTextShort} />
                          <div className={styles.skeletonPrice} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
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
                          <div className={styles.statusText}>
                            Chef is cooking...
                          </div>
                        </div>
                      ))}
                      {preparingCount === 0 && (
                        <div style={{ textAlign: 'center', padding: '32px 16px', color: '#888', fontFamily: 'Inter, sans-serif' }}>
                          No orders in preparation.
                        </div>
                      )}
                    </>
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
                    {isLoading ? '...' : readyCount}
                  </span>
                </div>
                <div className={styles.cardsList}>
                  {isLoading ? (
                    Array.from({ length: 1 }).map((_, idx) => (
                      <div key={`ready-skeleton-${idx}`} className={styles.skeletonCard}>
                        <div className={styles.skeletonHeader}>
                          <div className={styles.skeletonId} />
                          <div className={styles.skeletonTableBadge} />
                        </div>
                        <div className={styles.skeletonText} />
                        <div className={styles.cardFooter} style={{ borderTop: '1px solid var(--color-border-hairline, #e6dfd8)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                          <div className={styles.skeletonTextShort} />
                          <div className={styles.skeletonPrice} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Completed Filter View fallback */}
            {activeFilter === 'Completed' && (
              <div style={{ flex: 1, padding: '24px', fontFamily: 'Inter, sans-serif', color: 'var(--color-ink, #141413)', backgroundColor: 'var(--color-surface-card, #efe9de)', borderRadius: '12px', border: '1px solid var(--color-border-hairline, #e6dfd8)' }}>
                <h3 style={{ fontFamily: 'Newsreader, serif', fontSize: '20px', marginBottom: '16px' }}>All Completed Orders Today</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading completed orders...</div>
                  ) : (
                    completedOrders.map(o => (
                      <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#faf9f5', borderRadius: '6px', border: '1px solid var(--color-border-hairline, #e6dfd8)' }}>
                        <div>
                          <strong>#{o.id}</strong> <span style={{ color: '#666', marginLeft: '12px' }}>Table: {o.table}</span>
                        </div>
                        <div style={{ fontWeight: '500' }}>{o.price}</div>
                      </div>
                    ))
                  )}
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
        onClose={handleCloseModal} 
        title="Create New Order"
      >
        <form onSubmit={handleCreateOrder} className={modalStyles.form} id="new-order-form">
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="new-order-table">Select Table</label>
            {orderableTables.length > 0 ? (
              <select 
                id="new-order-table" 
                className={modalStyles.select}
                value={newOrderTableId}
                onChange={(e) => setNewOrderTableId(e.target.value)}
                required
              >
                {orderableTables.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.id} - {t.zone} Zone ({t.seats} seats) {t.status === 'occupied' ? '(Occupied)' : ''}
                  </option>
                ))}
              </select>
            ) : (
              <p style={{ color: '#8f482f', fontSize: '14px', margin: '4px 0 0 0', fontWeight: '500' }}>
                No tables are currently occupied.
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
            <label className={modalStyles.label}>Select Menu Items</label>
            <div className={styles.modalCategoryTabs}>
              {['Starters', 'Mains', 'Breads', 'Drinks', 'Desserts', 'Specials'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={modalCategory === cat ? styles.modalCategoryTabActive : styles.modalCategoryTab}
                  onClick={() => setModalCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className={styles.menuItemsGrid}>
              {menuItems.filter(mi => mi.category === modalCategory && mi.isActive).map(item => {
                const quantity = selectedItems[item.id] || 0;
                return (
                  <div key={item.id} className={styles.menuItemRow}>
                    <div className={styles.menuItemInfo}>
                      <span className={styles.menuItemName}>{item.name}</span>
                      <span className={styles.menuItemPrice}>₹{item.price}</span>
                    </div>
                    <div className={styles.quantitySelector}>
                      {quantity > 0 && (
                        <>
                          <button
                            type="button"
                            className={styles.quantityBtn}
                            onClick={() => decrementItem(item.id)}
                          >
                            -
                          </button>
                          <span className={styles.quantityVal}>{quantity}</span>
                        </>
                      )}
                      <button
                        type="button"
                        className={styles.quantityBtn}
                        onClick={() => incrementItem(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedItemsList.length > 0 && (
            <div className={styles.orderSummary}>
              <h4 className={styles.summaryTitle}>Order Summary</h4>
              <div className={styles.summaryList}>
                {selectedItemsList.map(item => (
                  <div key={item.id} className={styles.summaryRow}>
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className={styles.summaryTotalRow}>
                <span className={styles.summaryTotalLabel}>Grand Total</span>
                <span className={styles.summaryTotalValue}>₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className={modalStyles.footer}>
            <button 
              type="button" 
              className={modalStyles.cancelBtn} 
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={modalStyles.submitBtn}
              disabled={orderableTables.length === 0 || selectedItemsList.length === 0}
              style={(orderableTables.length === 0 || selectedItemsList.length === 0) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              Create Order
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
