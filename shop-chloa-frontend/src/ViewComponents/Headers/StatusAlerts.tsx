"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import SupportEmail from "../SupportEmail";
import warningSign from "@/Assets/gif/warning-sign.gif";
import Image from "next/image";
import rejectIcon from "@/Assets/icons/icons8-reject.svg";
import check from "@/Assets/gif/check.gif";
import { useLoginUserContext } from "@/app/(protected)/_context/UserContext";
import axiosInstance from "@/services/ApiServices/axiosInstance";
import apiRoutes from "@/services/ApiServices/apiRoutes";

function StatusAlerts() {
  const { user } = useLoginUserContext();
  const [open, setOpen] = React.useState(true);
  if (user?.status === "pending") {
    return (
      <AlertDialog open={open}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <Image
              src={warningSign}
              alt="Warning Sign"
              className="h-20 w-20 mx-auto"
            />
            <AlertDialogTitle className="text-center font-normal text-2xl">
              <span className="font-bold"> You&apos;re all set!</span>
              <br /> Account created and is under review
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base px-8 pb-4">
              You&apos;ll be notified via email once it&apos;s
              approved—typically within 24-48 hours.
            </AlertDialogDescription>
            <SupportEmail />
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else if (user?.status === "rejected") {
    return (
      <AlertDialog open={open}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <Image
              src={rejectIcon}
              alt="Reject Icon"
              className="h-20 w-20 mx-auto"
            />
            <AlertDialogTitle className="text-center font-normal text-2xl">
              <span className="font-bold">Oops!</span>
              <br /> Your account is rejected
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base px-4 pb-4">
              Feel free to reach out to partner support in case you want to
              understand more and apply again.
            </AlertDialogDescription>
            <SupportEmail />
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else if (user?.status === "inactive") {
    return (
      <AlertDialog open={open}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <Image
              src={rejectIcon}
              alt="Reject Icon"
              className="h-20 w-20 mx-auto"
            />
            <AlertDialogTitle className="text-center font-normal text-2xl">
              <span className="font-bold">Oops!</span>
              <br />
              Your account is deactivated
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base px-4 pb-4">
              Feel free to reach out to partner support incase you want to
              understand more and apply again.
            </AlertDialogDescription>
            <SupportEmail />
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else if (user?.status === "approved") {
    return (
      <AlertDialog open={open}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <Image src={check} alt="Check Icon" className="h-20 w-20 mx-auto" />
            <AlertDialogTitle className="text-center font-normal text-2xl">
              <span className="font-bold">Congratulations!</span>
              <br /> Your account is now approved
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base px-4 pb-4">
              You can now add leads individually or in bulk, manage your team
              among other things.
            </AlertDialogDescription>

            <AlertDialogAction
              onClick={() => {
                axiosInstance.put(`${apiRoutes.ACTIVATE_USER}`);
                setOpen(false);
              }}
              className="max-w-min px-8 mx-auto"
            >
              Go to Dashboard
            </AlertDialogAction>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return null;
}

export default StatusAlerts;
