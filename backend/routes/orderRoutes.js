const express = require("express");
const prisma = require("../lib/prisma");
const adminAuth = require("../middleware/adminAuth");

const {
    sendOrderConfirmationEmail,
    sendOrderCancellationEmail,
} = require("../services/emailService");

const router = express.Router();

const CANCELLABLE_STATUSES = ["CONFIRMED", "PROCESSING"];

const TRACKABLE_STATUSES = [
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

function normalizeEmail(email) {
    return typeof email === "string"
        ? email.trim().toLowerCase()
        : "";
}

function publicOrderDetails(order) {
    return {
        orderNumber: order.orderNumber,
        status: order.status,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        customer: {
            name: order.customer.name,
            email: order.customer.email,
            city: order.customer.city,
            state: order.customer.state,
            pincode: order.customer.pincode,
        },
        items: order.items.map((item) => ({
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
        })),
        canCancel: CANCELLABLE_STATUSES.includes(order.status),
    };
}

// ======================================================
// CUSTOMER - CREATE NEW ORDER
// ======================================================

router.post("/", async (req, res) => {
    try {
        const { customer, items, paymentMethod } = req.body;

        if (
            !customer ||
            !customer.name ||
            !customer.email ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Customer details and cart items are required",
            });
        }

        if (
            items.some((item) =>
                !Number.isInteger(Number(item.quantity)) ||
                Number(item.quantity) <= 0 ||
                !Number.isFinite(Number(item.price)) ||
                Number(item.price) < 0
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid order item details",
            });
        }

        const subtotal = items.reduce(
            (total, item) =>
                total + Number(item.price) * Number(item.quantity),
            0
        );

        const shipping = 0;
        const total = subtotal + shipping;
        const orderNumber = `AUR-${Date.now()}-${Math.floor(
            Math.random() * 1000
        )}`;

        const order = await prisma.$transaction(async (tx) => {
            for (const item of items) {
                const productId = Number(item.productId || item.id);
                const quantity = Number(item.quantity);

                if (!Number.isInteger(productId) || productId <= 0) {
                    throw new Error("Invalid product ID");
                }

                const product = await tx.product.findUnique({
                    where: { id: productId },
                });

                if (!product) {
                    throw new Error(`Product ${productId} not found`);
                }

                // Atomic stock check and reduction prevents overselling
                const stockUpdate = await tx.product.updateMany({
                    where: {
                        id: productId,
                        stock: { gte: quantity },
                    },
                    data: {
                        stock: { decrement: quantity },
                    },
                });

                if (stockUpdate.count !== 1) {
                    throw new Error(
                        `${product.name} does not have enough stock`
                    );
                }
            }

            return tx.order.create({
                data: {
                    orderNumber,
                    customer: {
                        create: {
                            name: customer.name,
                            phone: customer.phone,
                            email: customer.email.trim(),
                            address: customer.address,
                            city: customer.city,
                            state: customer.state,
                            pincode: customer.pincode,
                        },
                    },
                    subtotal,
                    shipping,
                    total,
                    paymentMethod: paymentMethod || "COD",
                    status: "CONFIRMED",
                    items: {
                        create: items.map((item) => ({
                            productId: Number(item.productId || item.id),
                            productName: item.productName || item.name,
                            price: Number(item.price),
                            quantity: Number(item.quantity),
                            image: item.image || null,
                        })),
                    },
                },
                include: {
                    customer: true,
                    items: true,
                },
            });
        });

        sendOrderConfirmationEmail(order)
            .then(() => {
                console.log(
                    `Order confirmation email sent: ${order.orderNumber}`
                );
            })
            .catch((error) => {
                console.error(
                    "Order confirmation email failed:",
                    error.message
                );
            });

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: {
                id: order.id,
                orderNumber: order.orderNumber,
                total: order.total,
                status: order.status,
            },
        });
    } catch (error) {
        console.error("Create Order Error:", error);

        return res.status(400).json({
            success: false,
            message: error.message || "Failed to create order",
        });
    }
});

// ======================================================
// CUSTOMER - TRACK ORDER
// POST /api/orders/track
// Body: { orderNumber, email }
// ======================================================

