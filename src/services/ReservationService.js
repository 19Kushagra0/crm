import { useReservationsStore } from '@/lib/stores/reservationsStore';
import TablesService from '@/services/TablesService';

const ReservationService = {
  useReservations: () => useReservationsStore((state) => state.reservations),

  getReservations: () => useReservationsStore.getState().reservations,

  addReservation: (reservation) => {
    useReservationsStore.getState().addReservation(reservation);
  },

  updateReservationStatus: (id, status) => {
    useReservationsStore.getState().updateReservationStatus(id, status);
    if (status === 'SEATED') {
      const res = useReservationsStore.getState().reservations.find(r => r.id === id);
      if (res && res.tableId) {
        TablesService.seatCustomer(res.tableId, res.customerId);
      }
    }
  },

  assignTableToReservation: (id, tableId) => {
    useReservationsStore.getState().assignTableToReservation(id, tableId);
  }
};

export default ReservationService;
