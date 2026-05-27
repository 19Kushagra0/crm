import { useStaffStore } from '@/lib/stores/staffStore';

const StaffService = {
  useStaff: () => useStaffStore((state) => state.staff),

  getStaff: () => useStaffStore.getState().staff,

  addStaff: (member) => {
    useStaffStore.getState().addStaff(member);
  },

  updateStaff: (id, updates) => {
    useStaffStore.getState().updateStaff(id, updates);
  },

  deleteStaff: (id) => {
    useStaffStore.getState().deleteStaff(id);
  },

  toggleShiftStatus: (id) => {
    useStaffStore.getState().toggleShiftStatus(id);
  }
};

export default StaffService;
