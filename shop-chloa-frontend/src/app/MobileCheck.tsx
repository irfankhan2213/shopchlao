"use client";
import { useMediaQuery } from "@/hooks/use-media-query";
import Image from "next/image";
import React from "react";
import mainLogo from "@/Assets/images/main-logo.svg";
import disabledMobile from "@/Assets/images/disabled-mobile.svg";

function MobileCheck({ children }: { children?: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  if (isMobile) {
    return (
      <div className="w-full h-screen relative bg-primary/10">
        <div className="w-full z-[49] sticky top-0">
          <div className="flex justify-center   shadow-lg bg-glass h-16 items-center ">
            <Image
              className="h-[45px] w-auto"
              src={mainLogo.src}
              width={mainLogo.width}
              height={mainLogo.height}
              alt={"main logo"}
            />
          </div>
        </div>
        <div className="flex p-6 justify-center items-center min-h-2/3 ">
          <div className="text-center space-y-4 rounded-2xl p-6 bg-background">
            <Image
              className="mx-auto w-auto"
              src={disabledMobile.src}
              width={disabledMobile.width}
              height={disabledMobile.height}
              alt={"disabled mobile illustration"}
            />
            <h1 className="text-2xl font-semibold">Switch to Desktop</h1>
            <p className="text-sm text-muted-foreground">
              Partner Portal is not supported on mobile yet. Please access the
              platform using a desktop or laptop device.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return children;
}

export default MobileCheck;
