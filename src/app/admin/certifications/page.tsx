'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, ConfirmDialog, EmptyState, Skeleton } from '@/components/ui';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const res = await fetch('/api/admin/certifications');
      const data = await res.json();
      setCertifications(data);
    } catch (err) {
      toast.error('Failed to fetch certifications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/certifications/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Certification deleted');
        fetchCertifications();
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      toast.error('Error deleting certification');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Certifications</h1>
        <Link href="/admin/certifications/new">
          <Button><Plus className="w-4 h-4 mr-2" /> Add Certification</Button>
        </Link>
      </div>
      
      <Card className="p-4">
        {certifications.length === 0 ? (
          <EmptyState title="No certifications" description="Add your certifications and licenses." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Name</th>
                  <th className="p-3">Organization</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certifications.map(cert => (
                  <tr key={cert.id} className="border-b">
                    <td className="p-3 font-medium">{cert.name}</td>
                    <td className="p-3">{cert.organization}</td>
                    <td className="p-3 text-sm">{new Date(cert.issueDate).toLocaleDateString()}</td>
                    <td className="p-3 text-right space-x-2">
                      <Link href={`/admin/certifications/${cert.id}/edit`}>
                        <Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteId(cert.id)}>
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
        title="Delete Certification"
        description="Are you sure you want to delete this certification?"
      />
    </div>
  );
}
