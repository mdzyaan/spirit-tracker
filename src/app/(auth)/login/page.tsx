import { Suspense } from "react";
import { LoginForm } from "@/components/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Suspense fallback={<div className="w-full max-w-sm h-64 animate-pulse rounded-md bg-muted" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
