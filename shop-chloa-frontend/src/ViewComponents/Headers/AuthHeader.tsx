"use client"
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

import { Bell, ChevronDown, Mail, PhoneCall } from "lucide-react";
import { useLoginUserContext } from "@/app/(protected)/_context/UserContext";
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '@/components/ui/drawer'
import { useMediaQuery } from "@/hooks/use-media-query";
import { FaCircleQuestion } from "react-icons/fa6";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AuthHeader = () => {
 const { user} = useLoginUserContext()

  const isDesktop = useMediaQuery('(min-width: 768px)')
  return (

          <header className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6 border-b border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="hidden sm:block">
                <h2 className="font-semibold text-foreground">Shop Chlao</h2>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-warning rounded-full text-xs"></span>
              </Button>
              
            {isDesktop ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex gap-1 cursor-pointer px-4">
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.image || ''} alt="@shadcn" />
                      <AvatarFallback className="text-primary text-xl font-semibold">
                        {user?.name
                          ? user.name.charAt(0) 
                          : ''}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                  <ChevronDown className="text-2xl my-auto" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Drawer>
              <DrawerTrigger asChild>
                <div className="flex gap-1 cursor-pointer px-4">
                  <FaCircleQuestion size={20} className="text-gray-neutral-700 my-auto" />
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.image || ''} alt="@shadcn" />
                      <AvatarFallback className="text-primary text-xl font-semibold">
                        {user?.name
                          ? user.name.charAt(0) + user.name.split(' ').pop()?.charAt(0)
                          : ''}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </div>
              </DrawerTrigger>
              <DrawerContent className="p-0">
                <DrawerHeader className="py-2 border-b border-gray-neutral-200">
                  <div className="flex gap-2 cursor-pointer items-center ">
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.image || ''} alt="@shadcn" />
                        <AvatarFallback className="text-primary text-xl font-semibold">
                          {user?.name
                            ? user.name.charAt(0) + user.name.split(' ').pop()?.charAt(0)
                            : ''}
                        </AvatarFallback>
                      </Avatar>
                    </Button>

                    <p className="font-semibold leading-none">{user?.name}</p>
                  </div>
                </DrawerHeader>
                <div>
                  <div className="flex flex-col text-gray-neutral-600 border-b border-gray-neutral-200 ">
                    <div className="flex leading-none p-4 gap-4 items-center">
                      <PhoneCall size={20} />
                      {user?.phone || 'No phone number provided'}
                    </div>
                    <div className="flex leading-none p-4 gap-4 items-center">
                      <Mail size={20} />
                      {user?.email}
                    </div>
                  </div>
                  <div className="flex leading-none p-4 gap-4 items-center">
                    <LogoutButton />
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          )}
            </div>
          </header>

     
  );
};

export default AuthHeader;
