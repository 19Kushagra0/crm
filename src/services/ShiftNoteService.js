import { useShiftNotesStore } from '@/lib/stores/shiftNotesStore';

const ShiftNoteService = {
  useNotes: () => useShiftNotesStore((state) => state.notes),

  getNotes: () => useShiftNotesStore.getState().notes,

  addNote: (note) => {
    useShiftNotesStore.getState().addNote(note);
  }
};

export default ShiftNoteService;
