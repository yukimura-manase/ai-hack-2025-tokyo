import { Fragment, ReactNode } from "react";
import { Header } from "@/components/shared/ui-parts/header";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shared/ui-elements/sidebar";
import { AppSidebar } from "@/components/shared/ui-parts/app-sidebar.tsx";

/**
 * 共通のBasic Layout
 *
 * - Header
 * - Main Area
 */
export const BasicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <Header />
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <div className="flex flex-col gap-[50px] h-screen w-full">
          <main className="flex gap-2">{children}</main>
        </div>
      </SidebarProvider>
    </Fragment>
  );
};
