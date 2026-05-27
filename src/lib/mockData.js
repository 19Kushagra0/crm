const extraNames = [
  "Kabir Mehta", "Ananya Iyer", "Arjun Kapoor", "Diya Sharma", "Rohan Sen",
  "Kavya Nair", "Aditya Goel", "Ishaan Malhotra", "Meera Reddy", "Siddharth Rao",
  "Zoya Khan", "Rohan Verma", "Shreya Ghoshal", "Karan Johar", "Alia Bhatt",
  "Ranbir Kapoor", "Deepika Padukone", "Ranveer Singh", "Katrina Kaif", "Vicky Kaushal",
  "Kiara Advani", "Sidharth Malhotra", "Varun Dhawan", "Shraddha Kapoor", "Rajkummar Rao"
];

const initialCustomers = [
  {
    id: "CUST-001",
    name: "Aisha Rahman",
    email: "aisha.r@example.com",
    phone: "+91 98765 43210",
    tier: "Platinum",
    visits: 42,
    lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    totalSpend: 124000
  },
  {
    id: "CUST-002",
    name: "Vikram Singh",
    email: "vikram.s@example.com",
    phone: "+91 99887 76655",
    tier: "VIP",
    visits: 18,
    lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    totalSpend: 48000
  },
  {
    id: "CUST-003",
    name: "Maya Nambiar",
    email: "maya.n@example.com",
    phone: "+91 91234 56789",
    tier: "Standard",
    visits: 2,
    lastVisit: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    totalSpend: 8500
  },
  {
    id: "CUST-004",
    name: "Priya Desai",
    email: "priya.d@example.com",
    phone: "+91 90000 11111",
    tier: "Standard",
    visits: 1,
    lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    totalSpend: 12000
  },
  {
    id: "CUST-005",
    name: "Rahul Joshi",
    email: "rahul.j@example.com",
    phone: "+91 98888 11111",
    tier: "Standard",
    visits: 5,
    lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    totalSpend: 15200
  },
  ...extraNames.map((name, i) => {
    const idNum = 6 + i;
    const tier = idNum % 5 === 0 ? "Platinum" : idNum % 3 === 0 ? "VIP" : "Standard";
    const visits = Math.floor(1 + (idNum * 1.5) % 30);
    const totalSpend = visits * (tier === "Platinum" ? 3000 : tier === "VIP" ? 2000 : 1000);
    return {
      id: `CUST-${idNum.toString().padStart(3, '0')}`,
      name,
      email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
      phone: `+91 98765 ${Math.floor(10000 + idNum * 321).toString().slice(0, 5)}`,
      tier,
      visits,
      lastVisit: new Date(Date.now() - (idNum % 20 + 1) * 24 * 60 * 60 * 1000),
      totalSpend
    };
  })
];

const initialActiveOrders = [
  {
    id: "ORD-9014",
    table: "T-2",
    items: [
      { name: "1x Wagyu Steak" },
      { name: "1x Red Wine" }
    ],
    status: "preparing",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    price: "$95.00",
    customerId: "CUST-001"
  },
  {
    id: "ORD-9012",
    table: "T-12",
    items: [
      { name: "2x Wagyu Tartare" },
      { name: "1x Scallop Crudo" }
    ],
    status: "incoming",
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
    price: "$64.00",
    customerId: "CUST-004"
  },
  {
    id: "ORD-9013",
    table: "Bar-2",
    items: [
      { name: "1x Truffle Fries" },
      { name: "2x Negroni" }
    ],
    status: "incoming",
    createdAt: new Date(Date.now() - 4 * 60 * 1000),
    price: "$48.00",
    customerId: "CUST-005"
  },
  {
    id: "ORD-8998",
    table: "T-4",
    items: [
      { name: "1x Tomahawk Ribeye", meta: "Med Rare" },
      { name: "2x Lobster Mac" },
      { name: "1x Grilled Asparagus" }
    ],
    status: "preparing",
    createdAt: new Date(Date.now() - 18 * 60 * 1000),
    price: "$215.00",
    isDelayed: true,
    customerId: "CUST-003"
  },
  {
    id: "ORD-9005",
    table: "T-8",
    items: [
      { name: "2x Duck Breast" },
      { name: "1x Pommes Purée" }
    ],
    status: "preparing",
    createdAt: new Date(Date.now() - 12 * 60 * 1000),
    price: "$88.00",
    customerId: "CUST-004"
  },
  {
    id: "ORD-8990",
    table: "T-1",
    items: [
      { name: "1x Châteaubriand" },
      { name: "2x Caesar Salad" }
    ],
    status: "ready",
    createdAt: new Date(Date.now() - 3 * 60 * 1000),
    price: "$145.00",
    customerId: "CUST-005"
  }
];

