export default function BlogDetailLoading() {
  return (
    <div className="relative">
      {/* Breadcrumb Skeleton */}
      <section className="section-breadcrum">
        <div className="relative z-10 overflow-hidden bg-[#FAF9F6]">
          <div className="py-[60px] lg:py-[90px]">
            <div className="container">
              <div className="text-center">
                <div className="mb-5 h-10 w-64 mx-auto bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 w-48 mx-auto bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="section-course">
        <div className="bg-white pb-44">
          <div className="section-space">
            <div className="container">
              <div className="grid grid-cols-1 gap-x-[30px] gap-y-10 lg:grid-cols-[1fr_minmax(0,360px)]">
                {/* Main Content Skeleton */}
                <div className="jos">
                  <div className="h-[439px] bg-gray-200 animate-pulse rounded-lg mb-7"></div>
                  <div className="flex gap-9 mb-6">
                    <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>

                {/* Sidebar Skeleton */}
                <aside className="jos">
                  <div className="rounded-lg bg-[#f5f5f5] px-[30px] py-6">
                    <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-7"></div>
                    <div className="space-y-4">
                      <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
