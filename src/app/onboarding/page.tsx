import { Suspense } from "react";
import { OnboardingForm } from "@/components/features/onboarding/OnboardingForm";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md h-80 animate-pulse rounded-md bg-muted" />
        }
      >
        <OnboardingForm />
      </Suspense>
    </div>
  );
}
