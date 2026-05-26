import { useCustomersStore } from '@/lib/stores/customersStore';

const CustomerService = {
  getCustomers: () => useCustomersStore.getState().customers,
  useCustomers: () => useCustomersStore(state => state.customers),

  addCustomer: (customer) => {
    useCustomersStore.getState().addCustomer(customer);
  },

  updateCustomer: (id, updates) => {
    useCustomersStore.getState().updateCustomer(id, updates);
  }
};

export default CustomerService;
