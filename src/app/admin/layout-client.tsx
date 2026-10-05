'use client';

import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-6 pt-16 lg:pt-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
