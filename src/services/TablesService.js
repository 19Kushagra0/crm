import { useMemo } from 'react';
import { useTablesStore } from '@/lib/stores/tablesStore';

const TablesService = {
  // Hooks
  useTables: () => useTablesStore((state) => state.tables),
  
  useFloors: () => useTablesStore((state) => state.floors),
  
  useSelectedFloorId: () => useTablesStore((state) => state.selectedFloorId),
  
  useTablesByFloor: (floorId) => {
    const tables = useTablesStore((state) => state.tables);
    return useMemo(() => tables.filter((t) => t.floorId === floorId), [tables, floorId]);
  },

  // Actions
  getTables: () => useTablesStore.getState().tables,

  getFloors: () => useTablesStore.getState().floors,

  getSelectedFloorId: () => useTablesStore.getState().selectedFloorId,

  setSelectedFloorId: (floorId) => {
    useTablesStore.getState().setSelectedFloorId(floorId);
  },

  setTableStatus: (tableId, status, reservedAt) => {
    useTablesStore.getState().setTableStatus(tableId, status, reservedAt);
  },

  updateTablePosition: (tableId, x, y) => {
    useTablesStore.getState().updateTablePosition(tableId, x, y);
  },

  updateTableTransform: (tableId, x, y, width, height, rotation) => {
    useTablesStore.getState().updateTableTransform(tableId, x, y, width, height, rotation);
  },

  addFloor: (name) => {
    const floors = useTablesStore.getState().floors;
    const newId = `floor-${floors.length + 1}`;
    useTablesStore.getState().addFloor(newId, name);
    useTablesStore.getState().setSelectedFloorId(newId);
  },

  addTable: (table) => {
    useTablesStore.getState().addTable(table);
  },

  deleteTable: (tableId) => {
    useTablesStore.getState().deleteTable(tableId);
  },

  deleteFloor: (floorId) => {
    useTablesStore.getState().deleteFloor(floorId);
  }
};

export default TablesService;
