"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { addAllSubjectsToCart } from "@/lib/actions/cart";
import { toast } from "react-toastify";

const OfferBanner = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchaseNow = async () => {
    // Check authentication
    if (status === "unauthenticated") {
      // Redirect to login with intent to purchase all subjects
      router.push("/login?purchaseAll=true");
      return;
    }

    if (status === "loading") {
      return;
    }

    setIsLoading(true);

    try {
      const result = await addAllSubjectsToCart();

      if (result.success) {
        toast.success(result.message);
        router.push("/learner/cart");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error adding all subjects to cart:", error);
      toast.error("Failed to add subjects to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="container">
        <div
          className="relative z-10 grid grid-cols-1 items-center overflow-hidden rounded-lg bg-[#1a365d] lg:grid-cols-2 lg:gap-14"
          data-aos="fade-up"
          style={{
            backgroundImage: "radial-gradient(#4c6ae6 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        >

          {/* Image */}
          <div className="relative order-2 p-4 lg:order-1 lg:p-12" data-aos="fade-right" data-aos-delay="100">
            <Image
              src="/assets/img/images/nca-bundle-offer.png"
              alt="NCA bundle"
              width={507}
              height={448}
              className="h-auto w-full rounded-lg"
            />
          </div>

          {/* Content */}
          <div className="order-1 px-6 py-12 sm:px-10 lg:order-2 lg:px-0 xl:py-[90px]" data-aos="fade-left" data-aos-delay="100">
            <div className="max-w-[530px]">
              <div>
                <span className="mb-5 block uppercase text-colorBrightGold">
                  NCA BUNDLE DEAL
                </span>
                <h2 className="text-white">
                  All 6 NCA Courses for $1,500 CAD
                </h2>
              </div>

              <p className="mb-[30px] mt-7 text-white/80">
                Complete NCA exam preparation with video lectures, notes, and
                question banks — all in one bundle. Save $300.
              </p>

              <p className="mb-[30px] text-white/80">
                Ontario Bar Bundles: Solicitor (4 subjects) – $900 CAD | Barrister
                (5 subjects) – $1,000 CAD
              </p>

              <div className="inline-block">
                <button
                  onClick={handlePurchaseNow}
                  disabled={isLoading || status === "loading"}
                  className="btn btn-secondary is-icon group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Adding to Cart..." : "Purchase Now"}
                  <span className="btn-icon bg-colorBlackPearl group-hover:right-0 group-hover:translate-x-full">
                    <Image
                      src="/assets/img/icons/icon-golden-yellow-arrow-right.svg"
                      alt="arrow"
                      width={13}
                      height={12}
                    />
                  </span>
                  <span className="btn-icon bg-colorBlackPearl group-hover:left-[5px] group-hover:translate-x-0">
                    <Image
                      src="/assets/img/icons/icon-golden-yellow-arrow-right.svg"
                      alt="arrow"
                      width={13}
                      height={12}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Background Abstracts */}
          <Image
            src="/assets/img/abstracts/abstract-golden-yellow-dash-2.svg"
            alt="abstract"
            width={44}
            height={37}
            className="absolute left-[400px] top-16 -z-10"
          />
          <Image
            src="/assets/img/abstracts/curve-1.svg"
            alt="curve"
            width={155}
            height={155}
            className="absolute left-6 top-14 z-10 hidden lg:inline-block"
          />
          <Image
            src="/assets/img/abstracts/abstract-dots-4-white.svg"
            alt="dots"
            width={108}
            height={67}
            className="absolute bottom-0 right-0 -z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;
