import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group">
      {/* Product Image */}
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[4/5] overflow-hidden bg-[#eeeae3]"
      >
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04] ${isOutOfStock ? "opacity-60" : ""
            }`}
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/5" />

        {/* Badge */}
        {product.badge && (
          <span className="absolute left-4 top-4 bg-white px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#292722]">
            {product.badge}
          </span>
        )}

        {/* Out of Stock */}
        {isOutOfStock && (
          <span className="absolute left-4 top-4 bg-[#171717] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
            Sold Out
          </span>
        )}

        {/* View Product */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-white/95 px-5 py-4 text-center transition duration-500 group-hover:translate-y-0">
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#171717]">
            View Details
          </span>
        </div>
      </Link>

      {/* Product Information */}
      <div className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            {/* Category */}
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a9874a]">
              {product.category}
            </p>

            {/* Product Name */}
            <Link to={`/product/${product.id}`}>
              <h3 className="mt-2 font-serif text-xl leading-tight text-[#171717] transition duration-300 group-hover:text-[#a9874a]">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Arrow */}
          <Link
            to={`/product/${product.id}`}
            aria-label={`View ${product.name}`}
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-[#ddd6cb] text-[#77716a] transition duration-300 group-hover:border-[#c6a15b] group-hover:bg-[#c6a15b] group-hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 12h13" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-medium tracking-wide text-[#292722]">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>

          {product.weight && (
            <p className="text-[9px] uppercase tracking-[0.18em] text-[#918b83]">
              {product.weight} g
            </p>
          )}
        </div>

        {/* Stock Indicator */}
        {product.stock > 0 && product.stock <= 3 && (
          <p className="mt-3 text-[9px] font-medium uppercase tracking-[0.18em] text-[#a9874a]">
            Only {product.stock} left
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductCard;

