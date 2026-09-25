import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AdminProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const [form, setForm] = useState({
        name: "",
        category: "Necklaces",
        price: "",
        metal: "22K Gold",
        weight: "",
        sku: "",
        stock: "",
        description: "",
        image: "",
    });

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEditMode);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem(
            "aureliaAdminToken"
        );

        if (!token) {
            navigate("/admin/login");
            return;
        }

        if (!isEditMode) {
            return;
        }

        const fetchProduct = async () => {
            try {
                setPageLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:5000/api/products/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch product"
                    );
                }

                const product = data.product;

                setForm({
                    name: product.name || "",
                    category:
                        product.category || "Necklaces",
                    price:
                        product.price !== null &&
                        product.price !== undefined
                            ? Number(product.price)
                            : "",
                    metal:
                        product.metal || "22K Gold",
                    weight:
                        product.weight !== null &&
                        product.weight !== undefined
                            ? Number(product.weight)
                            : "",
                    sku: product.sku || "",
                    stock:
                        product.stock !== undefined
                            ? product.stock
                            : "",
                    description:
                        product.description || "",
                    image:
                        product.images?.[0] || "",
                });
            } catch (error) {
                console.error(
                    "Fetch Product Error:",
                    error
                );

                setError(
                    "Unable to load product."
                );
            } finally {
                setPageLoading(false);
            }
        };

        fetchProduct();
    }, [id, isEditMode, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem(
                "aureliaAdminToken"
            );

            const productData = {
                name: form.name,
                category: form.category,
                price: Number(form.price),
                metal: form.metal,
                weight:
                    form.weight === ""
                        ? null
                        : Number(form.weight),
                sku: form.sku,
                stock: Number(form.stock),
                description: form.description,
                images: form.image
                    ? [form.image]
                    : [],
            };

            const url = isEditMode
                ? `http://localhost:5000/api/products/${id}`
                : "http://localhost:5000/api/products";

            const method = isEditMode
                ? "PUT"
                : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(productData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to save product"
                );
            }

            alert(
                isEditMode
                    ? "Product updated successfully."
                    : "Product added successfully."
            );

            navigate("/admin/products");
        } catch (error) {
            console.error(
                "Save Product Error:",
                error
            );

            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-[#f5f2ec]">

                <div className="flex min-h-screen flex-col items-center justify-center">

                    <div className="h-9 w-9 animate-spin rounded-full border border-[#ded8ce] border-t-[#a9874a]" />

                    <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                        Loading Product
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f2ec]">

            {/* ================= HEADER ================= */}

            <header className="sticky top-0 z-40 border-b border-[#2a2927] bg-[#171717] text-white">

                <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 sm:px-8">

                    <button
                        onClick={() =>
                            navigate("/admin/products")
                        }
                        className="text-left"
                    >

                        <h1 className="font-serif text-2xl tracking-[0.22em]">
                            AURELIA
                        </h1>

                        <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.3em] text-[#c6a15b]">
                            Jewellery Administration
                        </p>

                    </button>


                    <button
                        onClick={() =>
                            navigate("/admin/products")
                        }
                        className="flex items-center gap-2 border border-white/20 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] transition duration-300 hover:border-[#c6a15b] hover:bg-[#c6a15b] hover:text-[#171717]"
                    >

                        <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path d="M19 12H5" />
                            <path d="m11 18-6-6 6-6" />
                        </svg>

                        Back to Products

                    </button>

                </div>

            </header>


            {/* ================= MAIN ================= */}

            <main className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 sm:py-12">

                {/* Page Heading */}

                <div className="mb-10">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                        Catalogue
                    </p>

                    <h2 className="mt-3 font-serif text-4xl leading-tight text-[#171717] sm:text-5xl">
                        {isEditMode
                            ? "Edit Product"
                            : "Add Product"}
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-[#77716a]">
                        {isEditMode
                            ? "Update the details of this jewellery piece and keep your catalogue accurate."
                            : "Create a new jewellery piece and add it to the AURELIA collection."}
                    </p>

                </div>


                {/* ================= ERROR ================= */}

                {error && (
                    <div className="mb-8 flex items-start justify-between gap-5 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">

                        <div>
                            <p className="font-medium">
                                Something went wrong
                            </p>

                            <p className="mt-1 text-xs">
                                {error}
                            </p>
                        </div>

                    </div>
                )}


                {/* ================= FORM ================= */}

                <form
                    onSubmit={handleSubmit}
                    className="border border-[#ddd7cd] bg-white"
                >

                    {/* FORM HEADER */}

                    <div className="border-b border-[#e2ddd5] bg-[#faf8f4] px-6 py-6 sm:px-10">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a9874a]">
                            Product Information
                        </p>

                        <h3 className="mt-2 font-serif text-2xl text-[#171717]">
                            {isEditMode
                                ? "Update jewellery details"
                                : "Create your product listing"}
                        </h3>

                    </div>


                    {/* FORM CONTENT */}

                    <div className="px-6 py-8 sm:px-10 sm:py-10">

                        {/* BASIC INFORMATION */}

                        <div>

                            <div className="mb-6">

                                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                                    01 — Basic Information
                                </p>

                            </div>


                            <div className="grid gap-6 md:grid-cols-2">

                                {/* Product Name */}

                                <div className="md:col-span-2">

                                    <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]">
                                        Product Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Royal Temple Necklace"
                                        required
                                        className="mt-2 w-full border border-[#d8d2c9] bg-white px-4 py-3.5 text-sm text-[#292722] outline-none transition duration-300 placeholder:text-[#b2ada5] focus:border-[#a9874a]"
                                    />

                                </div>


                                {/* Category */}

                                <div>

                                    <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]">
                                        Category
                                    </label>

                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="mt-2 w-full border border-[#d8d2c9] bg-white px-4 py-3.5 text-sm text-[#292722] outline-none transition duration-300 focus:border-[#a9874a]"
                                    >
                                        <option>
                                            Necklaces
                                        </option>

                                        <option>
                                            Earrings
                                        </option>

                                        <option>
                                            Rings
                                        </option>

                                        <option>
                                            Bracelets
                                        </option>
                                    </select>

                                </div>


                                {/* Metal */}

                                <div>

                                    <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]">
                                        Metal
                                    </label>

                                    <select
                                        name="metal"
                                        value={form.metal}
                                        onChange={handleChange}
                                        className="mt-2 w-full border border-[#d8d2c9] bg-white px-4 py-3.5 text-sm text-[#292722] outline-none transition duration-300 focus:border-[#a9874a]"
                                    >
                                        <option>
                                            22K Gold
                                        </option>

                                        <option>
                                            18K Gold
                                        </option>

                                        <option>
                                            Diamond
                                        </option>

                                        <option>
                                            Silver
                                        </option>
                                    </select>

                                </div>

                            </div>

                        </div>


                        {/* PRICING & INVENTORY */}

                        <div className="mt-12 border-t border-[#e8e3db] pt-10">

                            <div className="mb-6">

                                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                                    02 — Pricing & Inventory
                                </p>

                            </div>


                            <div className="grid gap-6 md:grid-cols-3">

                                {/* Price */}

                                <div>

                                    <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]">
                                        Price (₹)
                                    </label>

                                    <div className="relative mt-2">

                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#918b83]">
                                            ₹
                                        </span>

                                        <input
                                            type="number"
                                            name="price"
                                            value={form.price}
                                            onChange={handleChange}
                                            placeholder="125000"
                                            min="0"
                                            required
                                            className="w-full border border-[#d8d2c9] bg-white py-3.5 pl-9 pr-4 text-sm text-[#292722] outline-none transition duration-300 placeholder:text-[#b2ada5] focus:border-[#a9874a]"
                                        />

                                    </div>

                                </div>


                                {/* Weight */}

                                <div>

                                    <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]">
                                        Weight (grams)
                                    </label>

                                    <div className="relative mt-2">

                                        <input
                                            type="number"
                                            name="weight"
                                            value={form.weight}
                                            onChange={handleChange}
                                            placeholder="32.5"
                                            min="0"
                                            step="0.01"
                                            className="w-full border border-[#d8d2c9] bg-white px-4 py-3.5 pr-12 text-sm text-[#292722] outline-none transition duration-300 placeholder:text-[#b2ada5] focus:border-[#a9874a]"
                                        />

                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-[0.15em] text-[#918b83]">
                                            g
                                        </span>

                                    </div>

                                </div>


                                {/* Stock */}

                                <div>

                                    <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]">
                                        Stock Quantity
                                    </label>

                                    <input
                                        type="number"
                                        name="stock"
                                        value={form.stock}
                                        onChange={handleChange}
                                        placeholder="10"
                                        min="0"
                                        required
                                        className="mt-2 w-full border border-[#d8d2c9] bg-white px-4 py-3.5 text-sm text-[#292722] outline-none transition duration-300 placeholder:text-[#b2ada5] focus:border-[#a9874a]"
                                    />

                                </div>


                                {/* SKU */}

                                <div className="md:col-span-3">

                                    <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]">
                                        SKU
                                    </label>

                                    <input
                                        type="text"
                                        name="sku"
                                        value={form.sku}
                                        onChange={handleChange}
                                        placeholder="AUR-NEC-005"
                                        required
                                        className="mt-2 w-full border border-[#d8d2c9] bg-white px-4 py-3.5 font-mono text-sm uppercase tracking-wide text-[#292722] outline-none transition duration-300 placeholder:font-sans placeholder:text-[#b2ada5] focus:border-[#a9874a]"
                                    />

                                    <p className="mt-2 text-[10px] text-[#918b83]">
                                        Use a unique SKU for inventory
                                        identification.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* MEDIA */}

                        <div className="mt-12 border-t border-[#e8e3db] pt-10">

                            <div className="mb-6">

                                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                                    03 — Product Media
                                </p>

                            </div>


                            <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]">
                                Product Image URL
                            </label>

                            <input
                                type="url"
                                name="image"
                                value={form.image}
                                onChange={handleChange}
                                placeholder="https://example.com/product-image.jpg"
                                className="mt-2 w-full border border-[#d8d2c9] bg-white px-4 py-3.5 text-sm text-[#292722] outline-none transition duration-300 placeholder:text-[#b2ada5] focus:border-[#a9874a]"
                            />

                            <p className="mt-2 text-[10px] text-[#918b83]">
                                Paste a publicly accessible image URL
                                for the product.
                            </p>


                            {/* Image Preview */}

                            {form.image && (
                                <div className="mt-6 border border-[#e2ddd5] bg-[#faf8f4] p-4">

                                    <p className="mb-3 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                                        Image Preview
                                    </p>

                                    <div className="h-56 w-full overflow-hidden bg-[#eeeae3] sm:h-72">

                                        <img
                                            src={form.image}
                                            alt="Product preview"
                                            className="h-full w-full object-contain"
                                            onError={(event) => {
                                                event.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />

                                    </div>

                                </div>
                            )}

                        </div>


                        {/* DESCRIPTION */}

                        <div className="mt-12 border-t border-[#e8e3db] pt-10">

                            <div className="mb-6">

                                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                                    04 — Product Description
                                </p>

                            </div>


                            <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the jewellery piece, craftsmanship, finish and design..."
                                rows="6"
                                required
                                className="mt-2 w-full resize-none border border-[#d8d2c9] bg-white px-4 py-3.5 text-sm leading-6 text-[#292722] outline-none transition duration-300 placeholder:text-[#b2ada5] focus:border-[#a9874a]"
                            />

                            <p className="mt-2 text-[10px] text-[#918b83]">
                                Provide a clear description that helps
                                customers understand the piece.
                            </p>

                        </div>

                    </div>


                    {/* ================= FORM ACTIONS ================= */}

                    <div className="flex flex-col gap-3 border-t border-[#e2ddd5] bg-[#faf8f4] px-6 py-6 sm:flex-row sm:justify-end sm:px-10">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/products"
                                )
                            }
                            disabled={loading}
                            className="border border-[#d1cbc1] bg-white px-8 py-3.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#292722] transition duration-300 hover:border-[#171717] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-3 bg-[#171717] px-8 py-3.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-white transition duration-300 hover:bg-[#a9874a] disabled:cursor-not-allowed disabled:bg-[#918b83]"
                        >

                            {loading ? (
                                <>
                                    <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                                    Saving
                                </>
                            ) : (
                                <>
                                    {isEditMode
                                        ? "Update Product"
                                        : "Add Product"}

                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-3.5 w-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        <path d="M5 12h13" />
                                        <path d="m13 6 6 6-6 6" />
                                    </svg>
                                </>
                            )}

                        </button>

                    </div>

                </form>


                {/* ================= FOOTER ================= */}

                <footer className="mt-12 border-t border-[#ddd7cd] pt-6">

                    <div className="flex flex-col justify-between gap-3 text-[9px] uppercase tracking-[0.18em] text-[#918b83] sm:flex-row">

                        <p>
                            © {new Date().getFullYear()} AURELIA Jewellery
                        </p>

                        <p>
                            Product Catalogue
                        </p>

                    </div>

                </footer>

            </main>

        </div>
    );
}

export default AdminProductForm;