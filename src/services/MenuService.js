import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const MenuService = {
  // Synchronous cache getter
  getMenuItems: () => {
    return queryClient.getQueryData(["menu"]) || [];
  },

  // Query Hook
  useMenuItems: () => {
    return useQuery({
      queryKey: ["menu"],
      queryFn: async () => {
        const res = await fetch("/api/menu");
        if (!res.ok) throw new Error("Failed to fetch menu items");
        return res.json();
      },
    });
  },

  // Actions
  toggleActive: async (id) => {
    const items = MenuService.getMenuItems();
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const res = await fetch(`/api/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !item.isActive }),
    });
    if (!res.ok) throw new Error("Failed to toggle active status");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["menu"] });
    return data;
  },

  deleteItem: async (id) => {
    const res = await fetch(`/api/menu/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete menu item");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["menu"] });
    return data;
  },

  updateItem: async (id, updates) => {
    const res = await fetch(`/api/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update menu item");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["menu"] });
    return data;
  },

  addItem: async (item) => {
    const res = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Failed to add menu item");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["menu"] });
    return data;
  },
};

export default MenuService;
