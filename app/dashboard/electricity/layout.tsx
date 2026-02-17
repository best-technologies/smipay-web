import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Electricity",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
