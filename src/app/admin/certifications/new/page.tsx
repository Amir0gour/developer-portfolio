'use client';

import { useRouter } from 'next/navigation';
import { useForm as useRHForm } from 'react-hook-form';
import { Button, Input, Card } from '@/components/ui';
import ImageUpload from '@/components/admin/ImageUpload';
import { toast } from 'sonner';

export default function NewCertificationPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useRHForm({
    defaultValues: { name: '', organization: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '', imageUrl: '', order: 0 }
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch('/api/admin/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to add certification');
      toast.success('Certification added successfully');
      router.push('/admin/certifications');
    } catch (err) {
      toast.error(err.message || 'Error adding certification');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Add Certification</h1>
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
            <Button type="submit" disabled={isSubmitting}>Save Certification</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
