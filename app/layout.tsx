
import { ToastProvider } from "@/components/ToastProvider";

import "./globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
  
    >
  <body >
  <ToastProvider>{children}</ToastProvider>
</body>
    </html>
  );
}
