import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "kukh elia Digital Loyalty Pass",
  description: "kukh elia coffee & baked goods Digital Loyalty Pass & Rewards",
  applicationName: "kukh elia Pass",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "kukh elia Pass",
  },
  manifest: "/manifest.json",
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
