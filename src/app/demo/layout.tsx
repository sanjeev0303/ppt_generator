import type { Metadata } from "next";
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Enhanced Editor Demo - PPT Generator",
  description: "Demo of the enhanced presentation editor",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}