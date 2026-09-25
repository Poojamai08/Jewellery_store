const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require("../lib/prisma");

const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

// Admin Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find admin
        const admin = await prisma.admin.findUnique({
            where: {
                email,
            },
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                adminId: admin.id,
                email: admin.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
            },
        });

    } catch (error) {
        console.error("Admin Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
});

// Admin Dashboard Stats
router.get("/dashboard", adminAuth, async (req, res) => {
    try {
        // Total products
        const totalProducts = await prisma.product.count();

        // Total orders
        const totalOrders = await prisma.order.count();

        // Total revenue
        const revenueResult = await prisma.order.aggregate({
            _sum: {
                total: true,
            },
        });

        // Low stock products
        const lowStock = await prisma.product.count({
            where: {
                stock: {
                    lte: 3,
                },
            },
        });

        const revenue = revenueResult._sum.total || 0;

        res.json({
            success: true,
            stats: {
                totalProducts,
                totalOrders,
                revenue: Number(revenue),
                lowStock,
            },
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
        });
    }
});

module.exports = router;