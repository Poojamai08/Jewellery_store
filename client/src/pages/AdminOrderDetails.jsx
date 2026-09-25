import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AdminOrderDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("aureliaAdminToken");

        if (!token) {
            navigate("/admin/login");
            return;
        }

        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:5000/api/orders/admin/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch order"
                    );
                }

                setOrder(data.order);
            } catch (error) {
                console.error(
                    "Admin Order Details Error:",
                    error
                );

                setError(
                    error.message || "Unable to load order."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, navigate]);

    const handleStatusChange = async (newStatus) => {
        const token = localStorage.getItem("aureliaAdminToken");

        try {
            setUpdatingStatus(true);
            setError("");

            const response = await fetch(
                `http://localhost:5000/api/orders/admin/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update order status"
                );
            }

            setOrder((previousOrder) => ({
                ...previousOrder,
                status: newStatus,
            }));
        } catch (error) {
            console.error(
                "Update Order Status Error:",
                error
            );

            setError(
                error.message ||
                "Unable to update order status."
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("aureliaAdminToken");
        localStorage.removeItem("aureliaAdmin");

        navigate("/admin/login");
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString("en-IN");
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "DELIVERED":
                return "border-emerald-100 bg-emerald-50 text-emerald-700";

            case "SHIPPED":
                return "border-blue-100 bg-blue-50 text-blue-700";

            case "PROCESSING":
                return "border-amber-100 bg-amber-50 text-amber-700";

            case "CANCELLED":
                return "border-red-100 bg-red-50 text-red-700";

            case "CONFIRMED":
                return "border-purple-100 bg-purple-50 text-purple-700";

            default:
                return "border-gray-200 bg-gray-50 text-gray-600";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "CONFIRMED":
                return "Confirmed";

            case "PROCESSING":
                return "Processing";

            case "SHIPPED":
                return "Shipped";

            case "DELIVERED":
                return "Delivered";

            case "CANCELLED":
                return "Cancelled";

            default:
                return status || "Unknown";
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8f6f1]">

                <div className="text-center">

                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#ddd6cb] border-t-[#a9874a]" />

                    <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#918b83]">
                        Loading Order
                    </p>

                </div>

            </div>
        );
    }

    if (error && !order) {
        return (
            <div className="min-h-screen bg-[#f8f6f1]">

                <header className="border-b border-[#2a2a2a] bg-[#171717]">

                    <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">

                        <button
                            onClick={() =>
                                navigate("/admin/orders")
                            }
                            className="font-serif text-2xl tracking-[0.16em] text-white transition hover:text-[#c6a15b]"
                        >
                            AURELIA
                        </button>

                        <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.3em] text-[#c6a15b]">
                            Administration
                        </p>

                    </div>

                </header>

                <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

                    <div className="border border-red-200 bg-red-50 px-6 py-5">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-red-500">
                            Unable to load order
                        </p>

                        <p className="mt-2 text-sm text-red-600">
                            {error}
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate("/admin/orders")
                        }
                        className="mt-6 border border-[#d9d2c8] bg-white px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#292722] transition hover:border-[#171717] hover:bg-[#171717] hover:text-white"
                    >
                        ← Back to Orders
                    </button>

                </main>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f6f1] text-[#171717]">

            {/* HEADER */}

            <header className="border-b border-[#2a2a2a] bg-[#171717] text-white">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">

                    <div>

                        <button
                            onClick={() =>
                                navigate("/admin/dashboard")
                            }
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
                            onClick={() =>
                                navigate("/admin/orders")
                            }
                            className="hidden border border-white/20 px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#c6a15b] hover:text-[#c6a15b] sm:block"
                        >
                            Orders
                        </button>

                        <button
                            onClick={handleLogout}
                            className="border border-white/20 px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white hover:bg-white hover:text-[#171717]"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </header>


            {/* MAIN */}

            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">

                {/* BACK */}

                <button
                    onClick={() =>
                        navigate("/admin/orders")
                    }
                    className="mb-7 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a] transition hover:text-[#171717]"
                >
                    <span className="text-sm">←</span>
                    Back to Orders
                </button>


                {/* TITLE */}

                <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

                    <div>

                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
                            Order Details
                        </p>

                        <h1 className="mt-3 font-serif text-4xl leading-none text-[#171717] sm:text-5xl">
                            {order.orderNumber}
                        </h1>

                        <p className="mt-4 text-sm text-[#77716a]">
                            Placed on {formatDate(order.createdAt)}
                        </p>

                    </div>


                    {/* STATUS */}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                        <span
                            className={`inline-flex justify-center border px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.18em] ${getStatusClass(
                                order.status
                            )}`}
                        >
                            {getStatusLabel(order.status)}
                        </span>

                        <div className="relative">

                            <select
                                value={order.status}
                                onChange={(e) =>
                                    handleStatusChange(
                                        e.target.value
                                    )
                                }
                                disabled={updatingStatus}
                                className="min-w-[170px] appearance-none border border-[#d9d2c8] bg-white px-4 py-3 pr-9 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#292722] outline-none transition focus:border-[#171717] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="CONFIRMED">
                                    Confirmed
                                </option>

                                <option value="PROCESSING">
                                    Processing
                                </option>

                                <option value="SHIPPED">
                                    Shipped
                                </option>

                                <option value="DELIVERED">
                                    Delivered
                                </option>

                                <option value="CANCELLED">
                                    Cancelled
                                </option>
                            </select>

                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#77716a]">
                                ↓
                            </span>

                        </div>

                    </div>

                </div>


                {/* STATUS UPDATE MESSAGE */}

                {error && order && (

                    <div className="mb-6 border border-red-200 bg-red-50 px-5 py-4">

                        <p className="text-sm text-red-600">
                            {error}
                        </p>

                    </div>

                )}


                {/* ORDER META */}

                <div className="mb-6 grid gap-px border border-[#ded8cf] bg-[#ded8cf] sm:grid-cols-3">

                    <div className="bg-white px-6 py-6">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                            Order ID
                        </p>

                        <p className="mt-3 text-sm font-medium text-[#292722]">
                            #{order.id}
                        </p>

                    </div>

                    <div className="bg-white px-6 py-6">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                            Payment
                        </p>

                        <p className="mt-3 text-sm font-medium uppercase tracking-wide text-[#292722]">
                            {order.paymentMethod || "COD"}
                        </p>

                    </div>

                    <div className="bg-white px-6 py-6">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#918b83]">
                            Order Total
                        </p>

                        <p className="mt-3 text-sm font-semibold text-[#171717]">
                            ₹{formatPrice(order.total)}
                        </p>

                    </div>

                </div>


                {/* CUSTOMER + ADDRESS */}

                <div className="grid gap-6 lg:grid-cols-2">

                    {/* CUSTOMER */}

                    <section className="border border-[#ded8cf] bg-white">

                        <div className="border-b border-[#e6e1d7] px-6 py-5">

                            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a9874a]">
                                Customer
                            </p>

                            <h2 className="mt-2 font-serif text-2xl text-[#171717]">
                                {order.customer?.name ||
                                    "Customer"}
                            </h2>

                        </div>

                        <div className="space-y-5 px-6 py-6">

                            <div>

                                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                                    Phone
                                </p>

                                <p className="mt-2 text-sm text-[#292722]">
                                    {order.customer?.phone || "—"}
                                </p>

                            </div>

                            <div>

                                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                                    Email
                                </p>

                                <p className="mt-2 break-all text-sm text-[#292722]">
                                    {order.customer?.email || "—"}
                                </p>

                            </div>

                        </div>

                    </section>


                    {/* DELIVERY ADDRESS */}

                    <section className="border border-[#ded8cf] bg-white">

                        <div className="border-b border-[#e6e1d7] px-6 py-5">

                            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a9874a]">
                                Delivery
                            </p>

                            <h2 className="mt-2 font-serif text-2xl text-[#171717]">
                                Shipping Address
                            </h2>

                        </div>

                        <div className="px-6 py-6">

                            <div className="flex gap-4">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#ddd6cb] text-[#a9874a]">

                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                    >
                                        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
                                        <circle
                                            cx="12"
                                            cy="10"
                                            r="2.2"
                                        />
                                    </svg>

                                </div>

                                <div className="text-sm leading-7 text-[#5f5a54]">

                                    <p>
                                        {order.customer?.address ||
                                            "—"}
                                    </p>

                                    <p>
                                        {order.customer?.city || "—"},{" "}
                                        {order.customer?.state || "—"}
                                    </p>

                                    <p className="text-[#292722]">
                                        PIN:{" "}
                                        {order.customer?.pincode ||
                                            "—"}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>

                </div>


                {/* ORDER ITEMS */}

                <section className="mt-6 border border-[#ded8cf] bg-white">

                    <div className="flex items-center justify-between border-b border-[#e6e1d7] px-6 py-5">

                        <div>

                            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a9874a]">
                                Catalogue
                            </p>

                            <h2 className="mt-2 font-serif text-2xl text-[#171717]">
                                Order Items
                            </h2>

                        </div>

                        <p className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83] sm:block">
                            {order.items?.length || 0}{" "}
                            {order.items?.length === 1
                                ? "Item"
                                : "Items"}
                        </p>

                    </div>


                    <div className="divide-y divide-[#eeeae3]">

                        {order.items?.map((item) => (

                            <div
                                key={item.id}
                                className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center"
                            >

                                {/* IMAGE */}

                                <div className="h-24 w-24 shrink-0 overflow-hidden bg-[#eeeae3]">

                                    {item.image ? (

                                        <img
                                            src={item.image}
                                            alt={item.productName}
                                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                        />

                                    ) : (

                                        <div className="flex h-full items-center justify-center text-[9px] font-semibold uppercase tracking-[0.15em] text-[#aaa39a]">
                                            No Image
                                        </div>

                                    )}

                                </div>


                                {/* PRODUCT */}

                                <div className="flex-1">

                                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#a9874a]">
                                        Jewellery
                                    </p>

                                    <h3 className="mt-2 font-serif text-xl text-[#171717]">
                                        {item.productName}
                                    </h3>

                                    <p className="mt-2 text-xs text-[#77716a]">
                                        ₹{formatPrice(item.price)}{" "}
                                        × {item.quantity}
                                    </p>

                                </div>


                                {/* TOTAL */}

                                <div className="sm:text-right">

                                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#918b83]">
                                        Item Total
                                    </p>

                                    <p className="mt-2 text-base font-semibold text-[#171717]">
                                        ₹
                                        {formatPrice(
                                            Number(item.price) *
                                            Number(item.quantity)
                                        )}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </section>


                {/* PAYMENT + SUMMARY */}

                <div className="mt-6 grid gap-6 lg:grid-cols-2">

                    {/* PAYMENT */}

                    <section className="border border-[#ded8cf] bg-white">

                        <div className="border-b border-[#e6e1d7] px-6 py-5">

                            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a9874a]">
                                Payment
                            </p>

                            <h2 className="mt-2 font-serif text-2xl text-[#171717]">
                                Payment Information
                            </h2>

                        </div>

                        <div className="px-6 py-7">

                            <div className="flex items-center gap-4">

                                <div className="flex h-11 w-11 items-center justify-center border border-[#ddd6cb] text-[#a9874a]">

                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                    >
                                        <rect
                                            x="3"
                                            y="5"
                                            width="18"
                                            height="14"
                                            rx="1"
                                        />

                                        <path d="M3 10h18" />

                                        <path d="M7 15h4" />
                                    </svg>

                                </div>

                                <div>

                                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                                        Payment Method
                                    </p>

                                    <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-[#292722]">
                                        {order.paymentMethod ||
                                            "COD"}
                                    </p>

                                </div>

                            </div>

                            <div className="mt-7 border-t border-[#eeeae3] pt-5">

                                <p className="text-xs leading-6 text-[#77716a]">
                                    Payment status is managed according
                                    to the order fulfilment process.
                                </p>

                            </div>

                        </div>

                    </section>


                    {/* ORDER SUMMARY */}

                    <section className="border border-[#ded8cf] bg-white">

                        <div className="border-b border-[#e6e1d7] px-6 py-5">

                            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a9874a]">
                                Summary
                            </p>

                            <h2 className="mt-2 font-serif text-2xl text-[#171717]">
                                Order Summary
                            </h2>

                        </div>

                        <div className="px-6 py-7">

                            <div className="space-y-4 text-sm">

                                <div className="flex justify-between gap-6">

                                    <span className="text-[#77716a]">
                                        Subtotal
                                    </span>

                                    <span className="font-medium text-[#292722]">
                                        ₹
                                        {formatPrice(
                                            order.subtotal
                                        )}
                                    </span>

                                </div>


                                <div className="flex justify-between gap-6">

                                    <span className="text-[#77716a]">
                                        Shipping
                                    </span>

                                    <span className="font-medium text-[#292722]">
                                        ₹
                                        {formatPrice(
                                            order.shipping
                                        )}
                                    </span>

                                </div>


                                <div className="border-t border-[#ded8cf] pt-5">

                                    <div className="flex items-end justify-between gap-6">

                                        <div>

                                            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                                                Grand Total
                                            </p>

                                            <p className="mt-1 text-xs text-[#aaa39a]">
                                                Inclusive order value
                                            </p>

                                        </div>

                                        <p className="font-serif text-2xl text-[#171717]">
                                            ₹
                                            {formatPrice(
                                                order.total
                                            )}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>

                </div>


                {/* BOTTOM ACTION */}

                <div className="mt-8 flex flex-col justify-between gap-4 border-t border-[#ded8cf] pt-7 sm:flex-row sm:items-center">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                        AURELIA Order Management
                    </p>

                    <button
                        onClick={() =>
                            navigate("/admin/orders")
                        }
                        className="border border-[#d9d2c8] bg-white px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#292722] transition hover:border-[#171717] hover:bg-[#171717] hover:text-white"
                    >
                        Back to All Orders
                    </button>

                </div>

            </main>


            {/* FOOTER */}

            <footer className="border-t border-[#ddd6cb] bg-[#f3efe7]">

                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                    <div className="flex flex-col justify-between gap-3 text-[9px] uppercase tracking-[0.2em] text-[#918b83] sm:flex-row">

                        <p>
                            AURELIA Administration
                        </p>

                        <p>
                            Secure Order Management
                        </p>

                    </div>

                </div>

            </footer>

        </div>
    );
}

export default AdminOrderDetails;