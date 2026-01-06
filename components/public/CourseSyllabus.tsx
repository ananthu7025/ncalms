"use client";

import { useState } from "react";

interface CourseSyllabusProps {
    objectives: string[];
    syllabusPdfUrl: string | null;
    additionalCoverage: string | null;
}

export default function CourseSyllabus({
    objectives = [],
    syllabusPdfUrl,
    additionalCoverage,
}: CourseSyllabusProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Check if there's any content
    const hasAnyContent =
        (objectives && objectives.length > 0) ||
        syllabusPdfUrl ||
        additionalCoverage;

    // Configuration for "Show More" logic
    const PREVIEW_ITEMS_LIMIT = 5;
    const CHARACTER_LIMIT = 300;

    // Calculate potential length to decide default state
    const objectivesLength = objectives.join(" ").length;
    const coverageLength = additionalCoverage?.length || 0;
    const totalLength = objectivesLength + coverageLength;

    const hasManyItems = objectives.length > PREVIEW_ITEMS_LIMIT;
    const isContentLong = totalLength > CHARACTER_LIMIT;

    // Only collapse if we have substantial content
    const shouldCollapse = hasManyItems || isContentLong;

    // If not valid to collapse (short content), always show full
    const showFullContent = !shouldCollapse || isExpanded;

    // Determine items to display
    const displayedObjectives = showFullContent
        ? objectives
        : objectives.slice(0, PREVIEW_ITEMS_LIMIT);

    return (
        <div className="mt-10">
            <div className="mb-6 flex items-center justify-between">
                <h5>Course Objectives</h5>
                {syllabusPdfUrl && (
                    <a
                        href={syllabusPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-colorPurpleBlue px-4 py-2 text-sm font-medium text-white transition-all hover:bg-colorPurpleBlue/90"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        Download Syllabus PDF
                    </a>
                )}
            </div>

            {!hasAnyContent ? (
                <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 text-center">
                    <p className="text-colorBlackPearl/60">
                        Course objectives will be available soon.
                    </p>
                </div>
            ) : (
                <>
                    <div className="relative">
                        {/* Course Objectives */}
                        {displayedObjectives.length > 0 && (
                            <div className="mb-6 rounded-lg border border-[#E5E7EB] bg-white p-6">
                                <h6 className="mb-4 text-lg font-bold">What You'll Learn:</h6>
                                <ul className="space-y-2">
                                    {displayedObjectives.map((objective, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-colorPurpleBlue/10 text-xs font-semibold text-colorPurpleBlue">
                                                {index + 1}
                                            </span>
                                            <span className="flex-1 text-colorBlackPearl">{objective}</span>
                                        </li>
                                    ))}
                                </ul>
                                {/* Visual fade effect if collapsed and has more objectives hidden (and not just covering due to length) */}
                                {!showFullContent && hasManyItems && (
                                    <div className="mt-2 text-sm text-gray-500 italic">
                                        ... and {objectives.length - PREVIEW_ITEMS_LIMIT} more objectives
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Additionally We Cover */}
                        {additionalCoverage && (showFullContent || (!hasManyItems && !shouldCollapse)) && (
                            <div className="rounded-lg border-2 border-colorBrightGold/30 bg-colorBrightGold/5 p-6 transition-all duration-300">
                                <h6 className="mb-3 flex items-center gap-2 text-lg font-bold text-colorBlackPearl">
                                    <svg
                                        className="h-5 w-5 text-colorBrightGold"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    Additionally, We Cover:
                                </h6>
                                <div className="whitespace-pre-line text-colorBlackPearl">
                                    {additionalCoverage}
                                </div>
                            </div>
                        )}

                        {/* Gradient overlay when collapsed */}
                        {!showFullContent && (
                            <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                        )}
                    </div>

                    {shouldCollapse && (
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-2 font-semibold text-colorPurpleBlue hover:underline"
                            >
                                {isExpanded ? "Show Less" : "Show More"}
                                <svg
                                    className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
