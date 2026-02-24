import type { Metadata } from "next";
import AdminLayout from "./_components/AdminLayout";

export const metadata: Metadata = {
  title: "Admin Panel — Smipay",
  description: "Smipay unified admin dashboard",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
