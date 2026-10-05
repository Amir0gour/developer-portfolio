'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, ConfirmDialog, EmptyState, Skeleton } from '@/components/ui';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/admin/achievements');
      const data = await res.json();
      setAchievements(data);
    } catch (err) {
      toast.error('Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/achievements/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Achievement deleted');
        fetchAchievements();
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      toast.error('Error deleting achievement');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Achievements</h1>
        <Link href="/admin/achievements/new">
          <Button><Plus className="w-4 h-4 mr-2" /> Add Achievement</Button>
        </Link>
      </div>
      
      <Card className="p-4">
        {achievements.length === 0 ? (
          <EmptyState title="No achievements" description="Add your awards and achievements." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Title</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3 font-medium">{item.title}</td>
                    <td className="p-3 text-sm">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="p-3 text-right space-x-2">
                      <Link href={`/admin/achievements/${item.id}/edit`}>
                        <Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete}
        title="Delete Achievement"
        description="Are you sure you want to delete this achievement?"
      />
    </div>
  );
}