const initialCompletedOrders = [
  { id: "ORD-8985", table: "T-6", price: "$320.00", customerId: "CUST-002" },
  { id: "ORD-8984", table: "Bar-1", price: "$45.00" }
];

const initialFloors = [
  { id: "floor-1", name: "Main Dining", order: 1, canvasWidth: 960, canvasHeight: 570 }
];

const initialTables = [
  // Floor 1 (Main Dining)
  // Window Zone (Left)
  { id: "T-1",  zone: "WINDOW",  seats: 2,  status: "available", x: 60,  y: 60,  width: 70,  height: 100, rotation: 0, shape: "rect",  floorId: "floor-1" },
  { id: "T-2",  zone: "WINDOW",  seats: 2,  status: "occupied",  x: 60,  y: 190, width: 70,  height: 100, rotation: 0, shape: "rect",  floorId: "floor-1", currentCustomerId: "CUST-001" },
  { id: "T-3",  zone: "WINDOW",  seats: 4,  status: "occupied",  x: 60,  y: 320, width: 70,  height: 100, rotation: 0, shape: "rect",  floorId: "floor-1" },
  { id: "T-4",  zone: "WINDOW",  seats: 4,  status: "reserved",  x: 60,  y: 450, width: 70,  height: 100, rotation: 0, shape: "rect",  floorId: "floor-1", reservedAt: "19:30" },

  // Center Zone (Middle)
  { id: "T-5",  zone: "CENTER",  seats: 4,  status: "available", x: 280, y: 120, width: 100, height: 100, rotation: 0, shape: "round", floorId: "floor-1" },
  { id: "T-6",  zone: "CENTER",  seats: 4,  status: "occupied",  x: 280, y: 340, width: 100, height: 100, rotation: 0, shape: "round", floorId: "floor-1", currentCustomerId: "CUST-002" },
  { id: "T-7",  zone: "CENTER",  seats: 4,  status: "reserved",  x: 500, y: 120, width: 100, height: 100, rotation: 0, shape: "round", floorId: "floor-1", reservedAt: "20:00" },
  { id: "T-8",  zone: "CENTER",  seats: 6,  status: "occupied",  x: 500, y: 340, width: 120, height: 120, rotation: 0, shape: "round", floorId: "floor-1" },

  // Bar Zone (Top Right)
  { id: "B-1",  zone: "BAR",     seats: 2,  status: "occupied",  x: 740, y: 80,  width: 45,  height: 45,  rotation: 0, shape: "round", floorId: "floor-1" },
  { id: "B-2",  zone: "BAR",     seats: 2,  status: "cleaning",  x: 800, y: 80,  width: 45,  height: 45,  rotation: 0, shape: "round", floorId: "floor-1" },
  { id: "B-3",  zone: "BAR",     seats: 2,  status: "occupied",  x: 860, y: 80,  width: 45,  height: 45,  rotation: 0, shape: "round", floorId: "floor-1" },

  // Private Zone (Right)
  { id: "T-12", zone: "PRIVATE", seats: 8,  status: "available", x: 740, y: 220, width: 160, height: 80,  rotation: 0, shape: "rect",  floorId: "floor-1" },
  { id: "T-13", zone: "PRIVATE", seats: 8,  status: "cleaning",  x: 740, y: 330, width: 160, height: 80,  rotation: 0, shape: "rect",  floorId: "floor-1" },
  { id: "T-14", zone: "PRIVATE", seats: 10, status: "occupied",  x: 740, y: 440, width: 160, height: 90,  rotation: 0, shape: "rect",  floorId: "floor-1" }
];

