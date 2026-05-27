import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const CampaignService = {
  // Synchronous cache getter
  getCampaigns: () => {
    return queryClient.getQueryData(["campaigns"]) || [];
  },

  // Query Hook
  useCampaigns: () => {
    return useQuery({
      queryKey: ["campaigns"],
      queryFn: async () => {
        const res = await fetch("/api/campaigns");
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        return res.json();
      },
    });
  },

  // Actions
  addCampaign: async (campaign) => {
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campaign),
    });
    if (!res.ok) throw new Error("Failed to add campaign");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    return data;
  },

  updateCampaignStatus: async (id, status) => {
    const res = await fetch(`/api/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update campaign status");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    return data;
  },
};

export default CampaignService;
