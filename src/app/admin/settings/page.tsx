'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { Button, Input, Card, Skeleton } from '@/components/ui';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useRHForm();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      
      // Convert array of settings to object for form
      const formValues = {};
      data.forEach(item => {
        formValues[item.key] = item.value;
      });
      reset(formValues);
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Convert object back to array
      const payload = Object.entries(data).map(([key, value]) => ({
        key, value, group: 'general'
      }));

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save settings');
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Skeleton className="h-64 max-w-2xl" />;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">General Settings</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label>Footer Text</label>
            <Input {...register('footer_text')} placeholder="© 2024 Your Name. All rights reserved." />
            <p className="text-xs text-muted-foreground">Text displayed at the bottom of the site.</p>
          </div>

          <div className="space-y-2">
            <label>Availability Status</label>
            <Input {...register('availability')} placeholder="Available for freelance work" />
            <p className="text-xs text-muted-foreground">Shown in your hero or about section.</p>
          </div>
          
          <Button type="submit" disabled={isSubmitting}>Save Settings</Button>
        </form>
      </Card>
    </div>
  );
}
