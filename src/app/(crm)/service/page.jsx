import React from 'react';
import { TrendingUp, ArrowUp, CheckCircle, Sliders, Star, BookOpen, Heart, FileText } from '@/lib/icons';
import styles from '@/style/service.module.css';

export default function ServicePage() {
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
              <h3 className={styles.kpiValue}>18</h3>
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
              <button className={styles.sectionHeaderLink}>
                VIEW ALL ORDERS
              </button>
            </div>
            <div className={styles.pipelineGrid}>
              {/* Column: Incoming */}
              <div className={styles.pipelineColumn}>
                <p className={styles.pipelineColumnHeader}>
                  <span className={`${styles.columnDot} ${styles.bgOutline}`} />{" "}
                  INCOMING (4)
                </p>
                <div className={styles.orderList}>
                  <div className={styles.orderCard}>
                    <div className={styles.orderCardHeader}>
                      <span className={styles.orderTable}>
                        T-14
                      </span>
                      <span className={styles.orderTime}>2m ago</span>
                    </div>
                    <p className={styles.orderTitle}>
                      Dégustation Menu x2
                    </p>
                    <p className={styles.orderNotes}>
                      No walnuts, allergy.
                    </p>
                  </div>
                  <div className={styles.orderCard}>
                    <div className={styles.orderCardHeader}>
                      <span className={styles.orderTable}>
                        T-08
                      </span>
                      <span className={styles.orderTime}>5m ago</span>
                    </div>
                    <p className={styles.orderTitleSecondary}>
                      Chef's Table Selection
                    </p>
                  </div>
                </div>
              </div>
              {/* Column: Preparing */}
              <div className={styles.pipelineColumn}>
                <p className={styles.pipelineColumnHeader}>
                  <span className={`${styles.columnDot} ${styles.bgAmber}`} />{" "}
                  PREPARING (7)
                </p>
                <div className={styles.orderList}>
                  <div className={styles.orderCardPreparing}>
                    <div className={styles.orderCardHeader}>
                      <span className={styles.orderTable}>
                        T-02
                      </span>
                      <span className={styles.orderTime}>
                        12:04
                      </span>
                    </div>
                    <p className={styles.orderTitle}>Roasted Sea Bass</p>
                    <p className={styles.orderTitleSecondary}>Wagyu A5 Strips</p>
                  </div>
                </div>
              </div>
              {/* Column: Ready */}
              <div className={styles.pipelineColumn}>
                <p className={styles.pipelineColumnHeader}>
                  <span className={`${styles.columnDot} ${styles.bgTertiary}`} /> READY
                  TO SERVE (3)
                </p>
                <div className={styles.orderList}>
                  <div className={styles.orderCardReady}>
                    <div className={styles.orderCardHeader}>
                      <span className={styles.orderTable}>
                        T-22
                      </span>
                      <CheckCircle size={18} className="text-tertiary" />
                    </div>
                    <p className={styles.orderTitleSecondary}>
                      Wine Pairing • Flight A
                    </p>
                  </div>
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
                {/* Reservation 1 */}
                <div className={styles.reservationRow}>
                  <div className={styles.reservationGuestInfo}>
                    <p className={styles.guestName}>
                      Mr. Alistair Cook
                    </p>
                    <p className={styles.guestParty}>
                      Party of 4 • VIP Tier 2
                    </p>
                  </div>
                  <div className={styles.reservationTime}>19:30</div>
                  <div className={styles.reservationStatus}>
                    <span className={styles.badgeSeated}>
                      SEATED
                    </span>
                  </div>
                </div>
                {/* Reservation 2 */}
                <div className={styles.reservationRow}>
                  <div className={styles.reservationGuestInfo}>
                    <p className={styles.guestName}>
                      Elena Rodriguez
                    </p>
                    <p className={styles.guestParty}>
                      Party of 2 • Anniversary
                    </p>
                  </div>
                  <div className={styles.reservationTime}>20:00</div>
                  <div className={styles.reservationStatus}>
                    <span className={styles.badgeConfirmed}>
                      CONFIRMED
                    </span>
                  </div>
                </div>
                {/* Reservation 3 */}
                <div className={styles.reservationRow}>
                  <div className={styles.reservationGuestInfo}>
                    <p className={styles.guestName}>
                      The Goldman Group
                    </p>
                    <p className={styles.guestParty}>
                      Party of 8 • Private Room
                    </p>
                  </div>
                  <div className={styles.reservationTime}>20:15</div>
                  <div className={styles.reservationStatus}>
                    <span className={styles.badgePending}>
                      PENDING
                    </span>
                  </div>
                </div>
                {/* Reservation 4 */}
                <div className={styles.reservationRowLater}>
                  <div className={styles.reservationGuestInfo}>
                    <p className={styles.guestName}>
                      Sarah Jenkins
                    </p>
                    <p className={styles.guestParty}>Party of 3</p>
                  </div>
                  <div className={styles.reservationTime}>21:00</div>
                  <div className={styles.reservationStatus}>
                    <span className={styles.badgeLater}>
                      LATER
                    </span>
                  </div>
                </div>
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
