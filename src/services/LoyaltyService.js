import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const LoyaltyService = {
  // Query Hook for rewards & redemptionLog
  useLoyaltyData: () => {
    return useQuery({
      queryKey: ["loyaltyData"],
      queryFn: async () => {
        const res = await fetch("/api/loyalty");
        if (!res.ok) throw new Error("Failed to fetch loyalty data");
        return res.json();
      },
    });
  },

  // Add new reward
  createReward: async (reward) => {
    const res = await fetch("/api/loyalty/rewards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reward),
    });
    if (!res.ok) throw new Error("Failed to create reward");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["loyaltyData"] });
    return data;
  },

  // Delete reward
  deleteReward: async (id) => {
    const res = await fetch(`/api/loyalty/rewards/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete reward");
    queryClient.invalidateQueries({ queryKey: ["loyaltyData"] });
  },

  // Send reminder re-engagement
  sendReminder: async (customerId, customerName) => {
    const res = await fetch("/api/loyalty/remind", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, customerName }),
    });
    if (!res.ok) throw new Error("Failed to send re-engagement reminder");
    return res.json();
  },
};

export default LoyaltyService;
