const express = require("express");
const prisma = require("../lib/prisma");
const adminAuth = require("../middleware/adminAuth");
const {
    sendOrderConfirmationEmail,
} = require("../services/emailService");

const router = express.Router();

// ======================================================
// CUSTOMER - CREATE NEW ORDER
// ======================================================

router.post("/", async (req, res) => {
    try {
        const { customer, items, paymentMethod } = req.body;

        if (!customer || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Customer details and cart items are required",
            });
        }

        // ==================================================
        // CALCULATE TOTAL
        // ==================================================

        const subtotal = items.reduce((total, item) => {
            return (
                total +
                Number(item.price) * Number(item.quantity)
            );
        }, 0);

        const shipping = 0;
        const total = subtotal + shipping;

        const orderNumber = `AUR-${Date.now()}`;

        // ==================================================
        // CREATE ORDER + REDUCE STOCK
        // ==================================================

        const order = await prisma.$transaction(async (tx) => {

            // Check stock
            for (const item of items) {
                const productId = Number(
                    item.productId || item.id
                );

                const quantity = Number(item.quantity);

                const product = await tx.product.findUnique({
                    where: {
                        id: productId,
                    },
                });

                if (!product) {
                    throw new Error(
                        `Product ${productId} not found`
                    );
                }

                if (product.stock < quantity) {
                    throw new Error(
                        `${product.name} has only ${product.stock} item(s) available`
                    );
                }
            }

            // Create order
            const newOrder = await tx.order.create({
                data: {
                    orderNumber,

                    customer: {
                        create: {
                            name: customer.name,
                            phone: customer.phone,
                            email: customer.email,
                            address: customer.address,
                            city: customer.city,
                            state: customer.state,
                            pincode: customer.pincode,
                        },
                    },

                    subtotal,
                    shipping,
                    total,

                    paymentMethod:
                        paymentMethod || "COD",

                    status: "CONFIRMED",

                    items: {
                        create: items.map((item) => ({
                            productId: Number(
                                item.productId || item.id
                            ),

                            productName:
                                item.productName ||
                                item.name,

                            price: Number(item.price),

                            quantity: Number(
                                item.quantity
                            ),

                            image:
                                item.image || null,
                        })),
                    },
                },

                include: {
                    customer: true,
                    items: true,
                },
            });

            // Reduce stock
            for (const item of items) {
                const productId = Number(
                    item.productId || item.id
                );

                const quantity = Number(
                    item.quantity
                );

                await tx.product.update({
                    where: {
                        id: productId,
                    },

                    data: {
                        stock: {
                            decrement: quantity,
                        },
                    },
                });
            }

            return newOrder;
        });

        // ==================================================
        // SEND EMAIL WITHOUT BLOCKING ORDER RESPONSE
        // ==================================================

        // Send confirmation email in the background
        sendOrderConfirmationEmail(order)
            .then(() => {
                console.log(
                    `Order confirmation email sent for ${order.orderNumber}`
                );
            })
            .catch((error) => {
                console.error(
                    `Order confirmation email failed for ${order.orderNumber}:`,
                    error.message
                );
            });

        // ==================================================
        // RETURN RESPONSE IMMEDIATELY
        // ==================================================

        return res.status(201).json({
            success: true,

            message: "Order created successfully",

            order: {
                id: order.id,

                orderNumber:
                    order.orderNumber,

                total:
                    order.total,

                status:
                    order.status,
            },
        });

    } catch (error) {
        console.error(
            "Create Order Error:",
            error
        );

        return res.status(400).json({
            success: false,

            message:
                error.message ||
                "Failed to create order",
        });
    }
});

// ======================================================
// ADMIN - GET ALL ORDERS
// ======================================================

router.get(
    "/admin",
    adminAuth,
    async (req, res) => {
        try {
            const orders =
                await prisma.order.findMany({
                    orderBy: {
                        createdAt: "desc",
                    },

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
            console.error(
                "Admin Orders Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch orders",
            });
        }
    }
);

// ======================================================
// ADMIN - GET SINGLE ORDER
// ======================================================

router.get(
    "/admin/:id",
    adminAuth,
    async (req, res) => {
        try {
            const orderId =
                Number(req.params.id);

            const order =
                await prisma.order.findUnique({
                    where: {
                        id: orderId,
                    },

                    include: {
                        customer: true,
                        items: true,
                    },
                });

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Order not found",
                });
            }

            return res.json({
                success: true,
                order,
            });

        } catch (error) {
            console.error(
                "Admin Order Details Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch order",
            });
        }
    }
);

// ======================================================
// ADMIN - UPDATE ORDER STATUS
// ======================================================

router.put(
    "/admin/:id/status",
    adminAuth,
    async (req, res) => {
        try {
            const orderId =
                Number(req.params.id);

            const { status } = req.body;

            const allowedStatuses = [
                "CONFIRMED",
                "PROCESSING",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
            ];

            if (
                !allowedStatuses.includes(status)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid order status",
                });
            }

            const existingOrder =
                await prisma.order.findUnique({
                    where: {
                        id: orderId,
                    },
                });

            if (!existingOrder) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Order not found",
                });
            }

            const order =
                await prisma.order.update({
                    where: {
                        id: orderId,
                    },

                    data: {
                        status,
                    },
                });

            return res.json({
                success: true,

                message:
                    "Order status updated successfully",

                order,
            });

        } catch (error) {
            console.error(
                "Update Order Status Error:",
                error
            );

            return res.status(500).json({
                success: false,

                message:
                    "Failed to update order status",
            });
        }
    }
);

module.exports = router;

