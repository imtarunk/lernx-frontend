import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Home, Video, LogOut, LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen page-bg">
      <nav className="sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="glass glass-edge backdrop-noise rounded-xl px-4 py-3 border flex items-center justify-between">
            <Link to="/" className="text-2xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                Lernx
              </span>
            </Link>
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <Link to="/">
                <Button variant="ghost" className="rounded-lg">
                  <Home className="mr-2 h-4 w-4" />
                  Courses
                </Button>
              </Link>
              {user && (
                <>
                  <Link to="/videos">
                    <Button variant="ghost" className="rounded-lg">
                      <Video className="mr-2 h-4 w-4" />
                      My Videos
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="rounded-lg"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              )}
              {!user && (
                <Link to="/auth">
                  <Button variant="ghost" className="rounded-lg">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 pb-16 pt-6">{children}</main>
      <LoadingOverlay />
    </div>
  );
}
