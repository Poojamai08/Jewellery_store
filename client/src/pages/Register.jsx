import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");

        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const apiUrl = import.meta.env.VITE_API_URL;

            const response = await fetch(
                `${apiUrl}/api/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to create your account."
                );
                return;
            }

            // Registration successful
            navigate("/login", {
                state: {
                    message:
                        "Account created successfully. Please sign in.",
                },
            });

        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

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


                {/* REGISTER FORM */}

                <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:order-1">

                    <div className="w-full max-w-md">

                        {/* MOBILE LOGO */}

                        <div className="mb-10 text-center lg:hidden">

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
                                Join AURELIA
                            </p>

                            <h2 className="mt-4 font-serif text-4xl text-[#171717]">
                                Create Account
                            </h2>

                            <p className="mt-4 text-sm text-gray-500">
                                Create your account and discover
                                the world of AURELIA.
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
                            onSubmit={handleRegister}
                            className="mt-8 space-y-5"
                        >

                            {/* NAME */}

                            <div>

                                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Your name"
                                    className="w-full border-b border-gray-300 bg-transparent px-1 py-3 text-sm outline-none transition focus:border-[#b3945b]"
                                />

                            </div>


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
                                        placeholder="Minimum 6 characters"
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


                            {/* CONFIRM PASSWORD */}

                            <div>

                                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
                                    Confirm Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Re-enter your password"
                                        className="w-full border-b border-gray-300 bg-transparent px-1 py-3 pr-16 text-sm outline-none transition focus:border-[#b3945b]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-1 top-3 text-[9px] uppercase tracking-[0.15em] text-gray-500 hover:text-[#b3945b]"
                                    >
                                        {showConfirmPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                            </div>


                            {/* REGISTER BUTTON */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-3 w-full bg-[#171717] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>

                        </form>


                        {/* LOGIN */}

                        <div className="mt-8 text-center">

                            <p className="text-sm text-gray-500">
                                Already have an account?
                            </p>

                            <Link
                                to="/login"
                                className="mt-3 inline-block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9b7a3f] hover:text-[#171717]"
                            >
                                Sign In
                            </Link>

                        </div>


                        <div className="mt-7 text-center">

                            <Link
                                to="/"
                                className="text-[9px] uppercase tracking-[0.2em] text-gray-400 hover:text-gray-700"
                            >
                                ← Back to AURELIA
                            </Link>

                        </div>

                    </div>

                </div>


                {/* BRAND PANEL */}

                <div className="relative hidden overflow-hidden bg-[#171717] lg:order-2 lg:flex lg:items-center lg:justify-center">

                    <div className="absolute inset-0 opacity-20">

                        <div className="absolute left-[-150px] top-[-100px] h-[420px] w-[420px] rounded-full border border-[#d2b06d]" />

                        <div className="absolute bottom-[-150px] right-[-100px] h-[500px] w-[500px] rounded-full border border-[#d2b06d]" />

                    </div>

                    <div className="relative z-10 max-w-md px-10 text-center">

                        <p className="text-[10px] uppercase tracking-[0.45em] text-[#d2b06d]">
                            Begin Your Journey
                        </p>

                        <h1 className="mt-5 font-serif text-6xl tracking-[0.15em] text-white">
                            AURELIA
                        </h1>

                        <div className="mx-auto mt-8 h-px w-16 bg-[#d2b06d]" />

                        <p className="mt-8 text-sm leading-8 text-white/50">
                            Discover jewellery created for
                            moments that deserve to be remembered.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;