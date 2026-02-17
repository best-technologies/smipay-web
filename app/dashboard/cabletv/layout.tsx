import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cable TV",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
