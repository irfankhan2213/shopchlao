import Link from "next/link";
import mainLogo from "@/Assets/images/main-logo.svg";
import Image from "next/image";


import { Phone } from "lucide-react";
import SupportEmail from "@/ViewComponents/SupportEmail";
import SidePanel from "./_components/SidePanel";
import NewSignup from "./_components/NewSignUp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AuthenticationPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full signup-page relative bg-gradient-to-br from-primary/15 via-accent/20 to-secondary/10 min-h-screen items-center justify-center grid lg:max-w-none md:grid-cols-2 lg:px-0">
      <SidePanel />
      <div className="min-h-screen flex items-center justify-center  p-4">
        <div className="w-full max-w-lg space-y-6 animate-fade-in">
          {/* Header */}
          {/* <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
              <UserPlus className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Create Your Store
          </h1>
          <p className="text-muted-foreground">
            Set up your account and store information
          </p>
        </div> */}
          <Card className="shadow-elegant border-border/50 rounded-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                Welcome to ShopChlao
              </CardTitle>
              <CardDescription className="text-center">
                Create your account and set up your store details
              </CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="hover:text-foreground underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="hover:text-foreground underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
