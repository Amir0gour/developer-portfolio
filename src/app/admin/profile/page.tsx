'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import ImageUpload from '@/components/admin/ImageUpload';
import { Save } from 'lucide-react';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetch('/api/admin/profile').then(r => r.json()).then(data => {
      if (data) Object.entries(data).forEach(([k, v]) => { if (v != null) setValue(k, v); });
    }).finally(() => setLoading(false));
  }, [setValue]);

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/admin/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Profile updated');
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed'); }
  };

  if (loading) return <div className="space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="h-12 rounded bg-card animate-pulse" />)}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Avatar</h2>
          <ImageUpload value={watch('avatarUrl') || ''} onChange={(url) => setValue('avatarUrl', url)} />
        </div>
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" {...register('name')} />
            <Input label="Professional Title" {...register('title')} />
            <Input label="Email" type="email" {...register('email')} />
            <Input label="Phone" {...register('phone')} />
            <Input label="Location" {...register('location')} />
            <Input label="Availability" {...register('availability')} />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">About</h2>
          <Textarea label="Short Introduction" rows={3} {...register('shortIntro')} />
          <Textarea label="Full Bio" rows={8} {...register('bio')} />
        </div>
        <Button type="submit" loading={isSubmitting}><Save className="h-4 w-4 mr-2" />Save Profile</Button>
      </form>
    </div>
  );
}
