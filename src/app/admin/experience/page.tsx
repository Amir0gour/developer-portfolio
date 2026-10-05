'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, Badge, ConfirmDialog, EmptyState, Skeleton } from '@/components/ui';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/admin/experience');
      const data = await res.json();
      setExperiences(data);
    } catch (err) {
      toast.error('Failed to fetch experience data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/experience/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Experience entry deleted');
        fetchExperiences();
      } else {
        toast.error('Failed to delete entry');
      }
    } catch (err) {
      toast.error('Error deleting entry');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Experience</h1>
        <Link href="/admin/experience/new">
          <Button><Plus className="w-4 h-4 mr-2" /> Add Experience</Button>
        </Link>
      </div>
      
      <Card className="p-4">
        {experiences.length === 0 ? (
          <EmptyState title="No experience entries" description="Add your work history." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Company</th>
                  <th className="p-3">Position</th>
                  <th className="p-3">Date Range</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map(exp => (
                  <tr key={exp.id} className="border-b">
                    <td className="p-3 font-medium">{exp.company}</td>
                    <td className="p-3">{exp.position}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {exp.isCurrent && <Badge variant="default">Current</Badge>}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Link href={`/admin/experience/${exp.id}/edit`}>
                        <Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteId(exp.id)}>
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
        title="Delete Experience"
        description="Are you sure you want to delete this experience entry?"
      />
    </div>
  );
}
