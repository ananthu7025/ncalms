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
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-center px-12">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80')",
          }}
        />
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-indigo-900/80" />

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
            {leftTitle}
          </h1>
          <p className="text-lg text-white/90 mb-8 leading-relaxed drop-shadow-md">
            {leftDescription}
          </p>
          {showFeatures && (
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-sm text-white">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Professional Network
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-sm text-white">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Resource Library</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
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
