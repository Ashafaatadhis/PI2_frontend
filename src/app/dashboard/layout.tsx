import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { TimezoneSync } from "./_components/timezone-sync";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <main className="w-full">
        <SidebarTrigger />
        <TimezoneSync />
        {children}
      </main>
    </SidebarProvider>
  );
}
