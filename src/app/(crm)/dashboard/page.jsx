import React from 'react';
import styles from '@/style/dashboard.module.css';
import { Clock, Star, CalendarDays, Megaphone, BarChart3 } from '@/lib/icons';

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      {/* Row 1: KPI Cards */}
      <section className={styles.kpiGrid}>
        {/* Revenue */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Today's Revenue</span>
            <span className={styles.badgeTertiary}>+12%</span>
          </div>
          <div className={styles.kpiValue}>₹18,420</div>
        </div>
        {/* Active Orders */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Active Orders</span>
            <span className={styles.badgePrimary}>3 New</span>
          </div>
          <div className={styles.kpiValue}>14</div>
        </div>
        {/* Tables */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeaderMargin}>
            <span className={styles.kpiLabel}>Tables Occupied</span>
            <span className={styles.dataMonoValue}>9 / 14</span>
          </div>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBarFill} style={{ width: '64%' }} />
          </div>
        </div>
        {/* Avg Order Value */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Avg Order Value</span>
            <span className={styles.badgeSecondaryText}>-₹40</span>
          </div>
          <div className={styles.kpiValue}>₹680</div>
        </div>
      </section>

      {/* Row 2: Live Pipeline & Reservations */}
      <section className={styles.pipelineSection}>
        {/* Live Orders Pipeline (60%) */}
        <div className={styles.liveOrdersCol}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Live Orders</h2>
            <a className={styles.cardHeaderLink} href="#">View All</a>
          </div>
          <div className={styles.pipelineGrid}>
            {/* Incoming */}
            <div>
              <div className={styles.columnHeader}>
                <span className={`${styles.columnDot} ${styles.bgAmber}`} />
                <span className={styles.kpiLabel}>Incoming (4)</span>
              </div>
              {/* Order Card */}
              <div className={styles.orderCard}>
                <div className={styles.orderCardHeader}>
                  <span className={styles.orderCardId}>#ORD-892</span>
                  <span className={styles.tableBadge}>T-12</span>
                </div>
                <p className={styles.orderDetails}>2x Truffle Risotto, 1x Wagyu Steak, 1x Sparkling Water</p>
                <div className={styles.cardTimerRow}>
                  <Clock size={14} className={styles.timerAmber} />
                  <span className={`${styles.orderCardId} ${styles.timerAmber}`}>12m</span>
                </div>
              </div>
            </div>
            {/* Preparing */}
            <div>
              <div className={styles.columnHeader}>
                <span className={`${styles.columnDot} ${styles.bgTertiary}`} />
                <span className={styles.kpiLabel}>Preparing (6)</span>
              </div>
              {/* Order Card */}
              <div className={styles.orderCard}>
                <div className={styles.orderCardHeader}>
                  <span className={styles.orderCardId}>#ORD-890</span>
                  <span className={styles.tableBadge}>T-04</span>
                </div>
                <p className={styles.orderDetails}>1x Seafood Platter, 2x White Wine, 1x Oysters</p>
                <div className={styles.cardTimerRow}>
                  <Clock size={14} className={styles.timerSecondary} />
                  <span className={`${styles.orderCardId} ${styles.timerSecondary}`}>24m</span>
                </div>
              </div>
            </div>
            {/* Ready */}
            <div>
              <div className={styles.columnHeader}>
                <span className={`${styles.columnDot} ${styles.bgPrimary}`} />
                <span className={styles.kpiLabel}>Ready (4)</span>
              </div>
              {/* Order Card */}
              <div className={styles.orderCard}>
                <div className={styles.orderCardHeader}>
                  <span className={styles.orderCardId}>#ORD-885</span>
                  <span className={styles.tableBadge}>T-08</span>
                </div>
                <p className={styles.orderDetails}>3x Chocolate Souffle, 3x Espresso</p>
                <div className={styles.cardTimerRow}>
                  <Clock size={14} className={styles.timerSecondary} />
                  <span className={`${styles.orderCardId} ${styles.timerSecondary}`}>2m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Reservations (40%) */}
        <div className={styles.reservationsCol}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Reservations</h2>
            <span className={styles.reservationsStatusText}>Next 2 Hrs</span>
          </div>
          <div className={styles.reservationsList}>
            <div className={styles.reservationRow}>
              <div className={styles.timeCell}>19:30</div>
              <div className={styles.infoCell}>
                <p className={styles.guestName}>Elara Vance</p>
                <p className={styles.guestDetails}>Party of 4</p>
              </div>
              <div className={styles.statusBadgeSeated}>Seated</div>
            </div>
            <div className={styles.reservationRow}>
              <div className={styles.timeCell}>19:45</div>
              <div className={styles.infoCell}>
                <p className={styles.guestName}>Dr. Sterling</p>
                <p className={styles.guestDetails}>Party of 2 · VIP</p>
              </div>
              <div className={styles.statusBadgeConfirmed}>Confirmed</div>
            </div>
            <div className={styles.reservationRow}>
              <div className={styles.timeCell}>20:00</div>
              <div className={styles.infoCell}>
                <p className={styles.guestName}>Otsuka Group</p>
                <p className={styles.guestDetails}>Party of 8</p>
              </div>
              <div className={styles.statusBadgePending}>Pending</div>
            </div>
            <div className={styles.reservationRowLast}>
              <div className={styles.timeCell}>20:15</div>
              <div className={styles.infoCell}>
                <p className={styles.guestName}>J. Reynolds</p>
                <p className={styles.guestDetails}>Party of 2</p>
              </div>
              <div className={styles.statusBadgeConfirmed}>Confirmed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Row 3: Dark Band Data */}
      <section className={styles.darkBandSection}>
        {/* Top Sellers */}
        <div>
          <h2 className={styles.darkBandTitle}>Top Sellers (Today)</h2>
          <div className={styles.sellersList}>
            <div>
              <div className={styles.sellerRowHeader}>
                <span className={styles.sellerIndex}>01</span>
                <span className={styles.sellerName}>Truffle Risotto</span>
                <span className={styles.sellerOrdersCount}>24 Ord</span>
              </div>
              <div className={styles.sellerProgressBarContainer}>
                <div className={styles.sellerProgressBarFill} style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className={styles.sellerRowHeader}>
                <span className={styles.sellerIndex}>02</span>
                <span className={styles.sellerName}>Wagyu A5</span>
                <span className={styles.sellerOrdersCount}>18 Ord</span>
              </div>
              <div className={styles.sellerProgressBarContainer}>
                <div className={styles.sellerProgressBarFill} style={{ width: '65%' }} />
              </div>
            </div>
            <div>
              <div className={styles.sellerRowHeader}>
                <span className={styles.sellerIndex}>03</span>
                <span className={styles.sellerName}>Oyster Dozen</span>
                <span className={styles.sellerOrdersCount}>15 Ord</span>
              </div>
              <div className={styles.sellerProgressBarContainer}>
                <div className={styles.sellerProgressBarFill} style={{ width: '50%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent VIP Guests */}
        <div>
          <h2 className={styles.darkBandTitle}>Recent VIP Activity</h2>
          <div className={styles.vipGrid}>
            <div className={styles.vipCard}>
              <div className={styles.vipAvatar}>AS</div>
              <div>
                <div className={styles.vipNameRow}>
                  <p className={styles.vipName}>A. Sterling</p>
                  <Star className={styles.vipStarIcon} />
                </div>
                <p className={styles.vipStatus}>Checked in 15m ago</p>
              </div>
            </div>
            <div className={styles.vipCard}>
              <div className={styles.vipAvatar}>MW</div>
              <div>
                <div className={styles.vipNameRow}>
                  <p className={styles.vipName}>M. Wallace</p>
                  <Star className={styles.vipStarIcon} />
                </div>
                <p className={styles.vipStatus}>Reserved for Tmrw</p>
              </div>
            </div>
            <div className={styles.vipCard}>
              <div className={styles.vipAvatar}>KL</div>
              <div>
                <div className={styles.vipNameRow}>
                  <p className={styles.vipName}>K. Laurent</p>
                  <Star className={styles.vipStarIcon} />
                </div>
                <p className={styles.vipStatus}>Paid Bill 2h ago</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Row 4: Quick Actions */}
      <section className={styles.actionsGrid}>
        <div className={styles.actionCard}>
          <div className={styles.actionIconPrimary}>
            <CalendarDays size={24} />
          </div>
          <div>
            <h3 className={styles.actionTitle}>Take Reservation</h3>
            <p className={styles.actionDesc}>Manual booking entry</p>
          </div>
        </div>
        <div className={styles.actionCard}>
          <div className={styles.actionIconStandard}>
            <Megaphone size={24} />
          </div>
          <div>
            <h3 className={styles.actionTitle}>Guest Campaign</h3>
            <p className={styles.actionDesc}>Send SMS/Email</p>
          </div>
        </div>
        <div className={styles.actionCard}>
          <div className={styles.actionIconStandard}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h3 className={styles.actionTitle}>End of Day Report</h3>
            <p className={styles.actionDesc}>Generate summaries</p>
          </div>
        </div>
      </section>
    </div>
  );
}
