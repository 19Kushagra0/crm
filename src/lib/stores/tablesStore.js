import { create } from 'zustand';

const initialFloors = [
  { id: "floor-1", name: "Main Dining", order: 1, canvasWidth: 960, canvasHeight: 570 }
];

const initialTables = [
  // Floor 1 (Main Dining)
  // Window Zone (Left)
  { id: "T-1",  zone: "WINDOW",  seats: 2,  status: "available", x: 60,  y: 60,  width: 70,  height: 100, rotation: 0, shape: "rect",  floorId: "floor-1" },
  { id: "T-2",  zone: "WINDOW",  seats: 2,  status: "occupied",  x: 60,  y: 190, width: 70,  height: 100, rotation: 0, shape: "rect",  floorId: "floor-1" },
  { id: "T-3",  zone: "WINDOW",  seats: 4,  status: "occupied",  x: 60,  y: 320, width: 70,  height: 100, rotation: 0, shape: "rect",  floorId: "floor-1" },
  { id: "T-4",  zone: "WINDOW",  seats: 4,  status: "reserved",  x: 60,  y: 450, width: 70,  height: 100, rotation: 0, shape: "rect",  floorId: "floor-1", reservedAt: "19:30" },

  // Center Zone (Middle)
  { id: "T-5",  zone: "CENTER",  seats: 4,  status: "available", x: 280, y: 120, width: 100, height: 100, rotation: 0, shape: "round", floorId: "floor-1" },
  { id: "T-6",  zone: "CENTER",  seats: 4,  status: "occupied",  x: 280, y: 340, width: 100, height: 100, rotation: 0, shape: "round", floorId: "floor-1" },
  { id: "T-7",  zone: "CENTER",  seats: 4,  status: "reserved",  x: 500, y: 120, width: 100, height: 100, rotation: 0, shape: "round", floorId: "floor-1", reservedAt: "20:00" },
  { id: "T-8",  zone: "CENTER",  seats: 6,  status: "occupied",  x: 500, y: 340, width: 120, height: 120, rotation: 0, shape: "round", floorId: "floor-1" },

  // Bar Zone (Top Right)
  { id: "B-1",  zone: "BAR",     seats: 2,  status: "occupied",  x: 740, y: 80,  width: 45,  height: 45,  rotation: 0, shape: "round", floorId: "floor-1" },
  { id: "B-2",  zone: "BAR",     seats: 2,  status: "cleaning",  x: 800, y: 80,  width: 45,  height: 45,  rotation: 0, shape: "round", floorId: "floor-1" },
  { id: "B-3",  zone: "BAR",     seats: 2,  status: "occupied",  x: 860, y: 80,  width: 45,  height: 45,  rotation: 0, shape: "round", floorId: "floor-1" },

  // Private Zone (Right)
  { id: "T-12", zone: "PRIVATE", seats: 8,  status: "available", x: 740, y: 220, width: 160, height: 80,  rotation: 0, shape: "rect",  floorId: "floor-1" },
  { id: "T-13", zone: "PRIVATE", seats: 8,  status: "cleaning",  x: 740, y: 330, width: 160, height: 80,  rotation: 0, shape: "rect",  floorId: "floor-1" },
  { id: "T-14", zone: "PRIVATE", seats: 10, status: "occupied",  x: 740, y: 440, width: 160, height: 90,  rotation: 0, shape: "rect",  floorId: "floor-1" }
];

export const useTablesStore = create((set) => ({
  floors: initialFloors,
  tables: initialTables,
  selectedFloorId: "floor-1",

  setSelectedFloorId: (floorId) => set({ selectedFloorId: floorId }),

  setTableStatus: (tableId, status, reservedAt) =>
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId
          ? { ...t, status, ...(reservedAt !== undefined ? { reservedAt } : { reservedAt: undefined }) }
          : t
      )
    })),

  updateTablePosition: (tableId, x, y) =>
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId ? { ...t, x, y } : t
      )
    })),

  updateTableTransform: (tableId, x, y, width, height, rotation) =>
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId ? { ...t, x, y, width, height, rotation } : t
      )
    })),

  addFloor: (id, name) =>
    set((state) => {
      const newOrder = state.floors.length + 1;
      return {
        floors: [...state.floors, { id, name, order: newOrder, canvasWidth: 960, canvasHeight: 570 }]
      };
    }),

  addTable: (table) =>
    set((state) => ({
      tables: [...state.tables, table]
    })),

  deleteTable: (tableId) =>
    set((state) => ({
      tables: state.tables.filter((t) => t.id !== tableId)
    })),

  deleteFloor: (floorId) =>
    set((state) => ({
      floors: state.floors.filter((f) => f.id !== floorId),
      tables: state.tables.filter((t) => t.floorId !== floorId)
    }))
}));
