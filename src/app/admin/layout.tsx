import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "kukh elia Admin Dashboard",
  description: "kukh elia Executive Admin Dashboard",
  applicationName: "kukh elia Admin",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "kukh elia Admin",
  },
  manifest: "/manifest-admin.json",
  other: {
    "application-name": "kukh elia Admin Dashboard",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
