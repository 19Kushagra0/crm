import { useTablesStore } from '@/lib/stores/tablesStore';

const TablesService = {
  getTables: () => useTablesStore.getState().tables,

  setTableStatus: (tableId, status, reservedAt) => {
    useTablesStore.getState().setTableStatus(tableId, status, reservedAt);
  }
};

export default TablesService;
