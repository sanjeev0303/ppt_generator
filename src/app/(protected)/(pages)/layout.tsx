import { getRecentProjects } from "@/actions/project";
import { onAuthenticateUser } from "@/actions/user";
import AppSidebar from "@/components/global/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import React from "react";
import UpperInfoBar from "../../../components/global/upper-info-bar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const recentProjects = await getRecentProjects();

  const checkUser = await onAuthenticateUser();

  if (!checkUser.user) redirect("/sign-in");

  return (
    <SidebarProvider>
      <AppSidebar
        user={checkUser.user}
        recentProjects={recentProjects?.data || []}
      />

      <SidebarInset>
       <UpperInfoBar user={checkUser.user}/>
      <div className="p-4">
      {children}
      </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
