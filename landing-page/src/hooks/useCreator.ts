import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useCreatorStats() {
  return useQuery({
    queryKey: ["creator-stats"],
    queryFn: async () => {
      const response = await api.get("/creator/stats");
      return response.data;
    },
  });
}

export function useCreatorVideos(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["creator-videos", page, limit],
    queryFn: async () => {
      const response = await api.get(`/creator/videos?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
}

export function useCreatorAnalytics() {
  return useQuery({
    queryKey: ["creator-analytics"],
    queryFn: async () => {
      const response = await api.get("/creator/analytics");
      return response.data;
    },
  });
}

export function useCreatorSubscribers() {
  return useQuery({
    queryKey: ["creator-subscribers"],
    queryFn: async () => {
      const response = await api.get("/creator/subscribers");
      return response.data;
    },
  });
}

export function useCreatorComments() {
  return useQuery({
    queryKey: ["creator-comments"],
    queryFn: async () => {
      const response = await api.get("/creator/comments");
      return response.data;
    },
  });
}


export function useMyChannel() {
  return useQuery({
    queryKey: ["my-channel"],
    queryFn: async () => {
      const response = await api.get("/channel/me");
      return response.data;
    },
  });
}

export function useCreatorPayouts() {
  return useQuery({
    queryKey: ["creator-payouts"],
    queryFn: async () => {
      const response = await api.get("/creator/payouts");
      return response.data;
    },
  });
}


export function useCreatePayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/creator/payouts", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-payouts"] });
    },
  });
}



