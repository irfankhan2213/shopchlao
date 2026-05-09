"use client";
import { signOut } from "next-auth/react";
import React from "react";

const LogoutButton = () => {
  return (
    <div
      className="w-full h-full"
      onClick={() => {
        signOut();
      }}
    >
      Log out
    </div>
  );
};

export default LogoutButton;
