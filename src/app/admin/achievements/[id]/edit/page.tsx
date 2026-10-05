'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm as useRHForm } from 'react-hook-form';
import { Button, Input, Textarea, Card, Skeleton } from '@/components/ui';
import ImageUpload from '@/components/admin/ImageUpload';
import { toast } from 'sonner';

export default function EditAchievementPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useRHForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/achievements/${params.id}`);
      const data = await res.json();
      if (data.date) data.date = data.date.split('T')[0];
      reset(data);
    } catch (err) {
      toast.error('Failed to load achievement');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/admin/achievements/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update achievement');
      toast.success('Achievement updated successfully');
      router.push('/admin/achievements');
    } catch (err) {
      toast.error(err.message || 'Error updating achievement');
    }
  };

  if (loading) return <Skeleton className="h-96 w-full max-w-3xl mx-auto" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Edit Achievement</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label>Title</label>
            <Input {...register('title', { required: true })} />
          </div>
          
          <div className="space-y-2">
            <label>Description</label>
            <Textarea {...register('description')} rows={4} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Date</label>
              <Input type="date" {...register('date', { required: true })} />
            </div>
            <div className="space-y-2">
              <label>Link (Optional)</label>
              <Input type="url" {...register('link')} />
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
            <Button type="button" variant="outline" onClick={() => router.push('/admin/achievements')}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Update Achievement</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
