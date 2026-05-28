"use client";
import React, { useState } from "react";
import styles from "@/style/campaigns.module.css";
import { Megaphone, AlertTriangle, Star, Medal, UserPlus, Plus, Mail, MessageSquare, ArrowRight, Edit, CheckAll, Rocket, Trash2 } from "@/lib/icons";
import CampaignService from "@/services/CampaignService";
import CustomerService from "@/services/CustomerService";

const renderSegmentIcon = (segment) => {
  switch (segment) {
    case "Gold":
      return <Star size={14} className={styles.iconGold} />;
    case "Silver":
      return <Medal size={14} className={styles.iconSilver} />;
    case "Bronze":
      return <Medal size={14} className={styles.iconBronze} />;
    case "New":
      return <UserPlus size={14} className={styles.iconNew} />;
    case "At Risk":
      return <AlertTriangle size={14} className={styles.iconRisk} />;
    default:
      return null;
  }
};

export default function CampaignsPage() {
  const [filter, setFilter] = useState("All");
  const campaignsQueryResult = CampaignService.useCampaigns();
  const campaigns = campaignsQueryResult.data || [];
  const isLoading = campaignsQueryResult.isLoading;
  const customersQueryResult = CustomerService.useCustomers();
  const customers = customersQueryResult.data || [];
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignType, setCampaignType] = useState("Email");
  const [campaignSegment, setCampaignSegment] = useState("Gold");
  const [campaignStatus, setCampaignStatus] = useState("scheduled");
  const [campaignPreview, setCampaignPreview] = useState("");

  // Edit & Report Modals State
  const [reportCampaign, setReportCampaign] = useState(null);
  const [editCampaign, setEditCampaign] = useState(null);

  // Form state for Edit
  const [editTitle, setEditTitle] = useState("");
  const [editType, setEditType] = useState("Email");
  const [editSegment, setEditSegment] = useState("Gold");
  const [editStatus, setEditStatus] = useState("scheduled");
  const [editPreview, setEditPreview] = useState("");

  const handleEditClick = (campaign) => {
    setEditCampaign(campaign);
    setEditTitle(campaign.title);
    setEditType(campaign.type);
    setEditSegment(campaign.segment);
    setEditStatus(campaign.status);
    setEditPreview(campaign.preview);
  };

  const handleUpdateCampaign = async (e) => {
    e.preventDefault();
    if (!editCampaign) return;
    const count = getSegmentCount(editSegment);
    const segmentMeta = `${editSegment} · ${count} customers`;
    
    const updates = {
      title: editTitle,
      type: editType,
      segment: editSegment,
      segmentMeta,
      preview: editPreview,
      status: editStatus,
      isEmail: editType === "Email",
      sent: editStatus === "completed" ? count : editCampaign.sent,
      opened: editStatus === "completed" ? Math.round(count * 0.85) : editCampaign.opened,
      openedPct: editStatus === "completed" ? "85%" : editCampaign.openedPct,
      redeemed: editStatus === "completed" ? Math.round(count * 0.22) : editCampaign.redeemed,
      redeemedPct: editStatus === "completed" ? "22%" : editCampaign.redeemedPct,
      footerText:
        editStatus === "active"
          ? "Sent Just Now"
          : editStatus === "scheduled"
            ? "Scheduled Tomorrow 7PM"
            : "Drafted",
      actionLabel:
        editStatus === "scheduled" ? "Edit Campaign" : "View Report",
    };
    
    await CampaignService.updateCampaign(editCampaign.id, updates);
    setEditCampaign(null);
  };

  const handleLaunchCampaign = async (id, segment) => {
    const count = getSegmentCount(segment);
    await CampaignService.launchCampaign(id, count);
  };

  const handleDeleteCampaign = async (id) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      await CampaignService.deleteCampaign(id);
    }
  };

  // Dynamically calculate segment sizes based on active customers
  const getSegmentCount = (segmentName) => {
    switch (segmentName) {
      case "Gold": // Maps to Platinum
        return customers.filter((c) => c.tier === "Platinum").length;
      case "Silver": // Maps to VIP
        return customers.filter((c) => c.tier === "VIP").length;
      case "Bronze": // Maps to Standard
        return customers.filter((c) => c.tier === "Standard").length;
      case "New": // Basic/new customer profile with <= 1 visit
        return customers.filter((c) => c.visits <= 1).length;
      case "At Risk": // Inactive customers whose last visit was > 30 days ago
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        return customers.filter(
          (c) => new Date(c.lastVisit).getTime() < thirtyDaysAgo,
        ).length;
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
      sent: campaignStatus === "completed" ? count : 0,
      opened: campaignStatus === "completed" ? Math.round(count * 0.85) : 0,
      openedPct: campaignStatus === "completed" ? "85%" : "0%",
      redeemed: campaignStatus === "completed" ? Math.round(count * 0.22) : 0,
      redeemedPct: campaignStatus === "completed" ? "22%" : "0%",
      preview: campaignPreview,
      footerText:
        campaignStatus === "active"
          ? "Sent Just Now"
          : campaignStatus === "scheduled"
            ? "Scheduled Tomorrow 7PM"
            : "Drafted",
      actionLabel:
        campaignStatus === "scheduled" ? "Edit Campaign" : "View Report",
      isEmail: campaignType === "Email",
    };

    CampaignService.addCampaign(newCampaign);
    setCampaignTitle("");
    setCampaignPreview("");
    setShowModal(false);
  };

  const filteredCampaigns =
    filter === "All"
      ? campaigns
      : campaigns.filter(
          (c) => c.status.toLowerCase() === filter.toLowerCase(),
        );

  // Aggregate Metrics derived from store
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0);
  const avgOpenRate =
    totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
  const totalConversions = campaigns.reduce((sum, c) => sum + c.redeemed, 0);
  // Assume each redemption brings ₹950 in revenue
  const revenueGenerated = campaigns.reduce(
    (sum, c) => sum + c.redeemed * 950,
    0,
  );

  // Best Performing Campaigns
  const completedCampaigns = campaigns
    .filter((c) => c.sent > 0)
    .map((c) => {
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
              {campaigns.length} campaigns · {totalSent.toLocaleString("en-IN")}{" "}
              total messages sent
            </p>
          </div>
          <div className={styles.headerActions}>
            {/* Filter Pills */}
            <div className={styles.filterPills}>
              {["All", "Active", "Scheduled", "Completed", "Draft"].map(
                (tab) => (
                  <button
                    key={tab}
                    className={`${styles.filterTab} ${filter === tab ? styles.filterTabActive : ""}`}
                    onClick={() => setFilter(tab)}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>
            <button
              className={styles.primaryBtn}
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} />
              New Campaign
            </button>
          </div>
        </div>

        {/* Campaign Grid */}
        <div className={styles.campaignGrid}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className={styles.cardLoading} />
              ))
            : filteredCampaigns.map((campaign) => (
                <article key={campaign.id} className={styles.card}>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <div>
                        <h2 className={styles.cardTitle}>{campaign.title}</h2>
                        <div className={styles.badgeGroup}>
                          {campaign.status === "active" && (
                            <span className={styles.badgeActive}>
                              <span className={styles.badgeActiveDot} />
                              Active
                            </span>
                          )}
                          {campaign.status === "scheduled" && (
                            <span className={styles.badgeScheduled}>
                              <span className={styles.badgeScheduledDot} />
                              Scheduled
                            </span>
                          )}
                          {campaign.status === "completed" && (
                            <span className={styles.badgeCompleted}>
                              <CheckAll size={13} />
                              Completed
                            </span>
                          )}
                          <span className={styles.badgeType}>
                            {campaign.isEmail ? (
                              <Mail size={13} />
                            ) : (
                              <MessageSquare size={13} />
                            )}
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
                    <div
                      className={
                        campaign.status === "scheduled"
                          ? styles.statsRowMuted
                          : styles.statsRow
                      }
                    >
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Sent</span>
                        <span className={styles.statValue}>{campaign.sent}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Opened</span>
                        <span className={styles.statValue}>
                          {campaign.opened}
                          {campaign.sent > 0 && (
                            <span
                              className={`${styles.statSubtext} ${styles.statPrimary}`}
                            >
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
                            <span
                              className={`${styles.statSubtext} ${styles.statGreen}`}
                            >
                              ({campaign.redeemedPct})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className={styles.previewContainer}>
                      <p className={styles.previewText}>"{campaign.preview}"</p>
                    </div>

                    {/* Footer */}
                    <div className={styles.cardFooter}>
                      <span className={styles.footerDate}>
                        {campaign.footerText}
                      </span>
                      {campaign.status === "scheduled" && (
                        <div className={styles.cardActions}>
                          <button
                            className={styles.actionBtn}
                            onClick={() => handleEditClick(campaign)}
                          >
                            Edit Campaign
                            <Edit size={14} />
                          </button>
                          <button
                            className={styles.launchBtn}
                            onClick={() => handleLaunchCampaign(campaign.id, campaign.segment)}
                          >
                            Launch Now
                            <Rocket size={14} />
                          </button>
                        </div>
                      )}
                      {campaign.status === "draft" && (
                        <div className={styles.cardActions}>
                          <button
                            className={styles.actionBtn}
                            onClick={() => handleEditClick(campaign)}
                          >
                            Edit Campaign
                            <Edit size={14} />
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            title="Delete Campaign"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                      {(campaign.status === "active" || campaign.status === "completed") && (
                        <button
                          className={styles.actionBtn}
                          onClick={() => setReportCampaign(campaign)}
                        >
                          View Report
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
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
                <span className={styles.metricValue}>
                  {totalSent.toLocaleString("en-IN")}
                </span>
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
                <span className={styles.metricValueAmber}>
                  ₹{revenueGenerated.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Right: Best Performing */}
            <div className={styles.bestPerformingSection}>
              <h3 className={styles.bestPerformingTitle}>Best Performing</h3>
              {completedCampaigns.map((c) => (
                <div key={c.id} className={styles.performanceRow}>
                  <span className={styles.performanceName}>{c.title}</span>
                  <div className={styles.progressBarTrack}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: `${c.conversionRate}%` }}
                    />
                  </div>
                  <span className={styles.performanceValue}>
                    {c.conversionRate}%
                  </span>
                </div>
              ))}
              {completedCampaigns.length === 0 && (
                <p
                  className={styles.performanceMuted}
                  style={{ color: "var(--color-secondary)", fontSize: "12px" }}
                >
                  No completed campaigns yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
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
                  <option value="Gold">
                    Gold Segment ({getSegmentCount("Gold")} guests)
                  </option>
                  <option value="Silver">
                    Silver Segment ({getSegmentCount("Silver")} guests)
                  </option>
                  <option value="Bronze">
                    Bronze Segment ({getSegmentCount("Bronze")} guests)
                  </option>
                  <option value="New">
                    New Segment ({getSegmentCount("New")} guests)
                  </option>
                  <option value="At Risk">
                    At Risk Segment ({getSegmentCount("At Risk")} guests)
                  </option>
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

      {editCampaign && (
        <div
          className={styles.modalOverlay}
          onClick={() => setEditCampaign(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>Edit Campaign</h2>
            <form onSubmit={handleUpdateCampaign}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Solstice Special"
                  className={styles.formInput}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Marketing Channel</label>
                <select
                  className={styles.formSelect}
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
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
                  value={editSegment}
                  onChange={(e) => setEditSegment(e.target.value)}
                >
                  <option value="Gold">
                    Gold Segment ({getSegmentCount("Gold")} guests)
                  </option>
                  <option value="Silver">
                    Silver Segment ({getSegmentCount("Silver")} guests)
                  </option>
                  <option value="Bronze">
                    Bronze Segment ({getSegmentCount("Bronze")} guests)
                  </option>
                  <option value="New">
                    New Segment ({getSegmentCount("New")} guests)
                  </option>
                  <option value="At Risk">
                    At Risk Segment ({getSegmentCount("At Risk")} guests)
                  </option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Campaign Status</label>
                <select
                  className={styles.formSelect}
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
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
                  value={editPreview}
                  onChange={(e) => setEditPreview(e.target.value)}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setEditCampaign(null)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalSaveBtn}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {reportCampaign && (
        <div
          className={styles.modalOverlay}
          onClick={() => setReportCampaign(null)}
        >
          <div
            className={styles.reportModal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>Campaign Report</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Campaign</label>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--color-ink)", marginBottom: "4px" }}>
                {reportCampaign.title}
              </div>
              <div className={styles.badgeGroup}>
                <span className={styles.badgeActive} style={{ textTransform: "capitalize" }}>
                  {reportCampaign.status}
                </span>
                <span className={styles.badgeType}>
                  {reportCampaign.type}
                </span>
                <span className={styles.segmentValue} style={{ fontSize: "10px", padding: "2px 8px" }}>
                  {reportCampaign.segmentMeta}
                </span>
              </div>
            </div>

            <div className={styles.reportStatsGrid}>
              <div className={styles.reportStatBox}>
                <span className={styles.reportStatLabel}>Sent</span>
                <span className={styles.reportStatValue}>{reportCampaign.sent}</span>
              </div>
              <div className={styles.reportStatBox}>
                <span className={styles.reportStatLabel}>Opened</span>
                <span className={styles.reportStatValue}>{reportCampaign.opened}</span>
                <span className={styles.reportStatSub}>{reportCampaign.openedPct} Open Rate</span>
              </div>
              <div className={styles.reportStatBox}>
                <span className={styles.reportStatLabel}>Redeemed</span>
                <span className={styles.reportStatValue}>{reportCampaign.redeemed}</span>
                <span className={styles.reportStatSub} style={{ color: "#2f9e44" }}>{reportCampaign.redeemedPct} Conversion</span>
              </div>
              <div className={styles.reportStatBox}>
                <span className={styles.reportStatLabel}>Est. Revenue</span>
                <span className={styles.reportStatValue} style={{ color: "#c49a3e" }}>
                  ₹{(reportCampaign.redeemed * 950).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className={styles.reportChartSection}>
              <h3 className={styles.reportChartTitle}>Performance Analysis</h3>
              <div className={styles.reportChartRow}>
                <div className={styles.reportChartRowHeader}>
                  <span>Open Rate</span>
                  <span>{reportCampaign.openedPct}</span>
                </div>
                <div className={styles.reportBar}>
                  <div
                    className={styles.reportBarFill}
                    style={{ width: reportCampaign.openedPct || "0%", backgroundColor: "var(--color-primary)" }}
                  />
                </div>
              </div>
              <div className={styles.reportChartRow}>
                <div className={styles.reportChartRowHeader}>
                  <span>Conversion Rate</span>
                  <span>{reportCampaign.redeemedPct}</span>
                </div>
                <div className={styles.reportBar}>
                  <div
                    className={styles.reportBarFill}
                    style={{ width: reportCampaign.redeemedPct || "0%", backgroundColor: "#2f9e44" }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.reportPreviewSection}>
              <span className={styles.reportPreviewLabel}>Message Body</span>
              <p className={styles.reportPreviewText}>"{reportCampaign.preview}"</p>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setReportCampaign(null)}
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
