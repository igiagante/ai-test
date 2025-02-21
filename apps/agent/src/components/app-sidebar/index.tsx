import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import Link from "next/link";
import { ComponentProps } from "react";
import { SidebarLeftIcon } from "../icons";
import { ChatsHistory } from "./chats-history";
import { Navigation } from "./navigation";
import { NewChatButton } from "./new-chat-button";
import { UserIndicator } from "./user-indicator";

export async function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu className="gap-2">
          <Link href="/" passHref>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="New Chat">
                <NewChatButton />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
          <Navigation />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
      <SidebarContent>
        <ChatsHistory />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="hidden items-center justify-center group-data-[collapsible=icon]:block">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Toggle Sidebar" asChild>
              <SidebarTrigger icon={<SidebarLeftIcon />} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <UserIndicator />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
