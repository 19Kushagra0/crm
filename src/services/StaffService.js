import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const StaffService = {
  // Synchronous cache getter
  getStaff: () => {
    return queryClient.getQueryData(["staff"]) || [];
  },

  // Query Hook
  useStaff: () => {
    return useQuery({
      queryKey: ["staff"],
      queryFn: async () => {
        const res = await fetch("/api/staff");
        if (!res.ok) throw new Error("Failed to fetch staff members");
        return res.json();
      },
    });
  },

  // Actions
  addStaff: async (member) => {
    const res = await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    });
    if (!res.ok) throw new Error("Failed to add staff member");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["staff"] });
    return data;
  },

  updateStaff: async (id, updates) => {
    const res = await fetch(`/api/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update staff member");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["staff"] });
    return data;
  },

  deleteStaff: async (id) => {
    const res = await fetch(`/api/staff/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete staff member");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["staff"] });
    return data;
  },

  toggleShiftStatus: async (id) => {
    const res = await fetch(`/api/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggleShiftStatus" }),
    });
    if (!res.ok) throw new Error("Failed to toggle shift status");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["staff"] });
    return data;
  },
};

export default StaffService;
