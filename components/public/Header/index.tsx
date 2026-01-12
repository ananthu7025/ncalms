"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard } from "lucide-react";

const HeaderPublic = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Book a Call", href: "/book-a-call" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/courses');
    }
  };

  return (
    <div
      style={{ backgroundColor: "#ffff" }}
      className="absolute left-0 top-0 z-20 w-full">
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

                  {/* Search */}
                  <form className="w-full flex-1 px-8" onSubmit={handleSearch}>
                    <input
                      type="search"
                      placeholder="Search your courses"
                      className="w-full bg-transparent outline-none placeholder:text-colorBlackPearl/55"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                {["facebook", "twitter", "dribbble", "instagram"].map((s, index) => (
                  <a
                    key={`social-${s}-${index}`}
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
                {session?.user ? (
                  <Link href="/learner/dashboard">
                    <button
                      className="flex h-10 items-center gap-x-2 rounded-[50Px] bg-colorBrightGold px-6 text-sm font-medium text-colorBlackPearl hover:shadow"
                      aria-label="Dashboard"
                    >
                      <LayoutDashboard size={18} />
                      <span className="hidden sm:inline-block">Dashboard</span>
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <button className="hidden h-10 rounded-[50Px] bg-colorBrightGold px-6 text-sm font-medium text-colorBlackPearl hover:shadow sm:inline-block">
                        Register
                      </button>
                    </Link>
                    <Link href="/login">
                      <button className="h-10 rounded-[50Px] bg-colorBrightGold px-6 text-sm font-medium text-colorBlackPearl hover:shadow">
                        Log In
                      </button>
                    </Link>
                  </>
                )}
                {/* Mobile Menu */}
                <div className="site-header inline-block lg:hidden">
                  <button
                    className={`hamburger-menu mobile-menu-trigger ${isMobileMenuOpen ? 'active' : ''}`}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                  >
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
          <div className="flex justify-center text-sm font-medium text-[#263238]">

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
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleMobileMenu}
        >
          <div
            className="absolute right-0 top-0 h-full w-[280px] bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col p-6">
              <button
                onClick={toggleMobileMenu}
                className="mb-6 self-end text-2xl text-colorBlackPearl"
                aria-label="Close menu"
              >
                ×
              </button>
              <nav>
                <ul className="space-y-4">
                  {menuItems.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="block py-2 text-base font-medium text-colorBlackPearl hover:text-colorPurpleBlue"
                        onClick={toggleMobileMenu}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-6 space-y-2">
                {session?.user ? (
                  <Link href="/learner/dashboard" onClick={toggleMobileMenu}>
                    <button className="flex w-full items-center justify-center gap-x-2 rounded-[50px] bg-colorBrightGold px-6 py-2.5 text-sm font-medium text-colorBlackPearl hover:shadow">
                      <LayoutDashboard size={18} />
                      Dashboard
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register" onClick={toggleMobileMenu}>
                      <button className="w-full rounded-[50px] bg-colorBrightGold px-6 py-2.5 text-sm font-medium text-colorBlackPearl hover:shadow">
                        Register
                      </button>
                    </Link>
                    <Link href="/login" onClick={toggleMobileMenu}>
                      <button className="w-full rounded-[50px] bg-colorBrightGold px-6 py-2.5 text-sm font-medium text-colorBlackPearl hover:shadow">
                        Log In
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderPublic;
