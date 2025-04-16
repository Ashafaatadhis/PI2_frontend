"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ChevronUp, Home, Inbox, LogOut, Search } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Daily Activity",
    url: "/dashboard/activity",
    icon: Calendar,
  },
  {
    title: "Stress Prediction",
    url: "/dashboard/stress-prediction",
    icon: Search,
  },
  {
    title: "Streak System",
    url: "/dashboard/streak",
    icon: Inbox,
  },
];

export function AppSidebar({ session }: { session: Session | null }) {
  const pathname = usePathname();

  const user = session?.user;

  const handleLogout = () => {
    // Hapus timezone dari localStorage saat logout
    localStorage.removeItem("user_tz");

    // Melakukan proses logout dan redirect ke halaman login
    void signOut({ redirectTo: "/" });
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <Sidebar className="flex flex-col justify-between">
      <SidebarHeader>
        <h1 className="m-2 text-2xl font-bold text-white">
          Daily<span className="text-yellow-500">Balance</span>
        </h1>
      </SidebarHeader>
      <SidebarContent className="flex h-full flex-col justify-between">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={
                          isActive ? "bg-[#ffd700] text-[#1a3d78]" : ""
                        }
                      >
                        <Link href={item.url}>
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <div className="flex items-center gap-2">
                      <Avatar key={user?.image} className="h-8 w-8">
                        <AvatarImage
                          referrerPolicy={"no-referrer"}
                          src={user?.image ?? ""}
                          alt={user?.name ?? ""}
                        />
                        <AvatarFallback>
                          {getInitials(user?.name ?? "U")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user?.name ?? "User"}</span>
                      <ChevronUp className="ml-auto h-4 w-4" />
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-red-500">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
