import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import AuthHeader from "@/ViewComponents/Headers/AuthHeader";


interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Mobile-optimized Header */}
         <AuthHeader />

          {/* Main Content with mobile padding */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile-optimized Floating Action Button */}
        <Button
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 md:h-14 md:w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 z-50 touch-manipulation"
        >
          <Plus className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>
    </SidebarProvider>
  );
}