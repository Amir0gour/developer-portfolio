'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm as useRHForm } from 'react-hook-form';
import { Button, Input, Card, Skeleton } from '@/components/ui';
import ImageUpload from '@/components/admin/ImageUpload';
import { toast } from 'sonner';

export default function EditCertificationPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useRHForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/certifications/${params.id}`);
      const data = await res.json();
      if (data.issueDate) data.issueDate = data.issueDate.split('T')[0];
      if (data.expiryDate) data.expiryDate = data.expiryDate.split('T')[0];
      reset(data);
    } catch (err) {
      toast.error('Failed to load certification');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/admin/certifications/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update certification');
      toast.success('Certification updated successfully');
      router.push('/admin/certifications');
    } catch (err) {
      toast.error(err.message || 'Error updating certification');
    }
  };

  if (loading) return <Skeleton className="h-96 w-full max-w-3xl mx-auto" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Edit Certification</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Name</label>
              <Input {...register('name', { required: true })} />
            </div>
            <div className="space-y-2">
              <label>Organization</label>
              <Input {...register('organization', { required: true })} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Issue Date</label>
              <Input type="date" {...register('issueDate', { required: true })} />
            </div>
            <div className="space-y-2">
              <label>Expiry Date</label>
              <Input type="date" {...register('expiryDate')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Credential ID</label>
              <Input {...register('credentialId')} />
            </div>
            <div className="space-y-2">
              <label>Credential URL</label>
              <Input type="url" {...register('credentialUrl')} />
            </div>
          </div>

          <div className="space-y-2">
            <label>Image (Optional)</label>
            <ImageUpload value={watch('imageUrl')} onChange={(url) => setValue('imageUrl', url)} />
          </div>
          
          <div className="space-y-2 w-1/3">
            <label>Order</label>
            <Input type="number" {...register('order')} />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/certifications')}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Update Certification</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
