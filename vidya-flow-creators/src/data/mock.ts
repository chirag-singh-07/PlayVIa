export const formatNumber = (n: number) => {
  if (n >= 1_00_00_000) return (n / 1_00_00_000).toFixed(1) + "Cr";
  if (n >= 1_00_000) return (n / 1_00_000).toFixed(1) + "L";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
};

export const formatINR = (n: number) =>
  "₹" + n.toLocaleString("en-IN");

export const viewsOverTime = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  views: Math.round(15000 + Math.sin(i / 3) * 6000 + i * 800 + Math.random() * 4000),
  watchTime: Math.round(800 + Math.sin(i / 4) * 200 + i * 30),
}));

export const earningsOverTime = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  amount: Math.round(8000 + i * 3500 + Math.random() * 4000),
}));

export const audienceRetention = Array.from({ length: 20 }, (_, i) => ({
  point: `${i * 5}%`,
  retention: Math.max(20, Math.round(100 - i * 4 + Math.random() * 6)),
}));

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  status: "Published" | "Draft" | "Processing";
  date: string;
  earnings: number;
}

const titles = [
  "Mumbai Street Food Tour 🍛",
  "How I Earn ₹50,000/month from YouTube",
  "Bollywood Dance Cover - Latest Hit",
  "Cricket Highlights: India vs Australia",
  "Diwali Vlog 2025 - Family Special",
  "Tech Review: New Smartphone Launch",
  "Cooking Hyderabadi Biryani at Home",
  "Travel Vlog: Manali in Winter ❄️",
  "Stand-up Comedy Special",
  "Workout Routine for Beginners",
  "Study with me - 5AM Routine",
  "Unboxing Latest Gadgets",
];

export const videos: Video[] = titles.map((title, i) => ({
  id: `v${i + 1}`,
  title,
  thumbnail: `https://picsum.photos/seed/v${i + 1}/400/225`,
  views: Math.round(5000 + Math.random() * 500000),
  likes: Math.round(200 + Math.random() * 30000),
  comments: Math.round(20 + Math.random() * 2000),
  status: i % 7 === 0 ? "Draft" : i % 11 === 0 ? "Processing" : "Published",
  date: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  earnings: Math.round(500 + Math.random() * 25000),
}));

export const comments = Array.from({ length: 12 }, (_, i) => ({
  id: `c${i}`,
  user: ["Aarav","Priya","Rohan","Sneha","Vikram","Ananya","Kabir","Ishita"][i % 8],
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  videoTitle: titles[i % titles.length],
  text: [
    "Bhai mast video hai! Keep it up 🔥",
    "Loved the editing, please make more!",
    "Mumbai food is the best ❤️",
    "Can you share the recipe?",
    "Amazing content as always 👏",
    "Subscribed! 🎉",
  ][i % 6],
  date: new Date(Date.now() - i * 3600_000).toISOString(),
}));

export const subscribers = Array.from({ length: 10 }, (_, i) => ({
  id: `s${i}`,
  name: ["Aarav Sharma","Priya Patel","Rohan Mehta","Sneha Reddy","Vikram Singh","Ananya Gupta","Kabir Khan","Ishita Jain","Arjun Kumar","Diya Verma"][i],
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=sub${i}`,
  subscribedAt: new Date(Date.now() - i * 86400000 * 7).toISOString(),
  videos: Math.round(Math.random() * 50),
}));

export const subscriberGrowth = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  subs: Math.round(1000 + i * 800 + Math.random() * 600),
}));

export const earningsByVideo = videos.slice(0, 8).map((v) => ({
  id: v.id,
  title: v.title,
  views: v.views,
  earnings: v.earnings,
}));

export const successStories = [
  { name: "Rahul Verma", handle: "@rahulvlogs", earnings: "₹85,000/mo", growth: "+340%", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul", quote: "Quit my 9-5 job within 6 months of joining!" },
  { name: "Priya Sharma", handle: "@priyacooks", earnings: "₹1,20,000/mo", growth: "+520%", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya", quote: "From 100 to 500K subscribers in one year." },
  { name: "Aman Khanna", handle: "@amantech", earnings: "₹65,000/mo", growth: "+210%", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aman", quote: "Best platform for tech creators in India." },
];

export const reviews = [
  { name: "Aarav S.", role: "Viewer", text: "Best Indian video app! Smooth playback even on slow internet.", rating: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=r1" },
  { name: "Sneha M.", role: "Creator", text: "Earnings hit my account on time, every time. Trustworthy platform!", rating: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=r2" },
  { name: "Vikram J.", role: "Viewer", text: "Love the regional language content. Finally something for everyone.", rating: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=r3" },
  { name: "Anita R.", role: "Creator", text: "Analytics dashboard is so detailed. Helps me grow faster.", rating: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=r4" },
  { name: "Karan P.", role: "Viewer", text: "Offline downloads are a lifesaver during commutes.", rating: 4, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=r5" },
  { name: "Meera D.", role: "Creator", text: "Started at zero, now earning ₹40k/month. Thank you!", rating: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=r6" },
];

export const faqs = [
  { q: "Is the app free to use?", a: "Yes, the app is completely free for viewers. Premium features are optional." },
  { q: "How do creators earn?", a: "Creators earn through ad revenue, brand sponsorships, viewer tips, and our Creator Fund. Earnings start from your first 1000 views." },
  { q: "What are the payment methods?", a: "We support UPI, IMPS, NEFT bank transfers, and PayPal for creator payouts." },
  { q: "What is the minimum withdrawal?", a: "The minimum withdrawal amount is ₹500. Payouts are processed every Friday." },
  { q: "Which languages are supported?", a: "Hindi, English, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam, Gujarati, and Punjabi." },
  { q: "Can I download videos to watch offline?", a: "Yes! Download any video in HD or SD quality and watch without internet." },
  { q: "Is there a content monetization policy?", a: "Yes. Original, family-friendly content with 1000+ subscribers and 4000 watch hours qualifies for monetization." },
];