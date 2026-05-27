import { useCampaignsStore } from '@/lib/stores/campaignsStore';

const CampaignService = {
  // Hook for retrieving campaigns state
  useCampaigns: () => {
    return useCampaignsStore((state) => state.campaigns);
  },

  // Direct getter
  getCampaigns: () => {
    return useCampaignsStore.getState().campaigns;
  },

  // Add campaign
  addCampaign: (campaign) => {
    useCampaignsStore.getState().addCampaign(campaign);
  },

  // Update campaign status
  updateCampaignStatus: (id, status) => {
    useCampaignsStore.getState().updateCampaignStatus(id, status);
  }
};

export default CampaignService;
