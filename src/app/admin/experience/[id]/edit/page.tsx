'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm as useRHForm } from 'react-hook-form';
import { Button, Input, Textarea, Card, Switch, Skeleton } from '@/components/ui';
import TagInput from '@/components/admin/TagInput';
import { toast } from 'sonner';

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useRHForm();
  const isCurrent = watch('isCurrent');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/experience/${params.id}`);
      const data = await res.json();
      if (data.startDate) data.startDate = data.startDate.split('T')[0];
      if (data.endDate) data.endDate = data.endDate.split('T')[0];
      reset(data);
    } catch (err) {
      toast.error('Failed to load experience');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (data.isCurrent) data.endDate = null;
      const res = await fetch(`/api/admin/experience/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update experience');
      toast.success('Experience updated successfully');
      router.push('/admin/experience');
    } catch (err) {
      toast.error(err.message || 'Error updating experience');
    }
  };

  if (loading) return <Skeleton className="h-96 w-full max-w-3xl mx-auto" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Edit Experience</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Company</label>
              <Input {...register('company', { required: true })} />
            </div>
            <div className="space-y-2">
              <label>Position</label>
              <Input {...register('position', { required: true })} />
            </div>
          </div>
          
          <div className="space-y-2">
            <label>Location</label>
            <Input {...register('location')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Start Date</label>
              <Input type="date" {...register('startDate', { required: true })} />
            </div>
            {!isCurrent && (
              <div className="space-y-2">
                <label>End Date</label>
                <Input type="date" {...register('endDate', { required: !isCurrent })} />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch checked={isCurrent} onCheckedChange={(val) => setValue('isCurrent', val)} />
            <label>I currently work here</label>
          </div>

          <div className="space-y-2">
            <label>Description</label>
            <Textarea {...register('description')} rows={4} />
          </div>

          <div className="space-y-2">
            <label>Technologies Used</label>
            <TagInput value={watch('technologies') || []} onChange={(t) => setValue('technologies', t)} />
          </div>
          
          <div className="space-y-2 w-1/3">
            <label>Order</label>
            <Input type="number" {...register('order')} />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/experience')}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Update Experience</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
