import { Link } from "@heroui/link";
import { Navbar } from "@/components/navbar";
import arBlackLogo from "@/assets/images/logos/ar_black.png"; // Import the image

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full bg-background/70 backdrop-blur-sm py-6 border-t border-neutral-200">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Centered monogram and date */}
            <div className="text-center">
              <div 
                className="font-script text-5xl font-medium text-primary"
                style={{
                  fontFamily: "'Pinyon Script', 'Dancing Script', cursive",
                }}
              >
                D&K
              </div>
              <p className="text-xs tracking-widest uppercase mt-1 text-foreground-500">
                10 • 9 • 2026
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-3 text-xs text-foreground-500">
              <Link
                isExternal
                href="https://alexrogoff.com"
                className="flex items-center text-foreground-500 text-xs hover:text-primary transition-colors"
                aria-label="AR Design"
              >
                <span className="text-xs">Designed & Created By</span>
                <img 
                  src={arBlackLogo}
                  alt="AR Logo" 
                  className="w-5 h-5 ml-1"
                />
              </Link>
              <span className="mx-1">•</span>
              <Link 
                href="/login" 
                className="text-foreground-500 text-xs hover:text-primary transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
