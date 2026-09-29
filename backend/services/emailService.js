const https = require("https");

function sendBrevoEmail({ to, subject, html }) {
    return new Promise((resolve, reject) => {
        const apiKey = process.env.BREVO_API_KEY;
        const senderEmail = process.env.MAIL_FROM_EMAIL;
        const senderName =
            process.env.MAIL_FROM_NAME || "AURELIA";

        if (!apiKey) {
            return reject(
                new Error("BREVO_API_KEY is not configured")
            );
        }

        if (!senderEmail) {
            return reject(
                new Error("MAIL_FROM_EMAIL is not configured")
            );
        }

        const data = JSON.stringify({
            sender: {
                name: senderName,
                email: senderEmail,
            },

            to: [
                {
                    email: to,
                },
            ],

            subject,

            htmlContent: html,
        });

        const options = {
            hostname: "api.brevo.com",
            path: "/v3/smtp/email",
            method: "POST",

            headers: {
                accept: "application/json",
                "api-key": apiKey,
                "content-type": "application/json",
                "content-length": Buffer.byteLength(data),
            },

            timeout: 15000,
        };

        const request = https.request(
            options,
            (response) => {
                let responseData = "";

                response.on("data", (chunk) => {
                    responseData += chunk;
                });

                response.on("end", () => {
                    if (
                        response.statusCode >= 200 &&
                        response.statusCode < 300
                    ) {
                        resolve(responseData);
                    } else {
                        reject(
                            new Error(
                                `Brevo API error ${response.statusCode}: ${responseData}`
                            )
                        );
                    }
                });
            }
        );

        request.on("timeout", () => {
            request.destroy(
                new Error("Brevo API connection timeout")
            );
        });

        request.on("error", (error) => {
            reject(error);
        });

        request.write(data);
        request.end();
    });
}


/* =========================================================
   ADD CONTACT TO BREVO
   ========================================================= */

async function addBrevoContact(email) {
    return new Promise((resolve, reject) => {
        const apiKey = process.env.BREVO_API_KEY;

        if (!apiKey) {
            return reject(
                new Error("BREVO_API_KEY is not configured")
            );
        }

        const data = JSON.stringify({
            email,
            updateEnabled: true,
        });

        const options = {
            hostname: "api.brevo.com",
            path: "/v3/contacts",
            method: "POST",

            headers: {
                accept: "application/json",
                "api-key": apiKey,
                "content-type": "application/json",
                "content-length": Buffer.byteLength(data),
            },

            timeout: 15000,
        };

        const request = https.request(
            options,
            (response) => {
                let responseData = "";

                response.on("data", (chunk) => {
                    responseData += chunk;
                });

                response.on("end", () => {
                    if (
                        response.statusCode >= 200 &&
                        response.statusCode < 300
                    ) {
                        resolve(responseData);
                    } else {
                        reject(
                            new Error(
                                `Brevo Contact API error ${response.statusCode}: ${responseData}`
                            )
                        );
                    }
                });
            }
        );

        request.on("timeout", () => {
            request.destroy(
                new Error("Brevo Contact API connection timeout")
            );
        });

        request.on("error", (error) => {
            reject(error);
        });

        request.write(data);
        request.end();
    });
}

