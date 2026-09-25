import { Link } from "react-router-dom";

function ShippingDelivery() {
    return (
        <div className="bg-[#f8f6f1] text-[#171717]">

            {/* HERO */}

            <section className="border-b border-[#ded8cf] bg-[#171717] px-6 py-20 text-white sm:py-28">
                <div className="mx-auto max-w-5xl text-center">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#c6a15b]">
                        AURELIA
                    </p>

                    <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">
                        Shipping & Delivery
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/60">
                        Every AURELIA order is carefully prepared, securely
                        packaged, and delivered with the attention your
                        jewellery deserves.
                    </p>

                </div>
            </section>

            {/* INTRO */}

            <section className="px-6 py-16 sm:py-24">
                <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">

                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                            Delivery Promise
                        </p>

                        <h2 className="mt-4 font-serif text-4xl leading-tight text-[#171717] sm:text-5xl">
                            From our hands
                            <br />
                            to yours.
                        </h2>
                    </div>

                    <div className="text-sm leading-7 text-[#77716a]">
                        <p>
                            At AURELIA, we take care at every stage of your
                            order. Once your purchase is confirmed, our team
                            prepares your jewellery for secure dispatch.
                        </p>

                        <p className="mt-5">
                            Orders are carefully packed to help protect your
                            jewellery during transit and are shipped to the
                            delivery address provided during checkout.
                        </p>
                    </div>

                </div>
            </section>

            {/* DELIVERY STEPS */}

            <section className="border-y border-[#ded8cf] bg-[#f3efe7] px-6 py-16 sm:py-24">
                <div className="mx-auto max-w-6xl">

                    <div className="mb-12">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                            The Journey
                        </p>

                        <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                            Your order, carefully handled.
                        </h2>
                    </div>

                    <div className="grid gap-px border border-[#ded8cf] bg-[#ded8cf] md:grid-cols-3">

                        <div className="bg-white p-8">
                            <span className="font-serif text-3xl text-[#c6a15b]">
                                01
                            </span>

                            <h3 className="mt-6 font-serif text-2xl">
                                Order Confirmed
                            </h3>

                            <p className="mt-4 text-sm leading-6 text-[#77716a]">
                                Once your order is successfully placed,
                                you will receive an order confirmation
                                with your order details.
                            </p>
                        </div>

                        <div className="bg-white p-8">
                            <span className="font-serif text-3xl text-[#c6a15b]">
                                02
                            </span>

                            <h3 className="mt-6 font-serif text-2xl">
                                Carefully Prepared
                            </h3>

                            <p className="mt-4 text-sm leading-6 text-[#77716a]">
                                Your jewellery is checked, packed securely,
                                and prepared for dispatch.
                            </p>
                        </div>

                        <div className="bg-white p-8">
                            <span className="font-serif text-3xl text-[#c6a15b]">
                                03
                            </span>

                            <h3 className="mt-6 font-serif text-2xl">
                                Delivered to You
                            </h3>

                            <p className="mt-4 text-sm leading-6 text-[#77716a]">
                                Your order is handed over to our delivery
                                partner and shipped to your provided address.
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            {/* SHIPPING INFORMATION */}

            <section className="px-6 py-16 sm:py-24">
                <div className="mx-auto max-w-6xl">

                    <div className="mb-10">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                            Shipping Information
                        </p>

                        <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                            Everything you need to know.
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">

                        <div className="border border-[#ded8cf] bg-white p-8">
                            <h3 className="font-serif text-2xl">
                                Shipping Charges
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-[#77716a]">
                                Standard shipping is currently offered
                                free of charge on AURELIA orders.
                            </p>
                        </div>

                        <div className="border border-[#ded8cf] bg-white p-8">
                            <h3 className="font-serif text-2xl">
                                Delivery Time
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-[#77716a]">
                                Delivery time may vary depending on your
                                location, product availability, and courier
                                service.
                            </p>
                        </div>

                        <div className="border border-[#ded8cf] bg-white p-8">
                            <h3 className="font-serif text-2xl">
                                Delivery Address
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-[#77716a]">
                                Please make sure your address, phone number,
                                city, state, and pincode are correct before
                                placing your order.
                            </p>
                        </div>

                        <div className="border border-[#ded8cf] bg-white p-8">
                            <h3 className="font-serif text-2xl">
                                Order Updates
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-[#77716a]">
                                You will receive order-related communication
                                using the contact details provided during
                                checkout.
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            {/* IMPORTANT NOTE */}

            <section className="px-6 pb-16 sm:pb-24">
                <div className="mx-auto max-w-6xl">

                    <div className="border border-[#c6a15b]/40 bg-[#eee9e1] p-8 sm:p-10">

                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                            Please Note
                        </p>

                        <p className="mt-4 max-w-4xl text-sm leading-7 text-[#77716a]">
                            Delivery timelines are estimates and may be
                            affected by courier delays, weather conditions,
                            holidays, or circumstances outside AURELIA's
                            control. If you experience an unexpected delay,
                            please contact our team for assistance.
                        </p>

                    </div>

                </div>
            </section>

            {/* CTA */}

            <section className="border-t border-[#ded8cf] bg-[#171717] px-6 py-16 text-center sm:py-20">

                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
                    Need Assistance?
                </p>

                <h2 className="mt-4 font-serif text-3xl text-white sm:text-4xl">
                    We're here to help.
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/50">
                    Have a question about your delivery or order?
                    Our team will be happy to assist you.
                </p>

                <Link
                    to="/contact"
                    className="mt-8 inline-flex bg-[#c6a15b] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#171717] transition hover:bg-[#e2cf9f]"
                >
                    Contact AURELIA
                </Link>

            </section>

        </div>
    );
}

export default ShippingDelivery;