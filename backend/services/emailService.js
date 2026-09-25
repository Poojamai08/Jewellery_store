const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

async function sendOrderConfirmationEmail(order) {
    const customer = order.customer;

    const itemsHtml = order.items
        .map(
            (item) => `
                <tr>
                    <td style="padding: 14px 0; border-bottom: 1px solid #e6e1d7;">
                        <div style="font-family: Arial, sans-serif; color: #171717; font-size: 14px;">
                            ${item.productName}
                        </div>
                        <div style="margin-top: 5px; color: #918b83; font-size: 12px;">
                            Quantity: ${item.quantity}
                        </div>
                    </td>

                    <td style="padding: 14px 0; border-bottom: 1px solid #e6e1d7; text-align: right; font-family: Arial, sans-serif; color: #171717; font-size: 14px;">
                        ₹${Number(item.price).toLocaleString("en-IN")}
                    </td>
                </tr>
            `
        )
        .join("");

    const mailOptions = {
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
        to: customer.email,
        subject: `AURELIA Order Confirmed — ${order.orderNumber}`,

        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>AURELIA Order Confirmation</title>
            </head>

            <body style="margin:0; padding:0; background:#f8f6f1;">

                <div style="
                    max-width:680px;
                    margin:0 auto;
                    padding:40px 20px;
                    font-family:Arial, Helvetica, sans-serif;
                ">

                    <!-- BRAND -->

                    <div style="
                        text-align:center;
                        padding:30px 20px;
                        background:#171717;
                    ">
                        <div style="
                            color:#ffffff;
                            font-family:Georgia, serif;
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
                            font-family:Georgia, serif;
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
                            font-family:Georgia, serif;
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
                                <span>₹${Number(order.subtotal).toLocaleString("en-IN")}</span>
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
                                    ${
                                        Number(order.shipping) === 0
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
                            font-family:Georgia, serif;
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
                            font-family:Georgia, serif;
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
        `,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = {
    sendOrderConfirmationEmail,
};