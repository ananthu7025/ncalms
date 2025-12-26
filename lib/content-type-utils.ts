import { Video, FileText, HelpCircle, File, LucideIcon } from "lucide-react";

/**
 * Get icon component for a content type based on its name
 */
export function getContentTypeIcon(contentTypeName: string): LucideIcon {
  const upperName = contentTypeName.toUpperCase();

  // Map common content type names to icons
  if (upperName.includes("VIDEO") || upperName.includes("LECTURE")) {
    return Video;
  }
  if (upperName.includes("PDF") || upperName.includes("DOCUMENT") || upperName.includes("MATERIAL")) {
    return FileText;
  }
  if (upperName.includes("MOCK") || upperName.includes("QUIZ") || upperName.includes("TEST") || upperName.includes("QUESTION")) {
    return HelpCircle;
  }

  // Default icon
  return File;
}

/**
 * Get display label for content type
 */
export function getContentTypeLabel(contentTypeName: string, plural = false): string {
  const upperName = contentTypeName.toUpperCase();

  if (upperName.includes("VIDEO") || upperName.includes("LECTURE")) {
    return plural ? "Videos" : "Video";
  }
  if (upperName.includes("PDF") || upperName.includes("DOCUMENT") || upperName.includes("MATERIAL")) {
    return plural ? "PDFs" : "PDF";
  }
  if (upperName.includes("MOCK") || upperName.includes("QUIZ") || upperName.includes("TEST") || upperName.includes("Q&A")) {
    return plural ? "Q&A" : "Q&A";
  }

  // Return the original name
  return contentTypeName;
}

/**
 * Get color scheme for content type
 */
export function getContentTypeColor(contentTypeName: string): {
  icon: string;
  bg: string;
} {
  const upperName = contentTypeName.toUpperCase();

  if (upperName.includes("VIDEO") || upperName.includes("LECTURE")) {
    return { icon: "text-primary", bg: "bg-primary/10" };
  }
  if (upperName.includes("PDF") || upperName.includes("DOCUMENT") || upperName.includes("MATERIAL")) {
    return { icon: "text-info", bg: "bg-info/10" };
  }
  if (upperName.includes("MOCK") || upperName.includes("QUIZ") || upperName.includes("TEST")) {
    return { icon: "text-success", bg: "bg-success/10" };
  }

  return { icon: "text-muted", bg: "bg-muted" };
}

/**
 * Check if content type is video-based
 */
export function isVideoContentType(contentTypeName: string): boolean {
  return contentTypeName.toUpperCase().includes("VIDEO") ||
         contentTypeName.toUpperCase().includes("LECTURE");
}

/**
 * Check if content type is document-based
 */
export function isDocumentContentType(contentTypeName: string): boolean {
  return contentTypeName.toUpperCase().includes("PDF") ||
         contentTypeName.toUpperCase().includes("DOCUMENT") ||
         contentTypeName.toUpperCase().includes("MATERIAL");
}

/**
 * Get friendly description for content in bundle
 */
export function getContentBundleDescription(contentTypeName: string): string {
  const upperName = contentTypeName.toUpperCase();

  if (upperName.includes("VIDEO")) return "Lectures";
  if (upperName.includes("PDF")) return "Materials";
  if (upperName.includes("MOCK")) return "Content";

  return "Content";
}
