import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../store/cartSlice";

function Checkout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cartItems = useSelector((state) => state.cart.items);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            const response = await fetch(
                "http://localhost:5000/api/orders",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        customer: formData,

                        items: cartItems.map((item) => ({
                            productId: item.id,
                            productName: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            image: item.image,
                        })),

                        paymentMethod: "COD",
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to place order"
                );
            }

            console.log("Order created:", data);

            dispatch(clearCart());

            navigate("/order-success", {
                state: {
                    orderNumber: data.order.orderNumber,
                    total: data.order.total,
                },
            });
        } catch (error) {
            console.error("Order Error:", error);

            alert(
                error.message ||
                    "Unable to place order. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Empty Cart
    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] bg-[#f8f6f1] text-[#171717]">
                <section className="flex min-h-[70vh] items-center justify-center px-6">
                    <div className="max-w-xl text-center">

                        <div className="mx-auto flex items-center justify-center gap-4">
                            <span className="h-px w-10 bg-[#c6a15b]" />

                            <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#a9874a]">
                                Aurelia Jewellery
                            </p>

                            <span className="h-px w-10 bg-[#c6a15b]" />
                        </div>

                        <h1 className="mt-7 font-serif text-5xl sm:text-6xl">
                            Your cart is empty
                        </h1>

                        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#77716a]">
                            Please add a piece to your collection before
                            proceeding to checkout.
                        </p>

                        <Link
                            to="/shop"
                            className="mt-9 inline-flex items-center gap-4 bg-[#171717] px-8 py-4 text-[9px] font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#a9874a]"
                        >
                            Explore Jewellery
                            <span className="h-px w-7 bg-[#d2b06d]" />
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f6f1] text-[#171717]">

            {/* ================= HEADER ================= */}
            <section className="border-b border-[#e4ded4] bg-[#eee9e1]">
                <div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">

                    <div className="flex items-center gap-4">
                        <span className="h-px w-10 bg-[#c6a15b]" />

                        <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#a9874a]">
                            Aurelia Jewellery
                        </p>
                    </div>

                    <h1 className="mt-5 font-serif text-5xl leading-none sm:text-6xl">
                        Checkout
                    </h1>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-[#77716a]">
                        Complete your details below and we'll prepare
                        your jewellery for delivery.
                    </p>

                </div>
            </section>

            {/* ================= CHECKOUT ================= */}
            <section className="mx-auto max-w-[1400px] px-6 py-12 sm:px-10 lg:px-16 lg:py-20">

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-14 lg:grid-cols-[1fr_400px]"
                >

                    {/* ================= CUSTOMER DETAILS ================= */}
                    <div>

                        {/* Section Title */}
                        <div className="flex items-center gap-4">
                            <span className="flex h-8 w-8 items-center justify-center border border-[#c6a15b] text-[10px] font-semibold text-[#a9874a]">
                                01
                            </span>

                            <div>
                                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                                    Delivery
                                </p>

                                <h2 className="mt-1 font-serif text-3xl">
                                    Delivery Details
                                </h2>
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="mt-10 grid gap-6 sm:grid-cols-2">

                            {/* Full Name */}
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="name"
                                    className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#77716a]"
                                >
                                    Full Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your full name"
                                    className="mt-2 h-14 w-full border border-[#d5cec3] bg-transparent px-4 text-sm text-[#171717] outline-none transition placeholder:text-[#a39d94] focus:border-[#c6a15b]"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#77716a]"
                                >
                                    Mobile Number
                                </label>

                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your mobile number"
                                    className="mt-2 h-14 w-full border border-[#d5cec3] bg-transparent px-4 text-sm text-[#171717] outline-none transition placeholder:text-[#a39d94] focus:border-[#c6a15b]"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#77716a]"
                                >
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your email address"
                                    className="mt-2 h-14 w-full border border-[#d5cec3] bg-transparent px-4 text-sm text-[#171717] outline-none transition placeholder:text-[#a39d94] focus:border-[#c6a15b]"
                                />
                            </div>

                            {/* Address */}
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="address"
                                    className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#77716a]"
                                >
                                    Delivery Address
                                </label>

                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    placeholder="House / Flat No, Street, Area"
                                    className="mt-2 w-full resize-none border border-[#d5cec3] bg-transparent px-4 py-4 text-sm leading-7 text-[#171717] outline-none transition placeholder:text-[#a39d94] focus:border-[#c6a15b]"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label
                                    htmlFor="city"
                                    className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#77716a]"
                                >
                                    City
                                </label>

                                <input
                                    id="city"
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    placeholder="City"
                                    className="mt-2 h-14 w-full border border-[#d5cec3] bg-transparent px-4 text-sm text-[#171717] outline-none transition placeholder:text-[#a39d94] focus:border-[#c6a15b]"
                                />
                            </div>

                            {/* State */}
                            <div>
                                <label
                                    htmlFor="state"
                                    className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#77716a]"
                                >
                                    State
                                </label>

                                <input
                                    id="state"
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                    placeholder="State"
                                    className="mt-2 h-14 w-full border border-[#d5cec3] bg-transparent px-4 text-sm text-[#171717] outline-none transition placeholder:text-[#a39d94] focus:border-[#c6a15b]"
                                />
                            </div>

                            {/* Pincode */}
                            <div>
                                <label
                                    htmlFor="pincode"
                                    className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#77716a]"
                                >
                                    PIN Code
                                </label>

                                <input
                                    id="pincode"
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    required
                                    maxLength="6"
                                    inputMode="numeric"
                                    placeholder="PIN code"
                                    className="mt-2 h-14 w-full border border-[#d5cec3] bg-transparent px-4 text-sm text-[#171717] outline-none transition placeholder:text-[#a39d94] focus:border-[#c6a15b]"
                                />
                            </div>

                        </div>

                        {/* ================= PAYMENT ================= */}
                        <div className="mt-14 border-t border-[#ded8ce] pt-10">

                            <div className="flex items-center gap-4">
                                <span className="flex h-8 w-8 items-center justify-center border border-[#c6a15b] text-[10px] font-semibold text-[#a9874a]">
                                    02
                                </span>

                                <div>
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                                        Payment
                                    </p>

                                    <h2 className="mt-1 font-serif text-3xl">
                                        Payment Method
                                    </h2>
                                </div>
                            </div>

                            <div className="mt-8 border border-[#c6a15b] bg-[#eee9e1] p-6">

                                <div className="flex items-start gap-4">
                                    <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#a9874a]">
                                        <div className="h-2 w-2 rounded-full bg-[#a9874a]" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-[#292722]">
                                            Cash on Delivery
                                        </p>

                                        <p className="mt-2 max-w-md text-xs leading-6 text-[#77716a]">
                                            Pay securely when your jewellery
                                            arrives at your delivery address.
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* Mobile Continue */}
                        <Link
                            to="/cart"
                            className="mt-8 inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#77716a] transition hover:text-[#171717]"
                        >
                            ← Return to Cart
                        </Link>

                    </div>

                    {/* ================= ORDER SUMMARY ================= */}
                    <aside className="h-fit bg-[#eee9e1] p-7 sm:p-9 lg:sticky lg:top-28">

                        <div className="flex items-center gap-3">
                            <span className="h-px w-7 bg-[#c6a15b]" />

                            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                                Your Selection
                            </p>
                        </div>

                        <h2 className="mt-4 font-serif text-3xl">
                            Your Order
                        </h2>

                        {/* Items */}
                        <div className="mt-8 space-y-5">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 border-b border-[#d8d1c6] pb-5"
                                >
                                    <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[#e5dfd5]">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />

                                        <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center bg-[#171717] px-1 text-[8px] text-white">
                                            {item.quantity}
                                        </span>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-serif text-base leading-tight">
                                            {item.name}
                                        </p>

                                        <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-[#918b83]">
                                            {item.category}
                                        </p>

                                        <p className="mt-2 text-sm font-medium">
                                            ₹{(
                                                item.price *
                                                item.quantity
                                            ).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Price Summary */}
                        <div className="mt-7 space-y-5 border-b border-[#d6cfc4] pb-7">

                            <div className="flex justify-between text-sm">
                                <span className="text-[#77716a]">
                                    Subtotal
                                </span>

                                <span className="font-medium">
                                    ₹{subtotal.toLocaleString("en-IN")}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-[#77716a]">
                                    Shipping
                                </span>

                                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#a9874a]">
                                    Complimentary
                                </span>
                            </div>

                        </div>

                        {/* Total */}
                        <div className="flex items-end justify-between py-7">
                            <div>
                                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#77716a]">
                                    Total
                                </p>

                                <p className="mt-2 text-[9px] text-[#918b83]">
                                    Inclusive of applicable taxes
                                </p>
                            </div>

                            <span className="font-serif text-2xl">
                                ₹{subtotal.toLocaleString("en-IN")}
                            </span>
                        </div>

                        {/* Place Order */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group flex h-16 w-full items-center justify-center gap-4 bg-[#171717] text-[9px] font-semibold uppercase tracking-[0.28em] text-white transition duration-300 hover:bg-[#a9874a] disabled:cursor-not-allowed disabled:bg-[#8c877f]"
                        >
                            {isSubmitting
                                ? "Placing Order..."
                                : "Place Order"}

                            {!isSubmitting && (
                                <span className="h-px w-7 bg-[#d2b06d] transition-all duration-300 group-hover:w-11" />
                            )}
                        </button>

                        {/* Trust */}
                        <div className="mt-7 border-t border-[#d6cfc4] pt-5">

                            <div className="flex items-center justify-between border-b border-[#ded8ce] py-4">
                                <span className="text-xs text-[#66615a]">
                                    Secure checkout
                                </span>

                                <span className="text-[9px] uppercase tracking-[0.15em] text-[#918b83]">
                                    Protected
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-[#ded8ce] py-4">
                                <span className="text-xs text-[#66615a]">
                                    Shipping
                                </span>

                                <span className="text-[9px] uppercase tracking-[0.15em] text-[#918b83]">
                                    Free
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-4">
                                <span className="text-xs text-[#66615a]">
                                    Payment
                                </span>

                                <span className="text-[9px] uppercase tracking-[0.15em] text-[#918b83]">
                                    COD
                                </span>
                            </div>

                        </div>

                    </aside>

                </form>
            </section>

            {/* ================= FOOTER STATEMENT ================= */}
            <section className="border-t border-[#e2dcd2] bg-[#171717] px-6 py-20 text-center text-white sm:px-10 lg:py-24">
                <div className="mx-auto max-w-3xl">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#d2b06d]">
                        Aurelia
                    </p>

                    <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl">
                        Your piece is almost yours.
                    </h2>

                    <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/55">
                        Complete your order and let us prepare something
                        beautiful for you.
                    </p>

                </div>
            </section>

        </div>
    );
}

export default Checkout;
