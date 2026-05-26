"use client";

import React, { useState } from 'react';
import { TrendingUp, ArrowUp, CheckCircle, Sliders, Star, BookOpen, Heart, FileText } from '@/lib/icons';
import styles from '@/style/service.module.css';
import Link from 'next/link';
import OrderService from '@/services/OrderService';

const getMinutesAgo = (createdAt) => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  return `${diffMins}m ago`;
};

const initialReservations = [
  { id: 1, guest: "Mr. Alistair Cook", details: "Party of 4 • VIP Tier 2", time: "19:30", status: "SEATED" },
  { id: 2, guest: "Elena Rodriguez", details: "Party of 2 • Anniversary", time: "20:00", status: "CONFIRMED" },
  { id: 3, guest: "The Goldman Group", details: "Party of 8 • Private Room", time: "20:15", status: "PENDING" },
  { id: 4, guest: "Sarah Jenkins", details: "Party of 3", time: "21:00", status: "LATER" }
];

export default function ServicePage() {
  const orders = OrderService.useActiveOrders();
  const [reservations, setReservations] = useState(initialReservations);

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
    setReservations(prev =>
      prev.map(r => {
        if (r.id === resId) {
          const nextIndex = (statuses.indexOf(r.status) + 1) % statuses.length;
          return { ...r, status: statuses[nextIndex] };
        }
        return r;
      })
    );
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
                        <span className={styles.orderTime}>{getMinutesAgo(o.createdAt)}</span>
                      </div>
                      <p className={styles.orderTitle}>
                        {o.items.map(item => item.name).join(', ')}
                      </p>
                      {o.items.some(it => it.meta) && (
                        <p className={styles.orderNotes}>
                          {o.items.map(it => it.meta).filter(Boolean).join(', ')}
                        </p>
                      )}
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
                        <span className={styles.orderTime}>
                          {getMinutesAgo(o.createdAt)}
                        </span>
                      </div>
                      <p className={styles.orderTitle}>{o.items.map(item => item.name).join(', ')}</p>
                      {o.items.some(it => it.meta) && (
                        <p className={styles.orderTitleSecondary}>
                          {o.items.map(it => it.meta).filter(Boolean).join(', ')}
                        </p>
                      )}
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
          {/* RESERVATIONS (40% on desktop) */}
          <div className={styles.reservationsCol}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTitle}>
                Upcoming Reservations
              </h4>
              <div className={styles.reservationsFilters}>
                <Sliders size={18} className={styles.reservationsFilterIcon} />
              </div>
            </div>
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
                    <div className={styles.reservationTime}>{r.time}</div>
                    <div className={styles.reservationStatus}>
                      <span className={getReservationBadgeClass(r.status)}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
    </main>
  );
}
