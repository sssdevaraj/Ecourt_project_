import React from "react";
import { Outlet } from "react-router-dom";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const UserLayout = () => {
 
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex w-full h-screen">
          <SidebarTrigger/>
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
};

export default UserLayout;
