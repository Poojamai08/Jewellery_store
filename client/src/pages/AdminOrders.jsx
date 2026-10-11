
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = useCallback(async () => {
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

            setLoading(true);
            setError("");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/orders/admin`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                throw new Error(
                    data.message || "Your session is invalid or expired. Please log in again."
                );
            }

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch orders.");
            }

            setOrders(Array.isArray(data.orders) ? data.orders : []);
        } catch (err) {
            console.error("Admin Orders Error:", err);

            if (err instanceof SyntaxError) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login", { replace: true });
                return;
            }

            setError(err.message || "Unable to load orders.");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    };

    const formatDate = (date) => {
        if (!date) return "—";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "—";

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatPrice = (price) =>
        Number(price || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
        });

    const getStatusClass = (status) => {
        switch (String(status || "").toUpperCase()) {
            case "DELIVERED":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "SHIPPED":
                return "bg-blue-50 text-blue-700 border-blue-100";
            case "PROCESSING":
                return "bg-amber-50 text-amber-700 border-amber-100";
            case "CANCELLED":
                return "bg-red-50 text-red-700 border-red-100";
            case "CONFIRMED":
                return "bg-purple-50 text-purple-700 border-purple-100";
            default:
                return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            CONFIRMED: "Confirmed",
            PROCESSING: "Processing",
            SHIPPED: "Shipped",
            DELIVERED: "Delivered",
            CANCELLED: "Cancelled",
        };

        const normalized = String(status || "").toUpperCase();
        return labels[normalized] || status || "Unknown";
    };

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0
    );

    const activeOrders = orders.filter(
        (order) =>
            !["DELIVERED", "CANCELLED"].includes(
                String(order.status || "").toUpperCase()
            )
    ).length;

    return (
        <div className="min-h-screen bg-[#f8f6f1] text-[#171717]">
            <header className="border-b border-[#2a2a2a] bg-[#171717] text-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
                    <div>
                        <button
                            onClick={() => navigate("/admin/dashboard")}
                            className="font-serif text-2xl tracking-[0.16em] transition hover:text-[#c6a15b]"
                        >
                            AURELIA
                        </button>

                        <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.3em] text-[#c6a15b]">
                            Administration
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/admin/dashboard")}
                            className="hidden border border-white/20 px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] transition hover:border-[#c6a15b] hover:text-[#c6a15b] sm:block"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={handleLogout}
                            className="border border-white/20 px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] transition hover:bg-white hover:text-[#171717]"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
                <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                            Sales Management
                        </p>

                        <h1 className="mt-3 font-serif text-4xl leading-none sm:text-5xl">
                            Orders
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-6 text-[#77716a]">
                            View customer purchases, monitor order activity,
                            and manage fulfilment.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Order system active
                    </div>
                </div>

                <div className="mb-10 grid gap-px border border-[#ded8cf] bg-[#ded8cf] sm:grid-cols-3">
                    <div className="bg-white px-6 py-6">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                            Total Orders
                        </p>
                        <p className="mt-3 font-serif text-3xl">{totalOrders}</p>
                    </div>

                    <div className="bg-white px-6 py-6">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                            Active Orders
                        </p>
                        <p className="mt-3 font-serif text-3xl">{activeOrders}</p>
                    </div>

                    <div className="bg-white px-6 py-6">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                            Order Value
                        </p>
                        <p className="mt-3 font-serif text-3xl">
                            ₹{formatPrice(totalRevenue)}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 flex flex-col justify-between gap-3 border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center">
                        <p className="text-sm text-red-600">{error}</p>

                        <button
                            onClick={fetchOrders}
                            className="text-left text-[9px] font-semibold uppercase tracking-[0.2em] text-red-700 underline underline-offset-4"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="border border-[#ded8cf] bg-white py-20 text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ded8cf] border-t-[#a9874a]" />
                        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                            Loading orders
                        </p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="border border-[#ded8cf] bg-white px-6 py-20 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#ddd6cb] text-[#a9874a]">
                            <svg
                                viewBox="0 0 24 24"
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.3"
                            >
                                <path d="M6 7h12l1 13H5L6 7Z" />
                                <path d="M9 7a3 3 0 0 1 6 0" />
                            </svg>
                        </div>

                        <h2 className="mt-6 font-serif text-3xl">
                            No orders yet
                        </h2>

                        <p className="mt-3 text-sm text-[#77716a]">
                            Customer orders will appear here once purchases
                            are completed.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden border border-[#ded8cf] bg-white">
                        <div className="flex items-center justify-between border-b border-[#ded8cf] px-6 py-5">
                            <div>
                                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a9874a]">
                                    Order Catalogue
                                </p>
                                <h2 className="mt-1 font-serif text-2xl">
                                    Recent Orders
                                </h2>
                            </div>

                            <div className="hidden text-right sm:block">
                                <p className="text-[9px] uppercase tracking-[0.2em] text-[#918b83]">
                                    Records
                                </p>
                                <p className="mt-1 text-sm font-medium">
                                    {orders.length}
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1150px]">
                                <thead className="border-b border-[#e6e1d7] bg-[#faf9f6]">
                                    <tr>
                                        {[
                                            "Order",
                                            "Customer",
                                            "Date",
                                            "Items",
                                            "Payment",
                                            "Total",
                                            "Status",
                                            "Action",
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className={`px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83] ${
                                                    heading === "Action"
                                                        ? "text-right"
                                                        : "text-left"
                                                }`}
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {orders.map((order) => (
                                        <tr
                                            key={order.id}
                                            onClick={() =>
                                                navigate(`/admin/orders/${order.id}`)
                                            }
                                            className="group cursor-pointer border-b border-[#eeeae3] transition last:border-0 hover:bg-[#faf9f6]"
                                        >
                                            <td className="px-6 py-6">
                                                <p className="text-sm font-semibold tracking-wide">
                                                    {order.orderNumber || `Order ${order.id}`}
                                                </p>
                                                <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#aaa39a]">
                                                    #{order.id}
                                                </p>
                                            </td>

                                            <td className="px-6 py-6">
                                                <p className="text-sm font-medium">
                                                    {order.customer?.name ||
                                                        order.user?.name ||
                                                        "Customer"}
                                                </p>
                                                <p className="mt-1 text-xs text-[#918b83]">
                                                    {order.customer?.phone ||
                                                        order.user?.phone ||
                                                        "—"}
                                                </p>
                                            </td>

                                            <td className="px-6 py-6 text-sm text-[#5f5a54]">
                                                {formatDate(order.createdAt)}
                                            </td>

                                            <td className="px-6 py-6">
                                                <span className="inline-flex h-8 min-w-8 items-center justify-center border border-[#ddd6cb] px-2 text-xs">
                                                    {order.items?.length || 0}
                                                </span>
                                            </td>

                                            <td className="px-6 py-6">
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5f5a54]">
                                                    {order.paymentMethod || "COD"}
                                                </p>
                                            </td>

                                            <td className="px-6 py-6">
                                                <p className="text-sm font-semibold">
                                                    ₹{formatPrice(order.total)}
                                                </p>
                                            </td>

                                            <td className="px-6 py-6">
                                                <span
                                                    className={`inline-flex border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] ${getStatusClass(order.status)}`}
                                                >
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>

                                            <td
                                                className="px-6 py-6 text-right"
                                                onClick={(event) =>
                                                    event.stopPropagation()
                                                }
                                            >
                                                <button
                                                    onClick={() =>
                                                        navigate(`/admin/orders/${order.id}`)
                                                    }
                                                    className="inline-flex items-center gap-2 border border-[#d9d2c8] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.18em] transition hover:border-[#171717] hover:bg-[#171717] hover:text-white"
                                                >
                                                    View Details
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        className="h-3 w-3"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path d="M5 12h13" />
                                                        <path d="m13 6 6 6-6 6" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            <footer className="border-t border-[#ddd6cb] bg-[#f3efe7]">
                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                    <div className="flex flex-col justify-between gap-3 text-[9px] uppercase tracking-[0.2em] text-[#918b83] sm:flex-row">
                        <p>AURELIA Administration</p>
                        <p>Secure Order Management</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default AdminOrders;