const initialReservations = [
  { id: 1, guest: "Mr. Alistair Cook", details: "Party of 4 • VIP Tier 2", time: "19:30", status: "SEATED", tableId: "T-4" },
  { id: 2, guest: "Elena Rodriguez", details: "Party of 2 • Anniversary", time: "20:00", status: "CONFIRMED", tableId: "T-7" },
  { id: 3, guest: "The Goldman Group", details: "Party of 8 • Private Room", time: "20:15", status: "PENDING", tableId: "T-12" },
  { id: 4, guest: "Sarah Jenkins", details: "Party of 3", time: "21:00", status: "LATER", tableId: "T-203" }
];

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

const initialStaff = [
  {
    id: 1,
    name: "Elena Rostova",
    initials: "ER",
    role: "Head Waiter",
    category: "Waiter",
    onShift: true,
    orders: 14,
    tables: 4,
    rating: "4.8★",
    tenure: "Since March 2024",
    isWaiter: true,
  },
  {
    id: 2,
    name: "Marcus Kim",
    initials: "MK",
    role: "Sommelier",
    category: "Waiter",
    onShift: false,
    orders: 0,
    tables: 0,
    rating: "4.9★",
    tenure: "Since Jan 2023",
    isWaiter: true,
  },
  {
    id: 3,
    name: "Thomas Chen",
    initials: "TC",
    role: "Sous Chef",
    category: "Kitchen",
    onShift: true,
    orders: 42,
    tables: "12m",
    rating: "98%",
    tenure: "Since Aug 2022",
    isKitchen: true,
    customLabels: {
      ordersLabel: "Tickets",
      tablesLabel: "Prep Time",
      ratingLabel: "Quality"
    }
  }
];

const initialCampaigns = [
  {
    id: 1,
    title: "Win-Back: Inactive Guests",
    status: "active",
    type: "Email",
    segment: "At Risk",
    segmentMeta: "At Risk · 42 customers",
    sent: 42,
    opened: 38,
    openedPct: "90%",
    redeemed: 12,
    redeemedPct: "28%",
    preview: "We miss you! Come back this week and enjoy 20% off your next visit...",
    footerText: "Sent May 20",
    actionLabel: "View Report",
    isEmail: true,
  },
  {
    id: 2,
    title: "Weekend Special: Wine Tasting",
    status: "scheduled",
    type: "SMS",
    segment: "Gold",
    segmentMeta: "Gold · 156 customers",
    sent: 0,
    opened: 0,
    openedPct: "0%",
    redeemed: 0,
    redeemedPct: "0%",
    preview: "Join us this Saturday for an exclusive wine tasting event...",
    footerText: "Scheduled May 26 7PM",
    actionLabel: "Edit Campaign",
    isEmail: false,
  },
  {
    id: 3,
    title: "Anniversary Celebration",
    status: "completed",
    type: "WhatsApp",
    segment: "Silver",
    segmentMeta: "Silver · 80 customers",
    sent: 80,
    opened: 72,
    openedPct: "90%",
    redeemed: 18,
    redeemedPct: "22.5%",
    preview: "Happy Anniversary! Celebrate with a complimentary bottle of sparkling wine...",
    footerText: "Sent May 15",
    actionLabel: "View Report",
    isEmail: false,
  },
  {
    id: 4,
    title: "Mother's Day Brunch",
    status: "completed",
    type: "Email",
    segment: "Gold",
    segmentMeta: "Gold · 156 customers",
    sent: 156,
    opened: 132,
    openedPct: "84.6%",
    redeemed: 42,
    redeemedPct: "26.9%",
    preview: "Treat Mom to a Michelin-starred brunch. Reserve your exclusive table today...",
    footerText: "Sent May 10",
    actionLabel: "View Report",
    isEmail: true,
  },
  {
    id: 5,
    title: "Spring Menu Launch",
    status: "completed",
    type: "Email",
    segment: "Bronze",
    segmentMeta: "Bronze · 64 customers",
    sent: 64,
    opened: 48,
    openedPct: "75%",
    redeemed: 16,
    redeemedPct: "25%",
    preview: "Discover our new seasonal culinary creations. Experience the taste of Spring...",
    footerText: "Sent April 28",
    actionLabel: "View Report",
    isEmail: true,
  }
];

