import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const OperationsService = {
  getOperationsFeed: () => {
    return queryClient.getQueryData(["operationsFeed"]) || [];
  },

  useOperationsFeed: () => {
    return useQuery({
      queryKey: ["operationsFeed"],
      queryFn: async () => {
        const res = await fetch("/api/operations");
        if (!res.ok) throw new Error("Failed to fetch operations feed");
        return res.json();
      },
    });
  }
};

export default OperationsService;
