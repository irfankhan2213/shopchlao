import { Providers } from "./providers";
import { auth } from "../auth";
import { Suspense } from "react";
import DashboardSkeleton from "@/ViewComponents/Skeletons/DashboardSkeleton";
import { LoginUserProvider } from "./_context/UserContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <section>
      <Providers token={session?.user?.token || ""}>
        <LoginUserProvider>
        
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppLayout>{children}</AppLayout>
            </TooltipProvider>
       
        </LoginUserProvider>
      </Providers>
    </section>
  );
}

