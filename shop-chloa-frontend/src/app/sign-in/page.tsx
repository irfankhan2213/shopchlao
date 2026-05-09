import Link from "next/link";
import mainLogo from "@/Assets/images/main-logo.svg";
import Image from "next/image";

import { Phone } from "lucide-react";
import SupportEmail from "@/ViewComponents/SupportEmail";
import SidePanel from "../sign-up/_components/SidePanel";
import NewSignIn from "./_components/NewSignIn";

export default async function AuthenticationPage() {
  return (
    <>
       <div className="w-full signup-page relative bg-gradient-to-br from-primary/15 via-accent/20 to-secondary/10 h-screen items-center justify-center grid lg:max-w-none md:grid-cols-2 lg:px-0">
        <SidePanel />
        <NewSignIn />

        {/* <div className=" lg:px-8 flex flex-col h-full  justify-center">
          <div className="m-auto flex  w-full flex-col min-h-2/3  space-y-6 max-w-sm">
            <div>
              <Link href={"/"}>
                <Image
                  className="h-[45px] w-auto"
                  src={mainLogo.src}
                  width={mainLogo.width}
                  height={mainLogo.height}
                  alt={"main logo"}
                />
              </Link>
              {/* <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
              <p className="text-sm text-muted-foreground">
                Log in to ShopChlao
              </p> */}
            {/* </div>
            <SignInForm />
          </div>
          <SupportEmail />
        </div> */} 
      </div>
    </>
  );
}
