import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        setError(error.message);
      } else {
        if (isLogin) {
          toast.success("Welcome back!");
          navigate("/");
        } else {
          toast.success("Account created. Verification email sent.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md glass glass-edge backdrop-noise rounded-2xl">
        <CardHeader>
          <CardTitle>{isLogin ? "Sign In" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Sign in to access your courses and videos"
              : "Create an account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
                minLength={6}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-lg"
              onClick={async () => {
                setError(null);
                const { error } = await signInWithGoogle();
                if (error) {
                  setError(error.message);
                } else {
                  toast("Redirecting to Google…");
                }
              }}
            >
              <span className="mr-2 inline-flex">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611 20.083H42V20H24v8h11.303C33.483 31.91 29.113 35 24 35 16.82 35 11 29.18 11 22S16.82 9 24 9c3.59 0 6.84 1.353 9.348 3.562l5.657-5.657C34.759 2.676 29.64 1 24 1 11.85 1 2 10.85 2 23s9.85 22 22 22c12.15 0 22-9.85 22-22 0-1.341-.138-2.651-.389-3.917z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.305 14.691l6.571 4.817C14.373 15.631 18.83 13 24 13c3.59 0 6.84 1.353 9.348 3.562l5.657-5.657C34.759 6.676 29.64 5 24 5 16.245 5 9.515 9.337 6.305 14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 41c5.052 0 9.615-1.94 13.093-5.1l-6.048-4.99C29.612 32.271 26.94 33 24 33c-5.09 0-9.437-3.058-11.248-7.438l-6.527 5.025C9.395 36.556 16.146 41 24 41z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611 20.083H42V20H24v8h11.303c-1.042 3.08-3.225 5.623-6.258 7.017l.001-.001 6.048 4.99C36.686 41.525 42 37 42 23c0-1.341-.138-2.651-.389-3.917z"
                  />
                </svg>
              </span>
              Continue with Google
            </Button>
          </div>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
