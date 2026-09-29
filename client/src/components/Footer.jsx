import { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const subscriberEmail = email.trim();

    if (!subscriberEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(
        `${apiUrl}/api/newsletter/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: subscriberEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to subscribe."
        );
      }

      setMessage(data.message);
      setEmail("");
    } catch (err) {
      console.error("Newsletter subscription error:", err);

      setError(
        err.message ||
        "Unable to subscribe right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#111111] text-white">

      {/* NEWSLETTER */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">

            <p className="text-[9px] uppercase tracking-[0.35em] text-[#c6a15b]">
              The AURELIA Journal
            </p>

            <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
              Stay close to the sparkle
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/50">
              Discover new collections, timeless pieces and stories from AURELIA.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="mx-auto mt-8 max-w-md"
            >
              <div className="flex border-b border-white/30">

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  disabled={loading}
                  className="min-w-0 flex-1 bg-transparent px-0 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="px-2 text-[9px] uppercase tracking-[0.2em] text-[#c6a15b] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Joining..." : "Subscribe"}
                </button>

              </div>

              {message && (
                <p className="mt-4 text-xs text-[#c6a15b]">
                  {message}
                </p>
              )}

              {error && (
                <p className="mt-4 text-xs text-red-400">
                  {error}
                </p>
              )}
            </form>

          </div>
        </div>
      </section>


      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-[1400px] px-6 py-14 sm:px-8 lg:py-16">

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div className="lg:pr-10">

            <Link
              to="/"
              className="inline-block"
            >
              <span className="block font-serif text-3xl tracking-[0.25em]">
                AURELIA
              </span>

              <span className="mt-1 block text-[7px] uppercase tracking-[0.45em] text-[#c6a15b]">
                Fine Jewellery
              </span>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-white/45">
              Jewellery designed to celebrate life's most beautiful moments.
            </p>

          </div>


          {/* SHOP */}
          <div>

            <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#c6a15b]">
              Shop
            </h3>

            <div className="mt-5 space-y-3">

              <Link
                to="/shop"
                className="block text-sm text-white/60 transition hover:text-white"
              >
                All Jewellery
              </Link>

              <Link
                to="/shop?category=Necklaces"
                className="block text-sm text-white/60 transition hover:text-white"
              >
                Necklaces
              </Link>

              <Link
                to="/shop?category=Earrings"
                className="block text-sm text-white/60 transition hover:text-white"
              >
                Earrings
              </Link>

              <Link
                to="/shop?category=Rings"
                className="block text-sm text-white/60 transition hover:text-white"
              >
                Rings
              </Link>

              <Link
                to="/shop?category=Bracelets"
                className="block text-sm text-white/60 transition hover:text-white"
              >
                Bracelets
              </Link>

            </div>

          </div>


          {/* CUSTOMER CARE */}
          <div>

            <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#c6a15b]">
              Customer Care
            </h3>

            <div className="mt-5 space-y-3">

              <Link
                to="/contact"
                className="block text-sm text-white/60 transition hover:text-white"
              >
                Contact Us
              </Link>

              <Link
                to="/shipping-delivery"
                className="block text-sm text-white/60 transition hover:text-white"
              >
                Shipping & Delivery
              </Link>

              <Link
                to="/return-exchange"
                className="block text-sm text-white/60 transition hover:text-white"
              >
                Returns & Exchange
              </Link>

              <Link
                to="/"
                className="block text-sm text-white/60 transition hover:text-white"
              >
                Jewellery Care
              </Link>

              <Link
                to="/"
                className="block text-sm text-white/60 transition hover:text-white"
              >
                FAQs
              </Link>

            </div>

          </div>


          {/* CONTACT */}
          <div>

            <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#c6a15b]">
              Contact
            </h3>

            <div className="mt-5 space-y-4 text-sm text-white/60">

              <p>
                Monday – Saturday
                <br />
                10:00 AM – 7:00 PM
              </p>

              <p>
                hello@aurelia.com
              </p>

              <p>
                +91 00000 00000
              </p>

            </div>

            {/* SOCIAL */}
            <div className="mt-6 flex gap-5">

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[9px] uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
              >
                Instagram
              </a>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[9px] uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
              >
                Facebook
              </a>

            </div>

          </div>

        </div>

      </div>


      {/* BOTTOM */}
      <div className="border-t border-white/10">

        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-6 text-center sm:px-8 md:flex-row md:items-center md:justify-between md:text-left">

          <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
            © 2026 AURELIA. All rights reserved.
          </p>

          <div className="flex justify-center gap-6 text-[9px] uppercase tracking-[0.2em] text-white/30">

            <Link
              to="/privacy"
              className="transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="transition hover:text-white"
            >
              Terms
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;