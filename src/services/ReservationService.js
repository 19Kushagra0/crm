import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import TablesService from "@/services/TablesService";

const ReservationService = {
  // Synchronous getter from cache
  getReservations: () => {
    return queryClient.getQueryData(["reservations"]) || [];
  },

  // Query Hook
  useReservations: () => {
    return useQuery({
      queryKey: ["reservations"],
      queryFn: async () => {
        const res = await fetch("/api/reservations");
        if (!res.ok) throw new Error("Failed to fetch reservations");
        return res.json();
      },
    });
  },

  // Actions
  addReservation: async (reservation) => {
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    });
    if (!res.ok) throw new Error("Failed to add reservation");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["reservations"] });
    return data;
  },

  updateReservationStatus: async (id, status) => {
    const res = await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update reservation status");
    const data = await res.json();

    // Invalidate immediately
    queryClient.invalidateQueries({ queryKey: ["reservations"] });

    // Handle seating side effects if marked as SEATED
    if (status === "SEATED") {
      const reservations = ReservationService.getReservations();
      const foundRes = reservations.find(
        (r) => r.id === id || String(r.id) === String(id),
      );
      if (foundRes && foundRes.tableId) {
        await TablesService.seatCustomer(foundRes.tableId, foundRes.customerId);
      }
    }

    return data;
  },

  assignTableToReservation: async (id, tableId) => {
    const res = await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableId }),
    });
    if (!res.ok) throw new Error("Failed to assign table to reservation");
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["reservations"] });
    return data;
  },
};

export default ReservationService;
