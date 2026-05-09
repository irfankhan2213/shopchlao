
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import NewSignup from "./_components/NewSignUp";

export default function AuthenticationPage() {
  return (
    <SessionProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <NewSignup />
      </Suspense>
    </SessionProvider>
  );
}
