import { create } from 'zustand';

const initialMenuItems = [
  {
    id: "MENU-001",
    name: "Truffle Risotto",
    category: "Mains",
    description: "Arborio rice slow-cooked in wild mushroom broth, finished with aged parmesan and shaved black truffle.",
    allergens: ["Dairy", "Gluten"],
    price: 850,
    isActive: true
  },
  {
    id: "MENU-002",
    name: "Burrata Heirloom",
    category: "Starters",
    description: "Fresh Puglia burrata served with heritage tomatoes, basil oil, and aged balsamic reduction.",
    allergens: ["Dairy"],
    price: 650,
    isActive: true
  },
  {
    id: "MENU-003",
    name: "Seared Hokkaido Scallops",
    category: "Starters",
    description: "Hokkaido scallops pan-seared, served atop cauliflower purée with caper and raisin dressing.",
    allergens: ["Shellfish"],
    price: 1100,
    isActive: true
  },
  {
    id: "MENU-004",
    name: "Truffle Mushroom Soup",
    category: "Starters",
    description: "Creamy forest mushroom soup infused with white truffle oil, served with toasted sourdough.",
    allergens: ["Dairy", "Gluten"],
    price: 420,
    isActive: true
  },
  {
    id: "MENU-005",
    name: "Calamari Fritti",
    category: "Starters",
    description: "Crispy baby squid seasoned with sea salt and black pepper, served with garlic aioli and lemon.",
    allergens: ["Gluten", "Shellfish"],
    price: 550,
    isActive: true
  },
  {
    id: "MENU-006",
    name: "Wagyu A5 Striploin",
    category: "Mains",
    description: "Grade A5 Wagyu beef from Kagoshima, perfectly seared and served with dynamic sea salt flakes.",
    allergens: [],
    price: 4800,
    isActive: true
  },
  {
    id: "MENU-007",
    name: "Pan-Seared Chilean Sea Bass",
    category: "Mains",
    description: "Flaky sea bass fillet pan-seared, served with ginger-soy glaze and baby bok choy.",
    allergens: ["Fish", "Gluten"],
    price: 1650,
    isActive: true
  },
  {
    id: "MENU-008",
    name: "Duck Breast à l'Orange",
    category: "Mains",
    description: "Crispy skinned duck breast sliced, served with a classic honey-orange reduction and carrot purée.",
    allergens: ["Dairy"],
    price: 1350,
    isActive: true
  },
  {
    id: "MENU-009",
    name: "Wild Mushroom Pappardelle",
    category: "Mains",
    description: "Fresh hand-cut pappardelle pasta tossed with wild sautéed mushrooms, thyme, and parmigiano cream.",
    allergens: ["Dairy", "Gluten"],
    price: 750,
    isActive: true
  },
  {
    id: "MENU-010",
    name: "Rosemary Focaccia",
    category: "Breads",
    description: "Freshly baked Italian flatbread seasoned with dynamic sea salt, extra virgin olive oil, and rosemary.",
    allergens: ["Gluten"],
    price: 250,
    isActive: true
  },
  {
    id: "MENU-011",
    name: "Garlic Butter Naan",
    category: "Breads",
    description: "Traditional Indian flatbread baked in tandoor, brushed with melted garlic butter.",
    allergens: ["Dairy", "Gluten"],
    price: 150,
    isActive: true
  },
  {
    id: "MENU-012",
    name: "Sourdough Basket",
    category: "Breads",
    description: "Slices of warm, freshly baked sourdough loaf served with house-churned sea salt butter.",
    allergens: ["Dairy", "Gluten"],
    price: 200,
    isActive: true
  },
  {
    id: "MENU-013",
    name: "Classic Negroni",
    category: "Drinks",
    description: "Equal parts Gin, Campari, and Sweet Vermouth, stirred with ice and garnished with orange peel.",
    allergens: [],
    price: 650,
    isActive: true
  },
  {
    id: "MENU-014",
    name: "Pinot Noir Reserve",
    category: "Drinks",
    description: "A rich glass of Pinot Noir with notes of dark cherry, spices, and a elegant smooth finish.",
    allergens: [],
    price: 950,
    isActive: true
  },
  {
    id: "MENU-015",
    name: "Tiramisu Classico",
    category: "Desserts",
    description: "House-made Italian tiramisu with coffee-dipped ladyfingers, rich mascarpone cream, and cocoa powder.",
    allergens: ["Dairy", "Gluten"],
    price: 450,
    isActive: true
  },
  {
    id: "MENU-016",
    name: "Madagascar Vanilla Crème Brûlée",
    category: "Desserts",
    description: "Classic rich vanilla custard base topped with a contrasting layer of hardened caramelized sugar.",
    allergens: ["Dairy"],
    price: 480,
    isActive: true
  },
  {
    id: "MENU-017",
    name: "Warm Chocolate Fondant",
    category: "Desserts",
    description: "Decadent chocolate cake with a molten liquid center, served with a scoop of vanilla bean gelato.",
    allergens: ["Dairy", "Gluten"],
    price: 520,
    isActive: true
  },
  {
    id: "MENU-018",
    name: "Caviar Service (Osetra)",
    category: "Specials",
    description: "30g premium Osetra caviar served on ice with blinis, chives, egg mimosa, and crème fraîche.",
    allergens: ["Fish", "Dairy", "Gluten"],
    price: 6500,
    isActive: true
  },
  {
    id: "MENU-019",
    name: "Saffron Lobster Thermidor",
    category: "Specials",
    description: "Whole fresh lobster cooked in a rich egg yolk, cognac, and saffron cream sauce, browned under the broiler.",
    allergens: ["Shellfish", "Dairy", "Gluten"],
    price: 3200,
    isActive: true
  }
];

export const useMenuStore = create((set, get) => ({
  menuItems: initialMenuItems,

  toggleActive: (id) =>
    set((state) => ({
      menuItems: state.menuItems.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    })),

  deleteItem: (id) =>
    set((state) => ({
      menuItems: state.menuItems.filter((item) => item.id !== id)
    })),

  updateItem: (id, updates) =>
    set((state) => ({
      menuItems: state.menuItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    })),

  addItem: (item) =>
    set((state) => {
      const nextIdNum = state.menuItems.length + 1;
      const newId = `MENU-${nextIdNum.toString().padStart(3, '0')}`;
      return {
        menuItems: [
          {
            ...item,
            id: newId,
            isActive: item.isActive !== undefined ? item.isActive : true
          },
          ...state.menuItems
        ]
      };
    })
}));
