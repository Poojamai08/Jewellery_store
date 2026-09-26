const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const prisma = require("./lib/prisma");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();
const cheerio = require("cheerio");

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

// ===============================
// LIVE GOLD & SILVER RATES
// ===============================

// ======================================================
// LIVE MADURAI GOLD & SILVER RATES
// ======================================================

const GOLD_RATES_URL =
  "https://www.goodreturns.in/gold-rates/madurai.html";

const SILVER_RATES_URL =
  "https://www.goodreturns.in/silver-rates/madurai.html";

let cachedRates = null;
let lastRatesFetch = 0;

// Refresh backend data every 30 minutes
const RATE_CACHE_TIME = 30 * 60 * 1000;


// ------------------------------------------------------
// Helper: fetch webpage
// ------------------------------------------------------

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Source returned ${response.status}`);
  }

  return await response.text();
}


// ------------------------------------------------------
// Fetch Madurai Gold Rates
// ------------------------------------------------------

async function fetchMaduraiGoldRates() {
  const html = await fetchPage(GOLD_RATES_URL);

  const $ = cheerio.load(html);

  const pageText = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  console.log("Gold source page loaded");


  // Try to find 24K gold
  const gold24Match = pageText.match(
    /24K\s*Gold\s*\/?\s*g.*?₹\s*([\d,]+(?:\.\d+)?)/i
  );

  // Try to find 22K gold
  const gold22Match = pageText.match(
    /22K\s*Gold\s*\/?\s*g.*?₹\s*([\d,]+(?:\.\d+)?)/i
  );

  // Try to find 18K gold
  const gold18Match = pageText.match(
    /18K\s*Gold\s*\/?\s*g.*?₹\s*([\d,]+(?:\.\d+)?)/i
  );


  if (!gold24Match || !gold22Match || !gold18Match) {
    console.error("Unable to detect gold rates from GoodReturns page");

    throw new Error("Gold rates not found");
  }


  const gold24K = Number(
    gold24Match[1].replace(/,/g, "")
  );

  const gold22K = Number(
    gold22Match[1].replace(/,/g, "")
  );

  const gold18K = Number(
    gold18Match[1].replace(/,/g, "")
  );


  // Calculate 14K from 24K
  const gold14K = gold24K * (14 / 24);


  if (
    !Number.isFinite(gold24K) ||
    !Number.isFinite(gold22K) ||
    !Number.isFinite(gold18K)
  ) {
    throw new Error("Invalid gold rate values");
  }


  return {
    k24: gold24K,
    k22: gold22K,
    k18: gold18K,
    k14: Number(gold14K.toFixed(2)),
  };
}


// ------------------------------------------------------
// Fetch Madurai Silver Rate
// ------------------------------------------------------

async function fetchMaduraiSilverRate() {
  const html = await fetchPage(SILVER_RATES_URL);

  const $ = cheerio.load(html);

  const pageText = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();


  const silverMatch = pageText.match(
    /Silver\s*\/?\s*g\s*₹\s*([\d,]+(?:\.\d+)?)/i
  );


  if (!silverMatch) {
    console.error("Unable to detect silver rate from GoodReturns page");

    throw new Error("Silver rate not found");
  }


  const pureSilver = Number(
    silverMatch[1].replace(/,/g, "")
  );


  if (!Number.isFinite(pureSilver)) {
    throw new Error("Invalid silver rate");
  }


  // Sterling silver = 92.5% pure silver
  const sterlingSilver = pureSilver * 0.925;


  return {
    pure: pureSilver,
    sterling: Number(sterlingSilver.toFixed(2)),
  };
}


// ------------------------------------------------------
// Main Rates Function
// ------------------------------------------------------

async function getMaduraiRates() {
  const now = Date.now();


  // Return cached rates if cache is still valid
  if (
    cachedRates &&
    now - lastRatesFetch < RATE_CACHE_TIME
  ) {
    return cachedRates;
  }


  try {
    console.log("Fetching fresh Madurai metal rates...");


    const [gold, silver] = await Promise.all([
      fetchMaduraiGoldRates(),
      fetchMaduraiSilverRate(),
    ]);


    cachedRates = {
      gold,
      silver,

      currency: "INR",
      unit: "gram",

      location: "Madurai",

      source: "GoodReturns",

      sourceUrl: {
        gold: GOLD_RATES_URL,
        silver: SILVER_RATES_URL,
      },

      updatedAt: new Date().toISOString(),
    };


    lastRatesFetch = now;


    console.log("Fresh Madurai rates:", cachedRates);


    return cachedRates;

  } catch (error) {

    console.error(
      "Failed to fetch fresh Madurai rates:",
      error.message
    );


    // If we already have valid cached rates,
    // continue using them.
    if (cachedRates) {
      console.log("Using previous cached metal rates");

      return cachedRates;
    }


    throw error;
  }
}


// ------------------------------------------------------
// GET /api/rates
// ------------------------------------------------------

app.get("/api/rates", async (req, res) => {

  try {

    const rates = await getMaduraiRates();

    res.json(rates);

  } catch (error) {

    console.error("Metal rate API error:", error);


    res.status(500).json({
      gold: null,
      silver: null,

      currency: "INR",
      unit: "gram",

      location: "Madurai",

      source: "GoodReturns",

      message:
        "Unable to fetch live Madurai metal rates",
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