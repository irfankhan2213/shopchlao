
import { Suspense } from "react";
import NewSignup from "./_components/NewSignUp";

export default function AuthenticationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewSignup />
    </Suspense>
  );
}
