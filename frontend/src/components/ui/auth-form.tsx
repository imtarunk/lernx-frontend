"use client";

import * as React from "react";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button as UIButton } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } =
        mode === "signin"
          ? await signIn(email, password)
          : await signUp(email, password);
      if (error) {
        toast.error(error.message || "Authentication failed");
      } else {
        if (mode === "signin") {
          toast.success("Welcome back!");
          navigate("/");
        } else {
          toast.success("Account created. Verification email sent.");
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 py-14 sm:py-20 text-zinc-800 dark:text-zinc-200 selection:bg-zinc-300 dark:selection:bg-zinc-600 rounded-2xl">
      <div className="px-4">
        <BackButton onClick={() => navigate(-1)} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative z-10 mx-auto w-full max-w-xl p-4"
      >
        <Logo />
        <Header mode={mode} setMode={setMode} />
        <GoogleButton
          onClick={async () => {
            const { error } = await signInWithGoogle();
            if (error) toast.error(error.message);
            else toast("Redirecting to Google…");
          }}
        />
        <div className="my-6 flex items-center gap-3">
          <div className="h-[1px] w-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="text-zinc-500 dark:text-zinc-400">OR</span>
          <div className="h-[1px] w-full bg-zinc-300 dark:bg-zinc-700" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email-input"
              className="mb-1.5 block text-zinc-500 dark:text-zinc-400"
            >
              Email
            </label>
            <input
              id="email-input"
              type="email"
              placeholder="your.email@provider.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-end justify-between">
              <label
                htmlFor="password-input"
                className="block text-zinc-500 dark:text-zinc-400"
              >
                Password
              </label>
            </div>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              placeholder="••••••••"
              required
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
            />
          </div>
          <UIButton type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Please wait…"
              : mode === "signin"
              ? "Sign in"
              : "Create account"}
          </UIButton>
        </form>
        <TermsAndConditions />
      </motion.div>
      <BackgroundDecoration />
    </div>
  );
};

const BackButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <SocialButton onClick={onClick} icon={<ChevronLeft size={16} />}>
    Go back
  </SocialButton>
);

const SocialButton: React.FC<{
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}> = ({ icon, fullWidth, children, onClick }) => (
  <button
    onClick={onClick}
    className={`relative z-0 flex items-center justify-center gap-2 overflow-hidden rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 font-semibold text-zinc-800 dark:text-zinc-200 transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-zinc-800 dark:before:bg-zinc-200 before:transition-transform before:duration-1000 before:content-["""] hover:scale-105 hover:text-zinc-100 dark:hover:text-zinc-900 hover:before:translate-x-[0%] hover:before:translate-y-[0%] active:scale-95 ${
      fullWidth ? "col-span-2" : ""
    }`}
  >
    {icon}
    <span>{children}</span>
  </button>
);

const GoogleButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="mb-6 space-y-3">
    <div className="grid grid-cols-1">
      <SocialButton fullWidth onClick={onClick}>
        Continue with Google
      </SocialButton>
    </div>
  </div>
);

const Logo: React.FC = () => (
  <div className="mb-6 flex justify-center">
    <img src="/vite.svg" alt="Lernx" className="h-8 w-8" />
    <span className="ml-2 text-xl font-bold">Lernx</span>
  </div>
);

const Header: React.FC<{
  mode: "signin" | "signup";
  setMode: (m: "signin" | "signup") => void;
}> = ({ mode, setMode }) => (
  <div className="mb-6 text-center">
    <h1 className="text-2xl font-semibold">
      {mode === "signin" ? "Sign in to your account" : "Create your account"}
    </h1>
    <p className="mt-2 text-zinc-500 dark:text-zinc-400">
      {mode === "signin"
        ? "Don't have an account? "
        : "Already have an account? "}
      <button
        className="text-blue-600 dark:text-blue-400 hover:underline"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
      >
        {mode === "signin" ? "Create one." : "Sign in."}
      </button>
    </p>
  </div>
);

const TermsAndConditions: React.FC = () => (
  <p className="mt-9 text-xs text-zinc-500 dark:text-zinc-400">
    By signing in, you agree to our{" "}
    <a href="#" className="text-blue-600 dark:text-blue-400">
      Terms & Conditions
    </a>{" "}
    and{" "}
    <a href="#" className="text-blue-600 dark:text-blue-400">
      Privacy Policy.
    </a>
  </p>
);

const BackgroundDecoration: React.FC = () => (
  <div
    className="absolute right-0 top-0 z-0 size-[50vw]"
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='rgb(30 58 138 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")",
    }}
  >
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(100% 100% at 100% 0%, rgba(9,9,11,0), rgba(9,9,11,1))",
      }}
    />
  </div>
);

export default AuthForm;