async function sendNewCollectionEmail({ to, product }) {
    const subject = `AURELIA | Introducing ${product.name}`;

    const productImage =
        product.images?.[0] ||
        "https://via.placeholder.com/800x1000";

    const shopUrl = `${process.env.FRONTEND_URL}/shop`;

    const formattedPrice = Number(product.price).toLocaleString("en-IN");

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>AURELIA — New Arrival</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f4f1eb;
    font-family:Arial, Helvetica, sans-serif;
    color:#1c1c1c;
">

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background:#f4f1eb;"
>
<tr>
<td align="center" style="padding:35px 15px;">

    <!-- MAIN CARD -->
    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
            max-width:650px;
            background:#ffffff;
        "
    >

        <!-- HEADER -->
        <tr>
        <td
            align="center"
            style="
                padding:42px 30px 30px;
                border-bottom:1px solid #eee9df;
            "
        >

            <div style="
                font-family:Georgia, 'Times New Roman', serif;
                font-size:30px;
                letter-spacing:8px;
                color:#171717;
            ">
                AURELIA
            </div>

            <div style="
                margin-top:10px;
                font-size:9px;
                letter-spacing:4px;
                color:#a4864d;
                text-transform:uppercase;
            ">
                FINE JEWELLERY
            </div>

        </td>
        </tr>


        <!-- INTRO -->
        <tr>
        <td
            align="center"
            style="
                padding:48px 35px 30px;
            "
        >

            <div style="
                font-size:10px;
                letter-spacing:4px;
                color:#a4864d;
                text-transform:uppercase;
                margin-bottom:18px;
            ">
                A NEW ARRIVAL
            </div>

            <h1 style="
                margin:0;
                font-family:Georgia, 'Times New Roman', serif;
                font-size:40px;
                font-weight:normal;
                line-height:1.2;
                color:#171717;
            ">
                Something New<br />
                Has Arrived
            </h1>

            <p style="
                margin:22px auto 0;
                max-width:460px;
                font-size:14px;
                line-height:1.8;
                color:#777;
            ">
                Discover the latest addition to the AURELIA collection,
                thoughtfully chosen for those who appreciate timeless
                elegance and refined craftsmanship.
            </p>

        </td>
        </tr>


        <!-- PRODUCT IMAGE -->
        <tr>
        <td align="center" style="padding:5px 35px 30px;">

            <img
                src="${productImage}"
                alt="${product.name}"
                width="580"
                style="
                    display:block;
                    width:100%;
                    max-width:580px;
                    height:auto;
                    border:0;
                "
            />

        </td>
        </tr>


        <!-- PRODUCT DETAILS -->
        <tr>
        <td
            align="center"
            style="
                padding:10px 35px 45px;
            "
        >

            <div style="
                font-size:9px;
                letter-spacing:4px;
                color:#a4864d;
                text-transform:uppercase;
                margin-bottom:15px;
            ">
                ${product.category}
            </div>

            <h2 style="
                margin:0;
                font-family:Georgia, 'Times New Roman', serif;
                font-size:30px;
                font-weight:normal;
                color:#171717;
            ">
                ${product.name}
            </h2>

            <div style="
                margin-top:18px;
                font-family:Georgia, 'Times New Roman', serif;
                font-size:20px;
                color:#222;
            ">
                ₹${formattedPrice}
            </div>

            ${product.metal
            ? `
            <div style="
                margin-top:12px;
                font-size:11px;
                letter-spacing:2px;
                color:#888;
                text-transform:uppercase;
            ">
                ${product.metal}
                ${product.weight
                ? ` &nbsp;•&nbsp; ${product.weight} g`
                : ""
            }
            </div>
            `
            : ""
        }

            <div style="
                width:45px;
                height:1px;
                background:#c8ad78;
                margin:25px auto;
            "></div>

            <p style="
                margin:0 auto;
                max-width:470px;
                font-size:13px;
                line-height:1.9;
                color:#777;
            ">
                ${product.description}
            </p>

        </td>
        </tr>


        <!-- CTA -->
        <tr>
        <td align="center" style="padding:0 35px 55px;">

            <a
                href="${shopUrl}"
                style="
                    display:inline-block;
                    padding:16px 38px;
                    background:#171717;
                    color:#ffffff;
                    text-decoration:none;
                    font-size:10px;
                    letter-spacing:3px;
                    text-transform:uppercase;
                "
            >
                Discover The Collection
            </a>

        </td>
        </tr>


        <!-- BRAND MESSAGE -->
        <tr>
        <td
            align="center"
            style="
                padding:40px 35px;
                background:#f8f6f1;
                border-top:1px solid #eee9df;
                border-bottom:1px solid #eee9df;
            "
        >

            <div style="
                font-family:Georgia, 'Times New Roman', serif;
                font-size:22px;
                color:#222;
                margin-bottom:12px;
            ">
                Timeless. Refined. Yours.
            </div>

            <p style="
                margin:0 auto;
                max-width:430px;
                font-size:12px;
                line-height:1.8;
                color:#888;
            ">
                Jewellery designed to become part of your story,
                today and for generations to come.
            </p>

        </td>
        </tr>


        <!-- FOOTER -->
        <tr>
        <td
            align="center"
            style="
                padding:35px 25px;
                background:#171717;
            "
        >

            <div style="
                font-family:Georgia, 'Times New Roman', serif;
                font-size:22px;
                letter-spacing:5px;
                color:#ffffff;
            ">
                AURELIA
            </div>

            <div style="
                margin-top:10px;
                font-size:8px;
                letter-spacing:3px;
                color:#b9a477;
                text-transform:uppercase;
            ">
                FINE JEWELLERY
            </div>

            <p style="
                margin:22px 0 0;
                font-size:10px;
                line-height:1.7;
                color:#999;
            ">
                With love from AURELIA
            </p>

            <p style="
                margin:15px 0 0;
                font-size:9px;
                color:#777;
            ">
                You are receiving this email because you subscribed
                to AURELIA collection updates.
            </p>

        </td>
        </tr>

    </table>

</td>
</tr>
</table>

</body>
</html>
`;

    return sendBrevoEmail({
        to,
        subject,
        html,
    });
}
/* =========================================================
   ORDER CONFIRMATION EMAIL
   ========================================================= */

async function sendOrderConfirmationEmail(order) {
    const customer = order.customer;

    const itemsHtml = order.items
        .map(
            (item) => `
                <tr>
                    <td style="padding:14px 0;border-bottom:1px solid #e6e1d7;">
                        <div style="font-family:Arial,sans-serif;color:#171717;font-size:14px;">
                            ${item.productName}
                        </div>

                        <div style="margin-top:5px;color:#918b83;font-size:12px;">
                            Quantity: ${item.quantity}
                        </div>
                    </td>

                    <td style="padding:14px 0;border-bottom:1px solid #e6e1d7;text-align:right;font-family:Arial,sans-serif;color:#171717;font-size:14px;">
                        ₹${Number(item.price).toLocaleString("en-IN")}
                    </td>
                </tr>
            `
        )
        .join("");

    const html = `
        <!DOCTYPE html>

        <html>

        <head>
            <meta charset="UTF-8" />

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />

            <title>AURELIA Order Confirmation</title>
        </head>

        <body style="margin:0;padding:0;background:#f8f6f1;">

            <div style="
                max-width:680px;
                margin:0 auto;
                padding:40px 20px;
                font-family:Arial,Helvetica,sans-serif;
            ">

                <!-- BRAND -->

                <div style="
                    text-align:center;
                    padding:30px 20px;
                    background:#171717;
                ">

                    <div style="
                        color:#ffffff;
                        font-family:Georgia,serif;
                        font-size:30px;
                        letter-spacing:6px;
                    ">
                        AURELIA
                    </div>

                    <div style="
                        margin-top:8px;
                        color:#c6a15b;
                        font-size:10px;
                        letter-spacing:3px;
                        text-transform:uppercase;
                    ">
                        Fine Jewellery
                    </div>

                </div>


                <!-- CONTENT -->

                <div style="
                    background:#ffffff;
                    padding:40px 35px;
                ">

                    <div style="
                        color:#a9874a;
                        font-size:10px;
                        font-weight:bold;
                        letter-spacing:3px;
                        text-transform:uppercase;
                    ">
                        Order Confirmation
                    </div>


                    <h1 style="
                        margin:14px 0 0;
                        color:#171717;
                        font-family:Georgia,serif;
                        font-size:32px;
                        font-weight:normal;
                    ">
                        Thank you, ${customer.name}
                    </h1>


                    <p style="
                        margin:18px 0 0;
                        color:#77716a;
                        font-size:14px;
                        line-height:1.7;
                    ">
                        Your order has been successfully confirmed.
                        We are preparing your AURELIA jewellery with care.
                    </p>


                    <!-- ORDER NUMBER -->

                    <div style="
                        margin-top:30px;
                        padding:18px;
                        background:#f8f6f1;
                        border-left:3px solid #c6a15b;
                    ">

                        <div style="
                            color:#918b83;
                            font-size:10px;
                            letter-spacing:2px;
                            text-transform:uppercase;
                        ">
                            Order Number
                        </div>

                        <div style="
                            margin-top:7px;
                            color:#171717;
                            font-size:17px;
                            font-weight:bold;
                        ">
                            ${order.orderNumber}
                        </div>

                    </div>


                    <!-- ITEMS -->

                    <h2 style="
                        margin:35px 0 15px;
                        color:#171717;
                        font-family:Georgia,serif;
                        font-size:22px;
                        font-weight:normal;
                    ">
                        Your Order
                    </h2>


                    <table style="
                        width:100%;
                        border-collapse:collapse;
                    ">

                        <tbody>
                            ${itemsHtml}
                        </tbody>

                    </table>


                    <!-- SUMMARY -->

                    <div style="
                        margin-top:25px;
                        border-top:1px solid #e6e1d7;
                        padding-top:20px;
                    ">

                        <div style="
                            display:flex;
                            justify-content:space-between;
                            margin-bottom:10px;
                            color:#77716a;
                            font-size:13px;
                        ">

                            <span>Subtotal</span>

                            <span>
                                ₹${Number(order.subtotal).toLocaleString("en-IN")}
                            </span>

                        </div>


                        <div style="
                            display:flex;
                            justify-content:space-between;
                            margin-bottom:10px;
                            color:#77716a;
                            font-size:13px;
                        ">

                            <span>Shipping</span>

                            <span>
                                ${Number(order.shipping) === 0
            ? "FREE"
            : `₹${Number(order.shipping).toLocaleString("en-IN")}`
        }
                            </span>

                        </div>


                        <div style="
                            margin-top:15px;
                            padding-top:15px;
                            border-top:1px solid #e6e1d7;
                            display:flex;
                            justify-content:space-between;
                            color:#171717;
                            font-size:17px;
                            font-weight:bold;
                        ">

                            <span>Total</span>

                            <span>
                                ₹${Number(order.total).toLocaleString("en-IN")}
                            </span>

                        </div>

                    </div>


                    <!-- PAYMENT -->

                    <div style="
                        margin-top:30px;
                        padding:18px;
                        background:#faf9f6;
                    ">

                        <div style="
                            color:#918b83;
                            font-size:10px;
                            letter-spacing:2px;
                            text-transform:uppercase;
                        ">
                            Payment Method
                        </div>

                        <div style="
                            margin-top:7px;
                            color:#171717;
                            font-size:14px;
                            font-weight:bold;
                        ">
                            ${order.paymentMethod || "COD"}
                        </div>

                    </div>


                    <!-- ADDRESS -->

                    <h2 style="
                        margin:35px 0 15px;
                        color:#171717;
                        font-family:Georgia,serif;
                        font-size:22px;
                        font-weight:normal;
                    ">
                        Delivery Address
                    </h2>


                    <div style="
                        color:#77716a;
                        font-size:13px;
                        line-height:1.8;
                    ">

                        ${customer.address}<br />
                        ${customer.city}, ${customer.state}<br />
                        ${customer.pincode}<br />
                        India

                    </div>


                    <!-- MESSAGE -->

                    <div style="
                        margin-top:35px;
                        padding-top:25px;
                        border-top:1px solid #e6e1d7;
                        color:#77716a;
                        font-size:13px;
                        line-height:1.7;
                    ">

                        We will keep you updated as your order moves
                        through processing and delivery.

                    </div>

                </div>


                <!-- FOOTER -->

                <div style="
                    padding:25px 20px;
                    text-align:center;
                    background:#eee9e1;
                ">

                    <div style="
                        color:#171717;
                        font-family:Georgia,serif;
                        font-size:18px;
                        letter-spacing:3px;
                    ">
                        AURELIA
                    </div>

                    <div style="
                        margin-top:10px;
                        color:#918b83;
                        font-size:10px;
                        letter-spacing:2px;
                        text-transform:uppercase;
                    ">
                        Jewellery with a lasting presence
                    </div>

                    <div style="
                        margin-top:15px;
                        color:#aaa39a;
                        font-size:10px;
                    ">
                        Thank you for choosing AURELIA.
                    </div>

                </div>

            </div>

        </body>

        </html>
    `;


    await sendBrevoEmail({
        to: customer.email,

        subject:
            `AURELIA Order Confirmed — ${order.orderNumber}`,

        html,
    });
}


/* =========================================================
   EXPORTS
   ========================================================= */

module.exports = {
    sendOrderConfirmationEmail,
    addBrevoContact,
    sendNewCollectionEmail,
    sendBrevoEmail
};