router.post("/track", async (req, res) => {
    try {
        const { orderNumber, email } = req.body;

        if (
            typeof orderNumber !== "string" ||
            !orderNumber.trim() ||
            !normalizeEmail(email)
        ) {
            return res.status(400).json({
                success: false,
                message: "Order number and email are required",
            });
        }

        const order = await prisma.order.findUnique({
            where: {
                orderNumber: orderNumber.trim(),
            },
            include: {
                customer: true,
                items: true,
            },
        });

        // Same response for unknown order and mismatched email
        if (
            !order ||
            normalizeEmail(order.customer.email) !== normalizeEmail(email)
        ) {
            return res.status(404).json({
                success: false,
                message: "Order not found. Check your order number and email.",
            });
        }

        return res.json({
            success: true,
            order: publicOrderDetails(order),
        });
    } catch (error) {
        console.error("Track Order Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to track your order right now",
        });
    }
});

// ======================================================
// CUSTOMER - CANCEL ORDER
// POST /api/orders/:orderNumber/cancel
// Body: { email }
// ======================================================

router.post("/:orderNumber/cancel", async (req, res) => {
    try {
        const orderNumber = req.params.orderNumber.trim();
        const email = normalizeEmail(req.body.email);

        if (!orderNumber || !email) {
            return res.status(400).json({
                success: false,
                message: "Order number and email are required",
            });
        }

        const order = await prisma.order.findUnique({
            where: { orderNumber },
            include: {
                customer: true,
                items: true,
            },
        });

        if (
            !order ||
            normalizeEmail(order.customer.email) !== email
        ) {
            return res.status(404).json({
                success: false,
                message: "Order not found. Check your order number and email.",
            });
        }

        if (!CANCELLABLE_STATUSES.includes(order.status)) {
            return res.status(409).json({
                success: false,
                message:
                    order.status === "CANCELLED"
                        ? "This order has already been cancelled."
                        : "This order can no longer be cancelled.",
                status: order.status,
            });
        }

        // Claim cancellation atomically to avoid duplicate cancellation
        const cancelledOrder = await prisma.$transaction(async (tx) => {
            const update = await tx.order.updateMany({
                where: {
                    id: order.id,
                    status: { in: CANCELLABLE_STATUSES },
                },
                data: {
                    status: "CANCELLED",
                },
            });

            if (update.count !== 1) {
                const conflict = new Error(
                    "Order status changed. Please track your order again."
                );
                conflict.statusCode = 409;
                throw conflict;
            }

            // Restore the reserved stock in the same transaction
            for (const item of order.items) {
                await tx.product.updateMany({
                    where: {
                        id: item.productId,
                    },
                    data: {
                        stock: {
                            increment: item.quantity,
                        },
                    },
                });
            }

            return tx.order.findUnique({
                where: { id: order.id },
                include: {
                    customer: true,
                    items: true,
                },
            });
        });

        // Cancellation remains saved even if the email provider fails
        let emailSent = false;

        try {
            await sendOrderCancellationEmail(cancelledOrder);
            emailSent = true;
        } catch (emailError) {
            console.error(
                `Cancellation email failed for ${orderNumber}:`,
                emailError.message
            );
        }

        return res.json({
            success: true,
            message: emailSent
                ? "Order cancelled successfully. Confirmation email sent."
                : "Order cancelled successfully, but the confirmation email could not be sent.",
            emailSent,
            order: {
                orderNumber: cancelledOrder.orderNumber,
                status: cancelledOrder.status,
                total: cancelledOrder.total,
            },
        });
    } catch (error) {
        console.error("Cancel Order Error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode
                ? error.message
                : "Unable to cancel your order right now",
        });
    }
});

// ======================================================
// ADMIN - GET ALL ORDERS
// ======================================================

router.get("/admin", adminAuth, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                customer: true,
                items: true,
            },
        });

        return res.json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Admin Orders Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
});

// ======================================================
// ADMIN - GET SINGLE ORDER
// ======================================================

router.get("/admin/:id", adminAuth, async (req, res) => {
    try {
        const orderId = Number(req.params.id);

        if (!Number.isInteger(orderId) || orderId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                customer: true,
                items: true,
            },
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Admin Order Details Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch order",
        });
    }
});

// ======================================================
// ADMIN - UPDATE ORDER STATUS
// ======================================================

router.put("/admin/:id/status", adminAuth, async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const { status } = req.body;

        const allowedStatuses = [
            "CONFIRMED",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ];

        if (!Number.isInteger(orderId) || orderId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status",
            });
        }

        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        return res.json({
            success: true,
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        console.error("Update Order Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update order status",
        });
    }
});

module.exports = router;