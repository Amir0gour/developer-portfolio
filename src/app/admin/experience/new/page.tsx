'use client';
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { useForm as useRHForm } from 'react-hook-form';
import { Button, Input, Textarea, Card, Switch } from '@/components/ui';
import TagInput from '@/components/admin/TagInput';
import { toast } from 'sonner';

export default function NewExperiencePage() {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useRHForm({
    defaultValues: {
      company: '', position: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '', technologies: [], order: 0
    }
  });

  const isCurrent = watch('isCurrent');

  const onSubmit = async (data) => {
    try {
      if (data.isCurrent) data.endDate = null;
      const res = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to add experience');
      toast.success('Experience added successfully');
      router.push('/admin/experience');
    } catch (err) {
      toast.error(err.message || 'Error adding experience');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Add Experience</h1>
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
            <TagInput value={watch('technologies')} onChange={(t) => setValue('technologies', t)} />
          </div>
          
          <div className="space-y-2 w-1/3">
            <label>Order</label>
            <Input type="number" {...register('order')} />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/experience')}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Save Experience</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
