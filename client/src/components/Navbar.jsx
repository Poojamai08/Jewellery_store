import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  // ======================================================
  // LIVE METAL RATES
  // ======================================================

  const [goldRate, setGoldRate] = useState(null);
  const [silverRate, setSilverRate] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // ======================================================
  // CART
  // ======================================================

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // ======================================================
  // WISHLIST
  // ======================================================

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const wishlistCount = wishlistItems.length;

  // ======================================================
  // ACTIVE NAVIGATION
  // ======================================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  // ======================================================
  // CLOSE MOBILE MENU
  // ======================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ======================================================
  // SEARCH
  // ======================================================

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchText.trim();

    if (!query) {
      navigate("/shop");
      setSearchOpen(false);
      return;
    }

    navigate(
      `/shop?search=${encodeURIComponent(query)}`
    );

    setSearchOpen(false);
  };

  const openSearch = () => {
    setSearchOpen(true);
    setMenuOpen(false);
  };

  // ======================================================
  // FETCH LIVE GOLD & SILVER RATES
  // ======================================================

  useEffect(() => {
    let isMounted = true;

    const fetchRates = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        if (!apiUrl) {
          console.error("VITE_API_URL is not configured");
          return;
        }

        const response = await fetch(
          `${apiUrl}/api/rates?t=${Date.now()}`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Rates API error: ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          "AURELIA latest metal rates:",
          data
        );

        if (!isMounted) {
          return;
        }

        setGoldRate(data.gold || null);
        setSilverRate(data.silver || null);

      } catch (error) {
        console.error(
          "Metal rate fetching error:",
          error
        );
      }
    };

    // Initial fetch
    fetchRates();

    // Refresh every 1 minute
    const rateInterval = setInterval(
      fetchRates,
      60 * 1000
    );

    return () => {
      isMounted = false;
      clearInterval(rateInterval);
    };
  }, []);

  // ======================================================
  // FORMAT RATE
  // ======================================================

  const formatRate = (rate) => {
    if (
      rate === null ||
      rate === undefined ||
      Number.isNaN(Number(rate))
    ) {
      return "Loading...";
    }

    return `₹${Number(rate).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}/g`;
  };

  // ======================================================
  // GOLD PURITY RATES
  // ======================================================

  const gold24K =
    goldRate?.k24 ?? null;

  const gold22K =
    goldRate?.k22 ?? null;

  const gold18K =
    goldRate?.k18 ?? null;

  const gold14K =
    goldRate?.k14 ?? null;

  // ======================================================
  // SILVER PURITY RATES
  // ======================================================

  const pureSilver =
    silverRate?.pure ?? null;

  const sterlingSilver =
    silverRate?.sterling ?? null;

  // ======================================================
  // TICKER CONTENT
  // ======================================================

  const tickerContent = (
    <>
      {/* MARKET UPDATE */}

      <span className="text-[9px] uppercase tracking-[0.18em] text-[#d6d0c6]">
        AURELIA MARKET UPDATE
      </span>

      {/* 24K GOLD */}

      <span className="text-[9px] uppercase tracking-[0.15em]">
        24K Gold

        <span className="ml-2 text-[#c9a96e]">
          {formatRate(gold24K)}
        </span>
      </span>

      <span className="text-[#5b5b5b]">
        •
      </span>

      {/* 22K GOLD */}

      <span className="text-[9px] uppercase tracking-[0.15em]">
        22K Gold

        <span className="ml-2 text-[#c9a96e]">
          {formatRate(gold22K)}
        </span>
      </span>

      <span className="text-[#5b5b5b]">
        •
      </span>

      {/* 18K GOLD */}

      <span className="text-[9px] uppercase tracking-[0.15em]">
        18K Gold

        <span className="ml-2 text-[#c9a96e]">
          {formatRate(gold18K)}
        </span>
      </span>

      <span className="text-[#5b5b5b]">
        •
      </span>

      {/* 14K GOLD */}

      <span className="text-[9px] uppercase tracking-[0.15em]">
        14K Gold

        <span className="ml-2 text-[#c9a96e]">
          {formatRate(gold14K)}
        </span>
      </span>

      <span className="text-[#5b5b5b]">
        •
      </span>

      {/* PURE SILVER */}

      <span className="text-[9px] uppercase tracking-[0.15em]">
        Pure Silver

        <span className="ml-2 text-[#c9a96e]">
          {formatRate(pureSilver)}
        </span>
      </span>

      <span className="text-[#5b5b5b]">
        •
      </span>

      {/* STERLING SILVER */}

      <span className="text-[9px] uppercase tracking-[0.15em]">
        Sterling Silver

        <span className="ml-2 text-[#c9a96e]">
          {formatRate(sterlingSilver)}
        </span>
      </span>

      <span className="text-[#5b5b5b]">
        •
      </span>

      {/* DISCLAIMER */}

      <span className="text-[9px] uppercase tracking-[0.15em] text-[#aaa39a]">
        Indicative market rate
      </span>
    </>
  );

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <header className="sticky top-0 z-50 border-b border-[#e6e1d7] bg-[#f8f6f1]/95 backdrop-blur-md">

      {/* ================================================= */}
      {/* LIVE GOLD & SILVER TICKER */}
      {/* ================================================= */}

      <div className="ticker-wrapper border-b border-[#2b2b2b] bg-[#111111] text-white">

        <div className="relative flex h-[30px] items-center overflow-hidden whitespace-nowrap">

          <div className="ticker-track flex min-w-max items-center">

            {/* FIRST GROUP */}

            <div className="flex items-center gap-12 px-6">
              {tickerContent}
            </div>

            {/* SECOND GROUP */}

            <div
              className="flex items-center gap-12 px-6"
              aria-hidden="true"
            >
              {tickerContent}
            </div>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* TOP BAR */}
      {/* ================================================= */}

      <div className="hidden border-b border-[#e6e1d7] bg-[#111111] py-2 text-center text-[9px] uppercase tracking-[0.3em] text-white sm:block">

        Complimentary shipping on orders above ₹10,000

      </div>

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">

        <div className="relative flex h-[76px] items-center justify-between">

          {/* MOBILE MENU BUTTON */}

          <button
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="flex h-10 w-10 items-center justify-center lg:hidden"
            aria-label="Toggle menu"
          >

            <div className="space-y-1.5">

              <span
                className={`block h-px w-5 bg-[#111111] transition ${
                  menuOpen
                    ? "translate-y-[4px] rotate-45"
                    : ""
                }`}
              />

              <span
                className={`block h-px w-5 bg-[#111111] transition ${
                  menuOpen
                    ? "-rotate-45"
                    : ""
                }`}
              />

            </div>

          </button>

          {/* DESKTOP NAVIGATION */}

          <nav className="hidden items-center gap-8 lg:flex">

            <Link
              to="/"
              className={`text-[10px] uppercase tracking-[0.2em] transition ${
                isActive("/")
                  ? "text-[#a9874a]"
                  : "text-[#333333] hover:text-[#a9874a]"
              }`}
            >
              Home
            </Link>

            <Link
              to="/shop"
              className={`text-[10px] uppercase tracking-[0.2em] transition ${
                isActive("/shop")
                  ? "text-[#a9874a]"
                  : "text-[#333333] hover:text-[#a9874a]"
              }`}
            >
              Shop
            </Link>

            <Link
              to="/shop"
              className="text-[10px] uppercase tracking-[0.2em] text-[#333333] transition hover:text-[#a9874a]"
            >
              Collections
            </Link>

            <Link
              to="/about"
              className="text-[10px] uppercase tracking-[0.2em] text-[#333333] transition hover:text-[#a9874a]"
            >
              About
            </Link>

          </nav>

          {/* LOGO */}

          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 text-center"
          >

            <span className="block font-serif text-[25px] tracking-[0.28em] text-[#111111] sm:text-[29px]">
              AURELIA
            </span>

            <span className="mt-0.5 block text-[7px] uppercase tracking-[0.48em] text-[#a9874a]">
              Fine Jewellery
            </span>

          </Link>

          {/* RIGHT ACTIONS */}

          <div className="flex items-center gap-1 sm:gap-3">

            {/* SEARCH */}

            <button
              onClick={openSearch}
              className="flex h-10 w-10 items-center justify-center transition hover:text-[#a9874a]"
              aria-label="Search"
            >

              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >

                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <path d="M20 20L16.5 16.5" />

              </svg>

            </button>

            {/* WISHLIST */}

            <Link
              to="/wishlist"
              className="relative hidden h-10 w-10 items-center justify-center transition hover:text-[#a9874a] sm:flex"
              aria-label="Wishlist"
            >

              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >

                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />

              </svg>

              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#111111] px-1 text-[8px] text-white">
                  {wishlistCount}
                </span>
              )}

            </Link>

            {/* CART */}

            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center transition hover:text-[#a9874a]"
              aria-label="Cart"
            >

              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >

                <path d="M6 8h12l1 13H5L6 8Z" />

                <path d="M9 8V6a3 3 0 0 1 6 0v2" />

              </svg>

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#111111] px-1 text-[8px] text-white">
                  {cartCount}
                </span>
              )}

            </Link>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* SEARCH PANEL */}
      {/* ================================================= */}

      <div
        className={`overflow-hidden border-t border-[#e6e1d7] bg-[#f8f6f1] transition-all duration-300 ${
          searchOpen
            ? "max-h-[150px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >

        <div className="mx-auto max-w-[900px] px-5 py-6 sm:px-8">

          <form
            onSubmit={handleSearch}
            className="flex items-center gap-3"
          >

            <div className="relative flex-1">

              <svg
                className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d877e]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >

                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <path d="M20 20L16.5 16.5" />

              </svg>

              <input
                autoFocus
                type="text"
                value={searchText}
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
                placeholder="Search jewellery..."
                className="w-full border-0 border-b border-[#cfc7bb] bg-transparent py-3 pl-7 pr-2 text-sm text-[#171717] outline-none transition focus:border-[#a9874a]"
              />

            </div>

            <button
              type="submit"
              className="bg-[#171717] px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#a9874a]"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchText("");
              }}
              className="px-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716a] transition hover:text-[#171717]"
            >
              Close
            </button>

          </form>

        </div>

      </div>

      {/* ================================================= */}
      {/* MOBILE MENU */}
      {/* ================================================= */}

      <div
        className={`overflow-hidden border-t border-[#e6e1d7] bg-[#f8f6f1] transition-all duration-300 lg:hidden ${
          menuOpen
            ? "max-h-[400px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >

        <nav className="mx-auto max-w-[1400px] px-5 py-5">

          <div className="flex flex-col">

            <Link
              to="/"
              onClick={closeMenu}
              className="border-b border-[#e6e1d7] py-4 text-[11px] uppercase tracking-[0.2em]"
            >
              Home
            </Link>

            <Link
              to="/shop"
              onClick={closeMenu}
              className="border-b border-[#e6e1d7] py-4 text-[11px] uppercase tracking-[0.2em]"
            >
              Shop
            </Link>

            <Link
              to="/shop"
              onClick={closeMenu}
              className="border-b border-[#e6e1d7] py-4 text-[11px] uppercase tracking-[0.2em]"
            >
              Collections
            </Link>

            <Link
              to="/about"
              onClick={closeMenu}
              className="border-b border-[#e6e1d7] py-4 text-[11px] uppercase tracking-[0.2em]"
            >
              About
            </Link>

            <button
              onClick={openSearch}
              className="border-b border-[#e6e1d7] py-4 text-left text-[11px] uppercase tracking-[0.2em]"
            >
              Search
            </button>

            <Link
              to="/cart"
              onClick={closeMenu}
              className="py-4 text-[11px] uppercase tracking-[0.2em]"
            >
              Cart

              {cartCount > 0 &&
                ` (${cartCount})`}
            </Link>

          </div>

        </nav>

      </div>

    </header>
  );
}

export default Navbar;
