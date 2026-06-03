import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "新人训练地图 | New Recruit Training Map",
  description: "8-week local checklist dashboard for WFG new recruit onboarding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans">
      <body className="min-h-screen font-sans antialiased">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <a href="/training" className="text-base font-bold text-slate-950 sm:text-lg">
              新人训练地图
              <span className="ml-2 hidden text-sm font-medium text-slate-500 sm:inline">
                New Recruit Training Map
              </span>
            </a>
            <span className="hidden text-right leading-tight sm:block">
              <span className="block text-sm font-semibold text-slate-700">本地保存</span>
              <span className="block text-xs font-medium text-slate-400">Progress saved locally</span>
            </span>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
