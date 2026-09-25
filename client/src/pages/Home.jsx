import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  /* =========================================
     HERO IMAGES
     These are separate from Shop/Product images
  ========================================= */

  const heroImages = [
    "https://images.unsplash.com/photo-1511745564573-fec5d8b7e907?auto=format&fit=crop&w=2200&q=90",
    "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=2200&q=90",
    "https://images.unsplash.com/photo-1581000217146-03f3a628d19a?auto=format&fit=crop&w=2200&q=90",
    "https://images.unsplash.com/photo-1603970402494-f97dac5a9b53?auto=format&fit=crop&w=2200&q=90",
  ];

  const [heroImage, setHeroImage] = useState(heroImages[0]);

  /* =========================================
     LIVE METAL RATES
  ========================================= */

  const [goldRate, setGoldRate] = useState(null);
  const [silverRate, setSilverRate] = useState(null);
  const [rateLoading, setRateLoading] = useState(true);

  /* =========================================
     SHOP CATEGORIES
     These images remain separate from HERO
  ========================================= */

  const categories = [
    {
      name: "Necklaces",
      subtitle: "Statement pieces",
      image:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85",
    },
    {
      name: "Earrings",
      subtitle: "Refined brilliance",
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85",
    },
    {
      name: "Rings",
      subtitle: "Made to treasure",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85",
    },
    {
      name: "Bracelets",
      subtitle: "Quiet luxury",
      image:
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=85",
    },
  ];

  /* =========================================
     AUTOMATIC HERO IMAGE CHANGE
     Every 5 seconds
  ========================================= */

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setHeroImage((currentImage) => {
        const currentIndex = heroImages.indexOf(currentImage);

        const nextIndex =
          currentIndex === -1
            ? 0
            : (currentIndex + 1) % heroImages.length;

        return heroImages[nextIndex];
      });
    }, 5000);

    return () => clearInterval(imageInterval);
  }, []);

  /* =========================================
     FETCH GOLD & SILVER RATES
  ========================================= */

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setRateLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/rates`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch metal rates");
        }

        const data = await response.json();

        setGoldRate(data.gold);
        setSilverRate(data.silver);
      } catch (error) {
        console.error("Metal rate fetching error:", error);
      } finally {
        setRateLoading(false);
      }
    };

    fetchRates();

    // Refresh rates every 5 minutes
    const rateInterval = setInterval(
      fetchRates,
      5 * 60 * 1000
    );

    return () => clearInterval(rateInterval);
  }, []);

  return (
    <div className="bg-[#f8f6f1] text-[#171717]">

      {/* =========================================
          HERO
      ========================================= */}

      <section className="relative min-h-[calc(100vh-100px)] overflow-hidden bg-black">

        <img
          src={heroImage}
          alt="Aurelia luxury jewellery collection"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] max-w-[1500px] items-end px-6 pb-16 sm:px-10 lg:px-16 lg:pb-20">

          <div className="max-w-3xl text-white">

            <div className="mb-7 flex items-center gap-4">

              <span className="h-px w-12 bg-[#d2b06d]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.45em] text-[#e4d2a7]">
                The Aurelia Collection
              </span>

            </div>

            <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[0.95] tracking-[-0.02em] sm:text-6xl md:text-7xl lg:text-[92px]">

              Jewellery
              <br />

              with a lasting
              <br />

              <span className="italic text-[#e1c994]">
                presence.
              </span>

            </h1>

            <p className="mt-8 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
              Thoughtfully crafted pieces designed to become part of
              your story — today, tomorrow, and for generations to come.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-6">

              <Link
                to="/shop"
                className="inline-flex bg-white px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-black transition duration-300 hover:bg-[#d2b06d] hover:text-white"
              >
                Shop Jewellery
              </Link>

              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white"
              >
                Explore Collection

                <span className="h-px w-8 bg-white transition-all duration-300 group-hover:w-12" />
              </Link>

            </div>

          </div>

        </div>

        <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-white/60 lg:flex">

          <span className="text-[9px] uppercase tracking-[0.3em]">
            Scroll to discover
          </span>

          <span className="h-px w-8 bg-white/40" />

        </div>

      </section>

      {/* =========================================
          INTRO
      ========================================= */}

      <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">

        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[1fr_2fr] lg:items-end">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#a9874a]">
              A new expression of luxury
            </p>

            <div className="mt-6 h-px w-14 bg-[#c6a15b]" />

          </div>

          <div>

            <h2 className="max-w-4xl font-serif text-4xl leading-[1.12] sm:text-5xl lg:text-6xl">

              Pieces created for the moments

              <span className="italic text-[#a9874a]">
                {" "}that matter.
              </span>

            </h2>

            <p className="mt-7 max-w-2xl text-sm leading-8 text-[#66615a]">
              Aurelia brings together timeless silhouettes, considered
              details and modern craftsmanship to create jewellery that
              feels personal, elegant and enduring.
            </p>

          </div>

        </div>

      </section>


      {/* =========================================
          CATEGORY GRID
      ========================================= */}

      <section className="border-y border-[#e5dfd5] bg-[#f3efe7] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">

        <div className="mx-auto max-w-[1300px]">

          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#a9874a]">
                Collections
              </p>

              <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
                Find your signature
              </h2>

            </div>

            <Link
              to="/shop"
              className="group flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em]"
            >
              View all

              <span className="h-px w-7 bg-black transition-all duration-300 group-hover:w-11" />

            </Link>

          </div>


          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {categories.map((category) => (

              <Link
                key={category.name}
                to="/shop"
                className="group relative aspect-[3/4] overflow-hidden bg-[#ddd]"
              >

                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 text-white">

                  <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-white/70">
                    {category.subtitle}
                  </p>

                  <h3 className="font-serif text-3xl">
                    {category.name}
                  </h3>

                  <div className="mt-4 flex items-center gap-3 text-[9px] uppercase tracking-[0.25em]">

                    Discover

                    <span className="h-px w-6 bg-white transition-all duration-300 group-hover:w-10" />

                  </div>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================
          EDITORIAL STORY
      ========================================= */}

      <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">

        <div className="mx-auto grid max-w-[1300px] overflow-hidden bg-[#171717] lg:grid-cols-2">

          <div className="relative min-h-[500px] lg:min-h-[650px]">

            <img
              src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1400&q=85"
              alt="Aurelia craftsmanship"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/15" />

          </div>


          <div className="flex items-center px-8 py-16 text-white sm:px-12 lg:px-16">

            <div className="max-w-lg">

              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d2b06d]">
                The Aurelia Philosophy
              </p>

              <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">

                Made slowly.

                <br />

                <span className="italic text-[#d2b06d]">
                  Made to last.
                </span>

              </h2>

              <p className="mt-7 text-sm leading-8 text-white/65">
                We believe jewellery should never feel temporary.
                Every piece is selected for its timeless character,
                refined design and ability to become part of the
                memories you carry with you.
              </p>

              <Link
                to="/about"
                className="group mt-9 inline-flex items-center gap-4 border-b border-white/30 pb-3 text-[10px] font-semibold uppercase tracking-[0.25em] transition hover:border-[#d2b06d]"
              >

                Discover our story

                <span className="h-px w-7 bg-[#d2b06d] transition-all duration-300 group-hover:w-11" />

              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          STATEMENT
      ========================================= */}

      <section className="border-y border-[#e5dfd5] px-6 py-24 text-center sm:px-10 lg:py-32">

        <div className="mx-auto max-w-4xl">

          <span className="font-serif text-5xl text-[#c6a15b]">
            “
          </span>

          <h2 className="mt-2 font-serif text-3xl leading-[1.25] sm:text-4xl lg:text-5xl">

            The most beautiful jewellery

            <br className="hidden sm:block" />

            is the kind that becomes

            <span className="italic text-[#a9874a]">
              {" "}yours.
            </span>

          </h2>

          <div className="mx-auto mt-8 h-px w-10 bg-[#c6a15b]" />

          <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.4em] text-[#88837c]">
            Aurelia
          </p>

        </div>

      </section>


      {/* =========================================
          NEWSLETTER
      ========================================= */}

      <section className="bg-[#e9e3d9] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">

        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-2 lg:items-end">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#a9874a]">
              Stay in the know
            </p>

            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
              Enter the world of Aurelia.
            </h2>

          </div>

          <div>

            <p className="mb-6 text-sm leading-7 text-[#68635c]">
              Receive new collection launches, jewellery stories and
              private offers directly in your inbox.
            </p>

            <div className="flex border-b border-[#8e877d]">

              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-transparent px-0 py-4 text-sm text-black placeholder:text-[#8e877d] focus:outline-none"
              />

              <button
                type="button"
                className="whitespace-nowrap px-0 py-4 text-[10px] font-semibold uppercase tracking-[0.25em]"
              >
                Subscribe
              </button>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;