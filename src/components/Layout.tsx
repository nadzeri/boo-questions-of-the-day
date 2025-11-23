import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left sidebar - 25% */}
      <aside className="w-[25%] bg-zinc-50 dark:bg-zinc-900">
        {/* Left sidebar content can be added here */}
      </aside>

      {/* Main content - 50% */}
      <main className="w-[50%] bg-white dark:bg-black">
        {children}
      </main>

      {/* Right sidebar - 25% */}
      <aside className="w-[25%] bg-zinc-50 dark:bg-zinc-900">
        {/* Right sidebar content can be added here */}
      </aside>
    </div>
  );
}

