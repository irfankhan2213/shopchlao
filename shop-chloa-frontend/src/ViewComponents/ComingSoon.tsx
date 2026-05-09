import Image from "next/image";
import React from "react";
import mainLogo from "@/Assets/images/main-logo.svg";
import Link from "next/link";

const ComingSoon = () => {
  return (
    <div className="relative  h-screen w-full  bg-[#0d6dfd0f] flex-col p-10 text-primary lg:flex dark:border-r">
      <div className="relative z-20 flex items-center text-lg font-medium">
        <Link href={"/"}>
          <Image
            className="w-[150px]"
            src={mainLogo.src}
            width={mainLogo.width}
            height={mainLogo.height}
            alt={"main logo"}
          />
        </Link>
      </div>
      <div className="m-auto h-[25vh] min-h-[100px] flex-col ">
        <div className=" font-bold text-5xl h-16 bg-clip-text text-transparent text-center bg-linear-to-r from-blue-300 to-primary drop-shadow-lg">
          Coming Soon
        </div>
        <p className="text-lg">
          {"We'"}re working hard to bring you something amazing. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
