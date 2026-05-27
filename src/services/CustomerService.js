import { useCustomersStore } from '@/lib/stores/customersStore';

const CustomerService = {
  getCustomers: () => useCustomersStore.getState().customers,
  useCustomers: () => useCustomersStore(state => state.customers),

  addCustomer: (customer) => {
    useCustomersStore.getState().addCustomer(customer);
  },

  updateCustomer: (id, updates) => {
    useCustomersStore.getState().updateCustomer(id, updates);
  },

  deleteCustomer: (id) => {
    useCustomersStore.getState().deleteCustomer(id);
  },

  recordVisit: (id) => {
    useCustomersStore.getState().recordVisit(id);
  },

  updateSpend: (id, amount) => {
    const customer = useCustomersStore.getState().customers.find(c => c.id === id);
    if (!customer) return;
    const newSpend = (customer.totalSpend || 0) + amount;
    
    // Determine tier threshold
    let newTier = 'Standard';
    if (newSpend >= 100000) {
      newTier = 'Platinum';
    } else if (newSpend >= 20000) {
      newTier = 'VIP';
    }

    useCustomersStore.getState().updateCustomer(id, {
      totalSpend: newSpend,
      tier: newTier
    });
  }
};

export default CustomerService;
