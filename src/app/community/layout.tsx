import { ReactNode } from 'react';

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {children}
    </div>
  );
}
