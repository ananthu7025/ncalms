/**
 * Bundle Deal Constants and Utilities
 *
 * Handles pricing and discount calculations for NCA course bundles
 */

// Individual content item prices
export const CONTENT_PRICES = {
  VIDEO: 150,
  PDF: 70,
  QA: 80,
  IRACS: 80,
} as const;

// Single subject bundle pricing
export const SINGLE_SUBJECT_BUNDLE = {
  INDIVIDUAL_TOTAL: 380, // Sum of all content types (150 + 70 + 80 + 80)
  BUNDLE_PRICE: 300,
  SAVINGS: 80,
  DISCOUNT_PERCENT: 21, // (80/380) * 100 = 21%
} as const;

// Multi-subject package deals
export const MULTI_SUBJECT_PACKAGES = {
  MANDATORY_5: {
    name: "5 Mandatory NCA Subjects Bundle",
    description: "Complete bundle of all 5 mandatory NCA subjects",
    subjectCount: 5,
    individualPrice: 1500, // 5 × $300
    bundlePrice: 1200,
    savings: 300,
    discountPercent: 20, // (300/1500) * 100 = 20%
    subjects: [
      "Canadian Constitutional Law",
      "Canadian Criminal Law",
      "Foundations of Canadian Law",
      "Canadian Administrative Law",
      "Professional Responsibility",
    ],
  },
  // You can add more packages here (e.g., 3-subject packages, elective combos, etc.)
} as const;

/**
 * Calculate savings for a multi-subject bundle
 */
export function calculateMultiSubjectSavings(
  subjectCount: number,
  singleBundlePrice = SINGLE_SUBJECT_BUNDLE.BUNDLE_PRICE
): {
  individualTotal: number;
  bundlePrice: number | null;
  savings: number;
  discountPercent: number;
} {
  const individualTotal = subjectCount * singleBundlePrice;

  // Check if this matches a defined package
  if (subjectCount === MULTI_SUBJECT_PACKAGES.MANDATORY_5.subjectCount) {
    const pkg = MULTI_SUBJECT_PACKAGES.MANDATORY_5;
    return {
      individualTotal,
      bundlePrice: pkg.bundlePrice,
      savings: pkg.savings,
      discountPercent: pkg.discountPercent,
    };
  }

  // No bundle deal available for this count
  return {
    individualTotal,
    bundlePrice: null,
    savings: 0,
    discountPercent: 0,
  };
}

/**
 * Get bundle package by subject count
 */
export function getBundlePackage(subjectCount: number) {
  if (subjectCount === MULTI_SUBJECT_PACKAGES.MANDATORY_5.subjectCount) {
    return MULTI_SUBJECT_PACKAGES.MANDATORY_5;
  }
  return null;
}

/**
 * Calculate total price for selected subjects
 */
export function calculateSubjectBundleTotal(
  subjects: Array<{
    id: string;
    bundlePrice: string | null;
    isBundleEnabled: boolean;
  }>
): {
  subtotal: number;
  packageDeal: ReturnType<typeof getBundlePackage>;
  finalPrice: number;
  totalSavings: number;
} {
  // Calculate subtotal (sum of individual bundle prices)
  const subtotal = subjects.reduce((sum, subject) => {
    if (subject.isBundleEnabled && subject.bundlePrice) {
      return sum + parseFloat(subject.bundlePrice);
    }
    return sum;
  }, 0);

  // Check for package deal
  const packageDeal = getBundlePackage(subjects.length);

  const finalPrice = packageDeal ? packageDeal.bundlePrice : subtotal;
  const totalSavings = packageDeal ? packageDeal.savings : 0;

  return {
    subtotal,
    packageDeal,
    finalPrice,
    totalSavings,
  };
}

/**
 * Format price with currency
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Check if subjects qualify for mandatory package
 */
export function qualifiesForMandatoryPackage(subjectTitles: string[]): boolean {
  const mandatorySubjects = MULTI_SUBJECT_PACKAGES.MANDATORY_5.subjects.map(s =>
    s.toLowerCase()
  );

  const normalizedTitles = subjectTitles.map(t => t.toLowerCase());

  // Check if all mandatory subjects are included
  return mandatorySubjects.every(subject =>
    normalizedTitles.some(title => title.includes(subject.toLowerCase()))
  );
}
