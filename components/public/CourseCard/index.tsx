import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface CourseCardProps {
  image: string;
  category: string;
  lessons: number;
  instructor: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  students: number;
}

const CourseCard = ({
  image,
  category,
  lessons,
  instructor,
  title,
  rating,
  reviews,
  price,
  students,
}: CourseCardProps) => {
  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Image
          key={i}
          src={
            i <= rating
              ? "/assets/img/icons/icon-yellow-star.svg"
              : "/assets/img/icons/icon-yellow-star-blank.svg"
          }
          alt="star rating"
          width={16}
          height={15}
        />
      );
    }
    return stars;
  };

  return (
    <li className="jos">
      <div className="group relative flex flex-col items-center xl:flex-row">
        {/* Thumbnail */}
        <div className="absolute block h-[222px] w-[217px] overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={title}
            width={217}
            height={222}
            className="h-auto w-full transition-all duration-300 group-hover:scale-105 object-cover"
          />

          <Link
            href="/course"
            className="absolute left-3 top-3 inline-block rounded-[40px] bg-colorBrightGold px-3.5 py-1.5 text-sm leading-none text-colorBlackPearl hover:bg-colorBlackPearl hover:text-colorBrightGold"
          >
            {category}
          </Link>

          <button className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-[50%] bg-white hover:bg-colorBrightGold">
            <Image
              src="/assets/img/icons/icon-dark-bookmark-line.svg"
              alt="bookmark"
              width={16}
              height={16}
            />
          </button>
        </div>

        {/* Content */}
        <div className="mt-[106px] rounded-lg bg-white px-6 py-10 pt-36 shadow-[0_0_50px_42px] shadow-[#0E0548]/5 transition-all duration-300 sm:px-8 xl:ml-[106px] xl:mt-0 xl:pl-36 xl:pt-10">
          {/* Course Meta */}
          <div className="flex gap-9">
            <span className="inline-flex items-center gap-1.5 text-sm">
              <Image
                src="/assets/img/icons/icon-grey-book-3-line.svg"
                alt="lessons icon"
                width={17}
                height={17}
              />
              <span className="flex-1">{lessons} Lessons</span>
            </span>

            <Link
              href="/course"
              className="inline-flex items-center gap-1.5 text-sm hover:underline"
            >
              <Image
                src="/assets/img/icons/icon-grey-user-3-line.svg"
                alt="instructor icon"
                width={17}
                height={18}
              />
              <span className="flex-1">{instructor}</span>
            </Link>
          </div>

          {/* Title Link */}
          <Link
            href="/course"
            className="my-6 block font-title text-xl font-bold text-colorBlackPearl hover:text-colorPurpleBlue"
          >
            {title}
          </Link>

          {/* Review Star */}
          <div className="inline-flex gap-x-[10px] text-sm">
            <div className="inline-flex items-center gap-x-1">{renderStars()}</div>
            <span>({reviews} Reviews)</span>
          </div>

          {/* Bottom Text */}
          <div className="mt-4 flex items-center justify-between">
            <span className="font-title text-xl font-bold text-colorPurpleBlue">
              ${price}.00
            </span>

            <div className="inline-flex items-center gap-1.5 text-sm">
              <Image
                src="/assets/img/icons/icon-grey-graduation-cap-line.svg"
                alt="students icon"
                width={17}
                height={17}
              />
              <span className="flex-1">{students} Students</span>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CourseCard;
