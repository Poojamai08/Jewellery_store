import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../store/wishlistSlice";
import { addToCart } from "../store/cartSlice";

function ProductDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const wishlistItems = useSelector(
        (state) => state.wishlist.items
    );

    const wishlist = wishlistItems.some(
        (item) => item.id === Number(id)
    );
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch product from PostgreSQL
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/products/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch product"
                    );
                }

                const formattedProduct = {
                    ...data.product,
                    price: Number(data.product.price),
                    weight: data.product.weight
                        ? Number(data.product.weight)
                        : null,
                    images:
                        data.product.images?.length > 0
                            ? data.product.images
                            : ["https://via.placeholder.com/1000"],
                };

                setProduct(formattedProduct);
                setSelectedImage(formattedProduct.images[0]);
                setQuantity(1);
            } catch (error) {
                console.error("Fetch Product Error:", error);
                setError("Unable to load product. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Loading
    if (loading) {
        return (
            <div className="min-h-[70vh] bg-[#f8f6f1]">
                <section className="flex min-h-[70vh] items-center justify-center px-6">
                    <div className="text-center">
                        <div className="mx-auto mb-6 h-px w-12 bg-[#c6a15b]" />

                        <p className="font-serif text-3xl text-[#171717]">
                            Curating your piece
                        </p>

                        <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#918b83]">
                            Please wait
                        </p>
                    </div>
                </section>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="min-h-[70vh] bg-[#f8f6f1]">
                <section className="flex min-h-[70vh] items-center justify-center px-6">
                    <div className="max-w-md text-center">
                        <div className="mx-auto mb-6 h-px w-12 bg-[#c6a15b]" />

                        <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#a9874a]">
                            A little interruption
                        </p>

                        <h1 className="mt-4 font-serif text-4xl text-[#171717]">
                            Something went wrong
                        </h1>

                        <p className="mt-4 text-sm leading-7 text-[#77716a]">
                            {error}
                        </p>

                        <Link
                            to="/shop"
                            className="mt-8 inline-flex bg-[#171717] px-8 py-4 text-[9px] font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#a9874a]"
                        >
                            Back to Jewellery
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    // Product not found
    if (!product) {
        return (
            <div className="min-h-[70vh] bg-[#f8f6f1]">
                <section className="flex min-h-[70vh] items-center justify-center px-6">
                    <div className="text-center">
                        <div className="mx-auto mb-6 h-px w-12 bg-[#c6a15b]" />

                        <h1 className="font-serif text-4xl">
                            Product Not Found
                        </h1>

                        <Link
                            to="/shop"
                            className="mt-8 inline-flex bg-[#171717] px-8 py-4 text-[9px] font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#a9874a]"
                        >
                            Back to Jewellery
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    const isOutOfStock = product.stock === 0;

    return (
        <div className="bg-[#f8f6f1] text-[#171717]">

            {/* Breadcrumb */}
            <section className="border-b border-[#e4ded4] bg-[#f3efe7]">
                <div className="mx-auto max-w-[1400px] px-6 py-5 sm:px-10 lg:px-16">
                    <div className="flex flex-wrap items-center gap-2 text-[9px] font-medium uppercase tracking-[0.2em] text-[#918b83]">
                        <Link
                            to="/"
                            className="transition hover:text-[#171717]"
                        >
                            Home
                        </Link>

                        <span>/</span>

                        <Link
                            to="/shop"
                            className="transition hover:text-[#171717]"
                        >
                            Jewellery
                        </Link>

                        <span>/</span>

                        <span className="max-w-[220px] truncate text-[#171717]">
                            {product.name}
                        </span>
                    </div>
                </div>
            </section>

            {/* Product Section */}
            <section className="mx-auto max-w-[1400px] px-6 py-10 sm:px-10 lg:px-16 lg:py-16">
                <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">

                    {/* ================= IMAGES ================= */}
                    <div className="grid gap-4 sm:grid-cols-[88px_1fr]">

                        {/* Thumbnails */}
                        <div className="order-2 flex gap-3 sm:order-1 sm:flex-col">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        setSelectedImage(image)
                                    }
                                    aria-label={`View image ${ index + 1}`}
                                    className={`group relative h - 20 w - 16 shrink - 0 overflow - hidden bg - [#eeeae3] transition sm: h - 24 sm: w - [68px] ${
                selectedImage === image
                ? "ring-1 ring-[#c6a15b]"
                : "ring-1 ring-transparent hover:ring-[#d9d1c4]"
            } `}
                                >
                                    <img
                                        src={image}
                                        alt={`${ product.name } ${ index + 1 } `}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />

                                    {selectedImage === image && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c6a15b]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="group relative order-1 aspect-[4/5] overflow-hidden bg-[#eeeae3] sm:order-2">
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className={`h - full w - full object - cover transition duration - 700 group - hover: scale - [1.025] ${
                isOutOfStock
                    ? "opacity-60"
                    : ""
            } `}
                            />

                            {/* Sold Out */}
                            {isOutOfStock && (
                                <div className="absolute left-5 top-5 bg-[#171717] px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-white">
                                    Sold Out
                                </div>
                            )}

                            {/* Image Number */}
                            {product.images.length > 1 && (
                                <div className="absolute bottom-5 right-5 bg-white/90 px-3 py-2 text-[9px] font-medium tracking-[0.2em] text-[#555049]">
                                    {product.images.indexOf(selectedImage) + 1}
                                    {" / "}
                                    {product.images.length}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ================= PRODUCT INFO ================= */}
                    <div className="flex flex-col justify-center lg:py-8">

                        {/* Category */}
                        <div className="flex items-center gap-4">
                            <span className="h-px w-8 bg-[#c6a15b]" />

                            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#a9874a]">
                                {product.category}
                            </p>
                        </div>

                        {/* Name */}
                        <h1 className="mt-6 max-w-xl font-serif text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="mt-7">
                            <p className="text-2xl font-medium tracking-wide text-[#292722]">
                                ₹{product.price.toLocaleString("en-IN")}
                            </p>

                            <p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-[#918b83]">
                                Inclusive of applicable taxes
                            </p>
                        </div>

                        {/* Description */}
                        <div className="my-9 border-y border-[#ded8ce] py-7">
                            <p className="text-sm leading-8 text-[#6d6861]">
                                {product.description}
                            </p>
                        </div>

                        {/* Specifications */}
                        <div className="border-b border-[#ded8ce] pb-8">
                            <p className="mb-6 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#918b83]">
                                Product Details
                            </p>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-7">

                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#9b958c]">
                                        Metal
                                    </p>

                                    <p className="mt-2 text-sm text-[#292722]">
                                        {product.metal}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#9b958c]">
                                        Weight
                                    </p>

                                    <p className="mt-2 text-sm text-[#292722]">
                                        {product.weight
                                            ? `${ product.weight } g`
                                            : "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#9b958c]">
                                        SKU
                                    </p>

                                    <p className="mt-2 text-sm text-[#292722]">
                                        {product.sku}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#9b958c]">
                                        Availability
                                    </p>

                                    <p
                                        className={`mt - 2 text - sm ${
                isOutOfStock
                    ? "text-red-700"
                    : product.stock <= 3
                        ? "text-[#a9874a]"
                        : "text-[#292722]"
            } `}
                                    >
                                        {isOutOfStock
                                            ? "Out of stock"
                                            : product.stock <= 3
                                                ? `Only ${ product.stock } left`
                                                : "In stock"}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Quantity + Wishlist */}
                        <div className="mt-8 flex gap-3">

                            {/* Quantity */}
                            <div className="flex h-14 border border-[#d6cfc4] bg-[#f8f6f1]">
                                <button
                                    onClick={() =>
                                        setQuantity((value) =>
                                            Math.max(1, value - 1)
                                        )
                                    }
                                    disabled={isOutOfStock}
                                    className="w-12 text-lg text-[#555049] transition hover:text-[#a9874a] disabled:cursor-not-allowed disabled:text-[#c8c1b7]"
                                >
                                    −
                                </button>

                                <span className="flex w-10 items-center justify-center text-sm">
                                    {quantity}
                                </span>

                                <button
                                    disabled={isOutOfStock}
                                    onClick={() =>
                                        setQuantity((value) =>
                                            Math.min(
                                                product.stock,
                                                value + 1
                                            )
                                        )
                                    }
                                    className="w-12 text-lg text-[#555049] transition hover:text-[#a9874a] disabled:cursor-not-allowed disabled:text-[#c8c1b7]"
                                >
                                    +
                                </button>
                            </div>

                            {/* Wishlist */}
                            {/* Wishlist */}
                            <button
                                onClick={() =>
                                    dispatch(
                                        toggleWishlist({
                                            id: product.id,
                                            name: product.name,
                                            price: product.price,
                                            image: product.images[0],
                                            category: product.category,
                                            weight: product.weight,
                                        })
                                    )
                                }
                                className={`flex h - 14 flex - 1 items - center justify - center border px - 5 text - [9px] font - semibold uppercase tracking - [0.22em] transition ${
                wishlist
                    ? "border-[#c6a15b] bg-[#f3efe7] text-[#a9874a]"
                    : "border-[#d6cfc4] text-[#555049] hover:border-[#171717] hover:text-[#171717]"
            } `}
                            >
                                <span className="mr-2 text-base">
                                    {wishlist ? "♥" : "♡"}
                                </span>

                                {wishlist
                                    ? "Added to Wishlist"
                                    : "Add to Wishlist"}
                            </button>
                        </div>

                        {/* Add To Cart */}
                        <button
                            disabled={isOutOfStock}
                            onClick={() => {
                                dispatch(
                                    addToCart({
                                        id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        image: product.images[0],
                                        category: product.category,
                                        quantity: quantity,
                                    })
                                );

                                alert("Product added to cart!");
                            }}
                            className="mt-4 flex h-16 w-full items-center justify-center gap-4 bg-[#171717] text-[9px] font-semibold uppercase tracking-[0.3em] text-white transition duration-300 hover:bg-[#a9874a] disabled:cursor-not-allowed disabled:bg-[#aaa49b]"
                        >
                            {isOutOfStock
                                ? "Out of Stock"
                                : "Add to Cart"}

                            {!isOutOfStock && (
                                <span className="h-px w-8 bg-[#d2b06d]" />
                            )}
                        </button>

                        {/* Service Information */}
                        <div className="mt-9 border-t border-[#ded8ce] pt-6">

                            <div className="flex items-center justify-between border-b border-[#e9e4dc] py-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-[#a9874a]">
                                        ✦
                                    </span>
                                    <span className="text-xs text-[#555049]">
                                        Free shipping
                                    </span>
                                </div>

                                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                                    Available
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-[#e9e4dc] py-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-[#a9874a]">
                                        ↺
                                    </span>
                                    <span className="text-xs text-[#555049]">
                                        Easy returns
                                    </span>
                                </div>

                                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                                    7 Days
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-[#a9874a]">
                                        ◇
                                    </span>
                                    <span className="text-xs text-[#555049]">
                                        Authenticity
                                    </span>
                                </div>

                                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                                    Guaranteed
                                </span>
                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* ================= BRAND STORY ================= */}
            <section className="border-y border-[#e2dcd2] bg-[#eee9e1] px-6 py-24 text-center sm:px-10 lg:py-32">
                <div className="mx-auto max-w-3xl">

                    <div className="mx-auto flex items-center justify-center gap-4">
                        <span className="h-px w-10 bg-[#c6a15b]" />

                        <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#a9874a]">
                            The Aurelia Philosophy
                        </p>

                        <span className="h-px w-10 bg-[#c6a15b]" />
                    </div>

                    <h2 className="mt-7 font-serif text-4xl leading-[1.15] sm:text-5xl">
                        Crafted with intention.
                        <br />
                        <span className="italic text-[#a9874a]">
                            Designed to be remembered.
                        </span>
                    </h2>

                    <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-[#6d6861]">
                        Every Aurelia piece is created to become part of
                        your story — from everyday moments to celebrations
                        that last a lifetime.
                    </p>

                    <div className="mx-auto mt-8 h-px w-10 bg-[#c6a15b]" />

                </div>
            </section>

            {/* ================= SHOP CTA ================= */}
            <section className="bg-[#171717] px-6 py-20 text-center text-white sm:px-10 lg:py-24">
                <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#d2b06d]">
                    Continue exploring
                </p>

                <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
                    Discover more from Aurelia
                </h2>

                <Link
                    to="/shop"
                    className="mt-8 inline-flex border border-white/30 px-8 py-4 text-[9px] font-semibold uppercase tracking-[0.25em] transition hover:border-[#d2b06d] hover:bg-[#d2b06d] hover:text-[#171717]"
                >
                    Explore Jewellery
                </Link>
            </section>

        </div>
    );
}

export default ProductDetails;
