import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Home, Video, LogOut, LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            SAT Study Platform
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/">
              <Button variant="ghost">
                <Home className="mr-2 h-4 w-4" />
                Courses
              </Button>
            </Link>
            {user && (
              <>
                <Link to="/videos">
                  <Button variant="ghost">
                    <Video className="mr-2 h-4 w-4" />
                    My Videos
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            )}
            {!user && (
              <Link to="/auth">
                <Button variant="ghost">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
