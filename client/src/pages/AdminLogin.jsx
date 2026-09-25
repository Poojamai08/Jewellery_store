import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            // Save token
            localStorage.setItem(
                "aureliaAdminToken",
                data.token
            );

            // Save admin information
            localStorage.setItem(
                "aureliaAdmin",
                JSON.stringify(data.admin)
            );

            navigate("/admin/dashboard");

        } catch (error) {
            console.error("Admin Login Error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f6]">

            <div className="flex min-h-screen items-center justify-center px-6">

                <div className="w-full max-w-md">

                    {/* Logo */}
                    <div className="mb-10 text-center">

                        <h1 className="font-serif text-4xl tracking-[0.15em]">
                            AURELIA
                        </h1>

                        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[#a67c3d]">
                            Admin Portal
                        </p>

                    </div>

                    {/* Login Card */}
                    <div className="border border-gray-200 bg-white p-8 shadow-sm sm:p-10">

                        <h2 className="font-serif text-3xl">
                            Admin Login
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Sign in to manage your jewellery store.
                        </p>

                        {/* Error */}
                        {error && (
                            <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="mt-8 space-y-6"
                        >

                            {/* Email */}
                            <div>

                                <label className="text-xs uppercase tracking-widest text-gray-500">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="admin@aurelia.com"
                                    required
                                    className="mt-2 w-full border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#a67c3d]"
                                />

                            </div>

                            {/* Password */}
                            <div>

                                <label className="text-xs uppercase tracking-widest text-gray-500">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Enter your password"
                                    required
                                    className="mt-2 w-full border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#a67c3d]"
                                />

                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#1c1a17] px-6 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-[#a67c3d] disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                                {loading
                                    ? "Signing In..."
                                    : "Sign In"}
                            </button>

                        </form>

                    </div>

                    {/* Back to Store */}
                    <div className="mt-6 text-center">

                        <button
                            onClick={() => navigate("/")}
                            className="text-xs uppercase tracking-widest text-gray-500 hover:text-black"
                        >
                            ← Back to Store
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminLogin;