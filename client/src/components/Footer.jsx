import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

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

      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

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

      setMessage(data.message || "Successfully subscribed!");
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
              Discover new collections, timeless pieces and stories
              from AURELIA.
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
                  aria-label="Your email address"
                  autoComplete="email"
                  required
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
                <p
                  role="status"
                  className="mt-4 text-xs text-[#c6a15b]"
                >
                  {message}
                </p>
              )}

              {error && (
                <p
                  role="alert"
                  className="mt-4 text-xs text-red-400"
                >
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
            <Link to="/" className="inline-block">
              <span className="block font-serif text-3xl tracking-[0.25em]">
                AURELIA
              </span>

              <span className="mt-1 block text-[7px] uppercase tracking-[0.45em] text-[#c6a15b]">
                Fine Jewellery
              </span>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-white/45">
              Jewellery designed to celebrate life's most beautiful
              moments.
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
                className="block text-sm text-white/60 transition hover:text-[#c6a15b]"
              >
                Contact Us
              </Link>

              <Link
                to="/shipping-delivery"
                className="block text-sm text-white/60 transition hover:text-[#c6a15b]"
              >
                Shipping & Delivery
              </Link>

              <Link
                to="/return-exchange"
                className="block text-sm text-white/60 transition hover:text-[#c6a15b]"
              >
                Returns & Exchange
              </Link>

              <Link
                to="/jewellery-care"
                className="block text-sm text-white/60 transition hover:text-[#c6a15b]"
              >
                Jewellery Care
              </Link>

              <Link
                to="/faq"
                className="block text-sm text-white/60 transition hover:text-[#c6a15b]"
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
              <p className="leading-6">
                Monday – Saturday
                <br />
                10:00 AM – 7:00 PM
              </p>

              {/* EMAIL - OPENS GMAIL COMPOSE */}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=poojamai8499%40gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email AURELIA through Gmail"
                className="group flex items-start gap-3 transition hover:text-[#c6a15b]"
              >
                <Mail
                  size={17}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-[#c6a15b] transition group-hover:scale-110"
                />

                <span className="break-all">
                  poojamai8499@gmail.com
                </span>
              </a>

              {/* PHONE - OPENS CALLING APPLICATION */}
              <a
                href="tel:+919384116088"
                aria-label="Call AURELIA at +91 93841 16088"
                className="group flex items-center gap-3 transition hover:text-[#c6a15b]"
              >
                <Phone
                  size={17}
                  strokeWidth={1.5}
                  className="shrink-0 text-[#c6a15b] transition group-hover:scale-110"
                />

                <span>+91 93841 16088</span>
              </a>
            </div>

            {/* SOCIAL LINKS */}
            <div className="mt-6 flex gap-5">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[9px] uppercase tracking-[0.2em] text-white/50 transition hover:text-[#c6a15b]"
              >
                Instagram
              </a>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[9px] uppercase tracking-[0.2em] text-white/50 transition hover:text-[#c6a15b]"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-6 text-center sm:px-8 md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
            © {new Date().getFullYear()} AURELIA. All rights reserved.
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