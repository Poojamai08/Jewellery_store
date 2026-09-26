const express = require("express");

const prisma = require("../lib/prisma");

const { addBrevoContact } = require("../services/emailService");

const router = express.Router();

/* =========================================
   SUBSCRIBE TO NEWSLETTER
========================================= */

router.post("/subscribe", async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();

        /* -----------------------------------------
           VALIDATION
        ----------------------------------------- */

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please enter your email address.",
            });
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address.",
            });
        }

        /* -----------------------------------------
           CHECK DATABASE
        ----------------------------------------- */

        const existingSubscriber =
            await prisma.newsletterSubscriber.findUnique({
                where: {
                    email,
                },
            });

        if (existingSubscriber) {
            return res.status(200).json({
                success: true,
                message:
                    "You are already subscribed to AURELIA.",
            });
        }

        /* -----------------------------------------
           SAVE SUBSCRIBER
        ----------------------------------------- */

        const subscriber =
            await prisma.newsletterSubscriber.create({
                data: {
                    email,
                },
            });

        /* -----------------------------------------
           ADD TO BREVO
        ----------------------------------------- */

        try {
            await addBrevoContact(email);

            console.log(
                `Newsletter subscriber added to Brevo: ${email}`
            );
        } catch (brevoError) {
            console.error(
                "Brevo contact error:",
                brevoError.message
            );

            /*
             * We keep the subscriber in PostgreSQL even
             * if Brevo temporarily fails.
             */
        }

        return res.status(201).json({
            success: true,
            message:
                "You're subscribed. We'll keep you updated on new AURELIA collections.",
            subscriberId: subscriber.id,
        });
    } catch (error) {
        console.error(
            "Newsletter subscription error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to subscribe right now. Please try again.",
        });
    }
});

module.exports = router;