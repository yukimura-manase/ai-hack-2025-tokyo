import { Home, Search } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shared/ui-elements/sidebar";
import { RiRobot2Line } from "react-icons/ri";

// Sidebar Menu items.
const items = [
  {
    title: "負けインとの会話",
    url: "/",
    icon: Home,
  },
  {
    title: "ストーリー",
    url: "/story",
    icon: RiRobot2Line,
  },
];

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="h-[80px]"></div>
        <SidebarGroup>
          <SidebarGroupLabel>アプリ・メニュー</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
