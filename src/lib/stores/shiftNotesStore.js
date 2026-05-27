import { create } from 'zustand';

export const useShiftNotesStore = create((set) => ({
  notes: [],

  addNote: (note) =>
    set((state) => ({
      notes: [
        {
          id: `NOTE-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date(),
          ...note
        },
        ...state.notes
      ]
    }))
}));
