import { Link, useLocation } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();

  const orderNumber = location.state?.orderNumber;
  const total = location.state?.total;

  return (
    <section className="min-h-[80vh] bg-[#f8f6f1] px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">

        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#c6a15b]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c6a15b]">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M5 12.5 9.5 17 19 7.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Eyebrow */}
        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#a9874a]">
          AURELIA JEWELLERY
        </p>

        {/* Heading */}
        <h1 className="mt-4 font-serif text-4xl leading-tight text-[#171717] sm:text-5xl">
          Thank You for Your Order
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#77716a]">
          Your order has been successfully placed. Thank you for choosing
          AURELIA. Your jewellery will soon begin its journey to you.
        </p>

        {/* Order Details Card */}
        <div className="mx-auto mt-12 max-w-lg border border-[#ded8ce] bg-white">

          {/* Card Header */}
          <div className="border-b border-[#e8e3db] px-6 py-5 text-left sm:px-8">
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#a9874a]">
              Order Confirmation
            </p>

            <h2 className="mt-2 font-serif text-2xl text-[#171717]">
              Your order is confirmed
            </h2>
          </div>

          {/* Order Number */}
          <div className="px-6 py-6 sm:px-8">

            <div className="flex items-center justify-between border-b border-[#eeeae3] pb-5">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#918b83]">
                Order Number
              </span>

              <span className="text-sm font-semibold tracking-wide text-[#171717]">
                {orderNumber || "Confirmed"}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between border-b border-[#eeeae3] py-5">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#918b83]">
                Order Status
              </span>

              <span className="flex items-center gap-2 text-sm font-medium text-[#292722]">
                <span className="h-2 w-2 rounded-full bg-[#a9874a]" />
                Confirmed
              </span>
            </div>

            {/* Payment */}
            <div className="flex items-center justify-between border-b border-[#eeeae3] py-5">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#918b83]">
                Payment
              </span>

              <span className="text-sm text-[#292722]">
                Cash on Delivery
              </span>
            </div>

            {/* Delivery */}
            <div className="flex items-center justify-between border-b border-[#eeeae3] py-5">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#918b83]">
                Delivery
              </span>

              <span className="text-sm text-[#292722]">
                Standard Delivery
              </span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#918b83]">
                Order Total
              </span>

              <span className="font-serif text-xl text-[#171717]">
                ₹
                {total
                  ? Number(total).toLocaleString("en-IN")
                  : "—"}
              </span>
            </div>

          </div>
        </div>

        {/* Delivery Message */}
        <div className="mx-auto mt-8 max-w-lg border border-[#ded8ce] bg-[#f3efe7] px-6 py-6">
          <div className="flex items-start gap-4 text-left">

            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center border border-[#c6a15b]">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-[#a9874a]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 7h11v10H3z" />
                <path d="M14 10h4l3 3v4h-7z" />
                <circle cx="7" cy="19" r="1.5" />
                <circle cx="18" cy="19" r="1.5" />
              </svg>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#171717]">
                Your jewellery is on its way
              </p>

              <p className="mt-2 text-xs leading-6 text-[#77716a]">
                We will carefully prepare and dispatch your order. You will
                receive delivery updates when your order progresses.
              </p>
            </div>

          </div>
        </div>

        {/* Buttons */}
        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            to="/shop"
            className="inline-flex items-center justify-center bg-[#171717] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-white transition duration-300 hover:bg-[#a9874a]"
          >
            Continue Shopping
          </Link>

          <Link
            to="/"
            className="inline-flex items-center justify-center border border-[#d7d0c6] bg-transparent px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#292722] transition duration-300 hover:border-[#171717]"
          >
            Back to Home
          </Link>

        </div>

        {/* Brand Statement */}
        <div className="mt-16">
          <div className="mx-auto h-px w-12 bg-[#c6a15b]" />

          <p className="mt-5 font-serif text-lg italic text-[#77716a]">
            Jewellery made to be remembered.
          </p>
        </div>

      </div>
    </section>
  );
}

export default OrderSuccess;