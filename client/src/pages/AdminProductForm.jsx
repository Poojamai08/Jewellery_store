
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const INITIAL_FORM = {
    name: "",
    category: "Necklaces",
    price: "",
    metal: "22K Gold",
    weight: "",
    sku: "",
    stock: "",
    description: "",
    image: "",
};

function AdminProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [form, setForm] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");
    const [imageStatus, setImageStatus] = useState("empty");

    // ================= AUTHENTICATION =================

    const getAdminToken = () => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            navigate("/login", { replace: true });
            return null;
        }

        try {
            const user = JSON.parse(storedUser);

            if (String(user.role).toUpperCase() !== "ADMIN") {
                navigate("/home", { replace: true });
                return null;
            }

            return token;
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login", { replace: true });
            return null;
        }
    };

    // ================= FETCH PRODUCT =================

    useEffect(() => {
        let cancelled = false;

        const loadProduct = async () => {
            const token = getAdminToken();

            if (!token) {
                setPageLoading(false);
                return;
            }

            if (!isEditMode) {
                setPageLoading(false);
                return;
            }

            try {
                setPageLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/products/${id}`,
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

                const product = data.product || data;

                if (!product || !product.id) {
                    throw new Error("Product not found.");
                }

                const imageUrl = Array.isArray(product.images)
                    ? product.images[0] || ""
                    : "";

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
                        image: imageUrl,
                    });

                    setImageStatus(imageUrl ? "loading" : "empty");
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Unable to load product.");
                }
            } finally {
                if (!cancelled) {
                    setPageLoading(false);
                }
            }
        };

        loadProduct();

        return () => {
            cancelled = true;
        };
        // Authentication helper intentionally uses the current navigation.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isEditMode, navigate]);

    // ================= FORM INPUTS =================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        if (name === "image") {
            setImageStatus(value.trim() ? "loading" : "empty");
        }

        if (error) {
            setError("");
        }
    };

    const handleImageLoad = () => {
        setImageStatus("loaded");
    };

    const handleImageError = () => {
        setImageStatus("error");
    };

    // ================= SAVE PRODUCT =================

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = getAdminToken();
        if (!token) return;

        setError("");

        if (
            !form.name.trim() ||
            !form.category.trim() ||
            !form.metal.trim() ||
            !form.sku.trim() ||
            !form.description.trim() ||
            form.price === "" ||
            form.stock === ""
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        const price = Number(form.price);
        const stock = Number(form.stock);
        const weight =
            form.weight === "" ? null : Number(form.weight);

        if (!Number.isFinite(price) || price < 0) {
            setError("Please enter a valid product price.");
            return;
        }

        if (!Number.isInteger(stock) || stock < 0) {
            setError("Stock must be a non-negative whole number.");
            return;
        }

        if (
            weight !== null &&
            (!Number.isFinite(weight) || weight < 0)
        ) {
            setError("Please enter a valid product weight.");
            return;
        }

        const imageUrl = form.image.trim();

        if (imageUrl) {
            try {
                const parsedUrl = new URL(imageUrl);

                if (!["https:", "http:"].includes(parsedUrl.protocol)) {
                    throw new Error();
                }
            } catch {
                setError("Please enter a valid HTTP or HTTPS image URL.");
                return;
            }

            if (imageStatus === "error") {
                setError(
                    "The image URL cannot be loaded. Please check the URL before saving."
                );
                return;
            }
        }

        const productData = {
            name: form.name.trim(),
            category: form.category.trim(),
            price,
            metal: form.metal.trim(),
            weight,
            sku: form.sku.trim(),
            stock,
            description: form.description.trim(),
            // Your backend stores image URLs in a PostgreSQL array.
            images: imageUrl ? [imageUrl] : [],
        };

        try {
            setLoading(true);

            const response = await fetch(
                isEditMode
                    ? `${API_URL}/api/products/${id}`
                    : `${API_URL}/api/products`,
                {
                    method: isEditMode ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(productData),
                }
            );

            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                throw new Error(
                    data.message || "You are not authorized to perform this action."
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save product."
                );
            }

            const savedProduct = data.product;

            if (
                imageUrl &&
                savedProduct &&
                Array.isArray(savedProduct.images) &&
                !savedProduct.images.includes(imageUrl)
            ) {
                console.warn(
                    "The API response does not contain the submitted image URL.",
                    savedProduct.images
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
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f2ec]">
                <div className="h-9 w-9 animate-spin rounded-full border border-[#ded8ce] border-t-[#a9874a]" />
                <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                    Loading Product
                </p>
            </div>
        );
    }

    const inputClass =
        "mt-2 w-full border border-[#d8d2c9] bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#b2ada5] focus:border-[#a9874a]";

    const labelClass =
        "text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a]";

    // ================= MAIN UI =================

    return (
        <div className="min-h-screen bg-[#f5f2ec]">
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
                        className="border border-white/20 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] transition hover:border-[#c6a15b] hover:bg-[#c6a15b] hover:text-[#171717]"
                    >
                        ← Back to Products
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 sm:py-12">
                <div className="mb-10">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                        Catalogue
                    </p>
                    <h2 className="mt-3 font-serif text-4xl text-[#171717] sm:text-5xl">
                        {isEditMode ? "Edit Product" : "Add Product"}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-[#77716a]">
                        {isEditMode
                            ? "Update the details of this jewellery piece."
                            : "Create a new jewellery piece for the AURELIA collection."}
                    </p>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mb-8 flex items-start justify-between gap-5 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
                    >
                        <p>{error}</p>
                        <button
                            type="button"
                            onClick={() => setError("")}
                            className="shrink-0 text-xs underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="border border-[#ddd7cd] bg-white"
                >
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

                    <div className="space-y-12 px-6 py-8 sm:px-10 sm:py-10">
                        <section>
                            <p className="mb-6 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                                01 — Basic Information
                            </p>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label htmlFor="name" className={labelClass}>
                                        Product Name *
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Royal Temple Necklace"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="category" className={labelClass}>
                                        Category *
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className={inputClass}
                                        required
                                    >
                                        <option value="Necklaces">Necklaces</option>
                                        <option value="Earrings">Earrings</option>
                                        <option value="Rings">Rings</option>
                                        <option value="Bracelets">Bracelets</option>
                                        <option value="Pendants">Pendants</option>
                                        <option value="Bangles">Bangles</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="metal" className={labelClass}>
                                        Metal *
                                    </label>
                                    <select
                                        id="metal"
                                        name="metal"
                                        value={form.metal}
                                        onChange={handleChange}
                                        className={inputClass}
                                        required
                                    >
                                        <option value="22K Gold">22K Gold</option>
                                        <option value="18K Gold">18K Gold</option>
                                        <option value="Diamond">Diamond</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Rose Gold">Rose Gold</option>
                                        <option value="Platinum">Platinum</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="border-t border-[#e8e3db] pt-10">
                            <p className="mb-6 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                                02 — Pricing & Inventory
                            </p>

                            <div className="grid gap-6 md:grid-cols-3">
                                <div>
                                    <label htmlFor="price" className={labelClass}>
                                        Price (₹) *
                                    </label>
                                    <input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.price}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="125000"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="weight" className={labelClass}>
                                        Weight (grams)
                                    </label>
                                    <input
                                        id="weight"
                                        name="weight"
                                        type="number"
                                        min="0"
                                        step="0.001"
                                        value={form.weight}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="32.5"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="stock" className={labelClass}>
                                        Stock Quantity *
                                    </label>
                                    <input
                                        id="stock"
                                        name="stock"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={form.stock}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="10"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-3">
                                    <label htmlFor="sku" className={labelClass}>
                                        SKU *
                                    </label>
                                    <input
                                        id="sku"
                                        name="sku"
                                        value={form.sku}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="AUR-NEC-005"
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="border-t border-[#e8e3db] pt-10">
                            <p className="mb-6 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                                03 — Product Image
                            </p>

                            <label htmlFor="image" className={labelClass}>
                                Image URL
                            </label>

                            <input
                                id="image"
                                name="image"
                                type="url"
                                value={form.image}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="https://example.com/jewellery.jpg"
                            />

                            <p className="mt-2 text-xs text-[#918b83]">
                                Paste a direct, publicly accessible image URL.
                            </p>

                            <div className="mt-5 flex min-h-64 items-center justify-center border border-[#ddd7cd] bg-[#faf8f4] p-4">
                                {!form.image.trim() ? (
                                    <p className="text-sm text-[#918b83]">
                                        Your image preview will appear here.
                                    </p>
                                ) : (
                                    <div className="w-full text-center">
                                        {imageStatus === "loading" && (
                                            <p className="mb-3 text-xs text-[#918b83]">
                                                Loading image preview...
                                            </p>
                                        )}

                                        <img
                                            key={form.image.trim()}
                                            src={form.image.trim()}
                                            alt="Product preview"
                                            className={`mx-auto max-h-72 max-w-full object-contain ${imageStatus === "error"
                                                    ? "hidden"
                                                    : ""
                                                }`}
                                            onLoad={handleImageLoad}
                                            onError={handleImageError}
                                        />

                                        {imageStatus === "error" && (
                                            <div className="py-8">
                                                <p className="text-sm font-medium text-red-600">
                                                    Image could not be loaded.
                                                </p>
                                                <p className="mt-2 text-xs text-[#918b83]">
                                                    Check the URL and use a direct image link.
                                                </p>
                                            </div>
                                        )}

                                        {imageStatus === "loaded" && (
                                            <p className="mt-3 text-xs text-green-700">
                                                Image preview loaded successfully.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="border-t border-[#e8e3db] pt-10">
                            <p className="mb-6 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                                04 — Description
                            </p>

                            <label htmlFor="description" className={labelClass}>
                                Product Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={6}
                                className={inputClass}
                                placeholder="Describe the jewellery piece, craftsmanship and design..."
                                required
                            />
                        </section>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-[#e2ddd5] bg-[#faf8f4] px-6 py-6 sm:flex-row sm:justify-end sm:px-10">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/products")}
                            disabled={loading}
                            className="border border-[#d1cbc1] bg-white px-8 py-3.5 text-[9px] font-semibold uppercase tracking-[0.25em] hover:border-[#171717] disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#171717] px-8 py-3.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#a9874a] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Saving..."
                                : isEditMode
                                    ? "Update Product"
                                    : "Save Product"}
                        </button>
                    </div>
                </form>

                <footer className="mt-12 border-t border-[#ddd7cd] pt-6">
                    <div className="flex flex-col justify-between gap-3 text-[9px] uppercase tracking-[0.18em] text-[#918b83] sm:flex-row">
                        <p>© {new Date().getFullYear()} AURELIA Jewellery</p>
                        <p>Product Catalogue</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default AdminProductForm;
