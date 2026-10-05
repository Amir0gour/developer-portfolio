'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, Badge, ConfirmDialog, EmptyState, Skeleton } from '@/components/ui';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EducationPage() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const res = await fetch('/api/admin/education');
      const data = await res.json();
      setEducation(data);
    } catch (err) {
      toast.error('Failed to fetch education data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/education/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Education entry deleted');
        fetchEducation();
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
        <h1 className="text-3xl font-bold">Education</h1>
        <Link href="/admin/education/new">
          <Button><Plus className="w-4 h-4 mr-2" /> Add Education</Button>
        </Link>
      </div>
      
      <Card className="p-4">
        {education.length === 0 ? (
          <EmptyState title="No education entries" description="Add your educational background." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Institution</th>
                  <th className="p-3">Degree</th>
                  <th className="p-3">Field</th>
                  <th className="p-3">Date Range</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {education.map(edu => (
                  <tr key={edu.id} className="border-b">
                    <td className="p-3 font-medium">{edu.institution}</td>
                    <td className="p-3">{edu.degree}</td>
                    <td className="p-3">{edu.field}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {new Date(edu.startDate).toLocaleDateString()} - {edu.isCurrent ? 'Present' : new Date(edu.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Link href={`/admin/education/${edu.id}/edit`}>
                        <Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteId(edu.id)}>
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
        title="Delete Education"
        description="Are you sure you want to delete this education entry?"
      />
    </div>
  );
}
