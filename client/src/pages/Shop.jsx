import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================
     DYNAMIC CATEGORIES
     Categories are created from available products
  ========================================= */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category?.trim())
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  /* =========================================
     FETCH PRODUCTS
  ========================================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch products"
          );
        }

        const formattedProducts = data.products.map((product) => ({
          ...product,
          price: Number(product.price),
          weight: product.weight
            ? Number(product.weight)
            : null,
          image:
            product.images?.[0] ||
            "https://via.placeholder.com/900",
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Fetch Products Error:", error);
        setError(
          "Unable to load jewellery. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* =========================================
     SYNC URL → CATEGORY + SEARCH
  ========================================= */

  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlSearch = searchParams.get("search");

    setCategory(urlCategory || "All");
    setSearch(urlSearch || "");
  }, [searchParams]);

  /* =========================================
     FILTER + SORT PRODUCTS
  ========================================= */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /* Category */

    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category?.trim() === category
      );
    }

    /* Search */

    if (search.trim()) {
      result = result.filter((product) =>
        product.name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    /* Sort */

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [products, category, sort, search]);

  /* =========================================
     CATEGORY CLICK
  ========================================= */

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);

    const params = new URLSearchParams(searchParams);

    if (newCategory === "All") {
      params.delete("category");
    } else {
      params.set("category", newCategory);
    }

    setSearchParams(params);
  };

  /* =========================================
     CLEAR SEARCH
  ========================================= */

  const handleClearSearch = () => {
    setSearch("");

    const params = new URLSearchParams(searchParams);
    params.delete("search");

    setSearchParams(params);
  };

  /* =========================================
     VIEW ALL
  ========================================= */

  const handleViewAll = () => {
    setCategory("All");
    setSearch("");

    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#f8f6f1] text-[#171717]">

      {/* =========================================
          PAGE HERO
      ========================================= */}

      <section className="border-b border-[#e4ded4] bg-[#eee9e1]">

        <div className="mx-auto max-w-[1400px] px-6 py-20 text-center sm:px-10 lg:px-16 lg:py-28">

          <div className="mx-auto flex items-center justify-center gap-4">

            <span className="h-px w-10 bg-[#c6a15b]" />

            <p className="text-[9px] font-semibold uppercase tracking-[0.45em] text-[#a9874a]">
              The Aurelia Collection
            </p>

            <span className="h-px w-10 bg-[#c6a15b]" />

          </div>

          <h1 className="mt-6 font-serif text-5xl leading-none tracking-[-0.02em] sm:text-6xl lg:text-7xl">
            Jewellery
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-[#6d6861]">
            Discover timeless pieces designed with intention,
            crafted with detail and made to become part of your story.
          </p>

        </div>

      </section>


      {/* =========================================
          SHOP CONTENT
      ========================================= */}

      <section className="mx-auto max-w-[1400px] px-6 py-14 sm:px-10 lg:px-16 lg:py-20">

        {/* Top controls */}

        <div className="border-b border-[#ded8ce] pb-7">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            {/* Categories */}

            <div>

              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.35em] text-[#8c867e]">
                Browse by category
              </p>

              <div className="flex flex-wrap gap-x-7 gap-y-3">

                {categories.map((item) => (

                  <button
                    key={item}
                    onClick={() => handleCategoryChange(item)}
                    className={`relative pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${category === item
                        ? "text-[#171717]"
                        : "text-[#8b857d] hover:text-[#171717]"
                      }`}
                  >

                    {item}

                    {category === item && (
                      <span className="absolute bottom-0 left-0 h-px w-full bg-[#c6a15b]" />
                    )}

                  </button>

                ))}

              </div>

            </div>


            {/* Search + Sort */}

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="relative">

                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d877e]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  type="text"
                  placeholder="Search jewellery"
                  value={search}
                  onChange={(e) => {
                    const value = e.target.value;

                    setSearch(value);

                    const params = new URLSearchParams(
                      searchParams
                    );

                    if (value.trim()) {
                      params.set("search", value);
                    } else {
                      params.delete("search");
                    }

                    setSearchParams(params);
                  }}
                  className="w-full border border-[#d9d2c8] bg-transparent py-3 pl-10 pr-4 text-xs text-[#171717] placeholder:text-[#9a948b] focus:border-[#c6a15b] focus:outline-none sm:w-[230px]"
                />

              </div>


              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-[#d9d2c8] bg-[#f8f6f1] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4e4a45] focus:border-[#c6a15b] focus:outline-none"
              >

                <option value="featured">
                  Featured
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="name">
                  Name
                </option>

              </select>

            </div>

          </div>

        </div>


        {/* Product count */}

        {!loading && !error && (

          <div className="flex items-center justify-between py-7">

            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#88827a]">

              {filteredProducts.length}{" "}

              {filteredProducts.length === 1
                ? "Piece"
                : "Pieces"}

            </p>


            {search && (

              <button
                onClick={handleClearSearch}
                className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#a9874a] hover:text-[#171717]"
              >
                Clear search
              </button>

            )}

          </div>

        )}


        {/* =========================================
            LOADING
        ========================================= */}

        {loading && (

          <div className="flex min-h-[400px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto mb-5 h-px w-12 bg-[#c6a15b]" />

              <p className="font-serif text-2xl">
                Curating your collection
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#918b83]">
                Please wait
              </p>

            </div>

          </div>

        )}


        {/* =========================================
            ERROR
        ========================================= */}

        {!loading && error && (

          <div className="flex min-h-[400px] items-center justify-center">

            <div className="max-w-md text-center">

              <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#a9874a]">
                A little interruption
              </p>

              <h2 className="mt-4 font-serif text-4xl">
                Something went wrong
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#77716a]">
                {error}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-7 bg-[#171717] px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#a9874a]"
              >
                Try Again
              </button>

            </div>

          </div>

        )}


        {/* =========================================
            PRODUCTS
        ========================================= */}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (

            <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">

              {filteredProducts.map((product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))}

            </div>

          )}


        {/* =========================================
            EMPTY STATE
        ========================================= */}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (

            <div className="flex min-h-[400px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto mb-6 h-px w-12 bg-[#c6a15b]" />

                <h2 className="font-serif text-4xl">
                  Nothing found
                </h2>

                <p className="mt-4 text-sm text-[#77716a]">
                  Try another search or explore a different category.
                </p>

                <button
                  onClick={handleViewAll}
                  className="mt-7 border-b border-[#171717] pb-2 text-[9px] font-semibold uppercase tracking-[0.25em]"
                >
                  View all jewellery
                </button>

              </div>

            </div>

          )}

      </section>

    </div>
  );
}

export default Shop;
