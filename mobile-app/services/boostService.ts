import api from "@/utils/api";

export interface BoostOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
}

export interface BoostVerifyData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  videoId: string;
  duration: number;
  amount: number;
}

export const boostService = {
  // Create an order for boosting
  createOrder: async (
    videoId: string,
    duration: number,
  ): Promise<BoostOrderResponse> => {
    const response = await api.post("/boost/create-order", {
      videoId,
      duration,
    });
    return response.data;
  },

  // Verify payment and activate boost
  verifyPayment: async (data: BoostVerifyData) => {
    const response = await api.post("/boost/verify", data);
    return response.data;
  },

  // Get user's boosts
  getMyBoosts: async () => {
    const response = await api.get("/boost/my-boosts");
    return response.data;
  },

  // Get boost settings (pricing)
  getSettings: async () => {
    const response = await api.get("/boost/settings");
    return response.data;
  },
};
