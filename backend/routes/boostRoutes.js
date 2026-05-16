const express = require("express");
const router = express.Router();
const {
  createBoostOrder,
  verifyBoostPayment,
  getMyBoosts,
  getAllBoosts,
  getBoostSettings,
} = require("../controllers/boostController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/create-order", protect, createBoostOrder);
router.post("/verify", protect, verifyBoostPayment);
router.get("/my-boosts", protect, getMyBoosts);
router.get("/all", protect, admin, getAllBoosts);
router.get("/settings", getBoostSettings);

module.exports = router;
