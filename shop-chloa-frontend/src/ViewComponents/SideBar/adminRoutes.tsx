"use client";
import { FaUsers } from "react-icons/fa6";
import { HiTemplate } from "react-icons/hi";
import { routeType } from "@/types/app";
const adminRoutes: routeType[] = [
  {
    name: "Partners",
    key: "partners",
    route: "/partners",
    exactMatch: false,
    icon: (color: string) => <HiTemplate color={color} size="24" />,
  },
  {
    name: "Users",
    key: "users",
    route: "/users",
    exactMatch: false,
    icon: (color: string) => <FaUsers color={color} size="24" />,
  },
];

export default adminRoutes;
