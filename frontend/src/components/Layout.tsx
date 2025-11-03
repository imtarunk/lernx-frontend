import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Home, Video, LogOut, LogIn, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import LoadingOverlay from "@/components/LoadingOverlay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="glass glass-edge backdrop-noise rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border flex items-center justify-between gap-2">
            <Link
              to="/"
              className="text-xl sm:text-2xl font-semibold tracking-tight shrink-0"
            >
              <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                Lernx
              </span>
            </Link>
            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
              <ThemeToggle />
              <Link to="/">
                <Button
                  variant="ghost"
                  className="rounded-lg h-9 px-3 sm:h-10 sm:px-4"
                >
                  <Home className="mr-2 h-4 w-4 shrink-0" />
                  Courses
                </Button>
              </Link>
              {user && (
                <>
                  <Link to="/videos">
                    <Button
                      variant="ghost"
                      className="rounded-lg h-9 px-3 sm:h-10 sm:px-4"
                    >
                      <Video className="mr-2 h-4 w-4" />
                      My Videos
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="rounded-lg h-9 px-3 sm:h-10 sm:px-4"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              )}
              {!user && (
                <Link to="/auth">
                  <Button
                    variant="ghost"
                    className="rounded-lg h-9 px-3 sm:h-10 sm:px-4"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile menu */}
            <div className="flex md:hidden items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg h-9 w-9"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/">
                      <span className="inline-flex items-center gap-2">
                        <Home className="h-4 w-4" /> Courses
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  {user && (
                    <DropdownMenuItem asChild>
                      <Link to="/videos">
                        <span className="inline-flex items-center gap-2">
                          <Video className="h-4 w-4" /> My Videos
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {!user && (
                    <DropdownMenuItem asChild>
                      <Link to="/auth">
                        <span className="inline-flex items-center gap-2">
                          <LogIn className="h-4 w-4" /> Sign In
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user && (
                    <DropdownMenuItem onClick={handleSignOut}>
                      <span className="inline-flex items-center gap-2">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <span className="inline-flex items-center gap-3">
                      <ThemeToggle />
                      <span className="text-sm">Theme</span>
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-3 sm:px-4 pb-16 pt-4 sm:pt-6">
        {children}
      </main>
      <LoadingOverlay />
    </div>
  );
}
