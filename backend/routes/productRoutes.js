const express = require("express");
const prisma = require("../lib/prisma");
const adminAuth = require("../middleware/adminAuth");
const {
    sendNewCollectionEmail,
} = require("../services/emailService");
const router = express.Router();


// ======================================================
// CUSTOMER APIs
// ======================================================

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json({
            success: true,
            products,
        });

    } catch (error) {
        console.error("Get Products Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
});


// Get single product
router.get("/:id", async (req, res) => {
    try {
        const productId = Number(req.params.id);

        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.json({
            success: true,
            product,
        });

    } catch (error) {
        console.error("Get Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
        });
    }
});


// ======================================================
// ADMIN APIs
// ======================================================


// Add Product
router.post("/", adminAuth, async (req, res) => {
    try {
        const {
            name,
            category,
            price,
            metal,
            weight,
            sku,
            stock,
            description,
            images,
        } = req.body;


        // Required fields
        if (
            !name ||
            !category ||
            price === undefined ||
            !metal ||
            !sku ||
            stock === undefined ||
            !description
        ) {
            return res.status(400).json({
                success: false,
                message: "Required product fields are missing",
            });
        }


        // Check duplicate SKU
        const existingProduct = await prisma.product.findUnique({
            where: {
                sku,
            },
        });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "SKU already exists",
            });
        }


        const product = await prisma.product.create({
            data: {
                name,
                category,
                price: Number(price),
                metal,
                weight:
                    weight !== undefined &&
                        weight !== null &&
                        weight !== ""
                        ? Number(weight)
                        : null,
                sku,
                stock: Number(stock),
                description,
                images: Array.isArray(images)
                    ? images
                    : [],
            },
        });

        // ======================================================
        // SEND NEW COLLECTION EMAIL
        // ======================================================

        try {
            const subscribers =
                await prisma.newsletterSubscriber.findMany({
                    select: {
                        email: true,
                    },
                });

            if (subscribers.length > 0) {
                console.log(
                    `Sending new collection email to ${subscribers.length} subscriber(s)...`
                );

                const emailResults = await Promise.allSettled(
                    subscribers.map((subscriber) =>
                        sendNewCollectionEmail({
                            to: subscriber.email,
                            product,
                        })
                    )
                );

                emailResults.forEach((result, index) => {
                    if (result.status === "fulfilled") {
                        console.log(
                            `New collection email sent to ${subscribers[index].email}`
                        );
                    } else {
                        console.error(
                            `Failed to send new collection email to ${subscribers[index].email}:`,
                            result.reason?.message || result.reason
                        );
                    }
                });
            } else {
                console.log(
                    "No newsletter subscribers found."
                );
            }

        } catch (emailError) {
            console.error(
                "Newsletter notification error:",
                emailError.message
            );
        }
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });

    } catch (error) {
        console.error("Create Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create product",
        });
    }
});


// Update Product
router.put("/:id", adminAuth, async (req, res) => {
    try {
        const productId = Number(req.params.id);

        const {
            name,
            category,
            price,
            metal,
            weight,
            sku,
            stock,
            description,
            images,
        } = req.body;


        // Check product exists
        const existingProduct = await prisma.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }


        // Check SKU belongs to another product
        if (sku && sku !== existingProduct.sku) {

            const skuProduct = await prisma.product.findUnique({
                where: {
                    sku,
                },
            });

            if (
                skuProduct &&
                skuProduct.id !== productId
            ) {
                return res.status(400).json({
                    success: false,
                    message: "SKU already exists",
                });
            }
        }


        const product = await prisma.product.update({
            where: {
                id: productId,
            },

            data: {
                name,
                category,
                price: Number(price),
                metal,

                weight:
                    weight !== undefined &&
                        weight !== null &&
                        weight !== ""
                        ? Number(weight)
                        : null,

                sku,
                stock: Number(stock),
                description,

                images: Array.isArray(images)
                    ? images
                    : existingProduct.images,
            },
        });


        res.json({
            success: true,
            message: "Product updated successfully",
            product,
        });

    } catch (error) {
        console.error("Update Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update product",
        });
    }
});


// Delete Product
router.delete("/:id", adminAuth, async (req, res) => {
    try {
        const productId = Number(req.params.id);


        // Check product exists
        const existingProduct = await prisma.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }


        await prisma.product.delete({
            where: {
                id: productId,
            },
        });


        res.json({
            success: true,
            message: "Product deleted successfully",
        });

    } catch (error) {
        console.error("Delete Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete product",
        });
    }
});


module.exports = router;