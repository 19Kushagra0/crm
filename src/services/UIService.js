import { useUIStore } from '@/lib/stores/uiStore';

const UIService = {
  useActiveModal: () => useUIStore((state) => state.activeModal),
  openModal: (modalType) => useUIStore.getState().setActiveModal(modalType),
  closeModal: () => useUIStore.getState().closeModal()
};

export default UIService;
