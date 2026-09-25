const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const prisma = require("./lib/prisma");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Home
app.get("/", (req, res) => {
  res.json({
    message: "AURELIA Backend API is running",
  });
});

// Database health check
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "success",
      message: "Backend and PostgreSQL are connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

// ===============================
// LIVE GOLD & SILVER RATES
// ===============================

// ===============================
// LIVE GOLD & SILVER RATES
// ===============================

app.get("/api/rates", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.oropocket.com/public/prices"
    );

    if (!response.ok) {
      throw new Error(`OroPocket API error: ${response.status}`);
    }

    const result = await response.json();

    const gold = result?.data?.gold?.buy;
    const silver = result?.data?.silver?.buy;

    if (gold == null || silver == null) {
      throw new Error("Gold or silver rate missing");
    }

    res.json({
      gold,
      silver,
      currency: "INR",
      unit: "gram",
      timestamp: result?.data?.timestamp || null,
    });

  } catch (error) {
    console.error("Metal rate API error:", error);

    res.status(500).json({
      gold: null,
      silver: null,
      message: "Unable to fetch live metal rates",
    });
  }
});

// Order routes
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AURELIA Backend running on http://localhost:${PORT}`);
});