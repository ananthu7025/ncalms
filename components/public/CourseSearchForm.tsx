"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CourseSearchFormProps {
  initialQuery?: string;
}

export default function CourseSearchForm({ initialQuery = "" }: CourseSearchFormProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const router = useRouter();

  // Update local state when URL changes
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/courses');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative flex items-center">
        <input
          type="search"
          placeholder="Search your courses"
          className="w-full rounded-[50px] border px-8 py-3.5 pr-36 text-sm font-medium outline-none placeholder:text-colorBlackPearl/55"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute bottom-[5px] right-0 top-[5px] mr-[5px] inline-flex items-center justify-center gap-x-2.5 rounded-[50px] bg-colorPurpleBlue px-6 text-center text-sm text-white hover:bg-colorBlackPearl"
        >
          Search
          <Image
            src="/assets/img/icons/icon-white-search-line.svg"
            alt="search icon"
            width={16}
            height={16}
          />
        </button>
      </div>
    </form>
  );
}
