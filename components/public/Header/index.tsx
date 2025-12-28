"use client";

import Image from "next/image";
import Link from "next/link";

const HeaderPublic = () => {
  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Book a Call", href: "/book-a-call" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];
  return (
    <div className="absolute left-0 top-0 z-20 w-full">
      {/* Header Top Area */}
      <div className="bg-transparent py-4">
        <div className="container-expand">
          <div className="flex items-center gap-x-6 lg:gap-x-10 xl:gap-x-[76px]">
            {/* Header Logo */}
            <Link href="/" className="inline-flex">
              <Image
                src="/assets/img/logo.jpeg"
                alt="logo"
                width={90}
                height={22}
                priority
              />
            </Link>

            {/* Header Right Block */}
            <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-9">
              {/* Category & Search Block */}
              <div className="relative hidden w-full flex-1 rounded-[50px] border bg-white py-3.5 pr-8 text-sm font-medium md:flex xl:pr-36">
                <div className="flex w-full divide-[#B8B8B8] lg:divide-x">
                  {/* Category Block */}
                  <div className="relative hidden lg:inline-block">
                    <button className="flex items-center gap-x-6 px-8 text-sm font-medium">
                      All Categories
                      <Image
                        src="/assets/img/icons/icon-small-gray-chevron-arrow-down.svg"
                        alt=""
                        width={10}
                        height={6}
                      />
                    </button>

                    <ul className="category-menu absolute left-0 top-[calc(100%+20px)] z-20 hidden min-w-[250px] divide-y divide-[#f6f6f6] rounded-lg bg-white px-4 shadow-sm">
                      {[
                        "Business",
                        "Marketing",
                        "Design",
                        "Finance",
                        "Lifestyle",
                        "Cyber",
                        "Development",
                        "Photography",
                      ].map((item, i) => (
                        <li key={item} className="py-2.5">
                          <a
                            href="#"
                            className="flex items-center gap-x-3 hover:text-colorBlackPearl"
                          >
                            <Image
                              src={`/assets/img/icons/category-icon-${
                                i + 1
                              }.svg`}
                              alt={item}
                              width={20}
                              height={20}
                            />
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Search */}
                  <form className="w-full flex-1 px-8">
                    <input
                      type="search"
                      placeholder="Search your courses"
                      className="w-full bg-transparent outline-none placeholder:text-colorBlackPearl/55"
                    />
                    <button
                      type="submit"
                      className="absolute bottom-[5px] right-0 top-[5px] mr-[5px] inline-flex items-center justify-center gap-x-2.5 rounded-[50px] bg-colorPurpleBlue px-6 text-sm text-white hover:bg-colorBlackPearl"
                    >
                      <span className="hidden xl:inline-block">Search</span>
                      <Image
                        src="/assets/img/icons/icon-white-search-line.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
                    </button>
                  </form>
                </div>
              </div>

              {/* Social Links */}
              <div className="hidden items-center gap-x-3.5 xl:flex">
                {["facebook", "twitter", "dribbble", "instagram"].map((s) => (
                  <a
                    key={s}
                    href={`https://www.${s}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={`/assets/img/icons/icon-dark-${s}.svg`}
                      alt={s}
                      width={17}
                      height={17}
                    />
                  </a>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center gap-x-2.5">
                <Link href="/register">
                  <button className="hidden h-10 rounded-[50Px] bg-colorBrightGold px-6 text-sm font-medium text-colorBlackPearl hover:shadow sm:inline-block">
                    Register
                  </button>
                </Link>
                <Link href="/login">
                  <button className="h-10 rounded-[50Px] bg-gradient-to-t from-[#D7E1D8] to-white px-6 text-sm font-medium text-colorBlackPearl hover:shadow">
                    Log In
                  </button>
                </Link>
                {/* Mobile Menu */}
                <div className="site-header inline-block lg:hidden">
                  <button className="hamburger-menu mobile-menu-trigger">
                    <span className="bg-colorBlackPearl before:bg-colorBlackPearl after:bg-colorBlackPearl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Bottom Area */}
      <header className="site-header bg-white shadow-[0_4px_30px_16px] shadow-[#070229]/5">
        <div className="container-expand">
          <div className="flex justify-between text-sm font-medium text-[#263238]">
            {/* Navigation */}
            <nav className="menu-block">
              <ul className="site-menu-main">
                {menuItems.map((item) => (
                  <li
                    key={item.label}
                    className="nav-item nav-item-has-children"
                  >
                    <Link
                      href={item.href}
                      className="nav-link-item drop-trigger text-colorBlackPearl"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right */}
            <div className="flex items-center gap-x-5">
              <button className="relative">
                <Image
                  src="/assets/img/icons/icon-grey-bag.svg"
                  alt=""
                  width={21}
                  height={21}
                />
                <span className="absolute left-2 top-full -translate-y-3 rounded-full bg-colorPurpleBlue px-1.5 text-xs text-white">
                  3
                </span>
              </button>
              <button>
                <Image
                  src="/assets/img/icons/icon-grey-menu-3-line.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default HeaderPublic;
