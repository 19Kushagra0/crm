import { useReservationsStore } from '@/lib/stores/reservationsStore';

const ReservationService = {
  useReservations: () => useReservationsStore((state) => state.reservations),

  getReservations: () => useReservationsStore.getState().reservations,

  addReservation: (reservation) => {
    useReservationsStore.getState().addReservation(reservation);
  },

  updateReservationStatus: (id, status) => {
    useReservationsStore.getState().updateReservationStatus(id, status);
  }
};

export default ReservationService;
