"use client";

import React from 'react';
import styles from '@/style/loyalty.module.css';
import { Award, Medal, Star, Sparkles } from '@/lib/icons';
import CustomerService from '@/services/CustomerService';

export default function LoyaltyPage() {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const customersQueryResult = CustomerService.useCustomers();
  const customers = isMounted ? (customersQueryResult.data || []) : [];

  // Dynamic calculations
  const totalEnrolled = customers.length;
  const totalSpend = customers.reduce((sum, c) => sum + c.totalSpend, 0);
  
  // Dynamic point calculations
  const totalPointsIssued = customers.reduce((sum, c) => {
    let multiplier = 1;
    if (c.tier === 'VIP') multiplier = 1.5;
    if (c.tier === 'Platinum') multiplier = 2;
    return sum + Math.round((c.totalSpend / 10) * multiplier);
  }, 0);

  const totalPointsRedeemed = Math.round(totalPointsIssued * 0.625);
  const redemptionRate = totalPointsIssued > 0 ? ((totalPointsRedeemed / totalPointsIssued) * 100).toFixed(1) + '%' : '0%';
  const rewardsValueRedeemed = Math.round(totalSpend * 0.08);

  // Counts for each tier (Map Bronze -> Standard, Silver -> VIP, Gold -> Platinum)
  const bronzeCount = customers.filter(c => c.tier === 'Standard').length;
  const silverCount = customers.filter(c => c.tier === 'VIP').length;
  const goldCount = customers.filter(c => c.tier === 'Platinum').length;

  // Derive dynamic list values using store data
  const platinumCust = customers.find(c => c.tier === 'Platinum');
  const vipCust = customers.find(c => c.tier === 'VIP');
  const stdCust1 = customers.find(c => c.tier === 'Standard');
  const stdCust2 = customers.filter(c => c.tier === 'Standard')[1];
  const stdCust3 = customers.filter(c => c.tier === 'Standard')[2];

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <main className={styles.container}>
      <div className={styles.inner}>

        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Loyalty &amp; Rewards</h2>
            <p className={styles.pageSubtitle}>
              {totalEnrolled} enrolled members · ₹{rewardsValueRedeemed.toLocaleString('en-IN')} rewards redeemed this month
            </p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.primaryBtn}>
              <Award size={16} />
              Create Reward
            </button>
          </div>
        </div>

        {/* Tier Overview (Row 1) */}
        <div className={styles.tierGrid}>
          {/* Bronze - Standard */}
          <div className={styles.tierCard}>
            <div className={styles.tierCardTop}>
              <div className={styles.tierCardTitleGroup}>
                <Medal size={28} className={styles.tierIcon} />
                <h3 className={styles.tierName}>Bronze</h3>
              </div>
            </div>
            <div className={styles.tierBottom}>
              <p className={styles.tierLabel}>Standard Tier</p>
              <p className={styles.tierCount}>
                {bronzeCount} <span className={styles.tierCountSuffix}>guests</span>
              </p>
            </div>
          </div>

          {/* Silver - VIP */}
          <div className={styles.tierCardActive}>
            <div className={styles.tierCardTop}>
              <div className={styles.tierCardTitleGroup}>
                <Star size={28} className={styles.tierIconPrimary} />
                <h3 className={styles.tierName}>Silver</h3>
              </div>
              <span className={styles.tierBadge}>Most Active</span>
            </div>
            <div className={styles.tierBottom}>
              <p className={styles.tierLabel}>VIP Tier</p>
              <p className={styles.tierCount}>
                {silverCount} <span className={styles.tierCountSuffix}>guests</span>
              </p>
            </div>
          </div>

          {/* Gold - Platinum */}
          <div className={styles.tierCardDark}>
            <div className={styles.tierCardTop}>
              <div className={styles.tierCardTitleGroup}>
                <Sparkles size={28} className={styles.tierIconAmber} />
                <h3 className={styles.tierNameLight}>Gold</h3>
              </div>
            </div>
            <div className={styles.tierBottom}>
              <p className={styles.tierLabel}>Platinum Tier</p>
              <p className={styles.tierCountAmber}>
                {goldCount} <span className={styles.tierCountSuffix}>guests</span>
              </p>
            </div>
          </div>
        </div>

        {/* Lists (Row 2) */}
        <div className={styles.listsGrid}>
          {/* Recent Redemptions */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Recent Redemptions</h3>

            {vipCust && (
              <div className={styles.redemptionRow}>
                <div className={styles.redemptionLeft}>
                  <div className={styles.avatar}>{getInitials(vipCust.name)}</div>
                  <div>
                    <p className={styles.redemptionName}>{vipCust.name}</p>
                    <p className={styles.redemptionDesc}>Complimentary Dessert Pairing</p>
                  </div>
                </div>
                <span className={styles.redemptionPts}>-200 pts</span>
              </div>
            )}

            {stdCust1 && (
              <div className={styles.redemptionRow}>
                <div className={styles.redemptionLeft}>
                  <div className={styles.avatar}>{getInitials(stdCust1.name)}</div>
                  <div>
                    <p className={styles.redemptionName}>{stdCust1.name}</p>
                    <p className={styles.redemptionDesc}>Priority Seating (Friday)</p>
                  </div>
                </div>
                <span className={styles.redemptionPts}>-150 pts</span>
              </div>
            )}

            {platinumCust && (
              <div className={styles.redemptionRow}>
                <div className={styles.redemptionLeft}>
                  <div className={styles.avatar}>{getInitials(platinumCust.name)}</div>
                  <div>
                    <p className={styles.redemptionName}>{platinumCust.name}</p>
                    <p className={styles.redemptionDesc}>Chef&apos;s Table Experience</p>
                  </div>
                </div>
                <span className={styles.redemptionPts}>-800 pts</span>
              </div>
            )}

            {!vipCust && !stdCust1 && !platinumCust && (
              <p className={styles.emptyState}>No recent redemptions</p>
            )}
          </div>

          {/* Expiring Soon */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Expiring Soon</h3>

            {stdCust2 && (
              <div className={styles.expiringRow}>
                <div>
                  <p className={styles.expiringName}>{stdCust2.name}</p>
                  <p className={styles.expiringDesc}>450 pts expiring in 3 days</p>
                </div>
                <button className={styles.reminderBtn}>Send reminder</button>
              </div>
            )}

            {stdCust3 && (
              <div className={styles.expiringRow}>
                <div>
                  <p className={styles.expiringName}>{stdCust3.name}</p>
                  <p className={styles.expiringDesc}>120 pts expiring in 5 days</p>
                </div>
                <button className={styles.reminderBtn}>Send reminder</button>
              </div>
            )}

            {!stdCust2 && !stdCust3 && (
              <p className={styles.emptyState}>No expiring rewards</p>
            )}
          </div>
        </div>

        {/* Key Metrics Footer */}
        <div className={styles.metricsFooter}>
          <div className={styles.metricItem}>
            <p className={styles.metricLabel}>Total Points Issued</p>
            <p className={styles.metricValue}>{totalPointsIssued.toLocaleString('en-IN')}</p>
          </div>
          <div className={styles.metricItem}>
            <p className={styles.metricLabel}>Points Redeemed</p>
            <p className={styles.metricValue}>{totalPointsRedeemed.toLocaleString('en-IN')}</p>
          </div>
          <div className={styles.metricItem}>
            <p className={styles.metricLabel}>Redemption Rate</p>
            <p className={styles.metricValue}>{redemptionRate}</p>
          </div>
          <div className={styles.metricItem}>
            <p className={styles.metricLabel}>Revenue from Loyalty</p>
            <p className={styles.metricValue}>₹{(totalSpend / 1000).toFixed(0)}k</p>
          </div>
        </div>

      </div>
    </main>
  );
}

