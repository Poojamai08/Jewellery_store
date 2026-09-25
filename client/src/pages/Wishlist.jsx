import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    removeFromWishlist,
    clearWishlist,
} from "../store/wishlistSlice";
import { addToCart } from "../store/cartSlice";

const Wishlist = () => {
    const dispatch = useDispatch();

    const wishlistItems = useSelector(
        (state) => state.wishlist.items
    );

    const handleRemove = (id) => {
        dispatch(removeFromWishlist(id));
    };

    const handleAddToCart = (item) => {
        dispatch(
            addToCart({
                id: item.id,
                name: item.name,
                price: Number(item.price),
                image: item.image,
                category: item.category,
                quantity: 1,
            })
        );

        // Remove from wishlist after adding to cart
        dispatch(removeFromWishlist(item.id));
    };
    return (
        <main className="min-h-screen bg-[#faf9f6]">
            {/* ================= HEADER ================= */}
            <section className="border-b border-[#e8e3da] bg-white">
                <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
                    <div className="text-center">
                        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-[#a9874a]">
                            Your Collection
                        </p>

                        <h1 className="font-serif text-4xl tracking-wide text-[#171717] sm:text-5xl">
                            My Wishlist
                        </h1>

                        <div className="mx-auto mt-5 h-px w-12 bg-[#b79a63]" />

                        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#77736c]">
                            Keep your favourite pieces close and discover the
                            jewellery you've fallen in love with.
                        </p>
                    </div>
                </div>
            </section>

            {/* ================= CONTENT ================= */}
            <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
                {wishlistItems.length === 0 ? (
                    /* ================= EMPTY WISHLIST ================= */
                    <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                        <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-[#ded8ce] bg-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-[#a9874a]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                                />
                            </svg>
                        </div>

                        <h2 className="font-serif text-2xl text-[#222222]">
                            Your wishlist is empty
                        </h2>

                        <p className="mt-3 max-w-md text-sm leading-6 text-[#77736c]">
                            Save the jewellery you love and come back to it
                            whenever you're ready.
                        </p>

                        <Link
                            to="/shop"
                            className="mt-8 inline-flex items-center justify-center bg-[#171717] px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#a9874a]"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* ================= TOP BAR ================= */}
                        <div className="mb-8 flex flex-col gap-4 border-b border-[#e4dfd6] pb-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs uppercase tracking-[0.18em] text-[#77736c]">
                                {wishlistItems.length}{" "}
                                {wishlistItems.length === 1
                                    ? "Item"
                                    : "Items"}{" "}
                                Saved
                            </p>

                            <button
                                type="button"
                                onClick={() => dispatch(clearWishlist())}
                                className="self-start text-[10px] uppercase tracking-[0.18em] text-[#77736c] underline underline-offset-4 transition hover:text-[#a9874a] sm:self-auto"
                            >
                                Clear Wishlist
                            </button>
                        </div>

                        {/* ================= PRODUCT GRID ================= */}
                        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {wishlistItems.map((item) => (
                                <article
                                    key={item.id}
                                    className="group relative"
                                >
                                    {/* Product Image */}
                                    <div className="relative aspect-[4/5] overflow-hidden bg-[#f1eee8]">
                                        <Link to={`/product/${item.id}`}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "https://via.placeholder.com/700x875?text=Aurelia";
                                                }}
                                            />
                                        </Link>

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(item.id)}
                                            aria-label={`Remove ${item.name} from wishlist`}
                                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#444] shadow-sm transition hover:bg-[#171717] hover:text-white"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-[17px] w-[17px]"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18 18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Product Information */}
                                    <div className="pt-5">
                                        <Link to={`/product/${item.id}`}>
                                            <p className="mb-2 text-[9px] uppercase tracking-[0.22em] text-[#a9874a]">
                                                {item.category || "Jewellery"}
                                            </p>

                                            <h2 className="font-serif text-lg text-[#222222] transition group-hover:text-[#a9874a]">
                                                {item.name}
                                            </h2>
                                        </Link>

                                        {item.weight && (
                                            <p className="mt-2 text-xs text-[#88837b]">
                                                {item.weight} g
                                            </p>
                                        )}

                                        <div className="mt-3 flex items-center justify-between">
                                            <p className="text-sm font-medium text-[#222222]">
                                                ₹
                                                {Number(item.price).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>
                                        </div>

                                        {/* Add To Cart */}
                                        <button
                                            type="button"
                                            onClick={() => handleAddToCart(item)}
                                            className="mt-5 flex w-full items-center justify-center gap-2 border border-[#242424] bg-[#171717] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#a9874a] hover:border-[#a9874a]"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="1.4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-1.5 3h12.8M9 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
                                                />
                                            </svg>

                                            Add to Cart
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* ================= BOTTOM CTA ================= */}
                        <div className="mt-16 border-t border-[#e4dfd6] pt-10 text-center">
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[#333] transition hover:text-[#a9874a]"
                            >
                                Continue Exploring
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 12h14m-6-6 6 6-6 6"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
};

export default Wishlist;