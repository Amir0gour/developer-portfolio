'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { Card, EmptyState, Skeleton, Pagination } from '@/components/ui';
import { toast } from 'sonner';

export default function ActivityLogPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchActivity();
  }, [page]);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/activity?page=${page}&limit=20`);
      const data = await res.json();
      setActivities(data.activities || data);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load activity log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Activity Log</h1>
      
      <Card className="p-4">
        {loading ? (
          <Skeleton className="h-96 w-full" />
        ) : activities.length === 0 ? (
          <EmptyState title="No activity recorded" description="Actions performed in the admin panel will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity Type</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Admin</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.map(log => (
                  <tr key={log.id} className="border-b">
                    <td className="p-3 font-medium capitalize">{log.action}</td>
                    <td className="p-3 capitalize">{log.entityType}</td>
                    <td className="p-3 text-sm text-muted-foreground truncate max-w-xs">{log.details}</td>
                    <td className="p-3">{log.adminName || log.adminEmail || 'Admin'}</td>
                    <td className="p-3 text-sm">{new Date(log.createdAt || log.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-4 flex justify-center">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
