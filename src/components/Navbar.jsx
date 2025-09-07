"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [role, setRole] = useState("renter");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("/data/notifications.json")
      .then((res) => res.json())
      .then((data) => setNotifications(data.filter((n) => n.role === role)));
  }, [role]);

  const getRoutesByRole = (role) => {
    const baseRoutes = [
      { href: "/", label: "Home" },
      { href: "/all-products", label: "Products" },
    ];

    if (role === "admin") return [...baseRoutes, { href: "/dashboard/admin", label: "Dashboard" }];
    if (role === "owner") return [...baseRoutes, { href: "/dashboard/owner", label: "Dashboard" }];
    if (role === "renter") return [...baseRoutes, { href: "/dashboard/renter", label: "Dashboard" }];

    return baseRoutes;
  };

  const routes = getRoutesByRole(role);

  return (
    <nav className="w-full border-b bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
          Rentify
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {routes.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className={`text-sm font-medium ${
                pathname === r.href
                  ? "text-blue-600"
                  : "text-gray-700 dark:text-gray-200 hover:text-blue-500"
              }`}
            >
              {r.label}
            </Link>
          ))}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {notifications.length === 0
                ? <DropdownMenuItem>No notifications</DropdownMenuItem>
                : notifications.map((n) => <DropdownMenuItem key={n.id}>{n.text}</DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark Mode Toggle */}
          <ModeToggle />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="w-5 h-5" /> <span className="hidden sm:inline">Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" /> My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard`} className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 cursor-pointer">
                <LogOut className="w-4 h-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col gap-4 mt-6">
              {routes.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className={`text-base font-medium ${
                    pathname === r.href
                      ? "text-blue-600"
                      : "text-gray-700 dark:text-gray-200 hover:text-blue-500"
                  }`}
                >
                  {r.label}
                </Link>
              ))}
              <hr />
              <Button variant="ghost" className="justify-start">
                <User className="w-5 h-5 mr-2" /> Profile
              </Button>
              <Button variant="ghost" className="justify-start text-red-600">
                <LogOut className="w-5 h-5 mr-2" /> Logout
              </Button>
              <ModeToggle />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
