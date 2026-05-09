import React from 'react'
import Image from "next/image";
import AffordableInterestRates  from "@/Assets/images/Affordable_Interest_Rates.svg";
import QuickAndEasyLoanApplicationsImage from "@/Assets/images/quick_and_easy_laon-application.svg";
import BestInClassImage from "@/Assets/images/Best_in_Class_Support.svg";
import bgImage from "@/Assets/images/SideImage.png"

function SidePanel() {
  return (
      <div className="relative max-md:hidden h-full   flex-col p-4 text-primary justify-center lg:flex dark:border-r">
          <div >
            <Image
              className="m-auto max-w-[350px]"
              src={bgImage.src}
              width={bgImage.width}
              height={bgImage.height}
              alt={"login-image"}
            />
          </div>
          <div >
            {/* <h2 className=" text-[2rem] bg-clip-text text-transparent text-center bg-gradient-to-r from-[#0072BC] via-[#A5D0D1]  to-[#FFEEFC] to-100% font-bold ">
              ShopChlao Medical Inventory Portal
            </h2> */}
            <div className="flex flex-col  md:flex-row  justify-center gap-6 max-md:space-y-2 pt-4">
              {[
                {
                  title: "Track Medicines & Supplies",
                  icon: AffordableInterestRates,
                },
                {
                  title: "Easy Inventory Management",
                  icon: QuickAndEasyLoanApplicationsImage,
                },
                { title: "Reliable Support", icon: BestInClassImage },
              ].map((item, index) => (
                <div
                  key={index}
                  className="feature-card py-6 px-2 w-1/3 max-w-[150px]  flex flex-col items-center space-y-2"
                >
                  <Image
                    className="max-h-[50px] h-full"
                    src={item.icon.src}
                    width={item.icon.width}
                    height={item.icon.height}
                    alt={item.title}
                  />
                  <p className="text-sm text-white text-center">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
  )
}

export default SidePanel