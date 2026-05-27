"use client";
import React, { useState } from 'react';
import styles from '@/style/campaigns.module.css';
import { Megaphone, AlertTriangle, Star, Medal, UserPlus } from '@/lib/icons';
import CampaignService from '@/services/CampaignService';
import CustomerService from '@/services/CustomerService';

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

const renderSegmentIcon = (segment) => {
  switch (segment) {
    case 'Gold':
      return <Star size={14} className={styles.iconGold} />;
    case 'Silver':
      return <Medal size={14} className={styles.iconSilver} />;
    case 'Bronze':
      return <Medal size={14} className={styles.iconBronze} />;
    case 'New':
      return <UserPlus size={14} className={styles.iconNew} />;
    case 'At Risk':
      return <AlertTriangle size={14} className={styles.iconRisk} />;
    default:
      return null;
  }
};

export default function CampaignsPage() {
  const [filter, setFilter] = useState('All');
  const campaignsQueryResult = CampaignService.useCampaigns();
  const campaigns = campaignsQueryResult.data || [];
  const isLoading = campaignsQueryResult.isLoading;
  const customersQueryResult = CustomerService.useCustomers();
  const customers = customersQueryResult.data || [];
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignType, setCampaignType] = useState('Email');
  const [campaignSegment, setCampaignSegment] = useState('Gold');
  const [campaignStatus, setCampaignStatus] = useState('scheduled');
  const [campaignPreview, setCampaignPreview] = useState('');

  // Dynamically calculate segment sizes based on active customers
  const getSegmentCount = (segmentName) => {
    switch (segmentName) {
      case 'Gold': // Maps to Platinum
        return customers.filter(c => c.tier === 'Platinum').length;
      case 'Silver': // Maps to VIP
        return customers.filter(c => c.tier === 'VIP').length;
      case 'Bronze': // Maps to Standard
        return customers.filter(c => c.tier === 'Standard').length;
      case 'New': // Basic/new customer profile with <= 1 visit
        return customers.filter(c => c.visits <= 1).length;
      case 'At Risk': // Inactive customers whose last visit was > 30 days ago
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        return customers.filter(c => new Date(c.lastVisit).getTime() < thirtyDaysAgo).length;
      default:
        return 0;
    }
  };

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!campaignTitle.trim() || !campaignPreview.trim()) return;

    const count = getSegmentCount(campaignSegment);
    const segmentMeta = `${campaignSegment} · ${count} customers`;

    const newCampaign = {
      id: Date.now(),
      title: campaignTitle,
      status: campaignStatus,
      type: campaignType,
      segment: campaignSegment,
      segmentMeta,
      sent: campaignStatus === 'completed' ? count : 0,
      opened: campaignStatus === 'completed' ? Math.round(count * 0.85) : 0,
      openedPct: campaignStatus === 'completed' ? "85%" : "0%",
      redeemed: campaignStatus === 'completed' ? Math.round(count * 0.22) : 0,
      redeemedPct: campaignStatus === 'completed' ? "22%" : "0%",
      preview: campaignPreview,
      footerText: campaignStatus === 'active' ? 'Sent Just Now' : campaignStatus === 'scheduled' ? 'Scheduled Tomorrow 7PM' : 'Drafted',
      actionLabel: campaignStatus === 'scheduled' ? 'Edit Campaign' : 'View Report',
      isEmail: campaignType === 'Email',
    };

    CampaignService.addCampaign(newCampaign);
    setCampaignTitle('');
    setCampaignPreview('');
    setShowModal(false);
  };

  const filteredCampaigns = filter === 'All' 
    ? campaigns 
    : campaigns.filter(c => c.status.toLowerCase() === filter.toLowerCase());

  // Aggregate Metrics derived from store
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0);
  const avgOpenRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
  const totalConversions = campaigns.reduce((sum, c) => sum + c.redeemed, 0);
  // Assume each redemption brings ₹950 in revenue
  const revenueGenerated = campaigns.reduce((sum, c) => sum + (c.redeemed * 950), 0);

  // Best Performing Campaigns
  const completedCampaigns = campaigns
    .filter(c => c.sent > 0)
    .map(c => {
      const conversionRate = Math.round((c.redeemed / c.sent) * 100);
      return { ...c, conversionRate };
    })
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, 2);

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.titleGroup}>
            <h2 className={styles.pageTitle}>Marketing Campaigns</h2>
            <p className={styles.pageSubtitle}>
              {campaigns.length} campaigns · {totalSent.toLocaleString('en-IN')} total messages sent
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
            <button className={styles.primaryBtn} onClick={() => setShowModal(true)}>
              <PlusIcon />
              New Campaign
            </button>
          </div>
        </div>

        {/* Campaign Grid */}
        <div className={styles.campaignGrid}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className={styles.cardLoading} />
            ))
          ) : (
            filteredCampaigns.map(campaign => (
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
                    <span className={styles.segmentValue}>
                      {renderSegmentIcon(campaign.segment)}
                      <span>{campaign.segmentMeta}</span>
                    </span>
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
            ))
          )}
        </div>

        {/* Performance Band (Non-Fixed Footer) */}
        <div className={styles.performanceBand}>
          <div className={styles.bandInner}>
            {/* Left: Aggregate Metrics */}
            <div className={styles.metricsContainer}>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Total Sent</span>
                <span className={styles.metricValue}>{totalSent.toLocaleString('en-IN')}</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Avg Open Rate</span>
                <span className={styles.metricValue}>{avgOpenRate}%</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Conversions</span>
                <span className={styles.metricValue}>{totalConversions}</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Revenue Generated</span>
                <span className={styles.metricValueAmber}>₹{revenueGenerated.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Right: Best Performing */}
            <div className={styles.bestPerformingSection}>
              <h3 className={styles.bestPerformingTitle}>Best Performing</h3>
              {completedCampaigns.map(c => (
                <div key={c.id} className={styles.performanceRow}>
                  <span className={styles.performanceName}>{c.title}</span>
                  <div className={styles.progressBarTrack}>
                    <div className={styles.progressBarFill} style={{ width: `${c.conversionRate}%` }} />
                  </div>
                  <span className={styles.performanceValue}>{c.conversionRate}%</span>
                </div>
              ))}
              {completedCampaigns.length === 0 && (
                <p className={styles.performanceMuted} style={{ color: 'var(--color-secondary)', fontSize: '12px' }}>
                  No completed campaigns yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>New Campaign</h2>
            <form onSubmit={handleCreateCampaign}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Solstice Special"
                  className={styles.formInput}
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Marketing Channel</label>
                <select
                  className={styles.formSelect}
                  value={campaignType}
                  onChange={(e) => setCampaignType(e.target.value)}
                >
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Target Segment</label>
                <select
                  className={styles.formSelect}
                  value={campaignSegment}
                  onChange={(e) => setCampaignSegment(e.target.value)}
                >
                  <option value="Gold">Gold Segment ({getSegmentCount('Gold')} guests)</option>
                  <option value="Silver">Silver Segment ({getSegmentCount('Silver')} guests)</option>
                  <option value="Bronze">Bronze Segment ({getSegmentCount('Bronze')} guests)</option>
                  <option value="New">New Segment ({getSegmentCount('New')} guests)</option>
                  <option value="At Risk">At Risk Segment ({getSegmentCount('At Risk')} guests)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Initial Status</label>
                <select
                  className={styles.formSelect}
                  value={campaignStatus}
                  onChange={(e) => setCampaignStatus(e.target.value)}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="active">Launch Instantly</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Message Content</label>
                <textarea
                  required
                  placeholder="Type your message body here..."
                  className={styles.formTextArea}
                  value={campaignPreview}
                  onChange={(e) => setCampaignPreview(e.target.value)}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalSaveBtn}>
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
