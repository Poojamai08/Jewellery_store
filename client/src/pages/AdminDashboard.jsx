import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();

    const [admin, setAdmin] = useState(null);

    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        revenue: 0,
        lowStock: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("aureliaAdminToken");
        const adminData = localStorage.getItem("aureliaAdmin");

        if (!token) {
            navigate("/admin/login");
            return;
        }

        if (adminData) {
            setAdmin(JSON.parse(adminData));
        }

        const fetchDashboardStats = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:5000/api/admin/dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch dashboard"
                    );
                }

                setStats(data.stats);
            } catch (error) {
                console.error(
                    "Dashboard Stats Error:",
                    error
                );

                setError(
                    "Unable to load dashboard statistics."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("aureliaAdminToken");
        localStorage.removeItem("aureliaAdmin");

        navigate("/admin/login");
    };

    const statCards = [
        {
            label: "Total Products",
            value: stats.totalProducts,
            description: "Active catalogue",
            icon: (
                <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                >
                    <path d="M4 7.5 12 3l8 4.5-8 4.5z" />
                    <path d="M4 7.5V16l8 5 8-5V7.5" />
                    <path d="M12 12v9" />
                </svg>
            ),
        },
        {
            label: "Total Orders",
            value: stats.totalOrders,
            description: "Customer orders",
            icon: (
                <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                >
                    <path d="M6 3h12v18H6z" />
                    <path d="M9 7h6" />
                    <path d="M9 11h6" />
                    <path d="M9 15h4" />
                </svg>
            ),
        },
        {
            label: "Revenue",
            value: `₹${Number(stats.revenue).toLocaleString(
                "en-IN"
            )}`,
            description: "Total order value",
            icon: (
                <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                >
                    <path d="M12 3v18" />
                    <path d="M16.5 7.5c0-1.7-1.8-3-4.5-3S7.5 5.8 7.5 7.5s1.8 2.5 4.5 3 4.5 1.3 4.5 3.5-1.8 3.5-4.5 3.5-4.5-1.3-4.5-3" />
                </svg>
            ),
        },
        {
            label: "Low Stock",
            value: stats.lowStock,
            description: "Products need attention",
            icon: (
                <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                >
                    <path d="M12 3 21 20H3z" />
                    <path d="M12 9v5" />
                    <path d="M12 17.5v.5" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-[#f5f2ec]">

            {/* ================= HEADER ================= */}

            <header className="sticky top-0 z-40 border-b border-[#ded8ce] bg-[#171717] text-white">

                <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-8">

                    {/* Brand */}

                    <div className="flex items-center gap-5">

                        <div>
                            <h1 className="font-serif text-2xl tracking-[0.22em]">
                                AURELIA
                            </h1>

                            <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.3em] text-[#c6a15b]">
                                Jewellery Administration
                            </p>
                        </div>

                        <div className="hidden h-8 w-px bg-white/20 sm:block" />

                        <span className="hidden text-[9px] uppercase tracking-[0.25em] text-white/50 md:block">
                            Control Centre
                        </span>

                    </div>

                    {/* Admin */}

                    <div className="flex items-center gap-4">

                        <div className="hidden text-right sm:block">

                            <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">
                                Signed in as
                            </p>

                            <p className="mt-1 text-sm text-white">
                                {admin?.name || "Admin"}
                            </p>

                        </div>

                        <button
                            onClick={handleLogout}
                            className="border border-white/20 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white transition duration-300 hover:border-[#c6a15b] hover:bg-[#c6a15b] hover:text-[#171717]"
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
                            Overview
                        </p>

                        <h2 className="mt-3 font-serif text-4xl leading-tight text-[#171717] sm:text-5xl">
                            Welcome back
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-[#77716a]">
                            Monitor your AURELIA jewellery catalogue,
                            orders, revenue and inventory from one place.
                        </p>

                    </div>

                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#918b83]">

                        <span className="h-2 w-2 rounded-full bg-[#a9874a]" />

                        Store System Active

                    </div>

                </div>


                {/* ================= ERROR ================= */}

                {error && (
                    <div className="mb-8 flex items-center justify-between border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">

                        <span>{error}</span>

                        <button
                            onClick={() => window.location.reload()}
                            className="text-[9px] font-semibold uppercase tracking-[0.2em] underline"
                        >
                            Retry
                        </button>

                    </div>
                )}


                {/* ================= STATISTICS ================= */}

                <section>

                    <div className="mb-5 flex items-center justify-between">

                        <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a9874a]">
                                Store Performance
                            </p>

                            <h3 className="mt-1 font-serif text-2xl text-[#171717]">
                                At a glance
                            </h3>
                        </div>

                    </div>


                    <div className="grid gap-px overflow-hidden border border-[#ddd7cd] bg-[#ddd7cd] sm:grid-cols-2 lg:grid-cols-4">

                        {statCards.map((card) => (
                            <div
                                key={card.label}
                                className="bg-white p-6 transition duration-300 hover:bg-[#faf8f4] sm:p-7"
                            >

                                <div className="flex items-start justify-between">

                                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                                        {card.label}
                                    </p>

                                    <div className="flex h-9 w-9 items-center justify-center border border-[#ded8ce] text-[#a9874a]">
                                        {card.icon}
                                    </div>

                                </div>

                                <p className="mt-7 font-serif text-3xl text-[#171717] sm:text-4xl">
                                    {loading ? "—" : card.value}
                                </p>

                                <p className="mt-2 text-[10px] text-[#918b83]">
                                    {card.description}
                                </p>

                            </div>
                        ))}

                    </div>

                </section>


                {/* ================= MANAGEMENT ================= */}

                <section className="mt-12">

                    <div className="mb-6">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a9874a]">
                            Management
                        </p>

                        <h3 className="mt-1 font-serif text-2xl text-[#171717]">
                            Store Operations
                        </h3>

                    </div>


                    <div className="grid gap-6 lg:grid-cols-2">

                        {/* PRODUCTS */}

                        <div className="group relative overflow-hidden border border-[#ddd7cd] bg-white p-8 sm:p-10">

                            <div className="absolute right-0 top-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full border border-[#e5dfd5] transition duration-700 group-hover:scale-150" />

                            <div className="relative">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                                            Catalogue
                                        </p>

                                        <h4 className="mt-3 font-serif text-3xl text-[#171717]">
                                            Products
                                        </h4>

                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center border border-[#ded8ce] text-[#a9874a]">

                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.4"
                                        >
                                            <path d="M4 7.5 12 3l8 4.5-8 4.5z" />
                                            <path d="M4 7.5V16l8 5 8-5V7.5" />
                                            <path d="M12 12v9" />
                                        </svg>

                                    </div>

                                </div>

                                <p className="mt-5 max-w-md text-sm leading-7 text-[#77716a]">
                                    Add new jewellery, update product details,
                                    manage pricing and keep your inventory
                                    stock accurate.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/admin/products")
                                    }
                                    className="mt-8 inline-flex items-center gap-4 bg-[#171717] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-white transition duration-300 hover:bg-[#a9874a]"
                                >
                                    Manage Products

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

                                </button>

                            </div>

                        </div>


                        {/* ORDERS */}

                        <div className="group relative overflow-hidden border border-[#ddd7cd] bg-[#171717] p-8 text-white sm:p-10">

                            <div className="absolute right-0 top-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full border border-white/10 transition duration-700 group-hover:scale-150" />

                            <div className="relative">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#c6a15b]">
                                            Sales
                                        </p>

                                        <h4 className="mt-3 font-serif text-3xl">
                                            Orders
                                        </h4>

                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center border border-white/15 text-[#c6a15b]">

                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.4"
                                        >
                                            <path d="M6 3h12v18H6z" />
                                            <path d="M9 7h6" />
                                            <path d="M9 11h6" />
                                            <path d="M9 15h4" />
                                        </svg>

                                    </div>

                                </div>

                                <p className="mt-5 max-w-md text-sm leading-7 text-white/55">
                                    Review customer orders, inspect order
                                    details and update the delivery status
                                    as orders move through fulfilment.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/admin/orders")
                                    }
                                    className="mt-8 inline-flex items-center gap-4 border border-white/20 px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-white transition duration-300 hover:border-[#c6a15b] hover:bg-[#c6a15b] hover:text-[#171717]"
                                >
                                    Manage Orders

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

                                </button>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ================= QUICK ACTIONS ================= */}

                <section className="mt-12 border-t border-[#ddd7cd] pt-10">

                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

                        <div>

                            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a9874a]">
                                Quick Actions
                            </p>

                            <h3 className="mt-1 font-serif text-2xl text-[#171717]">
                                Keep your store moving
                            </h3>

                        </div>


                        <div className="flex flex-wrap gap-3">

                            <button
                                onClick={() =>
                                    navigate("/admin/products/new")
                                }
                                className="border border-[#cfc8bd] bg-white px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#292722] transition duration-300 hover:border-[#a9874a] hover:text-[#a9874a]"
                            >
                                + Add Product
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/admin/orders")
                                }
                                className="border border-[#cfc8bd] bg-white px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#292722] transition duration-300 hover:border-[#a9874a] hover:text-[#a9874a]"
                            >
                                View Orders
                            </button>

                        </div>

                    </div>

                </section>


                {/* ================= FOOTER ================= */}

                <footer className="mt-16 border-t border-[#ddd7cd] pt-6">

                    <div className="flex flex-col justify-between gap-3 text-[9px] uppercase tracking-[0.18em] text-[#918b83] sm:flex-row">

                        <p>
                            © {new Date().getFullYear()} AURELIA Jewellery
                        </p>

                        <p>
                            Admin Control Centre
                        </p>

                    </div>

                </footer>

            </main>

        </div>
    );
}

export default AdminDashboard;