"use client";

import React, { useState, useEffect } from 'react';
import styles from '@/style/loyalty.module.css';
import { Award, Medal, Star, Sparkles, AlertTriangle, Plus, Trash2 } from '@/lib/icons';
import CustomerService from '@/services/CustomerService';
import LoyaltyService from '@/services/LoyaltyService';
import { useSession } from 'next-auth/react';

export default function LoyaltyPage() {
  const { data: session } = useSession();
  const currentUserRole = session?.user?.role || "staff";
  const isManagement = currentUserRole === "owner" || currentUserRole === "manager";

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch Customers & Loyalty Data
  const customersQueryResult = CustomerService.useCustomers();
  const customers = isMounted ? (customersQueryResult.data || []) : [];

  const loyaltyDataQueryResult = LoyaltyService.useLoyaltyData();
  const loyaltyData = isMounted ? (loyaltyDataQueryResult.data || { rewards: [], redemptionLog: [] }) : { rewards: [], redemptionLog: [] };
  const rewards = loyaltyData.rewards || [];
  const redemptionLog = loyaltyData.redemptionLog || [];

  // Modals and form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRewardName, setNewRewardName] = useState("");
  const [newRewardCost, setNewRewardCost] = useState("");
  const [newRewardDesc, setNewRewardDesc] = useState("");

  // Re-engagement sent status tracker
  const [sentReminders, setSentReminders] = useState({});

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

  const totalPointsRedeemed = redemptionLog.reduce((sum, log) => sum + (log.points || 0), 0);
  const redemptionRate = totalPointsIssued > 0 ? ((totalPointsRedeemed / totalPointsIssued) * 100).toFixed(1) + '%' : '0%';
  const rewardsValueRedeemed = redemptionLog.length * 1200; // estimated cost/value of rewards redeemed

  // Counts for each tier
  const bronzeCount = customers.filter(c => c.tier === 'Standard').length;
  const silverCount = customers.filter(c => c.tier === 'VIP').length;
  const goldCount = customers.filter(c => c.tier === 'Platinum').length;

  // At Risk calculation (last visit > 30 days)
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const atRiskGuests = customers.filter(c => new Date(c.lastVisit).getTime() < thirtyDaysAgo).slice(0, 5);

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleCreateReward = async (e) => {
    e.preventDefault();
    if (!newRewardName.trim() || !newRewardCost) return;

    await LoyaltyService.createReward({
      name: newRewardName,
      pointCost: parseInt(newRewardCost),
      description: newRewardDesc
    });

    setNewRewardName("");
    setNewRewardCost("");
    setNewRewardDesc("");
    setShowCreateModal(false);
  };

  const handleDeleteReward = async (id) => {
    if (confirm("Are you sure you want to delete this reward from the catalog?")) {
      await LoyaltyService.deleteReward(id);
    }
  };

  const handleSendReminder = async (customerId, name) => {
    setSentReminders(prev => ({ ...prev, [customerId]: 'sending' }));
    try {
      await LoyaltyService.sendReminder(customerId, name);
      setSentReminders(prev => ({ ...prev, [customerId]: 'sent' }));
      setTimeout(() => {
        setSentReminders(prev => {
          const next = { ...prev };
          delete next[customerId];
          return next;
        });
      }, 2000);
    } catch (err) {
      console.error(err);
      setSentReminders(prev => ({ ...prev, [customerId]: 'failed' }));
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.inner}>

        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Loyalty &amp; Rewards</h2>
            <p className={styles.pageSubtitle}>
              {totalEnrolled} enrolled members · {redemptionLog.length} redemptions logged overall
            </p>
          </div>
          {isManagement && (
            <div className={styles.headerActions}>
              <button className={styles.primaryBtn} onClick={() => setShowCreateModal(true)}>
                <Plus size={16} />
                Create Reward
              </button>
            </div>
          )}
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
              <p className={styles.tierLabel}>Standard Tier (1x Points)</p>
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
              <span className={styles.tierBadge}>1.5x Points</span>
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
              <span className={styles.tierBadge} style={{ backgroundColor: "#272725", color: "#e8a55a" }}>2x Points</span>
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
            <div style={{ display: "flex", flexDirection: "column" }}>
              {redemptionLog.map(redemption => (
                <div key={redemption.id} className={styles.redemptionRow}>
                  <div className={styles.redemptionLeft}>
                    <div className={styles.avatar}>{getInitials(redemption.customerName)}</div>
                    <div>
                      <p className={styles.redemptionName}>{redemption.customerName}</p>
                      <p className={styles.redemptionDesc}>{redemption.rewardName}</p>
                    </div>
                  </div>
                  <span className={styles.redemptionPts}>-{redemption.points} pts</span>
                </div>
              ))}
              {redemptionLog.length === 0 && (
                <p className={styles.emptyState}>No recent redemptions</p>
              )}
            </div>
          </div>

          {/* At Risk Guests */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>At Risk Guests</h3>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {atRiskGuests.map(guest => {
                const daysAgo = Math.floor((Date.now() - new Date(guest.lastVisit).getTime()) / (24 * 60 * 60 * 1000));
                const status = sentReminders[guest.id];

                return (
                  <div key={guest.id} className={styles.atRiskRow}>
                    <div>
                      <p className={styles.atRiskName}>{guest.name}</p>
                      <p className={styles.atRiskDays}>Last visit {daysAgo} days ago</p>
                    </div>
                    {status === 'sending' ? (
                      <span className={styles.reengageBtnSent} style={{ color: 'var(--color-primary)' }}>Sending...</span>
                    ) : status === 'sent' ? (
                      <span className={styles.reengageBtnSent}>✓ Sent</span>
                    ) : (
                      <button 
                        className={styles.reengageBtn}
                        onClick={() => handleSendReminder(guest.id, guest.name)}
                      >
                        Send Re-engagement
                      </button>
                    )}
                  </div>
                );
              })}
              {atRiskGuests.length === 0 && (
                <p className={styles.emptyState}>No at-risk guests at the moment</p>
              )}
            </div>
          </div>
        </div>

        {/* Rewards Catalog */}
        <div className={styles.rewardsCatalogSection}>
          <div className={styles.rewardsCatalogHeader}>
            <h3 className={styles.rewardsCatalogTitle}>Rewards Catalog</h3>
          </div>
          <div className={styles.rewardsCatalogGrid}>
            {rewards.map(reward => (
              <div key={reward.id} className={styles.rewardCard}>
                <div className={styles.rewardCardHeader}>
                  <h4 className={styles.rewardName}>{reward.name}</h4>
                  <span className={styles.rewardCost}>{reward.pointCost} pts</span>
                </div>
                <p className={styles.rewardDesc}>{reward.description}</p>
                {isManagement && (
                  <button
                    className={styles.rewardDelete}
                    onClick={() => handleDeleteReward(reward.id)}
                    title="Delete Reward"
                  >
                    <Trash2 size={14} />
                    Delete Reward
                  </button>
                )}
              </div>
            ))}
            {rewards.length === 0 && (
              <p className={styles.emptyState} style={{ gridColumn: "span 2" }}>No rewards registered in catalog</p>
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

      {/* Create Reward Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Create New Reward</h2>
            <form onSubmit={handleCreateReward}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Reward Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Vintage Champagne Bottle"
                  className={styles.formInput}
                  value={newRewardName}
                  onChange={(e) => setNewRewardName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Point Cost</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  placeholder="e.g. 500"
                  className={styles.formInput}
                  value={newRewardCost}
                  onChange={(e) => setNewRewardCost(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea 
                  required
                  placeholder="Describe the reward or any restrictions..."
                  className={styles.formTextArea}
                  value={newRewardDesc}
                  onChange={(e) => setNewRewardDesc(e.target.value)}
                />
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.modalCancelBtn}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalSaveBtn}>
                  Create Reward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
