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
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "AIエージェントとの会話",
    url: "/talk-room",
    icon: RiRobot2Line,
  },
  // {
  //   title: "マイページ",
  //   url: "/my-page",
  //   icon: ImProfile,
  // },
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
