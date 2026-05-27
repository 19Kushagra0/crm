import { useMenuStore } from '@/lib/stores/menuStore';

const MenuService = {
  useMenuItems: () => useMenuStore((state) => state.menuItems),

  getMenuItems: () => useMenuStore.getState().menuItems,

  toggleActive: (id) => {
    useMenuStore.getState().toggleActive(id);
  },

  deleteItem: (id) => {
    useMenuStore.getState().deleteItem(id);
  },

  updateItem: (id, updates) => {
    useMenuStore.getState().updateItem(id, updates);
  },

  addItem: (item) => {
    useMenuStore.getState().addItem(item);
  }
};

export default MenuService;
