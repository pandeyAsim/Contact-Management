import type { Metadata } from "next";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import ToastProvider from "@/providers/ToastProvider";
import CustomThemeProvider from "@/providers/CustomThemeProvider";

export const metadata: Metadata = {
  title: "Contact App",
  description: "A simple contact management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`antialiased bg-light dark:bg-dark`}>
        <ToastProvider />
        <CustomThemeProvider>
          <NextTopLoader showSpinner={false} color="#4A6CF7" />
          {children}
        </CustomThemeProvider>
      </body>
    </html>
  );
}
