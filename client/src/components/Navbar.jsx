import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [goldRates, setGoldRates] = useState(null);
  const [silverRates, setSilverRates] = useState(null);

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
  // NAVIGATION
  // ======================================================

  const isActive = (path) =>
    location.pathname === path;


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
  // LIVE METAL RATES
  // ======================================================

  useEffect(() => {

    let isMounted = true;


    const fetchRates = async () => {

      try {

        const apiUrl =
          import.meta.env.VITE_API_URL;


        if (!apiUrl) {
          console.error(
            "VITE_API_URL is not configured"
          );

          return;
        }


        const response = await fetch(
          `${apiUrl}/api/rates`
        );


        if (!response.ok) {
          throw new Error(
            `Rates API error: ${response.status}`
          );
        }


        const data = await response.json();


        console.log(
          "AURELIA live metal rates:",
          data
        );


        if (!isMounted) return;


        // New API structure
        if (data.gold) {
          setGoldRates(data.gold);
        }


        if (data.silver) {
          setSilverRates(data.silver);
        }

      } catch (error) {

        console.error(
          "Metal rate fetching error:",
          error
        );

      }
    };


    // Fetch immediately
    fetchRates();


    // Refresh every 5 minutes
    const rateInterval = setInterval(
      fetchRates,
      5 * 60 * 1000
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
  // DIRECT RATES FROM BACKEND
  // ======================================================

  const gold24K =
    goldRates?.k24 ?? null;

  const gold22K =
    goldRates?.k22 ?? null;

  const gold18K =
    goldRates?.k18 ?? null;

  const gold14K =
    goldRates?.k14 ?? null;


  const pureSilver =
    silverRates?.pure ?? null;

  const sterlingSilver =
    silverRates?.sterling ?? null;


  // ======================================================
  // TICKER DATA
  // ======================================================

  const tickerItems = [
    `24K GOLD ${formatRate(gold24K)}`,
    `22K GOLD ${formatRate(gold22K)}`,
    `18K GOLD ${formatRate(gold18K)}`,
    `14K GOLD ${formatRate(gold14K)}`,
    `PURE SILVER ${formatRate(pureSilver)}`,
    `STERLING SILVER ${formatRate(sterlingSilver)}`,
  ];


  return (
    <>
      {/* ==================================================
          TOP RATE TICKER
      ================================================== */}

      <div className="bg-black text-white overflow-hidden">

        <div className="flex items-center whitespace-nowrap">

          <div className="flex animate-marquee gap-10 py-2 text-[11px] tracking-[0.18em]">

            {tickerItems.map(
              (item, index) => (
                <span key={index}>
                  {item}
                </span>
              )
            )}

          </div>

        </div>

      </div>


      {/* ==================================================
          MAIN NAVBAR
      ================================================== */}

      <nav className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">


            {/* ==================================================
                LOGO
            ================================================== */}

            <Link
              to="/"
              className="flex flex-col leading-none"
              onClick={closeMenu}
            >

              <span className="text-2xl sm:text-3xl font-serif tracking-[0.25em] font-semibold">
                AURELIA
              </span>

              <span className="text-[8px] sm:text-[9px] tracking-[0.35em] text-gray-500 text-center mt-1">
                FINE JEWELLERY
              </span>

            </Link>


            {/* ==================================================
                DESKTOP MENU
            ================================================== */}

            <div className="hidden lg:flex items-center gap-8">

              <Link
                to="/"
                className={`text-sm tracking-wide transition ${isActive("/")
                    ? "text-black font-medium"
                    : "text-gray-600 hover:text-black"
                  }`}
              >
                HOME
              </Link>


              <Link
                to="/shop"
                className={`text-sm tracking-wide transition ${isActive("/shop")
                    ? "text-black font-medium"
                    : "text-gray-600 hover:text-black"
                  }`}
              >
                SHOP
              </Link>


              <Link
                to="/collections"
                className={`text-sm tracking-wide transition ${isActive("/collections")
                    ? "text-black font-medium"
                    : "text-gray-600 hover:text-black"
                  }`}
              >
                COLLECTIONS
              </Link>


              <Link
                to="/about"
                className={`text-sm tracking-wide transition ${isActive("/about")
                    ? "text-black font-medium"
                    : "text-gray-600 hover:text-black"
                  }`}
              >
                ABOUT
              </Link>


              <Link
                to="/contact"
                className={`text-sm tracking-wide transition ${isActive("/contact")
                    ? "text-black font-medium"
                    : "text-gray-600 hover:text-black"
                  }`}
              >
                CONTACT
              </Link>

            </div>


            {/* ==================================================
                RIGHT ICONS
            ================================================== */}

            <div className="flex items-center gap-4">


              {/* SEARCH */}

              <button
                type="button"
                onClick={openSearch}
                className="text-gray-700 hover:text-black transition"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>


              {/* WISHLIST */}

              <Link
                to="/wishlist"
                className="relative text-gray-700 hover:text-black transition"
                aria-label="Wishlist"
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.8 8.6c0 5.4-8.8 10.4-8.8 10.4S3.2 14 3.2 8.6A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.4Z" />
                </svg>


                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-black text-white text-[9px] flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}

              </Link>


              {/* CART */}

              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-black transition"
                aria-label="Cart"
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle
                    cx="9"
                    cy="20"
                    r="1"
                  />

                  <circle
                    cx="19"
                    cy="20"
                    r="1"
                  />

                  <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
                </svg>


                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-black text-white text-[9px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}

              </Link>


              {/* MOBILE MENU */}

              <button
                type="button"
                onClick={() =>
                  setMenuOpen((prev) => !prev)
                }
                className="lg:hidden text-gray-700 hover:text-black"
                aria-label="Menu"
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {menuOpen ? (
                    <>
                      <path d="M6 6l12 12" />
                      <path d="M18 6 6 18" />
                    </>
                  ) : (
                    <>
                      <path d="M4 7h16" />
                      <path d="M4 12h16" />
                      <path d="M4 17h16" />
                    </>
                  )}
                </svg>

              </button>

            </div>

          </div>


          {/* ==================================================
              MOBILE MENU
          ================================================== */}

          {menuOpen && (

            <div className="lg:hidden border-t border-gray-100 py-5">

              <div className="flex flex-col gap-5">

                <Link
                  to="/"
                  onClick={closeMenu}
                  className="text-sm tracking-widest"
                >
                  HOME
                </Link>

                <Link
                  to="/shop"
                  onClick={closeMenu}
                  className="text-sm tracking-widest"
                >
                  SHOP
                </Link>

                <Link
                  to="/collections"
                  onClick={closeMenu}
                  className="text-sm tracking-widest"
                >
                  COLLECTIONS
                </Link>

                <Link
                  to="/about"
                  onClick={closeMenu}
                  className="text-sm tracking-widest"
                >
                  ABOUT
                </Link>

                <Link
                  to="/contact"
                  onClick={closeMenu}
                  className="text-sm tracking-widest"
                >
                  CONTACT
                </Link>

              </div>

            </div>

          )}

        </div>

      </nav>


      {/* ==================================================
          SEARCH OVERLAY
      ================================================== */}

      {searchOpen && (

        <div className="fixed inset-0 z-50 bg-black/40">

          <div className="bg-white shadow-xl">

            <div className="max-w-4xl mx-auto px-5 py-6">

              <div className="flex items-center justify-between mb-5">

                <h2 className="text-lg tracking-widest">
                  SEARCH AURELIA
                </h2>


                <button
                  type="button"
                  onClick={() =>
                    setSearchOpen(false)
                  }
                  className="text-gray-500 hover:text-black text-2xl"
                  aria-label="Close search"
                >
                  ×
                </button>

              </div>


              <form
                onSubmit={handleSearch}
                className="flex items-center border-b border-black"
              >

                <input
                  type="text"
                  value={searchText}
                  onChange={(e) =>
                    setSearchText(e.target.value)
                  }
                  autoFocus
                  placeholder="Search jewellery..."
                  className="flex-1 py-3 outline-none text-base"
                />


                <button
                  type="submit"
                  className="px-4 py-3 text-sm tracking-widest"
                >
                  SEARCH
                </button>

              </form>

            </div>

          </div>

        </div>

      )}

    </>
  );
}

export default Navbar;