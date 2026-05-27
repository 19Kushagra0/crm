import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import CustomerService from '@/services/CustomerService';

const TablesService = {
  // Sync getters from cache
  getTables: () => {
    const data = queryClient.getQueryData(['tables']);
    return data?.tables || [];
  },

  getFloors: () => {
    const data = queryClient.getQueryData(['tables']);
    return data?.floors || [];
  },

  getSelectedFloorId: () => {
    const data = queryClient.getQueryData(['tables']);
    return data?.selectedFloorId || 'floor-1';
  },

  // Base query hook
  useTablesQuery: () => {
    return useQuery({
      queryKey: ['tables'],
      queryFn: async () => {
        const res = await fetch('/api/tables');
        if (!res.ok) throw new Error('Failed to fetch tables data');
        return res.json();
      }
    });
  },

  // Specific query hooks using select
  useTables: () => {
    return useQuery({
      queryKey: ['tables'],
      queryFn: async () => {
        const res = await fetch('/api/tables');
        if (!res.ok) throw new Error('Failed to fetch tables data');
        return res.json();
      },
      select: (data) => data.tables || []
    });
  },

  useFloors: () => {
    return useQuery({
      queryKey: ['tables'],
      queryFn: async () => {
        const res = await fetch('/api/tables');
        if (!res.ok) throw new Error('Failed to fetch tables data');
        return res.json();
      },
      select: (data) => data.floors || []
    });
  },

  useSelectedFloorId: () => {
    return useQuery({
      queryKey: ['tables'],
      queryFn: async () => {
        const res = await fetch('/api/tables');
        if (!res.ok) throw new Error('Failed to fetch tables data');
        return res.json();
      },
      select: (data) => data.selectedFloorId || 'floor-1'
    });
  },

  useTablesByFloor: (floorId) => {
    return useQuery({
      queryKey: ['tables'],
      queryFn: async () => {
        const res = await fetch('/api/tables');
        if (!res.ok) throw new Error('Failed to fetch tables data');
        return res.json();
      },
      select: (data) => (data.tables || []).filter((t) => t.floorId === floorId)
    });
  },

  // Actions
  setSelectedFloorId: async (floorId) => {
    const res = await fetch('/api/tables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setSelectedFloorId', selectedFloorId: floorId })
    });
    if (!res.ok) throw new Error('Failed to set selected floor id');
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ['tables'] });
    return data;
  },

  setTableStatus: async (tableId, status, reservedAt) => {
    const res = await fetch(`/api/tables/${tableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reservedAt })
    });
    if (!res.ok) throw new Error('Failed to set table status');
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ['tables'] });
    return data;
  },

  seatCustomer: async (tableId, customerId) => {
    const res = await fetch(`/api/tables/${tableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'occupied', currentCustomerId: customerId })
    });
    if (!res.ok) throw new Error('Failed to seat customer');
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ['tables'] });
    return data;
  },

  clearSeat: async (tableId) => {
    const tables = TablesService.getTables();
    const table = tables.find((t) => t.id === tableId);
    if (table?.currentCustomerId) {
      await CustomerService.recordVisit(table.currentCustomerId);
    }
    const res = await fetch(`/api/tables/${tableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'available', currentCustomerId: null })
    });
    if (!res.ok) throw new Error('Failed to clear seat');
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ['tables'] });
    return data;
  },

  updateTablePosition: async (tableId, x, y) => {
    const res = await fetch(`/api/tables/${tableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x, y })
    });
    if (!res.ok) throw new Error('Failed to update table position');
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ['tables'] });
    return data;
  },

  updateTableTransform: async (tableId, x, y, width, height, rotation) => {
    const res = await fetch(`/api/tables/${tableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x, y, width, height, rotation })
    });
    if (!res.ok) throw new Error('Failed to update table transform');
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ['tables'] });
    return data;
  },

  addFloor: async (name) => {
    const res = await fetch('/api/tables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addFloor', name })
    });
    if (!res.ok) throw new Error('Failed to add floor');
    const newFloor = await res.json();
    await TablesService.setSelectedFloorId(newFloor.id);
    queryClient.invalidateQueries({ queryKey: ['tables'] });
    return newFloor;
  },

  addTable: async (table) => {
    const res = await fetch('/api/tables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(table)
    });
    if (!res.ok) throw new Error('Failed to add table');
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ['tables'] });
    return data;
  },

  deleteTable: async (tableId) => {
    const res = await fetch(`/api/tables/${tableId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete table');
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ['tables'] });
    return data;
  },

  deleteFloor: async (floorId) => {
    const res = await fetch('/api/tables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteFloor', floorId })
    });
    if (!res.ok) throw new Error('Failed to delete floor');
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ['tables'] });
    return data;
  }
};

export default TablesService;
