import type { Metadata } from "next";
import "./globals.css";
import { WorkflowProvider } from "../context/WorkflowContext";

export const metadata: Metadata = {
  title: "DataTwin Schema Generator | SCDP Enterprise Studio",
  description: "Enterprise schema generator transforming business requirements into SCDP schemas through reviewable, AI-assisted stages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 antialiased h-screen overflow-hidden flex flex-col transition-colors duration-150 font-sans">
        <WorkflowProvider>
          {children}
        </WorkflowProvider>
      </body>
    </html>
  );
}
