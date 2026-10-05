'use client';

import { useEffect, useState } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { Button, Input, Textarea, Select, Card, Skeleton } from '@/components/ui';
import ImageUpload from '@/components/admin/ImageUpload';
import { toast } from 'sonner';

export default function SeoSettingsPage() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useRHForm();

  useEffect(() => {
    fetchSeo();
  }, []);

  const fetchSeo = async () => {
    try {
      const res = await fetch('/api/admin/seo');
      const data = await res.json();
      reset(data);
    } catch (err) {
      toast.error('Failed to load SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to save SEO settings');
      toast.success('SEO settings saved successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Skeleton className="h-[500px] max-w-3xl" />;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">SEO Settings</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label>Site Title</label>
            <Input {...register('siteTitle')} />
          </div>

          <div className="space-y-2">
            <label>Meta Description</label>
            <Textarea {...register('metaDescription')} rows={3} />
          </div>

          <div className="space-y-2">
            <label>Keywords (comma separated)</label>
            <Input {...register('keywords')} />
          </div>

          <div className="space-y-2">
            <label>Default OG Image</label>
            <ImageUpload value={watch('ogImage')} onChange={(url) => setValue('ogImage', url)} />
            <p className="text-xs text-muted-foreground">Default image shown when links are shared on social media.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Twitter Card Type</label>
              <Select {...register('twitterCard')}>
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary Large Image</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label>Twitter Handle</label>
              <Input {...register('twitterHandle')} placeholder="@yourhandle" />
            </div>
          </div>

          <div className="space-y-2">
            <label>Canonical URL</label>
            <Input type="url" {...register('canonicalUrl')} placeholder="https://yourdomain.com" />
          </div>
          
          <Button type="submit" disabled={isSubmitting}>Save SEO Settings</Button>
        </form>
      </Card>
    </div>
  );
}
