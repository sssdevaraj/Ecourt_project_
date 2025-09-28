import React from "react";
import { AppSidebar } from "@/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const Sidebar = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  );
};

export default Sidebar;
