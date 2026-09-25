import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
} from "../store/cartSlice";

function Cart() {
    const dispatch = useDispatch();

    const cartItems = useSelector((state) => state.cart.items);

    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

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

                        <h1 className="mt-7 font-serif text-5xl leading-tight sm:text-6xl">
                            Your cart is empty
                        </h1>

                        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#77716a]">
                            Your collection is waiting. Discover a piece
                            that feels uniquely yours.
                        </p>

                        <Link
                            to="/shop"
                            className="mt-9 inline-flex items-center gap-4 bg-[#171717] px-8 py-4 text-[9px] font-semibold uppercase tracking-[0.25em] text-white transition duration-300 hover:bg-[#a9874a]"
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

            {/* Header */}
            <section className="border-b border-[#e4ded4] bg-[#eee9e1]">
                <div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">

                    <div className="flex items-center gap-4">
                        <span className="h-px w-10 bg-[#c6a15b]" />

                        <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#a9874a]">
                            Aurelia Collection
                        </p>
                    </div>

                    <h1 className="mt-5 font-serif text-5xl leading-none sm:text-6xl">
                        Your Cart
                    </h1>

                    <p className="mt-5 text-sm text-[#77716a]">
                        {cartItems.length}{" "}
                        {cartItems.length === 1 ? "piece" : "pieces"} selected
                    </p>

                </div>
            </section>

            {/* Main Cart */}
            <section className="mx-auto max-w-[1400px] px-6 py-12 sm:px-10 lg:px-16 lg:py-20">

                <div className="grid gap-14 lg:grid-cols-[1fr_380px]">

                    {/* ================= CART ITEMS ================= */}
                    <div>

                        {/* Table Heading */}
                        <div className="mb-5 hidden border-b border-[#dcd5ca] pb-4 sm:grid sm:grid-cols-[1fr_120px]">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                                Your Selection
                            </p>

                            <p className="text-right text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                                Total
                            </p>
                        </div>

                        <div>
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="border-b border-[#ded8ce] py-7 first:pt-2"
                                >
                                    <div className="grid gap-5 sm:grid-cols-[1fr_120px]">

                                        {/* Product */}
                                        <div className="flex gap-5">

                                            {/* Image */}
                                            <Link
                                                to={`/product/${item.id}`}
                                                className="group relative h-32 w-24 shrink-0 overflow-hidden bg-[#eeeae3] sm:h-40 sm:w-32"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                                />
                                            </Link>

                                            {/* Details */}
                                            <div className="flex min-w-0 flex-1 flex-col justify-between">

                                                <div>
                                                    <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                                                        {item.category}
                                                    </p>

                                                    <Link
                                                        to={`/product/${item.id}`}
                                                    >
                                                        <h2 className="mt-2 font-serif text-xl leading-tight transition duration-300 hover:text-[#a9874a] sm:text-2xl">
                                                            {item.name}
                                                        </h2>
                                                    </Link>

                                                    <p className="mt-3 text-sm font-medium tracking-wide text-[#292722]">
                                                        ₹{Number(item.price).toLocaleString("en-IN")}
                                                    </p>
                                                </div>

                                                {/* Quantity + Remove */}
                                                <div className="mt-5 flex items-center gap-5">

                                                    {/* Quantity */}
                                                    <div className="flex h-10 border border-[#d4cdc2]">

                                                        <button
                                                            onClick={() =>
                                                                dispatch(
                                                                    decreaseQuantity(
                                                                        item.id
                                                                    )
                                                                )
                                                            }
                                                            aria-label="Decrease quantity"
                                                            className="w-9 text-base text-[#555049] transition hover:bg-[#eee9e1] hover:text-[#a9874a]"
                                                        >
                                                            −
                                                        </button>

                                                        <span className="flex w-10 items-center justify-center border-x border-[#d4cdc2] text-xs">
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            onClick={() =>
                                                                dispatch(
                                                                    increaseQuantity(
                                                                        item.id
                                                                    )
                                                                )
                                                            }
                                                            aria-label="Increase quantity"
                                                            className="w-9 text-base text-[#555049] transition hover:bg-[#eee9e1] hover:text-[#a9874a]"
                                                        >
                                                            +
                                                        </button>

                                                    </div>

                                                    {/* Remove */}
                                                    <button
                                                        onClick={() =>
                                                            dispatch(
                                                                removeFromCart(
                                                                    item.id
                                                                )
                                                            )
                                                        }
                                                        className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83] transition hover:text-[#171717]"
                                                    >
                                                        Remove
                                                    </button>

                                                </div>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        <div className="flex items-start justify-between sm:block sm:text-right">
                                            <span className="text-[9px] uppercase tracking-[0.2em] text-[#918b83] sm:hidden">
                                                Item total
                                            </span>

                                            <p className="text-sm font-medium tracking-wide text-[#292722]">
                                                ₹{(
                                                    item.price *
                                                    item.quantity
                                                ).toLocaleString("en-IN")}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Continue Shopping */}
                        <div className="pt-8">
                            <Link
                                to="/shop"
                                className="group inline-flex items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#555049]"
                            >
                                <span className="transition group-hover:-translate-x-1">
                                    ←
                                </span>

                                Continue Shopping

                                <span className="h-px w-7 bg-[#c6a15b] transition-all duration-300 group-hover:w-11" />
                            </Link>
                        </div>

                    </div>

                    {/* ================= ORDER SUMMARY ================= */}
                    <aside className="h-fit bg-[#eee9e1] p-7 sm:p-9 lg:sticky lg:top-28">

                        <div className="flex items-center gap-3">
                            <span className="h-px w-7 bg-[#c6a15b]" />

                            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                                Your Order
                            </p>
                        </div>

                        <h2 className="mt-4 font-serif text-3xl">
                            Order Summary
                        </h2>

                        {/* Summary */}
                        <div className="mt-8 space-y-5 border-b border-[#d6cfc4] pb-7">

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

                                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#a9874a]">
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

                        {/* Checkout */}
                        <Link
                            to="/checkout"
                            className="group flex h-16 w-full items-center justify-center gap-4 bg-[#171717] text-[9px] font-semibold uppercase tracking-[0.28em] text-white transition duration-300 hover:bg-[#a9874a]"
                        >
                            Proceed to Checkout

                            <span className="h-px w-7 bg-[#d2b06d] transition-all duration-300 group-hover:w-11" />
                        </Link>

                        {/* Trust Information */}
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
                                    Returns
                                </span>

                                <span className="text-[9px] uppercase tracking-[0.15em] text-[#918b83]">
                                    7 Days
                                </span>
                            </div>

                        </div>

                    </aside>

                </div>
            </section>

            {/* Brand Statement */}
            <section className="border-t border-[#e2dcd2] bg-[#171717] px-6 py-20 text-center text-white sm:px-10 lg:py-24">
                <div className="mx-auto max-w-3xl">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#d2b06d]">
                        Aurelia
                    </p>

                    <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl">
                        Every piece has a story.
                        <br />
                        Make yours unforgettable.
                    </h2>

                </div>
            </section>

        </div>
    );
}

export default Cart;
