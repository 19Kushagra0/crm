import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const CustomerService = {
  // Sync getter from Query Cache
  getCustomers: () => {
    return queryClient.getQueryData(["customers"]) || [];
  },

  // Query Hook
  useCustomers: () => {
    return useQuery({
      queryKey: ["customers"],
      queryFn: async () => {
        const res = await fetch("/api/customers");
        if (!res.ok) throw new Error("Failed to fetch customers");
        return res.json();
      },
    });
  },

  // Mutations/Actions (can be called inside or outside React)
  addCustomer: async (customer) => {
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });
    if (!res.ok) throw new Error("Failed to add customer");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    return data;
  },

  updateCustomer: async (id, updates) => {
    const res = await fetch(`/api/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update customer");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    return data;
  },

  deleteCustomer: async (id) => {
    const res = await fetch(`/api/customers/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete customer");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    return data;
  },

  recordVisit: async (id) => {
    const customers = CustomerService.getCustomers();
    const customer = customers.find((c) => c.id === id);
    const currentVisits = customer ? customer.visits || 0 : 0;

    return CustomerService.updateCustomer(id, {
      visits: currentVisits + 1,
      lastVisit: new Date(),
    });
  },

  updateSpend: async (id, amount) => {
    const customers = CustomerService.getCustomers();
    const customer = customers.find((c) => c.id === id);
    if (!customer) return;

    const newSpend = (customer.totalSpend || 0) + amount;

    let newTier = "Standard";
    if (newSpend >= 100000) {
      newTier = "Platinum";
    } else if (newSpend >= 20000) {
      newTier = "VIP";
    }

    return CustomerService.updateCustomer(id, {
      totalSpend: newSpend,
      tier: newTier,
    });
  },

  // Award manual bonus points — updates totalSpend as a proxy for points
  awardPoints: async (id, bonusPoints) => {
    // Convert points back to spend equivalent: points * 10
    const spendEquivalent = bonusPoints * 10;
    return CustomerService.updateSpend(id, spendEquivalent);
  },
};

export default CustomerService;
