"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard } from "lucide-react";

const HeaderPublic = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
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
    <header
      className="absolute left-0 top-0 z-20 w-full bg-white shadow-[0_4px_30px_16px] shadow-[#070229]/5">
      <div className="py-2">
        <div className="container-expand">
          <div className="flex items-center gap-x-4 lg:gap-x-8 justify-between">
            {/* Header Logo */}
            <Link href="/" className="inline-flex flex-shrink-0">
              <Image
                src="/assets/img/logo.jpeg"
                alt="logo"
                width={80}
                height={20}
                priority
              />
            </Link>

            {/* Navigation - Moved from bottom */}
            <div className="hidden md:flex ml-4 lg:ml-8 flex-shrink-0">
              <nav>
                <ul className="flex items-center gap-x-2 text-sm font-semibold text-[#263238] whitespace-nowrap">
                  {menuItems.map((item) => {
                    const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                    return (
                      <li
                        key={item.label}
                        className="relative"
                      >
                        <Link
                          href={item.href}
                          className={`px-4 py-2 rounded-full transition-all duration-300 block ${isActive
                            ? "bg-gray-100/80 text-colorPurpleBlue"
                            : "hover:bg-gray-100/80 hover:text-colorPurpleBlue"
                            }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Header Right Block */}
            <div className="flex flex-1 items-center justify-end gap-x-4">
              {/* Category & Search Block */}
              <div className="relative hidden w-full max-w-[300px] xl:max-w-[400px] rounded-[50px] border bg-white py-2.5 pr-2 text-sm font-medium md:flex">
                <div className="flex w-full divide-[#B8B8B8]">

                  {/* Search */}
                  <form className="w-full flex-1 px-4" onSubmit={handleSearch}>
                    <input
                      type="search"
                      placeholder="Search courses..."
                      className="w-full bg-transparent outline-none placeholder:text-colorBlackPearl/55"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="absolute bottom-[2px] right-[2px] top-[2px] inline-flex items-center justify-center gap-x-2.5 rounded-[50px] bg-colorPurpleBlue px-4 text-sm text-white hover:bg-colorBlackPearl"
                    >
                      <Image
                        src="/assets/img/icons/icon-white-search-line.svg"
                        alt=""
                        width={14}
                        height={14}
                      />
                    </button>
                  </form>
                </div>
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
                  <Link href="/login">
                    <button className="h-10 rounded-[50Px] bg-colorBrightGold px-6 text-sm font-medium text-colorBlackPearl hover:shadow">
                      Login
                    </button>
                  </Link>
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
                  {menuItems.map((item) => {
                    const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className={`block py-2 text-base font-medium transition-colors ${isActive
                            ? "text-colorPurpleBlue"
                            : "text-colorBlackPearl hover:text-colorPurpleBlue"
                            }`}
                          onClick={toggleMobileMenu}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
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
    </header>
  );
};

export default HeaderPublic;
