const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require("../lib/prisma");
const { sendBrevoEmail } = require("../services/emailService");

const router = express.Router();


// ========================================
// REGISTER
// ========================================

router.post("/register", async (req, res) => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required.",
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters.",
            });
        }

        // Check existing user
        const existingUser = await prisma.user.findUnique({
            where: {
                email: cleanEmail,
            },
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name: cleanName,
                email: cleanEmail,
                password: hashedPassword,
                role: "USER",
            },
        });

        // Send welcome email
        try {
            await sendBrevoEmail({
                to: cleanEmail,
                subject: "Welcome to AURELIA",
                html: `
                    <div style="
                        margin:0;
                        padding:40px 20px;
                        background:#f7f5f0;
                        font-family:Arial, sans-serif;
                    ">

                        <div style="
                            max-width:600px;
                            margin:auto;
                            background:#ffffff;
                            padding:45px 35px;
                            text-align:center;
                        ">

                            <div style="
                                font-family:Georgia, serif;
                                font-size:28px;
                                letter-spacing:6px;
                                color:#171717;
                            ">
                                AURELIA
                            </div>

                            <div style="
                                margin-top:8px;
                                font-size:9px;
                                letter-spacing:4px;
                                color:#b9a477;
                                text-transform:uppercase;
                            ">
                                FINE JEWELLERY
                            </div>

                            <div style="
                                margin:35px 0;
                                border-top:1px solid #eeeeee;
                            "></div>

                            <h1 style="
                                font-family:Georgia, serif;
                                font-size:28px;
                                font-weight:normal;
                                color:#171717;
                            ">
                                Welcome, ${cleanName}
                            </h1>

                            <p style="
                                font-size:14px;
                                line-height:1.8;
                                color:#666666;
                            ">
                                Your AURELIA account has been created successfully.
                            </p>

                            <p style="
                                font-size:14px;
                                line-height:1.8;
                                color:#666666;
                            ">
                                You can now explore our collections,
                                save your favourite pieces and place orders
                                with ease.
                            </p>

                            <a
                                href="${process.env.FRONTEND_URL}/shop"
                                style="
                                    display:inline-block;
                                    margin-top:20px;
                                    padding:14px 28px;
                                    background:#171717;
                                    color:#ffffff;
                                    text-decoration:none;
                                    font-size:11px;
                                    letter-spacing:2px;
                                    text-transform:uppercase;
                                "
                            >
                                Explore Collection
                            </a>

                            <div style="
                                margin-top:40px;
                                font-size:11px;
                                color:#999999;
                            ">
                                Timeless. Refined. Yours.
                            </div>

                        </div>

                    </div>
                `,
            });

            console.log(
                `Welcome email sent to ${cleanEmail}`
            );
        } catch (emailError) {
            console.error(
                "Welcome email error:",
                emailError.message
            );
        }

        return res.status(201).json({
            success: true,
            message: "Registration successful.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error(
            "Registration error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to register right now.",
        });
    }
});


// ========================================
// LOGIN
// ========================================

router.post("/login", async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Find user
        const user = await prisma.user.findUnique({
            where: {
                email: cleanEmail,
            },
        });

        // Don't reveal whether email exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Check password
        const passwordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to login right now.",
        });
    }
});


// ========================================
// GET CURRENT USER
// ========================================

router.get("/me", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists.",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
});


module.exports = router;