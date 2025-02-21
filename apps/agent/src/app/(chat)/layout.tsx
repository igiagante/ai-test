import { cookies } from "next/headers";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";

import Script from "next/script";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, cookieStore] = await Promise.all([currentUser(), cookies()]);
  const isCollapsed = cookieStore.get("sidebar:state")?.value !== "true";

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarProvider defaultOpen={!isCollapsed}>
        {user && <AppSidebar />}
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
