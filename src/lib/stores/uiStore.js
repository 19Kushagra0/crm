import { create } from 'zustand';

export const useUIStore = create((set) => ({
  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null })
}));
