import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Zap, Clock, ShieldCheck, Loader2 } from "lucide-react";
import { useCreateBoostOrder, useVerifyBoost } from "@/hooks/useCreator";
import { toast } from "sonner";

interface BoostModalProps {
  video: any;
  isOpen: boolean;
  onClose: () => void;
}

const DURATIONS = [
  { days: 1, price: 100, label: "Starter", reach: "1k - 5k" },
  { days: 3, price: 270, label: "Pro", reach: "5k - 15k", discount: "10% Off" },
  { days: 7, price: 560, label: "Ultimate", reach: "15k - 50k", discount: "20% Off" },
];

export default function BoostModal({ video, isOpen, onClose }: BoostModalProps) {
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);

  const createOrder = useCreateBoostOrder();
  const verifyPayment = useVerifyBoost();

  const handleBoost = async () => {
    if (!video) return;
    setIsProcessing(true);

    try {
      // 1. Create Order on Backend
      const orderData = await createOrder.mutateAsync({
        videoId: video._id,
        duration: selectedDuration,
      });

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_your_key",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PlayVia Boost",
        description: `Boosting: ${video.title}`,
        image: "/logo.png",
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // 3. Verify Payment on Backend
            await verifyPayment.mutateAsync({
              ...response,
              videoId: video._id,
              duration: selectedDuration,
              amount: orderData.amount
            });
            toast.success("Video boosted successfully! 🔥");
            onClose();
          } catch (error) {
            toast.error("Payment verification failed.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: "Creator", // Could get from auth context
          email: "creator@example.com",
        },
        theme: {
          color: "#EAB308", // Yellow primary
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment.");
      setIsProcessing(false);
    }
  };

  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-black border-yellow-500/20">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-yellow-500/10 rounded-full">
              <Rocket className="h-5 w-5 text-yellow-500" />
            </div>
            <DialogTitle className="text-2xl text-white">Boost your video</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-400">
            Increase visibility and reach more audience across India.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-white/5">
            <img 
              src={video.thumbnailUrl || "/placeholder.svg"} 
              className="h-16 w-28 rounded-lg object-cover" 
              alt="" 
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{video.title}</p>
              <Badge variant="outline" className="mt-1 text-xs text-yellow-500 border-yellow-500/30">
                {video.videoType === 'short' ? 'Short' : 'Video'}
              </Badge>
            </div>
          </div>

          <div className="grid gap-3">
            {DURATIONS.map((d) => (
              <div 
                key={d.days}
                onClick={() => setSelectedDuration(d.days)}
                className={`relative flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
                  selectedDuration === d.days 
                  ? "bg-yellow-500/10 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]" 
                  : "bg-zinc-900 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${selectedDuration === d.days ? "bg-yellow-500 text-black" : "bg-zinc-800 text-zinc-400"}`}>
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{d.days} {d.days === 1 ? 'Day' : 'Days'}</p>
                    <p className="text-xs text-zinc-500">Est. reach: {d.reach} views</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-500">₹{d.price}</p>
                  {d.discount && (
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                      {d.discount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900/80 p-3 rounded-lg border border-white/5 flex items-start gap-2">
            <Zap className="h-4 w-4 text-yellow-500 mt-0.5" />
            <p className="text-xs text-zinc-400">
              Boosted content is prioritized in feeds, recommendations, and search results for the entire duration.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleBoost} 
            disabled={isProcessing}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold w-full sm:w-auto"
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
            Pay & Boost Now
          </Button>
        </DialogFooter>
        <p className="text-[10px] text-center text-zinc-500 flex items-center justify-center gap-1">
          <ShieldCheck className="h-3 w-3" /> Secure payment via Razorpay
        </p>
      </DialogContent>
    </Dialog>
  );
}
