import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background text-text-primary">
      {/* Left sidebar - 25% */}
      <aside className="w-[25%]">
        {/* Left sidebar content can be added here */}
      </aside>

      {/* Main content - 50% */}
      <main className="w-[50%]">{children}</main>

      {/* Right sidebar - 25% */}
      <aside className="w-[25%]">
        {/* Right sidebar content can be added here */}
      </aside>
    </div>
  );
}

