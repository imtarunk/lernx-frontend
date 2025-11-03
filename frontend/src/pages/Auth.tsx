import AuthForm from "@/components/ui/auth-form";

export default function Auth() {
  return (
    <div className="py-6 sm:py-10 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-2xl glass glass-edge backdrop-noise rounded-2xl overflow-hidden">
        <AuthForm />
      </div>
    </div>
  );
}
