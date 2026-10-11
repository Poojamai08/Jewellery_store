
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
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= AUTHENTICATION & FETCH PRODUCT =================

    useEffect(() => {
        let cancelled = false;

        const checkAuthAndFetchProduct = async () => {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (!token || !storedUser) {
                navigate("/login", { replace: true });
                return;
            }

            try {
                const user = JSON.parse(storedUser);

                if (String(user.role).toUpperCase() !== "ADMIN") {
                    navigate("/home", { replace: true });
                    return;
                }
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login", { replace: true });
                return;
            }

            if (!isEditMode) {
                if (!cancelled) {
                    setPageLoading(false);
                }
                return;
            }

            try {
                setPageLoading(true);
                setError("");

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/products/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch product."
                    );
                }

                const product = data.product;

                if (!product) {
                    throw new Error("Product not found.");
                }

                if (!cancelled) {
                    setForm({
                        name: product.name || "",
                        category: product.category || "Necklaces",
                        price: product.price ?? "",
                        metal: product.metal || "22K Gold",
                        weight: product.weight ?? "",
                        sku: product.sku || "",
                        stock: product.stock ?? "",
                        description: product.description || "",
                        image: product.images?.[0] || "",
                    });
                }
            } catch (err) {
                console.error("Fetch Product Error:", err);

                if (!cancelled) {
                    setError(err.message || "Unable to load product.");
                }
            } finally {
                if (!cancelled) {
                    setPageLoading(false);
                }
            }
        };

        checkAuthAndFetchProduct();

        return () => {
            cancelled = true;
        };
    }, [id, isEditMode, navigate]);

    // ================= FORM INPUTS =================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    // ================= SUBMIT PRODUCT =================

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            navigate("/login", { replace: true });
            return;
        }

        try {
            const user = JSON.parse(storedUser);

            if (String(user.role).toUpperCase() !== "ADMIN") {
                navigate("/home", { replace: true });
                return;
            }
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login", { replace: true });
            return;
        }

        if (
            !form.name.trim() ||
            !form.sku.trim() ||
            !form.description.trim() ||
            form.price === "" ||
            form.stock === ""
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        if (
            !Number.isFinite(Number(form.price)) ||
            Number(form.price) < 0
        ) {
            setError("Please enter a valid product price.");
            return;
        }

        if (
            !Number.isInteger(Number(form.stock)) ||
            Number(form.stock) < 0
        ) {
            setError("Stock must be a non-negative whole number.");
            return;
        }

        if (
            form.weight !== "" &&
            (!Number.isFinite(Number(form.weight)) ||
                Number(form.weight) < 0)
        ) {
            setError("Please enter a valid product weight.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const productData = {
                name: form.name.trim(),
                category: form.category,
                price: Number(form.price),
                metal: form.metal,
                weight:
                    form.weight === ""
                        ? null
                        : Number(form.weight),
                sku: form.sku.trim(),
                stock: Number(form.stock),
                description: form.description.trim(),
                images: form.image.trim()
                    ? [form.image.trim()]
                    : [],
            };

            const url = isEditMode
                ? `${import.meta.env.VITE_API_URL}/api/products/${id}`
                : `${import.meta.env.VITE_API_URL}/api/products`;

            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(productData),
            });

            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                throw new Error(
                    data.message ||
                    "You are not authorized to perform this action."
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save product."
                );
            }

            alert(
                isEditMode
                    ? "Product updated successfully."
                    : "Product added successfully."
            );

            navigate("/admin/products");
        } catch (err) {
            console.error("Save Product Error:", err);
            setError(err.message || "Unable to save product.");
        } finally {
            setLoading(false);
        }
    };

    // ================= LOADING SCREEN =================

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

    // ================= MAIN UI =================

    return (
        <div className="min-h-screen bg-[#f5f2ec]">
            {/* HEADER */}

            <header className="sticky top-0 z-40 border-b border-[#2a2927] bg-[#171717] text-white">
                <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 sm:px-8">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/products")}
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
                        type="button"
                        onClick={() => navigate("/admin/products")}
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

            {/* MAIN */}

            <main className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 sm:py-12">
                <div className="mb-10">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                        Catalogue
                    </p>

                    <h2 className="mt-3 font-serif text-4xl leading-tight text-[#171717] sm:text-5xl">
                        {isEditMode ? "Edit Product" : "Add Product"}
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-[#77716a]">
                        {isEditMode
                            ? "Update the details of this jewellery piece and keep your catalogue accurate."
                            : "Create a new jewellery piece and add it to the AURELIA collection."}
                    </p>
                </div>

                {/* ERROR */}

                {error && (
                    <div
                        role="alert"
                        className="mb-8 flex items-start justify-between gap-5 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600"
                    >
                        <div>
                            <p className="font-medium">
                                Something went wrong
                            </p>

                            <p className="mt-1 text-xs">{error}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setError("")}
                            className="text-xs underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* PRODUCT FORM */}

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

                    <div className="px-6 py-8 sm:px-10 sm:py-10">
                        {/* BASIC INFORMATION */}

                        <section>
                            <p className="mb-6 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                                01 — Basic Information
                            </p>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="name"
                                        className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]"
                                    >
                                        Product Name
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Royal Temple Necklace"
                                        required
                                        className="mt-2 w-full border border-[#d8d2c9] bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#b2ada5] focus:border-[#a9874a]"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="category"
                                        className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]"
                                    >
                                        Category
                                    </label>

                                    <select
                                        id="category"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="mt-2 w-full border border-[#d8d2c9] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#a9874a]"
                                    >
                                        <option value="Necklaces">
                                            Necklaces
                                        </option>
                                        <option value="Earrings">
                                            Earrings
                                        </option>
                                        <option value="Rings">Rings</option>
                                        <option value="Bracelets">
                                            Bracelets
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="metal"
                                        className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]"
                                    >
                                        Metal
                                    </label>

                                    <select
                                        id="metal"
                                        name="metal"
                                        value={form.metal}
                                        onChange={handleChange}
                                        className="mt-2 w-full border border-[#d8d2c9] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#a9874a]"
                                    >
                                        <option value="22K Gold">
                                            22K Gold
                                        </option>
                                        <option value="18K Gold">
                                            18K Gold
                                        </option>
                                        <option value="Diamond">
                                            Diamond
                                        </option>
                                        <option value="Silver">
                                            Silver
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* PRICING & INVENTORY */}

                        <section className="mt-12 border-t border-[#e8e3db] pt-10">
                            <p className="mb-6 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                                02 — Pricing & Inventory
                            </p>

                            <div className="grid gap-6 md:grid-cols-3">
                                <div>
                                    <label
                                        htmlFor="price"
                                        className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]"
                                    >
                                        Price (₹)
                                    </label>

                                    <div className="relative mt-2">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#918b83]">
                                            ₹
                                        </span>

                                        <input
                                            id="price"
                                            type="number"
                                            name="price"
                                            value={form.price}
                                            onChange={handleChange}
                                            placeholder="125000"
                                            min="0"
                                            step="0.01"
                                            required
                                            className="w-full border border-[#d8d2c9] bg-white py-3.5 pl-9 pr-4 text-sm outline-none placeholder:text-[#b2ada5] focus:border-[#a9874a]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="weight"
                                        className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]"
                                    >
                                        Weight (grams)
                                    </label>

                                    <div className="relative mt-2">
                                        <input
                                            id="weight"
                                            type="number"
                                            name="weight"
                                            value={form.weight}
                                            onChange={handleChange}
                                            placeholder="32.5"
                                            min="0"
                                            step="0.01"
                                            className="w-full border border-[#d8d2c9] bg-white px-4 py-3.5 pr-12 text-sm outline-none placeholder:text-[#b2ada5] focus:border-[#a9874a]"
                                        />

                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-[0.15em] text-[#918b83]">
                                            g
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="stock"
                                        className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]"
                                    >
                                        Stock Quantity
                                    </label>

                                    <input
                                        id="stock"
                                        type="number"
                                        name="stock"
                                        value={form.stock}
                                        onChange={handleChange}
                                        placeholder="10"
                                        min="0"
                                        step="1"
                                        required
                                        className="mt-2 w-full border border-[#d8d2c9] bg-white px-4 py-3.5 text-sm outline-none placeholder:text-[#b2ada5] focus:border-[#a9874a]"
                                    />
                                </div>

                                <div className="md:col-span-3">
                                    <label
                                        htmlFor="sku"
                                        className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]"
                                    >
                                        SKU
                                    </label>

                                    <input
                                        id="sku"
                                        type="text"
                                        name="sku"
                                        value={form.sku}
                                        onChange={handleChange}
                                        placeholder="AUR-NEC-005"
                                        required
                                        className="mt-2 w-full border border-[#d8d2c9] bg-white px-4 py-3.5 font-mono text-sm uppercase tracking-wide outline-none placeholder:font-sans placeholder:text-[#b2ada5] focus:border-[#a9874a]"
                                    />

                                    <p className="mt-2 text-[10px] text-[#918b83]">
                                        Use a unique SKU for inventory
                                        identification.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* PRODUCT IMAGE */}

                        <section className="mt-12 border-t border-[#e8e3db] pt-10">
                            <p className="mb-6 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                                03 — Product Media
                            </p>

                            <label
                                htmlFor="image"
                                className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]"
                            >
                                Product Image URL
                            </label>

                            <input
                                id="image"
                                type="url"
                                name="image"
                                value={form.image}
                                onChange={handleChange}
                                placeholder="https://example.com/product-image.jpg"
                                className="mt-2 w-full border border-[#d8d2c9] bg-white px-4 py-3.5 text-sm outline-none placeholder:text-[#b2ada5] focus:border-[#a9874a]"
                            />

                            <p className="mt-2 text-[10px] text-[#918b83]">
                                Paste a publicly accessible image URL.
                            </p>

                            {form.image && (
                                <div className="mt-6 border border-[#e2ddd5] bg-[#faf8f4] p-4">
                                    <p className="mb-3 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                                        Image Preview
                                    </p>

                                    <div className="flex min-h-56 items-center justify-center overflow-hidden bg-[#eeeae3] sm:h-72">
                                        <img
                                            src={form.image}
                                            alt="Product preview"
                                            className="h-56 w-full object-contain sm:h-72"
                                            onError={(event) => {
                                                event.currentTarget.style.visibility =
                                                    "hidden";
                                            }}
                                            onLoad={(event) => {
                                                event.currentTarget.style.visibility =
                                                    "visible";
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* DESCRIPTION */}

                        <section className="mt-12 border-t border-[#e8e3db] pt-10">
                            <p className="mb-6 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                                04 — Product Description
                            </p>

                            <label
                                htmlFor="description"
                                className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the jewellery piece, craftsmanship, finish and design..."
                                rows={6}
                                required
                                className="mt-2 w-full resize-y border border-[#d8d2c9] bg-white px-4 py-3.5 text-sm leading-6 outline-none placeholder:text-[#b2ada5] focus:border-[#a9874a]"
                            />

                            <p className="mt-2 text-[10px] text-[#918b83]">
                                Provide a clear description that helps
                                customers understand the piece.
                            </p>
                        </section>
                    </div>

                    {/* FORM ACTIONS */}

                    <div className="flex flex-col gap-3 border-t border-[#e2ddd5] bg-[#faf8f4] px-6 py-6 sm:flex-row sm:justify-end sm:px-10">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/products")}
                            disabled={loading}
                            className="border border-[#d1cbc1] bg-white px-8 py-3.5 text-[9px] font-semibold uppercase tracking-[0.25em] transition hover:border-[#171717] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-3 bg-[#171717] px-8 py-3.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#a9874a] disabled:cursor-not-allowed disabled:bg-[#918b83]"
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

                {/* FOOTER */}

                <footer className="mt-12 border-t border-[#ddd7cd] pt-6">
                    <div className="flex flex-col justify-between gap-3 text-[9px] uppercase tracking-[0.18em] text-[#918b83] sm:flex-row">
                        <p>
                            © {new Date().getFullYear()} AURELIA Jewellery
                        </p>

                        <p>Product Catalogue</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default AdminProductForm;
