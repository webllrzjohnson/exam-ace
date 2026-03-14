import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "./providers";
import Layout from "@/components/Layout";
import "@/index.css";

export const metadata: Metadata = {
  title: "Canadian Citizenship Test Prep",
  description: "Practice for your Canadian citizenship test",
  icons: {
    icon: [{ url: "/icon?v=3", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Layout>{children}</Layout>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
