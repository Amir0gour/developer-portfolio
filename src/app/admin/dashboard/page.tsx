'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatsCard from '@/components/admin/StatsCard';
import { FolderKanban, FileText, MessageSquare, Wrench, Plus, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatRelativeDate } from '@/lib/utils';

interface DashboardData {
  projects: number;
  blog: { total: number; published: number; draft: number };
  messages: { total: number; unread: number };
  skills: number;
  activities: Array<{ id: string; action: string; entityType: string; details: string | null; createdAt: string; admin: { name: string } }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard').then(r => r.json()).then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-lg bg-card border border-border animate-pulse" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold">Dashboard</h1><p className="text-muted-foreground mt-1">Welcome back! Here&apos;s an overview.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={FolderKanban} label="Projects" value={data?.projects ?? 0} />
        <StatsCard icon={FileText} label="Blog Posts" value={data?.blog.total ?? 0} />
        <StatsCard icon={MessageSquare} label="Unread Messages" value={data?.messages.unread ?? 0} />
        <StatsCard icon={Wrench} label="Skills" value={data?.skills ?? 0} />
      </div>
      <div className="flex gap-3">
        <Link href="/admin/projects/new"><Button size="sm"><Plus className="h-4 w-4 mr-1" />New Project</Button></Link>
        <Link href="/admin/blog/new"><Button size="sm" variant="secondary"><Plus className="h-4 w-4 mr-1" />New Post</Button></Link>
        <Link href="/admin/messages"><Button size="sm" variant="outline"><MessageSquare className="h-4 w-4 mr-1" />Messages</Button></Link>
      </div>
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Activity className="h-5 w-5" />Recent Activity</h2>
        {data?.activities?.length ? (
          <div className="space-y-3">{data.activities.map(act => (
            <div key={act.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div><p className="text-sm">{act.action} <span className="text-muted-foreground">{act.entityType}</span></p>{act.details && <p className="text-xs text-muted-foreground">{act.details}</p>}</div>
              <span className="text-xs text-muted-foreground">{formatRelativeDate(act.createdAt)}</span>
            </div>
          ))}</div>
        ) : <p className="text-sm text-muted-foreground">No recent activity</p>}
      </div>
    </div>
  );
}
