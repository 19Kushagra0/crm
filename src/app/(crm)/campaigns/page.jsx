"use client";
import React, { useState } from 'react';
import styles from '@/style/campaigns.module.css';
import { Megaphone, AlertTriangle } from '@/lib/icons';

// Custom lightweight inline icons to preserve bundle size and consistency
const PlusIcon = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const MailIcon = ({ className, size = 13 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const MessageSquareIcon = ({ className, size = 13 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const ArrowRightIcon = ({ className, size = 15 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const EditIcon = ({ className, size = 15 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const CheckAllIcon = ({ className, size = 13 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 6 7 17l-5-5"></path>
    <path d="m22 10-7.5 7.5L13 16"></path>
  </svg>
);

const campaignsData = [
  {
    id: 1,
    title: "Win-Back: Inactive Guests",
    status: "active",
    type: "Email",
    segment: "At Risk",
    segmentMeta: "⚠️ At Risk · 42 customers",
    sent: 42,
    opened: 38,
    openedPct: "90%",
    redeemed: 12,
    redeemedPct: "28%",
    preview: "We miss you! Come back this week and enjoy 20% off your next visit...",
    footerText: "Sent May 20",
    actionLabel: "View Report",
    isEmail: true,
  },
  {
    id: 2,
    title: "Weekend Special: Wine Tasting",
    status: "scheduled",
    type: "SMS",
    segment: "Gold",
    segmentMeta: "⭐ Gold · 156 customers",
    sent: 0,
    opened: 0,
    openedPct: "0%",
    redeemed: 0,
    redeemedPct: "0%",
    preview: "Join us this Saturday for an exclusive wine tasting event...",
    footerText: "Scheduled May 26 7PM",
    actionLabel: "Edit Campaign",
    isEmail: false,
  },
  {
    id: 3,
    title: "Anniversary Celebration",
    status: "completed",
    type: "WhatsApp",
    segment: "Silver",
    segmentMeta: "🥈 Silver · 80 customers",
    sent: 80,
    opened: 72,
    openedPct: "90%",
    redeemed: 18,
    redeemedPct: "22.5%",
    preview: "Happy Anniversary! Celebrate with a complimentary bottle of sparkling wine...",
    footerText: "Sent May 15",
    actionLabel: "View Report",
    isEmail: false,
  }
];

export default function CampaignsPage() {
  const [filter, setFilter] = useState('All');

  const filteredCampaigns = filter === 'All' 
    ? campaignsData 
    : campaignsData.filter(c => c.status.toLowerCase() === filter.toLowerCase());

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.titleGroup}>
            <h1 className={styles.pageTitle}>Campaigns</h1>
            <p className={styles.pageSubtitle}>
              3 active · 12 sent this month · 68% avg open rate
            </p>
          </div>
          <div className={styles.headerActions}>
            {/* Filter Pills */}
            <div className={styles.filterPills}>
              {['All', 'Active', 'Scheduled', 'Completed', 'Draft'].map(tab => (
                <button 
                  key={tab} 
                  className={`${styles.filterTab} ${filter === tab ? styles.filterTabActive : ''}`}
                  onClick={() => setFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className={styles.primaryBtn}>
              <PlusIcon />
              New Campaign
            </button>
          </div>
        </div>

        {/* Campaign Grid */}
        <div className={styles.campaignGrid}>
          {filteredCampaigns.map(campaign => (
            <article key={campaign.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>{campaign.title}</h2>
                  <div className={styles.badgeGroup}>
                    {campaign.status === 'active' && (
                      <span className={styles.badgeActive}>
                        <span className={styles.badgeActiveDot} />
                        Active
                      </span>
                    )}
                    {campaign.status === 'scheduled' && (
                      <span className={styles.badgeScheduled}>
                        <span className={styles.badgeScheduledDot} />
                        Scheduled
                      </span>
                    )}
                    {campaign.status === 'completed' && (
                      <span className={styles.badgeCompleted}>
                        <CheckAllIcon />
                        Completed
                      </span>
                    )}
                    <span className={styles.badgeType}>
                      {campaign.isEmail ? <MailIcon /> : <MessageSquareIcon />}
                      {campaign.type}
                    </span>
                  </div>
                </div>
                <div className={styles.segmentInfo}>
                  <span className={styles.segmentLabel}>Segment</span>
                  <span className={styles.segmentValue}>{campaign.segmentMeta}</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className={campaign.status === 'scheduled' ? styles.statsRowMuted : styles.statsRow}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Sent</span>
                  <span className={styles.statValue}>{campaign.sent}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Opened</span>
                  <span className={styles.statValue}>
                    {campaign.opened}
                    {campaign.sent > 0 && (
                      <span className={`${styles.statSubtext} ${styles.statPrimary}`}>
                        ({campaign.openedPct})
                      </span>
                    )}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Redeemed</span>
                  <span className={styles.statValue}>
                    {campaign.redeemed}
                    {campaign.sent > 0 && (
                      <span className={`${styles.statSubtext} ${styles.statGreen}`}>
                        ({campaign.redeemedPct})
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Preview */}
              <div className={styles.previewContainer}>
                <p className={styles.previewText}>
                  "{campaign.preview}"
                </p>
              </div>

              {/* Footer */}
              <div className={styles.cardFooter}>
                <span className={styles.footerDate}>{campaign.footerText}</span>
                <button className={styles.actionBtn}>
                  {campaign.actionLabel}
                  {campaign.status === 'scheduled' ? <EditIcon size={14} /> : <ArrowRightIcon size={14} />}
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Performance Band (Non-Fixed Footer) */}
        <div className={styles.performanceBand}>
          <div className={styles.bandInner}>
            {/* Left: Aggregate Metrics */}
            <div className={styles.metricsContainer}>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Total Sent</span>
                <span className={styles.metricValue}>847</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Avg Open Rate</span>
                <span className={styles.metricValue}>68%</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Conversions</span>
                <span className={styles.metricValue}>124</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Revenue Generated</span>
                <span className={styles.metricValueAmber}>₹38,200</span>
              </div>
            </div>

            {/* Right: Best Performing */}
            <div className={styles.bestPerformingSection}>
              <h3 className={styles.bestPerformingTitle}>Best Performing</h3>
              <div className={styles.performanceRow}>
                <span className={styles.performanceName}>Mother's Day Brunch</span>
                <div className={styles.progressBarTrack}>
                  <div className={styles.progressBarFill} style={{ width: '42%' }} />
                </div>
                <span className={styles.performanceValue}>42%</span>
              </div>
              <div className={styles.performanceRow}>
                <span className={styles.performanceName}>Spring Menu Launch</span>
                <div className={styles.progressBarTrack}>
                  <div className={styles.progressBarFill} style={{ width: '35%' }} />
                </div>
                <span className={styles.performanceValue}>35%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
