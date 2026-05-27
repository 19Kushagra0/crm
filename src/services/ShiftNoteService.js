import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

const ShiftNoteService = {
  // Synchronous cache getter
  getNotes: () => {
    return queryClient.getQueryData(['shiftNotes']) || [];
  },

  // Query Hook
  useNotes: () => {
    return useQuery({
      queryKey: ['shiftNotes'],
      queryFn: async () => {
        const res = await fetch('/api/shift-notes');
        if (!res.ok) throw new Error('Failed to fetch shift notes');
        return res.json();
      }
    });
  },

  // Actions
  addNote: async (note) => {
    const res = await fetch('/api/shift-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    if (!res.ok) throw new Error('Failed to add shift note');
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ['shiftNotes'] });
    return data;
  }
};

export default ShiftNoteService;
