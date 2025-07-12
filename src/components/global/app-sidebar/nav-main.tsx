"use client";

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavMain = ({
  items,
}: {
  items: {
    title: string;
    url: string;
    icons: React.ElementType
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) => {
  const pathName = usePathname();

  return (
    <SidebarGroup className="p-0">
      <SidebarMenu>
        {items.map((item, index) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className={`${pathName.includes(item.url) && "bg-background-80"}`}
            >
              <Link
                href={item.url}
                className={`text-lg ${
                  pathName.includes(item.url) && "font-bold"
                }`}
              >
                <item.icons className="text-lg"></item.icons>
                <span className="">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;
