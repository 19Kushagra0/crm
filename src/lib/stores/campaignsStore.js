import { create } from 'zustand';

const initialCampaigns = [
  {
    id: 1,
    title: "Win-Back: Inactive Guests",
    status: "active",
    type: "Email",
    segment: "At Risk",
    segmentMeta: "At Risk · 42 customers",
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
    segmentMeta: "Gold · 156 customers",
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
    segmentMeta: "Silver · 80 customers",
    sent: 80,
    opened: 72,
    openedPct: "90%",
    redeemed: 18,
    redeemedPct: "22.5%",
    preview: "Happy Anniversary! Celebrate with a complimentary bottle of sparkling wine...",
    footerText: "Sent May 15",
    actionLabel: "View Report",
    isEmail: false,
  },
  {
    id: 4,
    title: "Mother's Day Brunch",
    status: "completed",
    type: "Email",
    segment: "Gold",
    segmentMeta: "Gold · 156 customers",
    sent: 156,
    opened: 132,
    openedPct: "84.6%",
    redeemed: 42,
    redeemedPct: "26.9%",
    preview: "Treat Mom to a Michelin-starred brunch. Reserve your exclusive table today...",
    footerText: "Sent May 10",
    actionLabel: "View Report",
    isEmail: true,
  },
  {
    id: 5,
    title: "Spring Menu Launch",
    status: "completed",
    type: "Email",
    segment: "Bronze",
    segmentMeta: "Bronze · 64 customers",
    sent: 64,
    opened: 48,
    openedPct: "75%",
    redeemed: 16,
    redeemedPct: "25%",
    preview: "Discover our new seasonal culinary creations. Experience the taste of Spring...",
    footerText: "Sent April 28",
    actionLabel: "View Report",
    isEmail: true,
  }
];

export const useCampaignsStore = create((set) => ({
  campaigns: initialCampaigns,

  addCampaign: (campaign) =>
    set((state) => ({
      campaigns: [campaign, ...state.campaigns]
    })),

  updateCampaignStatus: (id, status) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id ? { ...c, status } : c
      )
    }))
}));
