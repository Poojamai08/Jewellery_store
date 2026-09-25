import { Link } from "react-router-dom";

function ReturnExchange() {
    return (
        <main className="bg-[#f8f6f1] text-[#171717]">

            {/* HERO */}
            <section className="border-b border-[#e6e1d7]">
                <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
                    <div className="max-w-3xl">
                        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#a9874a]">
                            AURELIA Care
                        </p>

                        <h1 className="font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
                            Return & Exchange
                        </h1>

                        <p className="mt-7 max-w-2xl text-sm leading-7 text-[#77716a] sm:text-base">
                            Every AURELIA piece is carefully selected and prepared
                            for you. If something isn't right, we're here to help
                            make the experience simple and seamless.
                        </p>
                    </div>
                </div>
            </section>

            {/* INTRO */}
            <section className="border-b border-[#e6e1d7] bg-[#eeeae3]">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
                    <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                                Our Promise
                            </p>

                            <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
                                Made for a lasting experience.
                            </h2>
                        </div>

                        <div className="lg:col-span-2">
                            <p className="text-sm leading-8 text-[#66615b] sm:text-base">
                                We want you to feel confident every time you
                                purchase from AURELIA. Please review the return
                                and exchange guidelines below before placing
                                your order.
                            </p>

                            <p className="mt-5 text-sm leading-8 text-[#66615b] sm:text-base">
                                For assistance with an order, our customer care
                                team can help you understand the available
                                options based on your order and product.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* RETURN POLICY */}
            <section className="border-b border-[#e6e1d7]">
                <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-24">

                    <div className="mb-12">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                            01 — Returns
                        </p>

                        <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
                            Return Policy
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">

                        <div className="border border-[#e3ddd3] bg-white p-7 sm:p-9">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a9874a]">
                                Eligibility
                            </span>

                            <h3 className="mt-4 font-serif text-2xl">
                                Unused & original condition
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-[#77716a]">
                                Products should be unused and returned in their
                                original condition, including the original
                                packaging and accompanying items.
                            </p>
                        </div>

                        <div className="border border-[#e3ddd3] bg-white p-7 sm:p-9">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a9874a]">
                                Inspection
                            </span>

                            <h3 className="mt-4 font-serif text-2xl">
                                Quality verification
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-[#77716a]">
                                Returned products may be inspected before a
                                return or refund is approved.
                            </p>
                        </div>

                        <div className="border border-[#e3ddd3] bg-white p-7 sm:p-9">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a9874a]">
                                Packaging
                            </span>

                            <h3 className="mt-4 font-serif text-2xl">
                                Keep the presentation intact
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-[#77716a]">
                                Please retain the jewellery box, packaging,
                                certificates and other items received with
                                your order.
                            </p>
                        </div>

                        <div className="border border-[#e3ddd3] bg-white p-7 sm:p-9">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a9874a]">
                                Condition
                            </span>

                            <h3 className="mt-4 font-serif text-2xl">
                                No signs of use
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-[#77716a]">
                                Items showing signs of wear, damage or alteration
                                may not qualify for return.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* EXCHANGE */}
            <section className="border-b border-[#e6e1d7] bg-[#171717] text-white">
                <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-24">

                    <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
                                02 — Exchange
                            </p>

                            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                                Need a different piece?
                            </h2>

                            <p className="mt-6 max-w-xl text-sm leading-8 text-white/60 sm:text-base">
                                If your order is eligible for exchange,
                                contact our customer care team with your
                                order details. Our team will guide you through
                                the available exchange options.
                            </p>
                        </div>

                        <div className="border border-white/10 p-7 sm:p-9">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c6a15b]">
                                Exchange Process
                            </p>

                            <div className="mt-8 space-y-7">

                                <div className="flex gap-5">
                                    <span className="font-serif text-2xl text-[#c6a15b]">
                                        01
                                    </span>

                                    <div>
                                        <h3 className="font-medium">
                                            Contact us
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-white/50">
                                            Share your order number and
                                            exchange request.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-5">
                                    <span className="font-serif text-2xl text-[#c6a15b]">
                                        02
                                    </span>

                                    <div>
                                        <h3 className="font-medium">
                                            Verification
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-white/50">
                                            Our team will review the product
                                            and request.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-5">
                                    <span className="font-serif text-2xl text-[#c6a15b]">
                                        03
                                    </span>

                                    <div>
                                        <h3 className="font-medium">
                                            Next steps
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-white/50">
                                            We will provide the next steps
                                            based on your request.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* NON RETURNABLE */}
            <section className="border-b border-[#e6e1d7]">
                <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-24">

                    <div className="max-w-3xl">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                            03 — Important
                        </p>

                        <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
                            Before requesting a return
                        </h2>

                        <p className="mt-6 text-sm leading-8 text-[#77716a] sm:text-base">
                            To help us process your request smoothly, please
                            ensure the following are available:
                        </p>
                    </div>

                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {[
                            "Order number",
                            "Original packaging",
                            "Product in original condition",
                            "Purchase details",
                        ].map((item, index) => (
                            <div
                                key={item}
                                className="border border-[#e3ddd3] bg-[#f8f6f1] p-6"
                            >
                                <span className="font-serif text-2xl text-[#c6a15b]">
                                    0{index + 1}
                                </span>

                                <p className="mt-5 text-sm font-medium text-[#292722]">
                                    {item}
                                </p>
                            </div>
                        ))}

                    </div>
                </div>
            </section>

            {/* REFUND */}
            <section className="border-b border-[#e6e1d7] bg-[#eeeae3]">
                <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-24">

                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                                04 — Refunds
                            </p>

                            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
                                Refund Information
                            </h2>
                        </div>

                        <div>
                            <p className="text-sm leading-8 text-[#66615b] sm:text-base">
                                Once an eligible return has been received and
                                approved, the applicable refund will be
                                processed according to the payment method and
                                order terms.
                            </p>

                            <p className="mt-5 text-sm leading-8 text-[#66615b] sm:text-base">
                                Processing time can vary depending on the
                                payment provider or bank.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* CONTACT CTA */}
            <section>
                <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:px-10 lg:px-16 lg:py-28">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#a9874a]">
                        Need Assistance?
                    </p>

                    <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
                        We're here to help with your AURELIA experience.
                    </h2>

                    <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#77716a]">
                        Have a question about a return or exchange?
                        Get in touch with our customer care team.
                    </p>

                    <div className="mt-9">
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center bg-[#171717] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-white transition duration-300 hover:bg-[#a9874a]"
                        >
                            Contact AURELIA
                        </Link>
                    </div>

                </div>
            </section>

        </main>
    );
}

export default ReturnExchange;