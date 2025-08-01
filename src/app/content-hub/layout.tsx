import { ReactNode } from "react";

interface ContentHubLayoutProps {
  children: ReactNode;
}

export default function ContentHubLayout({ children }: ContentHubLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {children}
    </div>
  );
} 