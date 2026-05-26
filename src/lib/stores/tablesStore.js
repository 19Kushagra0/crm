import { create } from 'zustand';

const initialTables = [
  { id: "T-1",  zone: "WINDOW",  seats: 2,  status: "available" },
  { id: "T-2",  zone: "WINDOW",  seats: 2,  status: "occupied" },
  { id: "T-3",  zone: "WINDOW",  seats: 4,  status: "occupied" },
  { id: "T-4",  zone: "WINDOW",  seats: 4,  status: "reserved", reservedAt: "19:30" },
  { id: "T-5",  zone: "CENTER",  seats: 4,  status: "available" },
  { id: "T-6",  zone: "CENTER",  seats: 4,  status: "occupied" },
  { id: "T-7",  zone: "CENTER",  seats: 4,  status: "reserved", reservedAt: "20:00" },
  { id: "T-8",  zone: "CENTER",  seats: 6,  status: "occupied" },
  { id: "T-12", zone: "PRIVATE", seats: 8,  status: "available" },
  { id: "T-13", zone: "PRIVATE", seats: 8,  status: "cleaning" },
  { id: "T-14", zone: "PRIVATE", seats: 10, status: "occupied" },
  { id: "B-1",  zone: "BAR",     seats: 2,  status: "occupied" },
  { id: "B-2",  zone: "BAR",     seats: 2,  status: "cleaning" },
  { id: "B-3",  zone: "BAR",     seats: 2,  status: "occupied" }
];

export const useTablesStore = create((set) => ({
  tables: initialTables,

  setTableStatus: (tableId, status, reservedAt) =>
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId
          ? { ...t, status, ...(reservedAt ? { reservedAt } : {}) }
          : t
      )
    }))
}));
