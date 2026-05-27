import { create } from 'zustand';

const initialReservations = [
  { id: 1, guest: "Mr. Alistair Cook", details: "Party of 4 • VIP Tier 2", time: "19:30", status: "SEATED", tableId: "T-4" },
  { id: 2, guest: "Elena Rodriguez", details: "Party of 2 • Anniversary", time: "20:00", status: "CONFIRMED", tableId: "T-7" },
  { id: 3, guest: "The Goldman Group", details: "Party of 8 • Private Room", time: "20:15", status: "PENDING", tableId: "T-12" },
  { id: 4, guest: "Sarah Jenkins", details: "Party of 3", time: "21:00", status: "LATER", tableId: "T-203" }
];

export const useReservationsStore = create((set) => ({
  reservations: initialReservations,

  addReservation: (reservation) =>
    set((state) => ({
      reservations: [
        ...state.reservations,
        {
          id: state.reservations.length > 0 ? Math.max(...state.reservations.map(r => r.id)) + 1 : 1,
          ...reservation
        }
      ]
    })),

  updateReservationStatus: (id, status) =>
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === id ? { ...r, status } : r
      )
    })),

  assignTableToReservation: (id, tableId) =>
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === id ? { ...r, tableId } : r
      )
    }))
}));
