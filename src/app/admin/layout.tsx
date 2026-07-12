"use client";

import { useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar, SidebarItems, SidebarItemGroup, SidebarItem } from "flowbite-react";
import { HiHome, HiBriefcase, HiPhoto, HiStar, HiUser, HiDocumentText, HiEnvelope, HiCog6Tooth, HiArrowRightOnRectangle } from "react-icons/hi2";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: HiHome },
  { href: "/admin/services", label: "Services", icon: HiBriefcase },
  { href: "/admin/gallery", label: "Gallery", icon: HiPhoto },
  { href: "/admin/google-reviews", label: "Google Reviews", icon: HiStar },
  { href: "/admin/about", label: "About", icon: HiUser },
  { href: "/admin/blog", label: "Blog", icon: HiDocumentText },
  { href: "/admin/contacts", label: "Contacts", icon: HiEnvelope },
  { href: "/admin/settings", label: "Settings", icon: HiCog6Tooth },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/admin/login") return;
    fetch("/api/auth/verify")
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) router.replace("/admin/login");
      })
      .catch(() => router.replace("/admin/login"));
  }, [pathname, router]);

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }, [router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-dark">
      <Sidebar aria-label="Admin sidebar" className="w-64">
        <div className="px-4 py-4 text-lg font-bold text-gold">Wedding by Kranthi</div>
        <SidebarItems>
          <SidebarItemGroup>
            {navItems.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                active={item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)}
              >
                {item.label}
              </SidebarItem>
            ))}
          </SidebarItemGroup>
          <SidebarItemGroup>
            <SidebarItem href="/" icon={HiArrowRightOnRectangle}>
              View Site
            </SidebarItem>
            <SidebarItem onClick={handleLogout} icon={HiArrowRightOnRectangle} className="cursor-pointer">
              Logout
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>
      <main className="flex-1 overflow-y-auto p-6 bg-dark-surface">{children}</main>
    </div>
  );
}
