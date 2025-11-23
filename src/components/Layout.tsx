import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background text-text-primary">
      {/* Main content - max width 610px with padding */}
      <main className="w-full max-w-[750px] mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

