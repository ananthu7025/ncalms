import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="relative">
      {/* Breadcrumb Section */}
      <section className="section-breadcrum">
        <div className="relative z-10 overflow-hidden bg-[#FAF9F6]">
          <div className="py-[60px] lg:py-[90px]">
            <div className="container">
              <div className="text-center">
                <h1 className="mb-5 text-4xl capitalize tracking-normal">
                  Blog Not Found
                </h1>
                <nav className="text-base font-medium uppercase">
                  <ul className="flex justify-center">
                    <li className="relative has-[a]:text-colorJasper has-[a]:after:text-colorCarbonGrey has-[a]:after:content-['/']">
                      <Link href="/">HOME</Link>
                    </li>
                    <li>404</li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute -left-48 top-0 -z-10 h-[327px] w-[371px] bg-[#BFC06F] blur-[250px]"></div>
          <div className="absolute -right-36 bottom-20 -z-10 h-[327px] w-[371px] bg-[#AAC3E9] blur-[200px]"></div>
        </div>
      </section>

      {/* 404 Content */}
      <section className="section-course">
        <div className="bg-white pb-44">
          <div className="section-space">
            <div className="container">
              <div className="mx-auto max-w-2xl text-center">
                <div className="mb-8">
                  <h2 className="mb-4 text-6xl font-bold text-colorBlackPearl">
                    404
                  </h2>
                  <h3 className="mb-4 text-2xl font-semibold text-colorBlackPearl">
                    Blog Post Not Found
                  </h3>
                  <p className="text-gray-600 mb-8">
                    The blog post you are looking for might have been removed,
                    had its name changed, or is temporarily unavailable.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-x-2 rounded-[50px] bg-colorPurpleBlue px-8 py-4 font-medium text-white hover:bg-colorBlackPearl transition-colors"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
