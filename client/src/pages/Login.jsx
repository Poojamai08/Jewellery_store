import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const apiUrl = import.meta.env.VITE_API_URL;

            const response = await fetch(
                `${apiUrl}/api/auth/login`,
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
                setError(
                    data.message ||
                    "Invalid email or password."
                );
                return;
            }

            // Save authentication details
            localStorage.setItem(
                "aureliaToken",
                data.token
            );

            localStorage.setItem(
                "aureliaUser",
                JSON.stringify(data.user)
            );

            // Role based redirect
            if (data.user.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/home");
            }

        } catch (error) {
            console.error("Login error:", error);

            setError(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f5f0]">

            <div className="grid min-h-screen lg:grid-cols-2">

                {/* LEFT BRAND PANEL */}

                <div className="relative hidden overflow-hidden bg-[#171717] lg:flex lg:items-center lg:justify-center">

                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute left-[-120px] top-[-120px] h-[400px] w-[400px] rounded-full border border-[#d2b06d]" />
                        <div className="absolute bottom-[-180px] right-[-100px] h-[500px] w-[500px] rounded-full border border-[#d2b06d]" />
                    </div>

                    <div className="relative z-10 max-w-md px-10 text-center">

                        <p className="text-[10px] uppercase tracking-[0.45em] text-[#d2b06d]">
                            Fine Jewellery
                        </p>

                        <h1 className="mt-5 font-serif text-6xl tracking-[0.15em] text-white">
                            AURELIA
                        </h1>

                        <div className="mx-auto mt-8 h-px w-16 bg-[#d2b06d]" />

                        <p className="mt-8 text-sm leading-8 text-white/50">
                            Timeless pieces, refined details,
                            and jewellery designed to become
                            part of your story.
                        </p>

                    </div>
                </div>


                {/* LOGIN PANEL */}

                <div className="flex items-center justify-center px-6 py-12 sm:px-10">

                    <div className="w-full max-w-md">

                        {/* MOBILE LOGO */}

                        <div className="mb-12 text-center lg:hidden">

                            <Link
                                to="/"
                                className="font-serif text-3xl tracking-[0.15em] text-[#171717]"
                            >
                                AURELIA
                            </Link>

                            <p className="mt-2 text-[9px] uppercase tracking-[0.35em] text-[#b3945b]">
                                Fine Jewellery
                            </p>

                        </div>


                        {/* HEADING */}

                        <div className="text-center">

                            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#b3945b]">
                                Welcome Back
                            </p>

                            <h2 className="mt-4 font-serif text-4xl text-[#171717]">
                                Sign In
                            </h2>

                            <p className="mt-4 text-sm text-gray-500">
                                Enter your details to continue
                                to AURELIA.
                            </p>

                        </div>


                        {/* ERROR */}

                        {error && (
                            <div className="mt-8 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}


                        {/* FORM */}

                        <form
                            onSubmit={handleLogin}
                            className="mt-8 space-y-6"
                        >

                            {/* EMAIL */}

                            <div>

                                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="you@example.com"
                                    className="w-full border-b border-gray-300 bg-transparent px-1 py-3 text-sm outline-none transition focus:border-[#b3945b]"
                                />

                            </div>


                            {/* PASSWORD */}

                            <div>

                                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
                                    Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter your password"
                                        className="w-full border-b border-gray-300 bg-transparent px-1 py-3 pr-16 text-sm outline-none transition focus:border-[#b3945b]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-1 top-3 text-[9px] uppercase tracking-[0.15em] text-gray-500 hover:text-[#b3945b]"
                                    >
                                        {showPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                            </div>


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#171717] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Signing In..."
                                    : "Sign In"}
                            </button>

                        </form>


                        {/* REGISTER */}

                        <div className="mt-10 text-center">

                            <p className="text-sm text-gray-500">
                                Don't have an account?
                            </p>

                            <Link
                                to="/register"
                                className="mt-3 inline-block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9b7a3f] hover:text-[#171717]"
                            >
                                Create an Account
                            </Link>

                        </div>


                        {/* HOME */}

                        <div className="mt-8 text-center">

                            <Link
                                to="/"
                                className="text-[9px] uppercase tracking-[0.2em] text-gray-400 hover:text-gray-700"
                            >
                                ← Back to AURELIA
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;