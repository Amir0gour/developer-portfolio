'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm as useRHForm } from 'react-hook-form';
import { Button, Input, Textarea, Card, Switch, Skeleton } from '@/components/ui';
import { toast } from 'sonner';

export default function EditEducationPage() {
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
      const res = await fetch(`/api/admin/education/${params.id}`);
      const data = await res.json();
      if (data.startDate) data.startDate = data.startDate.split('T')[0];
      if (data.endDate) data.endDate = data.endDate.split('T')[0];
      reset(data);
    } catch (err) {
      toast.error('Failed to load education');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (data.isCurrent) data.endDate = null;
      const res = await fetch(`/api/admin/education/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update education');
      toast.success('Education updated successfully');
      router.push('/admin/education');
    } catch (err) {
      toast.error(err.message || 'Error updating education');
    }
  };

  if (loading) return <Skeleton className="h-96 w-full max-w-3xl mx-auto" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Edit Education</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Institution</label>
              <Input {...register('institution', { required: true })} />
            </div>
            <div className="space-y-2">
              <label>Degree</label>
              <Input {...register('degree', { required: true })} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Field of Study</label>
              <Input {...register('field')} />
            </div>
            <div className="space-y-2">
              <label>Grade (GPA/Score)</label>
              <Input {...register('grade')} />
            </div>
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
            <label>I currently study here</label>
          </div>

          <div className="space-y-2">
            <label>Description</label>
            <Textarea {...register('description')} rows={4} />
          </div>
          
          <div className="space-y-2 w-1/3">
            <label>Order</label>
            <Input type="number" {...register('order')} />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/education')}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Update Education</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
