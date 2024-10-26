const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Import routes
const plotRoutes = require("./routes/plotRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const loanRoutes = require("./routes/loanRoutes");

// Use routes
app.use("/api", plotRoutes);
app.use("/api", paymentRoutes);
app.use("/api", loanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
