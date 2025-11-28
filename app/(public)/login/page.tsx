import { Suspense } from "react";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-6">
      <Suspense fallback={<div className="text-textBase">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

