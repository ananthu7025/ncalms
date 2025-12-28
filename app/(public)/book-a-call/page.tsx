import { Suspense } from "react";
import BookACallContent from "../../../components/public/BookACallContent";
import Breadcrumb from "@/components/public/Breadcrumb";

export const metadata = {
  title: "Book a Personal Session - NCA & Ontario Bar Exam Prep",
  description: "Get personalized guidance from our experts. Book a 1:1 session for NCA Exams or Ontario Bar Licensing preparation strategy.",
};

export default function BookACallPage() {
  return (
    <>
      <Breadcrumb
        title="Book a Personal Session"
        items={[
          { label: "Home", href: "/" },
          { label: "1:1 Sessions" },
        ]}
      />
      <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
        <BookACallContent />
      </Suspense>
    </>
  );
}
