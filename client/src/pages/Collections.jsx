import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function Collections() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        console.error("Fetch Collections Error:", error);
        setError(
          "Unable to load collections. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /*
    Create collections automatically from products.

    Example:

    Products:
    Necklace A → Necklaces
    Necklace B → Necklaces
    Ring A     → Rings
    Earring A  → Earrings

    Result:

    Necklaces
    Rings
    Earrings
  */

  const collections = useMemo(() => {
    const collectionMap = {};

    products.forEach((product) => {
      const category = product.category?.trim();

      if (!category) return;

      if (!collectionMap[category]) {
        collectionMap[category] = {
          name: category,
          image: product.image,
          count: 0,
        };
      }

      collectionMap[category].count += 1;
    });

    return Object.values(collectionMap);
  }, [products]);

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
              Aurelia
            </p>

            <span className="h-px w-10 bg-[#c6a15b]" />

          </div>

          <h1 className="mt-6 font-serif text-5xl leading-none tracking-[-0.02em] sm:text-6xl lg:text-7xl">
            Collections
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-[#6d6861]">
            Explore our jewellery collections, thoughtfully curated
            for every style, occasion and story.
          </p>

        </div>

      </section>


      {/* =========================================
          COLLECTIONS
      ========================================= */}

      <section className="mx-auto max-w-[1400px] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">

        {/* Loading */}

        {loading && (
          <div className="flex min-h-[400px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto mb-5 h-px w-12 bg-[#c6a15b]" />

              <p className="font-serif text-2xl">
                Curating collections
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#918b83]">
                Please wait
              </p>

            </div>

          </div>
        )}


        {/* Error */}

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


        {/* Collection count */}

        {!loading && !error && collections.length > 0 && (
          <div className="mb-10 flex items-end justify-between border-b border-[#ded8ce] pb-6">

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#8c867e]">
                Explore
              </p>

              <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
                Find your signature
              </h2>

            </div>

            <p className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8c867e] sm:block">
              {collections.length}{" "}
              {collections.length === 1
                ? "Collection"
                : "Collections"}
            </p>

          </div>
        )}


        {/* Collection Grid */}

        {!loading &&
          !error &&
          collections.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {collections.map((collection) => (

                <Link
                  key={collection.name}
                  to={`/shop?category=${encodeURIComponent(
                    collection.name
                  )}`}
                  className="group relative aspect-[4/5] overflow-hidden bg-[#ddd]"
                >

                  {/* Image */}

                  <img
                    src={collection.image}
                    alt={`${collection.name} jewellery collection`}
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Overlay */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                  {/* Content */}

                  <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-8">

                    <p className="mb-3 text-[9px] uppercase tracking-[0.3em] text-white/65">
                      {collection.count}{" "}
                      {collection.count === 1
                        ? "Piece"
                        : "Pieces"}
                    </p>

                    <h3 className="font-serif text-4xl sm:text-5xl">
                      {collection.name}
                    </h3>

                    <div className="mt-5 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.25em]">

                      Explore collection

                      <span className="h-px w-7 bg-white transition-all duration-300 group-hover:w-12" />

                    </div>

                  </div>

                </Link>

              ))}

            </div>
          )}


        {/* No collections */}

        {!loading &&
          !error &&
          collections.length === 0 && (
            <div className="flex min-h-[400px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto mb-6 h-px w-12 bg-[#c6a15b]" />

                <h2 className="font-serif text-4xl">
                  Collections coming soon
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#77716a]">
                  Add jewellery products with a category to
                  start building your collections.
                </p>

                <Link
                  to="/shop"
                  className="mt-7 inline-flex bg-[#171717] px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#a9874a]"
                >
                  View Jewellery
                </Link>

              </div>

            </div>
          )}

      </section>

    </div>
  );
}

export default Collections;