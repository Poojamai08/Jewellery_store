import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("aureliaAdminToken");

        if (!token) {
            navigate("/admin/login");
            return;
        }

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:5000/api/products"
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch products"
                    );
                }

                setProducts(data.products);
            } catch (error) {
                console.error("Admin Products Error:", error);

                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [navigate]);

    const handleDelete = async (productId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem(
                "aureliaAdminToken"
            );

            const response = await fetch(
                `http://localhost:5000/api/products/${productId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete product"
                );
            }

            setProducts((currentProducts) =>
                currentProducts.filter(
                    (product) => product.id !== productId
                )
            );

            alert("Product deleted successfully.");
        } catch (error) {
            console.error("Delete Product Error:", error);

            alert(error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("aureliaAdminToken");
        localStorage.removeItem("aureliaAdmin");

        navigate("/admin/login");
    };

    const lowStockCount = products.filter(
        (product) => product.stock <= 3
    ).length;

    return (
        <div className="min-h-screen bg-[#f5f2ec]">

            {/* ================= HEADER ================= */}

            <header className="sticky top-0 z-40 border-b border-[#2a2927] bg-[#171717] text-white">

                <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-8">

                    {/* Brand */}

                    <div className="flex items-center gap-5">

                        <button
                            onClick={() =>
                                navigate("/admin/dashboard")
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

                        <div className="hidden h-8 w-px bg-white/20 sm:block" />

                        <span className="hidden text-[9px] uppercase tracking-[0.25em] text-white/50 md:block">
                            Product Catalogue
                        </span>

                    </div>

                    {/* Header Actions */}

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() =>
                                navigate("/admin/dashboard")
                            }
                            className="hidden border border-white/20 px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] transition duration-300 hover:border-[#c6a15b] hover:bg-[#c6a15b] hover:text-[#171717] sm:block"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={handleLogout}
                            className="border border-white/20 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] transition duration-300 hover:border-[#c6a15b] hover:bg-[#c6a15b] hover:text-[#171717]"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </header>


            {/* ================= MAIN ================= */}

            <main className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 sm:py-12">

                {/* Page Intro */}

                <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

                    <div>

                        <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                            Catalogue
                        </p>

                        <h2 className="mt-3 font-serif text-4xl leading-tight text-[#171717] sm:text-5xl">
                            Products
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-[#77716a]">
                            Manage your jewellery collection, pricing,
                            product information and inventory.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate("/admin/products/new")
                        }
                        className="inline-flex items-center justify-center gap-3 bg-[#171717] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-white transition duration-300 hover:bg-[#a9874a]"
                    >
                        <span className="text-base leading-none">
                            +
                        </span>

                        Add Product
                    </button>

                </div>


                {/* ================= SUMMARY ================= */}

                <div className="mb-8 grid gap-px overflow-hidden border border-[#ddd7cd] bg-[#ddd7cd] sm:grid-cols-3">

                    {/* Total Products */}

                    <div className="bg-white px-6 py-5">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                            Catalogue Items
                        </p>

                        <p className="mt-2 font-serif text-3xl text-[#171717]">
                            {loading ? "—" : products.length}
                        </p>

                    </div>


                    {/* Low Stock */}

                    <div className="bg-white px-6 py-5">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                            Low Stock
                        </p>

                        <div className="mt-2 flex items-center gap-3">

                            <p className="font-serif text-3xl text-[#171717]">
                                {loading ? "—" : lowStockCount}
                            </p>

                            {!loading && lowStockCount > 0 && (
                                <span className="border border-[#e4d4c0] bg-[#faf5ed] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#a9874a]">
                                    Attention
                                </span>
                            )}

                        </div>

                    </div>


                    {/* Inventory Status */}

                    <div className="bg-white px-6 py-5">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                            Inventory Status
                        </p>

                        <div className="mt-3 flex items-center gap-2">

                            <span className="h-2 w-2 rounded-full bg-[#a9874a]" />

                            <span className="text-sm text-[#292722]">
                                System Active
                            </span>

                        </div>

                    </div>

                </div>


                {/* ================= ERROR ================= */}

                {error && (
                    <div className="mb-6 flex items-center justify-between border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">

                        <span>{error}</span>

                        <button
                            onClick={() =>
                                window.location.reload()
                            }
                            className="text-[9px] font-semibold uppercase tracking-[0.2em] underline"
                        >
                            Retry
                        </button>

                    </div>
                )}


                {/* ================= CONTENT ================= */}

                {loading ? (

                    <div className="border border-[#ddd7cd] bg-white p-16 text-center">

                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border border-[#ded8ce] border-t-[#a9874a]" />

                        <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-[#918b83]">
                            Loading Catalogue
                        </p>

                    </div>

                ) : products.length === 0 ? (

                    /* EMPTY STATE */

                    <div className="border border-[#ddd7cd] bg-white px-6 py-20 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#ded8ce] text-[#a9874a]">

                            <svg
                                viewBox="0 0 24 24"
                                className="h-7 w-7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.3"
                            >
                                <path d="M4 7.5 12 3l8 4.5-8 4.5z" />
                                <path d="M4 7.5V16l8 5 8-5V7.5" />
                                <path d="M12 12v9" />
                            </svg>

                        </div>

                        <p className="mt-7 font-serif text-3xl text-[#171717]">
                            Your catalogue is empty
                        </p>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#77716a]">
                            Add your first jewellery product to begin
                            building the AURELIA collection.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/admin/products/new")
                            }
                            className="mt-7 bg-[#171717] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-white transition duration-300 hover:bg-[#a9874a]"
                        >
                            Add Your First Product
                        </button>

                    </div>

                ) : (

                    /* PRODUCT TABLE */

                    <div className="overflow-hidden border border-[#ddd7cd] bg-white">

                        {/* Table Header */}

                        <div className="flex flex-col justify-between gap-3 border-b border-[#e2ddd5] bg-[#faf8f4] px-6 py-5 sm:flex-row sm:items-center">

                            <div>

                                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a9874a]">
                                    Collection Inventory
                                </p>

                                <p className="mt-1 text-sm text-[#77716a]">
                                    {products.length}{" "}
                                    {products.length === 1
                                        ? "product"
                                        : "products"}{" "}
                                    in catalogue
                                </p>

                            </div>

                        </div>


                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1000px]">

                                <thead className="border-b border-[#e2ddd5]">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                                            Product
                                        </th>

                                        <th className="px-6 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                                            Category
                                        </th>

                                        <th className="px-6 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                                            Price
                                        </th>

                                        <th className="px-6 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                                            SKU
                                        </th>

                                        <th className="px-6 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                                            Stock
                                        </th>

                                        <th className="px-6 py-4 text-right text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {products.map((product) => {

                                        const isLowStock =
                                            product.stock <= 3;

                                        const isOutOfStock =
                                            product.stock === 0;

                                        return (
                                            <tr
                                                key={product.id}
                                                className="group border-b border-[#eeeae3] last:border-0 transition duration-300 hover:bg-[#fcfbf8]"
                                            >

                                                {/* PRODUCT */}

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-4">

                                                        <div className="h-16 w-16 shrink-0 overflow-hidden bg-[#eeeae3]">

                                                            <img
                                                                src={
                                                                    product
                                                                        .images?.[0] ||
                                                                    "https://via.placeholder.com/100"
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                            />

                                                        </div>


                                                        <div className="min-w-0">

                                                            <p className="font-serif text-lg leading-tight text-[#171717]">
                                                                {
                                                                    product.name
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#918b83]">
                                                                {
                                                                    product.metal
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* CATEGORY */}

                                                <td className="px-6 py-5">

                                                    <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#77716a]">
                                                        {
                                                            product.category
                                                        }
                                                    </span>

                                                </td>


                                                {/* PRICE */}

                                                <td className="px-6 py-5">

                                                    <span className="text-sm font-medium tracking-wide text-[#292722]">
                                                        ₹
                                                        {Number(
                                                            product.price
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </span>

                                                </td>


                                                {/* SKU */}

                                                <td className="px-6 py-5">

                                                    <span className="font-mono text-[10px] tracking-wide text-[#77716a]">
                                                        {
                                                            product.sku
                                                        }
                                                    </span>

                                                </td>


                                                {/* STOCK */}

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-3">

                                                        <span
                                                            className={`text-sm font-medium ${
                                                                isOutOfStock
                                                                    ? "text-red-600"
                                                                    : isLowStock
                                                                    ? "text-[#a9874a]"
                                                                    : "text-[#292722]"
                                                            }`}
                                                        >
                                                            {
                                                                product.stock
                                                            }
                                                        </span>


                                                        {isOutOfStock ? (
                                                            <span className="border border-red-200 bg-red-50 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-red-600">
                                                                Sold Out
                                                            </span>
                                                        ) : isLowStock ? (
                                                            <span className="border border-[#e4d4c0] bg-[#faf5ed] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#a9874a]">
                                                                Low
                                                            </span>
                                                        ) : (
                                                            <span className="text-[8px] uppercase tracking-[0.15em] text-[#918b83]">
                                                                In Stock
                                                            </span>
                                                        )}

                                                    </div>

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="px-6 py-5">

                                                    <div className="flex justify-end gap-2">

                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/products/edit/${product.id}`
                                                                )
                                                            }
                                                            className="border border-[#d6d0c6] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#292722] transition duration-300 hover:border-[#a9874a] hover:text-[#a9874a]"
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product.id
                                                                )
                                                            }
                                                            className="border border-red-200 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-red-600 transition duration-300 hover:bg-red-600 hover:text-white"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}


                {/* ================= FOOTER ================= */}

                <footer className="mt-12 border-t border-[#ddd7cd] pt-6">

                    <div className="flex flex-col justify-between gap-3 text-[9px] uppercase tracking-[0.18em] text-[#918b83] sm:flex-row">

                        <p>
                            © {new Date().getFullYear()} AURELIA Jewellery
                        </p>

                        <p>
                            Product Management
                        </p>

                    </div>

                </footer>

            </main>

        </div>
    );
}

export default AdminProducts;