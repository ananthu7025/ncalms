import { BookOpen, Check } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  leftTitle: string;
  leftDescription: string;
  showFeatures?: boolean;
}

export function AuthLayout({
  children,
  leftTitle,
  leftDescription,
  showFeatures = false,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left Section - Hero/Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#F0FEFF] relative overflow-hidden flex-col justify-center px-12 text-[#1a56db]">
        {/* Abstract Background Design */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-blue-500/10 mix-blend-multiply" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-[#1a56db]">
            {leftTitle}
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            {leftDescription}
          </p>

          {showFeatures && (
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-blue-100 shadow-sm text-[#1a56db]">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Professional Network
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-blue-100 shadow-sm text-[#1a56db]">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Resource Library</span>
              </div>
            </div>
          )}

          {/* Statue/Art Overlay - Mimic the screenshot */}
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-foreground">NCA</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
