import Breadcrumb from "@/components/public/Breadcrumb";
import Link from "next/link";

export default function BookingSuccessPage() {
  return (
    <>
      <Breadcrumb
        title="Booking Confirmed"
        items={[
          { label: "Home", href: "/" },
          { label: "Book a Session", href: "/book-a-call" },
          { label: "Success" },
        ]}
      />

      <section className="section-success bg-white pb-44">
        <div className="section-space">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              {/* Success Icon */}
              <div className="mb-8 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-12 w-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <h1 className="mb-6 text-4xl font-bold text-colorBlackPearl md:text-5xl">
                Booking Confirmed!
              </h1>
              <p className="mb-8 text-lg text-colorBlackPearl/70">
                Thank you for booking a personal session with us. Your payment has been processed successfully.
              </p>

              {/* Next Steps */}
              <div className="mb-12 rounded-lg bg-purple-50 p-8 text-left">
                <h2 className="mb-4 text-2xl font-semibold text-colorBlackPearl">
                  What Happens Next?
                </h2>
                <ul className="space-y-3 text-colorBlackPearl/70">
                  <li className="flex items-start">
                    <svg
                      className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      You will receive a confirmation email with your booking details at the email address you provided.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      Our team will contact you via WhatsApp within 24 hours to schedule your session at a convenient time.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      Once confirmed, you&apos;ll receive a Zoom meeting link and any necessary preparation materials.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      The session recording will be shared with you via your Gmail ID after the session is completed.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/"
                  className="btn btn-primary is-icon group"
                >
                  Back to Home
                  <span className="btn-icon bg-white group-hover:right-0 group-hover:translate-x-full">
                    <img
                      src="/assets/img/icons/icon-purple-arrow-right.svg"
                      alt="arrow"
                      width="13"
                      height="12"
                    />
                  </span>
                  <span className="btn-icon bg-white group-hover:left-[5px] group-hover:translate-x-0">
                    <img
                      src="/assets/img/icons/icon-purple-arrow-right.svg"
                      alt="arrow"
                      width="13"
                      height="12"
                    />
                  </span>
                </Link>
                <Link
                  href="/courses"
                  className="btn btn-outline is-icon group"
                >
                  Browse Courses
                  <span className="btn-icon bg-colorPurple group-hover:right-0 group-hover:translate-x-full">
                    <img
                      src="/assets/img/icons/icon-white-arrow-right.svg"
                      alt="arrow"
                      width="13"
                      height="12"
                    />
                  </span>
                  <span className="btn-icon bg-colorPurple group-hover:left-[5px] group-hover:translate-x-0">
                    <img
                      src="/assets/img/icons/icon-white-arrow-right.svg"
                      alt="arrow"
                      width="13"
                      height="12"
                    />
                  </span>
                </Link>
              </div>

              {/* Support */}
              <div className="mt-12 rounded-lg border border-colorBlackPearl/10 bg-gray-50 p-6">
                <h3 className="mb-2 font-semibold text-colorBlackPearl">
                  Need Help?
                </h3>
                <p className="text-sm text-colorBlackPearl/70">
                  If you have any questions or need to reschedule, please contact us at{" "}
                  <a href="mailto:support@nca-lms.com" className="text-purple-600 hover:underline">
                    support@nca-lms.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
