const express = require("express");
const paymentController = require("../controllers/paymentController");
const router = express.Router();

router.post("/payments/stripe", paymentController.processPayment);

module.exports = router;
