import React from 'react';
import styles from '@/style/loyalty.module.css';
import { Award, Medal, Star, Sparkles, Utensils, FileText } from '@/lib/icons';

export default function LoyaltyPage() {
  return (
    <main className={styles.container}>
      <div className={styles.inner}>

        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Loyalty &amp; Rewards</h2>
            <p className={styles.pageSubtitle}>
              420 enrolled members · ₹12,400 rewards redeemed this month
            </p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.outlineBtn}>
              <Utensils size={16} />
              New Service
            </button>
            <button className={styles.outlineBtn}>
              <FileText size={16} />
              Shift Report
            </button>
            <button className={styles.primaryBtn}>
              <Award size={16} />
              Create Reward
            </button>
          </div>
        </div>

        {/* Tier Overview (Row 1) */}
        <div className={styles.tierGrid}>
          {/* Bronze */}
          <div className={styles.tierCard}>
            <div className={styles.tierCardTop}>
              <div className={styles.tierCardTitleGroup}>
                <Medal size={28} className={styles.tierIcon} />
                <h3 className={styles.tierName}>Bronze</h3>
              </div>
            </div>
            <div className={styles.tierBottom}>
              <p className={styles.tierLabel}>Base Tier</p>
              <p className={styles.tierCount}>
                184 <span className={styles.tierCountSuffix}>guests</span>
              </p>
            </div>
          </div>

          {/* Silver */}
          <div className={styles.tierCardActive}>
            <div className={styles.tierCardTop}>
              <div className={styles.tierCardTitleGroup}>
                <Star size={28} className={styles.tierIconPrimary} />
                <h3 className={styles.tierName}>Silver</h3>
              </div>
              <span className={styles.tierBadge}>Most Active</span>
            </div>
            <div className={styles.tierBottom}>
              <p className={styles.tierLabel}>Mid Tier</p>
              <p className={styles.tierCount}>
                156 <span className={styles.tierCountSuffix}>guests</span>
              </p>
            </div>
          </div>

          {/* Gold */}
          <div className={styles.tierCardDark}>
            <div className={styles.tierCardTop}>
              <div className={styles.tierCardTitleGroup}>
                <Sparkles size={28} className={styles.tierIconAmber} />
                <h3 className={styles.tierNameLight}>Gold</h3>
              </div>
            </div>
            <div className={styles.tierBottom}>
              <p className={styles.tierLabel}>VIP Tier</p>
              <p className={styles.tierCountAmber}>
                80 <span className={styles.tierCountSuffix}>guests</span>
              </p>
            </div>
          </div>
        </div>

        {/* Lists (Row 2) */}
        <div className={styles.listsGrid}>
          {/* Recent Redemptions */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Recent Redemptions</h3>

            <div className={styles.redemptionRow}>
              <div className={styles.redemptionLeft}>
                <div className={styles.avatar}>AW</div>
                <div>
                  <p className={styles.redemptionName}>Alice Walker</p>
                  <p className={styles.redemptionDesc}>Complimentary Dessert Pairing</p>
                </div>
              </div>
              <span className={styles.redemptionPts}>-200 pts</span>
            </div>

            <div className={styles.redemptionRow}>
              <div className={styles.redemptionLeft}>
                <div className={styles.avatar}>MJ</div>
                <div>
                  <p className={styles.redemptionName}>Marcus Johnson</p>
                  <p className={styles.redemptionDesc}>Priority Seating (Friday)</p>
                </div>
              </div>
              <span className={styles.redemptionPts}>-150 pts</span>
            </div>

            <div className={styles.redemptionRow}>
              <div className={styles.redemptionLeft}>
                <div className={styles.avatar}>SC</div>
                <div>
                  <p className={styles.redemptionName}>Sarah Chen</p>
                  <p className={styles.redemptionDesc}>Chef&apos;s Table Experience</p>
                </div>
              </div>
              <span className={styles.redemptionPts}>-800 pts</span>
            </div>
          </div>

          {/* Expiring Soon */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Expiring Soon</h3>

            <div className={styles.expiringRow}>
              <div>
                <p className={styles.expiringName}>David Lee</p>
                <p className={styles.expiringDesc}>450 pts expiring in 3 days</p>
              </div>
              <button className={styles.reminderBtn}>Send reminder</button>
            </div>

            <div className={styles.expiringRow}>
              <div>
                <p className={styles.expiringName}>Emma Thompson</p>
                <p className={styles.expiringDesc}>120 pts expiring in 5 days</p>
              </div>
              <button className={styles.reminderBtn}>Send reminder</button>
            </div>
          </div>
        </div>

        {/* Key Metrics Footer */}
        <div className={styles.metricsFooter}>
          <div className={styles.metricItem}>
            <p className={styles.metricLabel}>Total Points Issued</p>
            <p className={styles.metricValue}>142,500</p>
          </div>
          <div className={styles.metricItem}>
            <p className={styles.metricLabel}>Points Redeemed</p>
            <p className={styles.metricValue}>89,200</p>
          </div>
          <div className={styles.metricItem}>
            <p className={styles.metricLabel}>Redemption Rate</p>
            <p className={styles.metricValue}>62.5%</p>
          </div>
          <div className={styles.metricItem}>
            <p className={styles.metricLabel}>Revenue from Loyalty</p>
            <p className={styles.metricValue}>₹450k</p>
          </div>
        </div>

      </div>
    </main>
  );
}
