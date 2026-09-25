import { useState } from "react";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Contact Enquiry:", formData);

        setSubmitted(true);

        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        });
    };

    return (
        <main className="bg-[#f8f6f1] text-[#171717]">

            {/* HERO */}
            <section className="border-b border-[#e6e1d7]">
                <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
                    <div className="max-w-3xl">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#a9874a]">
                            AURELIA Care
                        </p>

                        <h1 className="mt-5 font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
                            Contact Us
                        </h1>

                        <p className="mt-7 max-w-2xl text-sm leading-7 text-[#77716a] sm:text-base">
                            Whether you have a question about an order,
                            jewellery piece, delivery or anything else,
                            our team is here to assist you.
                        </p>
                    </div>
                </div>
            </section>

            {/* CONTACT INFO */}
            <section className="border-b border-[#e6e1d7] bg-[#eeeae3]">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-20">

                    <div className="grid gap-6 md:grid-cols-3">

                        {/* EMAIL */}
                        <div className="border border-[#ddd7cd] bg-[#f8f6f1] p-8">
                            <div className="flex h-11 w-11 items-center justify-center border border-[#d8c59f] text-[#a9874a]">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <rect
                                        x="3"
                                        y="5"
                                        width="18"
                                        height="14"
                                        rx="1"
                                    />
                                    <path d="M3 7l9 6 9-6" />
                                </svg>
                            </div>

                            <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a9874a]">
                                Email
                            </p>

                            <h3 className="mt-3 font-serif text-2xl">
                                Write to us
                            </h3>

                            <p className="mt-3 text-sm text-[#77716a]">
                                support@aurelia.com
                            </p>
                        </div>

                        {/* PHONE */}
                        <div className="border border-[#ddd7cd] bg-[#f8f6f1] p-8">
                            <div className="flex h-11 w-11 items-center justify-center border border-[#d8c59f] text-[#a9874a]">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>

                            <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a9874a]">
                                Phone
                            </p>

                            <h3 className="mt-3 font-serif text-2xl">
                                Speak with us
                            </h3>

                            <p className="mt-3 text-sm text-[#77716a]">
                                +91 00000 00000
                            </p>
                        </div>

                        {/* HOURS */}
                        <div className="border border-[#ddd7cd] bg-[#f8f6f1] p-8">
                            <div className="flex h-11 w-11 items-center justify-center border border-[#d8c59f] text-[#a9874a]">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M12 7v5l3 2" />
                                </svg>
                            </div>

                            <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a9874a]">
                                Support Hours
                            </p>

                            <h3 className="mt-3 font-serif text-2xl">
                                We're available
                            </h3>

                            <p className="mt-3 text-sm text-[#77716a]">
                                Monday – Saturday
                                <br />
                                10:00 AM – 6:00 PM
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* CONTACT FORM */}
            <section>
                <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">

                    <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">

                        {/* LEFT */}
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                                Get in Touch
                            </p>

                            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                                How can we help?
                            </h2>

                            <p className="mt-6 max-w-md text-sm leading-8 text-[#77716a]">
                                Send us a message and our customer care team
                                will get back to you with the information you
                                need.
                            </p>

                            <div className="mt-10 border-l border-[#c6a15b] pl-6">
                                <p className="font-serif text-xl leading-relaxed text-[#292722]">
                                    "Every detail matters."
                                </p>

                                <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a9874a]">
                                    The AURELIA Standard
                                </p>
                            </div>
                        </div>

                        {/* FORM */}
                        <div className="border border-[#e0d9cf] bg-white p-7 sm:p-10">

                            {submitted && (
                                <div className="mb-8 border border-[#d8c59f] bg-[#f8f6f1] p-5">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a9874a]">
                                        Message Received
                                    </p>

                                    <p className="mt-2 text-sm text-[#66615b]">
                                        Thank you for contacting AURELIA.
                                        Our team will get back to you soon.
                                    </p>
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-7"
                            >

                                <div className="grid gap-7 sm:grid-cols-2">

                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#55504a]"
                                        >
                                            Full Name
                                        </label>

                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="mt-3 w-full border-0 border-b border-[#dcd5cb] bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#a9874a]"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#55504a]"
                                        >
                                            Email Address
                                        </label>

                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="mt-3 w-full border-0 border-b border-[#dcd5cb] bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#a9874a]"
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                </div>

                                <div className="grid gap-7 sm:grid-cols-2">

                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#55504a]"
                                        >
                                            Phone Number
                                        </label>

                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="mt-3 w-full border-0 border-b border-[#dcd5cb] bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#a9874a]"
                                            placeholder="+91"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#55504a]"
                                        >
                                            Subject
                                        </label>

                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="mt-3 w-full border-0 border-b border-[#dcd5cb] bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#a9874a]"
                                        >
                                            <option value="">
                                                Select a subject
                                            </option>
                                            <option value="Order Enquiry">
                                                Order Enquiry
                                            </option>
                                            <option value="Product Enquiry">
                                                Product Enquiry
                                            </option>
                                            <option value="Shipping">
                                                Shipping & Delivery
                                            </option>
                                            <option value="Return">
                                                Return & Exchange
                                            </option>
                                            <option value="Other">
                                                Other
                                            </option>
                                        </select>
                                    </div>

                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#55504a]"
                                    >
                                        Message
                                    </label>

                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="6"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="mt-3 w-full resize-none border border-[#dcd5cb] bg-[#fdfcf9] px-4 py-4 text-sm outline-none transition focus:border-[#a9874a]"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#171717] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-white transition duration-300 hover:bg-[#a9874a]"
                                >
                                    Send Message
                                </button>

                            </form>
                        </div>

                    </div>
                </div>
            </section>

        </main>
    );
}

export default Contact;