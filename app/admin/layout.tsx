import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - OAU ChowFinder",
  description: "Admin dashboard for OAU ChowFinder",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