const initialShiftNotes = [
  {
    id: "NOTE-001",
    content: "Kitchen exhaust fans serviced and fully functional today.",
    author: "Elena Rostova (Head Waiter)",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: "NOTE-002",
    content: "Special VIP guest Mr. Cook arriving at 19:30 for Table 4.",
    author: "Marie Curie (Maitre D')",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
];

const initialRevenueTrend = [
  { day: "Mon", revenue: 42000, orders: 48, occupancy: 57, avgValue: 875 },
  { day: "Tue", revenue: 38000, orders: 42, occupancy: 50, avgValue: 904 },
  { day: "Wed", revenue: 51000, orders: 55, occupancy: 71, avgValue: 927 },
  { day: "Thu", revenue: 49000, orders: 50, occupancy: 64, avgValue: 980 },
  { day: "Fri", revenue: 85000, orders: 82, occupancy: 85, avgValue: 1036 },
  { day: "Sat", revenue: 112000, orders: 105, occupancy: 100, avgValue: 1066 },
  { day: "Sun", revenue: 95000, orders: 90, occupancy: 92, avgValue: 1055 }
];

const initialOperationsFeed = [
  {
    id: "OP-001",
    type: "add",
    message: "Added new staff member: Elena Rostova (Head Waiter)",
    timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 mins ago
  },
  {
    id: "OP-002",
    type: "delete",
    message: "Removed staff member: Marcus Kim (Sommelier)",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  }
];

if (!globalThis.mockDb) {
  globalThis.mockDb = {
    customers: initialCustomers,
    activeOrders: initialActiveOrders,
    completedOrders: initialCompletedOrders,
    floors: initialFloors,
    tables: initialTables,
    reservations: initialReservations,
    selectedFloorId: "floor-1",
    menuItems: initialMenuItems,
    staff: initialStaff,
    campaigns: initialCampaigns,
    shiftNotes: initialShiftNotes,
    revenueTrend: initialRevenueTrend,
    operationsFeed: initialOperationsFeed
  };
} else {
  // Gracefully ensure they exist if HMR already loaded
  if (!globalThis.mockDb.floors) globalThis.mockDb.floors = initialFloors;
  if (!globalThis.mockDb.tables) globalThis.mockDb.tables = initialTables;
  if (!globalThis.mockDb.reservations) globalThis.mockDb.reservations = initialReservations;
  if (!globalThis.mockDb.selectedFloorId) globalThis.mockDb.selectedFloorId = "floor-1";
  if (!globalThis.mockDb.menuItems) globalThis.mockDb.menuItems = initialMenuItems;
  if (!globalThis.mockDb.staff) globalThis.mockDb.staff = initialStaff;
  if (!globalThis.mockDb.campaigns) globalThis.mockDb.campaigns = initialCampaigns;
  if (!globalThis.mockDb.shiftNotes) globalThis.mockDb.shiftNotes = initialShiftNotes;
  if (!globalThis.mockDb.revenueTrend) globalThis.mockDb.revenueTrend = initialRevenueTrend;
  if (!globalThis.mockDb.operationsFeed) globalThis.mockDb.operationsFeed = initialOperationsFeed;
}

export const mockDb = globalThis.mockDb;

