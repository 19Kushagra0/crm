"use client";

import React, { useState } from 'react';
import { TrendingUp, ArrowUp, CheckCircle, Sliders, Star, BookOpen, Heart, FileText } from '@/lib/icons';
import styles from '@/style/service.module.css';
import Link from 'next/link';
import OrderService from '@/services/OrderService';
import ReservationService from '@/services/ReservationService';
import TablesService from '@/services/TablesService';
import CustomerService from '@/services/CustomerService';
import Modal from '@/components/Modal';
import modalStyles from '@/style/modal.module.css';

const getMinutesAgo = (createdAt) => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  return `${diffMins}m ago`;
};

const formatTimeTo12Hour = (timeStr) => {
  if (!timeStr) return '';
  if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
    return timeStr;
  }
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const hour = parseInt(parts[0], 10);
  const min = parts[1];
  if (isNaN(hour)) return timeStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${min} ${ampm}`;
};

export default function ServicePage() {
  const ordersQueryResult = OrderService.useActiveOrders();
  const orders = ordersQueryResult.data || [];

  const completedOrdersQueryResult = OrderService.useCompletedOrders();
  const completedOrders = completedOrdersQueryResult.data || [];

  const reservationsQueryResult = ReservationService.useReservations();
  const reservations = reservationsQueryResult.data || [];
  const tablesQueryResult = TablesService.useTables();
  const tables = tablesQueryResult.data || [];

  const customersQueryResult = CustomerService.useCustomers();
  const customers = customersQueryResult.data || [];

  const [billTableId, setBillTableId] = useState(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState('Tabs'); // 'Tabs' or 'Reservations'

  const getTableGrandTotal = (tableId) => {
    const activeTableOrders = orders.filter(o => o.table === tableId);
    const completedTableOrders = completedOrders.filter(o => o.table === tableId);
    const allTableOrders = [...activeTableOrders, ...completedTableOrders];

    const subtotal = allTableOrders.reduce((sum, o) => {
      if (!o.price) return sum;
      const numericPrice = parseFloat(o.price.replace(/[^\d.-]/g, '')) || 0;
      return sum + numericPrice;
    }, 0);

    const taxCGST = subtotal * 0.05;
    const taxSGST = subtotal * 0.05;
    const serviceCharge = subtotal * 0.05;
    return subtotal + taxCGST + taxSGST + serviceCharge;
  };


  const openBillModal = (tableId) => {
    setBillTableId(tableId);
    setIsBillModalOpen(true);
  };

  const closeBillModal = () => {
    setBillTableId(null);
    setIsBillModalOpen(false);
  };

  const handleCloseBill = () => {
    if (!billTableId) return;

    // Find table and customer
    const table = tables.find(t => t.id === billTableId);
    const customerId = table?.currentCustomerId;

    // 1. Fetch active orders for this table
    const activeTableOrders = orders.filter(o => o.table === billTableId);

    // 2. Serve and close all active orders for this table
    activeTableOrders.forEach(o => {
      OrderService.serveAndClose(o);
    });

    // 3. Compute final grand total
    const allTableOrders = [...orders.filter(o => o.table === billTableId), ...completedOrders.filter(o => o.table === billTableId)];
    const subtotal = allTableOrders.reduce((sum, o) => {
      if (!o.price) return sum;
      const numericPrice = parseFloat(o.price.replace(/[^\d.-]/g, '')) || 0;
      return sum + numericPrice;
    }, 0);

    const taxCGST = subtotal * 0.05;
    const taxSGST = subtotal * 0.05;
    const serviceCharge = subtotal * 0.05;
    const grandTotal = subtotal + taxCGST + taxSGST + serviceCharge;

    // 4. Update customer total spend
    if (customerId) {
      CustomerService.updateSpend(customerId, grandTotal);
    }

    // 5. Clear table seating (triggers CustomerService.recordVisit)
    TablesService.clearSeat(billTableId);

    // 6. Transition table to cleaning
    TablesService.setTableStatus(billTableId, 'cleaning');

    // 7. Close modal
    closeBillModal();
  };

  const incomingCount = orders.filter(o => o.status === 'incoming').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;

  const cycleOrderStatus = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    if (order.status === 'incoming') {
      OrderService.transitionOrder(orderId, 'preparing');
    } else if (order.status === 'preparing') {
      OrderService.transitionOrder(orderId, 'ready');
    } else if (order.status === 'ready') {
      OrderService.serveAndClose(order);
    }
  };

  const cycleReservationStatus = (resId) => {
    const statuses = ["PENDING", "CONFIRMED", "SEATED", "LATER"];
    const r = reservations.find(res => res.id === resId);
    if (!r) return;
    const nextIndex = (statuses.indexOf(r.status) + 1) % statuses.length;
    ReservationService.updateReservationStatus(resId, statuses[nextIndex]);
  };

  const getReservationBadgeClass = (status) => {
    if (status === 'SEATED') return styles.badgeSeated;
    if (status === 'CONFIRMED') return styles.badgeConfirmed;
    if (status === 'PENDING') return styles.badgePending;
    return styles.badgeLater;
  };

  return (
    <main className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* KPI ROW */}
        <section className={styles.kpiGrid}>
          {/* KPI 1 */}
          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>
              TODAY'S REVENUE
            </p>
            <div className={styles.kpiContent}>
              <h3 className={styles.kpiValue}>
                $14,280
              </h3>
              <span className={styles.kpiTrend}>
                <TrendingUp size={14} /> +12%
              </span>
            </div>
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBarFillTertiary} style={{ width: '78%' }} />
            </div>
          </div>
          {/* KPI 2 */}
          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>
              ACTIVE ORDERS
            </p>
            <div className={styles.kpiContent}>
              <h3 className={styles.kpiValue}>{orders.length}</h3>
              <span className={styles.kpiTrendMuted}>
                Avg 42m/table
              </span>
            </div>
            <div className={styles.dotIndicatorGroup}>
              <div className={styles.dotIndicatorPrimary} />
              <div className={styles.dotIndicatorPrimary} />
              <div className={styles.dotIndicatorPrimary} />
              <div className={styles.dotIndicatorVariant} />
              <div className={styles.dotIndicatorVariant} />
            </div>
          </div>
          {/* KPI 3 */}
          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>
              TABLES OCCUPIED
            </p>
            <div className={styles.kpiContent}>
              <h3 className={styles.kpiValue}>
                24/32
              </h3>
              <span className={styles.kpiTrendAmber}>
                75% Capacity
              </span>
            </div>
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBarFillAmber} style={{ width: '75%' }} />
            </div>
          </div>
          {/* KPI 4 */}
          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>
              AVG ORDER VALUE
            </p>
            <div className={styles.kpiContent}>
              <h3 className={styles.kpiValue}>
                $185.50
              </h3>
              <span className={styles.kpiTrend}>
                <ArrowUp size={14} /> $12
              </span>
            </div>
            <div className={styles.gridIndicator}>
              <div className={styles.gridItemHighest} />
              <div className={styles.gridItemHighest} />
              <div className={styles.gridItemHighest} />
              <div className={styles.gridItemPrimaryContainer} />
              <div className={styles.gridItemPrimary} />
              <div className={styles.gridItemPrimary} />
              <div className={styles.gridItemPrimary} />
            </div>
          </div>
        </section>
        
        {/* MAIN GRID */}
        <section className={styles.mainGrid}>
          {/* LIVE ORDERS (60% on desktop) */}
          <div className={styles.liveOrdersCol}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTitle}>
                Live Orders Pipeline
              </h4>
              <Link href="/orders" className={styles.sectionHeaderLink} style={{ textDecoration: 'none' }}>
                VIEW ALL ORDERS
              </Link>
            </div>
            <div className={styles.pipelineGrid}>
              {/* Column: Incoming */}
              <div className={styles.pipelineColumn}>
                <p className={styles.pipelineColumnHeader}>
                  <span className={`${styles.columnDot} ${styles.bgOutline}`} />{" "}
                  INCOMING ({incomingCount})
                </p>
                <div className={styles.orderList}>
                  {orders.filter(o => o.status === 'incoming').map(o => (
                    <div key={o.id} className={styles.orderCard} onClick={() => cycleOrderStatus(o.id)} style={{ cursor: 'pointer' }}>
                      <div className={styles.orderCardHeader}>
                        <span className={styles.orderTable}>
                          {o.table}
                        </span>
                        <span className={styles.orderTime} suppressHydrationWarning>{getMinutesAgo(o.createdAt)}</span>
                      </div>
                      <p className={styles.orderTitle}>
                        {o.items.map(item => item.name).join(', ')}
                      </p>
                      {o.items.some(it => it.meta) && (
                        <p className={styles.orderNotes}>
                          {o.items.map(it => it.meta).filter(Boolean).join(', ')}
                        </p>
                      )}
                      <button
                        type="button"
                        className={styles.cardBillBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          openBillModal(o.table);
                        }}
                      >
                        View Bill
                      </button>
                    </div>
                  ))}
                  {incomingCount === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px 12px', color: '#888', fontStyle: 'italic', fontSize: '13px' }}>
                      No incoming orders
                    </div>
                  )}
                </div>
              </div>
              {/* Column: Preparing */}
              <div className={styles.pipelineColumn}>
                <p className={styles.pipelineColumnHeader}>
                  <span className={`${styles.columnDot} ${styles.bgAmber}`} />{" "}
                  PREPARING ({preparingCount})
                </p>
                <div className={styles.orderList}>
                  {orders.filter(o => o.status === 'preparing').map(o => (
                    <div key={o.id} className={styles.orderCardPreparing} onClick={() => cycleOrderStatus(o.id)} style={{ cursor: 'pointer' }}>
                      <div className={styles.orderCardHeader}>
                        <span className={styles.orderTable}>
                          {o.table}
                        </span>
                        <span className={styles.orderTime} suppressHydrationWarning>
                          {getMinutesAgo(o.createdAt)}
                        </span>
                      </div>
                      <p className={styles.orderTitle}>{o.items.map(item => item.name).join(', ')}</p>
                      {o.items.some(it => it.meta) && (
                        <p className={styles.orderTitleSecondary}>
                          {o.items.map(it => it.meta).filter(Boolean).join(', ')}
                        </p>
                      )}
                      <button
                        type="button"
                        className={styles.cardBillBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          openBillModal(o.table);
                        }}
                      >
                        View Bill
                      </button>
                    </div>
                  ))}
                  {preparingCount === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px 12px', color: '#888', fontStyle: 'italic', fontSize: '13px' }}>
                      No orders preparing
                    </div>
                  )}
                </div>
              </div>
              {/* Column: Ready */}
              <div className={styles.pipelineColumn}>
                <p className={styles.pipelineColumnHeader}>
                  <span className={`${styles.columnDot} ${styles.bgTertiary}`} /> READY
                  TO SERVE ({readyCount})
                </p>
                <div className={styles.orderList}>
                  {orders.filter(o => o.status === 'ready').map(o => (
                    <div key={o.id} className={styles.orderCardReady} onClick={() => cycleOrderStatus(o.id)} style={{ cursor: 'pointer' }}>
                      <div className={styles.orderCardHeader}>
                        <span className={styles.orderTable}>
                          {o.table}
                        </span>
                        <CheckCircle size={18} className="text-tertiary" />
                      </div>
                      <p className={styles.orderTitleSecondary}>
                        {o.items.map(item => item.name).join(', ')}
                      </p>
                      <button
                        type="button"
                        className={styles.cardBillBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          openBillModal(o.table);
                        }}
                      >
                        View Bill
                      </button>
                    </div>
                  ))}
                  {readyCount === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px 12px', color: '#888', fontStyle: 'italic', fontSize: '13px' }}>
                      No orders ready to serve
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* RESERVATIONS & OPEN TABS (40% on desktop) */}
          <div className={styles.reservationsCol}>
            <div className={styles.tabsHeader}>
              <button 
                type="button"
                className={activeRightTab === 'Tabs' ? styles.activeTabBtn : styles.tabBtn} 
                onClick={() => setActiveRightTab('Tabs')}
              >
                Active Tabs ({tables.filter(t => t.status === 'occupied').length})
              </button>
              <button 
                type="button"
                className={activeRightTab === 'Reservations' ? styles.activeTabBtn : styles.tabBtn} 
                onClick={() => setActiveRightTab('Reservations')}
              >
                Reservations ({reservations.length})
              </button>
            </div>

            {activeRightTab === 'Tabs' ? (
              <div className={styles.activeTabsCard}>
                <div className={styles.activeTabsList}>
                  {tables.filter(t => t.status === 'occupied').map(t => {
                    const seatedCustomer = t.currentCustomerId 
                      ? customers.find(c => c.id === t.currentCustomerId) 
                      : null;
                    const grandTotal = getTableGrandTotal(t.id);
                    
                    return (
                      <div key={t.id} className={styles.activeTabRow}>
                        <div className={styles.activeTabInfo}>
                          <span className={styles.activeTabTable}>
                            Table {t.id.replace('T-', '')}
                          </span>
                          <p className={styles.activeTabGuest}>
                            {seatedCustomer ? seatedCustomer.name : 'Walk-In Guest'}
                          </p>
                        </div>
                        <div className={styles.activeTabAmountCol}>
                          <span className={styles.activeTabAmount}>
                            ₹{grandTotal.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            className={styles.viewBillRowBtn}
                            onClick={() => openBillModal(t.id)}
                          >
                            View Bill
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {tables.filter(t => t.status === 'occupied').length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 16px', color: '#888', fontStyle: 'italic', fontSize: '13px' }}>
                      No active tables occupied
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.reservationsCard}>
                <div className={styles.reservationsTableHeader}>
                  <span className={styles.reservationsTableHeaderLabel}>
                     GUEST / PARTY
                  </span>
                  <span className={styles.reservationsTableHeaderTime}>
                    TIME
                  </span>
                  <span className={styles.reservationsTableHeaderStatus}>
                    STATUS
                  </span>
                </div>
                <div className={styles.reservationsList}>
                  {reservations.map(r => (
                    <div key={r.id} className={styles.reservationRow} onClick={() => cycleReservationStatus(r.id)} style={{ cursor: 'pointer' }}>
                      <div className={styles.reservationGuestInfo}>
                        <p className={styles.guestName}>
                          {r.guest}
                        </p>
                        <p className={styles.guestParty}>
                          {r.details}
                        </p>
                      </div>
                      <div className={styles.reservationTime} suppressHydrationWarning>{formatTimeTo12Hour(r.time)}</div>
                      <div className={styles.reservationStatus}>
                        <span className={getReservationBadgeClass(r.status)}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {reservations.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 16px', color: '#888', fontStyle: 'italic', fontSize: '13px' }}>
                      No upcoming reservations
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* DARK BAND SECTION */}
        <section className={styles.darkBand}>
          <div className={styles.darkBandGrid}>
            {/* Top Sellers Charts */}
            <div>
              <div className={styles.darkBandHeader}>
                <h4 className={styles.darkBandTitle}>
                  Top Menu Sellers
                </h4>
                <span className={styles.darkBandHeaderLabel}>
                  MONTH TO DATE
                </span>
              </div>
              <div className={styles.sellersList}>
                <div className={styles.sellerItem}>
                  <div className={styles.sellerInfo}>
                    <span>Truffle Linguine</span>
                    <span>482 orders</span>
                  </div>
                  <div className={styles.sellerProgressContainer}>
                    <div className={styles.sellerProgressFill} style={{ width: '92%' }} />
                  </div>
                </div>
                <div className={styles.sellerItem}>
                  <div className={styles.sellerInfo}>
                    <span>Dry-Aged Ribeye</span>
                    <span>365 orders</span>
                  </div>
                  <div className={styles.sellerProgressContainer}>
                    <div className={styles.sellerProgressFill} style={{ width: '75%' }} />
                  </div>
                </div>
                <div className={styles.sellerItem}>
                  <div className={styles.sellerInfo}>
                    <span>Lobster Bisque</span>
                    <span>294 orders</span>
                  </div>
                  <div className={styles.sellerProgressContainer}>
                    <div className={styles.sellerProgressFill} style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </div>
            {/* Recent VIP Activity */}
            <div>
              <div className={styles.darkBandHeader}>
                <h4 className={styles.darkBandTitle}>
                  Recent VIP Activity
                </h4>
                <Star className="text-surface-variant" size={24} />
              </div>
              <div className={styles.vipActivityList}>
                <div className={styles.vipActivityItem}>
                  <div className={styles.vipAvatarPrimary}>
                    JD
                  </div>
                  <div>
                    <p className={styles.vipActivityText}>
                      John Doe{" "}
                      <span className={styles.vipActivityAction}>
                        purchased
                      </span>{" "}
                      Vintage 1982 Bordeaux
                    </p>
                    <p className={styles.vipActivityMeta}>
                      14 minutes ago • Table 05
                    </p>
                  </div>
                </div>
                <div className={styles.vipActivityItem}>
                  <div className={styles.vipAvatarTertiary}>
                    MC
                  </div>
                  <div>
                    <p className={styles.vipActivityText}>
                      Marie Curie{" "}
                      <span className={styles.vipActivityAction}>
                        requested
                      </span>{" "}
                      Chef's Tasting Menu
                    </p>
                    <p className={styles.vipActivityMeta}>
                      32 minutes ago • Table 12
                    </p>
                  </div>
                </div>
                <div className={styles.vipActivityItemLast}>
                  <div className={styles.vipAvatarOutline}>
                    RK
                  </div>
                  <div>
                    <p className={styles.vipActivityText}>
                      Robert King{" "}
                      <span className={styles.vipActivityAction}>
                        joined
                      </span>{" "}
                      Loyalty Platinum
                    </p>
                    <p className={styles.vipActivityMeta}>
                      1 hour ago • Mobile Entry
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* QUICK ACTIONS */}
        <section className={styles.actionsGrid}>
          <button className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <BookOpen size={28} />
            </div>
            <div>
              <h5 className={styles.actionTitle}>
                Take Reservation
              </h5>
              <p className={styles.actionDesc}>
                Instant floor plan booking
              </p>
            </div>
          </button>
          <button className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <Heart size={28} />
            </div>
            <div>
              <h5 className={styles.actionTitle}>
                Guest Campaign
              </h5>
              <p className={styles.actionDesc}>
                Blast VIP special offers
              </p>
            </div>
          </button>
          <button className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <FileText size={28} />
            </div>
            <div>
              <h5 className={styles.actionTitle}>End of Day</h5>
              <p className={styles.actionDesc}>
                Finalize all tabs &amp; reports
              </p>
            </div>
          </button>
        </section>
      </div>

      {isBillModalOpen && billTableId && (() => {
        const activeTable = tables.find(t => t.id === billTableId);
        const seatedCustomer = activeTable?.currentCustomerId 
          ? customers.find(c => c.id === activeTable.currentCustomerId) 
          : null;
        
        const activeTableOrders = orders.filter(o => o.table === billTableId);
        const completedTableOrders = completedOrders.filter(o => o.table === billTableId);
        const allTableOrders = [...activeTableOrders, ...completedTableOrders];

        const subtotal = allTableOrders.reduce((sum, o) => {
          if (!o.price) return sum;
          const numericPrice = parseFloat(o.price.replace(/[^\d.-]/g, '')) || 0;
          return sum + numericPrice;
        }, 0);

        const taxCGST = subtotal * 0.05;
        const taxSGST = subtotal * 0.05;
        const serviceCharge = subtotal * 0.05;
        const grandTotal = subtotal + taxCGST + taxSGST + serviceCharge;

        return (
          <Modal 
            isOpen={isBillModalOpen} 
            onClose={closeBillModal} 
            title={`Table Bill & Checkout - ${billTableId}`}
          >
            <div className={modalStyles.form}>
              <div className={styles.billCustomerCard}>
                <div>
                  <p className={modalStyles.label} style={{ margin: 0, fontSize: '11px' }}>Seated Guest</p>
                  <p className={styles.billCustomerName}>{seatedCustomer ? seatedCustomer.name : 'Walk-In Guest'}</p>
                </div>
                {seatedCustomer && (
                  <span className={seatedCustomer.tier === 'Platinum' ? styles.billCustomerTierPlatinum : styles.billCustomerTier}>
                    {seatedCustomer.tier}
                  </span>
                )}
              </div>

              <div className={modalStyles.formGroup}>
                <label className={modalStyles.label}>Order Details</label>
                <div className={styles.billItemsList}>
                  {allTableOrders.map(order => {
                    if (!order) return null;
                    return (
                      <div key={order.id} style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                          <span>Order #{order.id}</span>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: order.status === 'ready' ? 'var(--color-tertiary)' : '#888' }}>
                            {order.status || 'completed'}
                          </span>
                        </div>
                        {order.items ? order.items.map((item, idx) => (
                          <div key={idx} className={styles.billItemRow}>
                            <span>{item.name}</span>
                          </div>
                        )) : (
                          <div className={styles.billItemRow}>
                            <span>Pre-existing Closed Order</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '13px', fontWeight: '500', color: 'var(--color-ink)', marginTop: '2px' }}>
                          <span>Subtotal: {order.price}</span>
                        </div>
                      </div>
                    );
                  })}
                  {allTableOrders.length === 0 && (
                    <p style={{ color: '#888', fontStyle: 'italic', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>
                      No items ordered yet.
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.billSummaryGrid}>
                <div className={styles.billSummaryRow}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.billSummaryRow}>
                  <span>CGST (5%)</span>
                  <span>₹{taxCGST.toFixed(2)}</span>
                </div>
                <div className={styles.billSummaryRow}>
                  <span>SGST (5%)</span>
                  <span>₹{taxSGST.toFixed(2)}</span>
                </div>
                <div className={styles.billSummaryRow}>
                  <span>Service Charge (5%)</span>
                  <span>₹{serviceCharge.toFixed(2)}</span>
                </div>
                <div className={styles.billTotalRow}>
                  <span className={styles.billTotalLabel}>Grand Total</span>
                  <span className={styles.billTotalValue}>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className={modalStyles.footer} style={{ margin: '16px -24px -24px -24px' }}>
                <button 
                  type="button" 
                  className={modalStyles.cancelBtn} 
                  onClick={closeBillModal}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className={modalStyles.submitBtn}
                  onClick={handleCloseBill}
                  disabled={allTableOrders.length === 0}
                  style={allTableOrders.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  Close Bill &amp; Checkout
                </button>
              </div>
            </div>
          </Modal>
        );
      })()}
    </main>
  );
}
