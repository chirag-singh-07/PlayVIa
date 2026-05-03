const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  general: {
    name: { type: String, default: "PlayVia" },
    tagline: { type: String, default: "India's #1 Video Streaming App" },
    email: { type: String, default: "support@playvia.in" },
    phone: { type: String, default: "+91 98765 43210" },
    maintenance: { type: Boolean, default: false }
  },
  upload: {
    maxSize: { type: Number, default: 2048 },
    formats: { type: String, default: "mp4, mov, avi, mkv" },
    maxDuration: { type: Number, default: 180 },
    autoTranscode: { type: Boolean, default: true }
  },
  monetization: {
    enabled: { type: Boolean, default: true },
    share: { type: Number, default: 55 },
    minWithdraw: { type: Number, default: 500 },
    upi: { type: Boolean, default: true },
    bank: { type: Boolean, default: true },
    paypal: { type: Boolean, default: false }
  },
  email: {
    host: { type: String, default: "smtp.sendgrid.net" },
    port: { type: Number, default: 587 },
    user: { type: String, default: "apikey" },
    pass: { type: String, default: "" }
  },
  security: {
    sessionTimeout: { type: Number, default: 60 },
    ipWhitelist: { type: String, default: "" }
  },
  boost: {
    perDayCost: { type: Number, default: 100 },
    discount3Days: { type: Number, default: 10 }, // percent
    discount7Days: { type: Number, default: 20 }  // percent
  }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
