'use client';
export const dynamic = 'force-dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-form'; // Note: react-hook-form as requested
import { useForm as useRHForm } from 'react-hook-form';
import { Button, Input, Textarea, Card, Select, Switch } from '@/components/ui';
import TagInput from '@/components/admin/TagInput';
import ImageUpload from '@/components/admin/ImageUpload';
import { generateSlug } from '@/lib/utils';
import { toast } from 'sonner';

export default function NewProjectPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useRHForm({
    defaultValues: {
      title: '', slug: '', description: '', thumbnail: '', techStack: [], features: [],
      githubUrl: '', liveUrl: '', category: 'fullstack', featured: false, published: false, order: 0
    }
  });

  const title = watch('title');

  useEffect(() => {
    if (title) setValue('slug', generateSlug(title), { shouldValidate: true });
  }, [title, setValue]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create project');
      toast.success('Project created successfully');
      router.push('/admin/projects');
    } catch (err) {
      toast.error(err.message || 'Error creating project');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">New Project</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Title</label>
              <Input {...register('title', { required: true })} />
            </div>
            <div className="space-y-2">
              <label>Slug</label>
              <Input {...register('slug', { required: true })} />
            </div>
          </div>
          
          <div className="space-y-2">
            <label>Description</label>
            <Textarea {...register('description', { required: true })} rows={4} />
          </div>

          <div className="space-y-2">
            <label>Thumbnail</label>
            <ImageUpload value={watch('thumbnail')} onChange={(url) => setValue('thumbnail', url)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Tech Stack</label>
              <TagInput value={watch('techStack')} onChange={(tags) => setValue('techStack', tags)} />
            </div>
            <div className="space-y-2">
              <label>Features</label>
              <TagInput value={watch('features')} onChange={(tags) => setValue('features', tags)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>GitHub URL</label>
              <Input {...register('githubUrl')} />
            </div>
            <div className="space-y-2">
              <label>Live URL</label>
              <Input {...register('liveUrl')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Category</label>
              <Select {...register('category')}>
                <option value="fullstack">Fullstack</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="mobile">Mobile</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label>Order</label>
              <Input type="number" {...register('order')} />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Switch checked={watch('featured')} onCheckedChange={(val) => setValue('featured', val)} />
              <label>Featured</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={watch('published')} onCheckedChange={(val) => setValue('published', val)} />
              <label>Published</label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/projects')}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Save Project</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
