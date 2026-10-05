'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm as useRHForm } from 'react-hook-form';
import { Button, Input, Textarea, Card, Select } from '@/components/ui';
import TagInput from '@/components/admin/TagInput';
import ImageUpload from '@/components/admin/ImageUpload';
import { generateSlug } from '@/lib/utils';
import { toast } from 'sonner';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [existingTags, setExistingTags] = useState([]);
  
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useRHForm({
    defaultValues: {
      title: '', slug: '', excerpt: '', content: '', coverImage: '', status: 'draft',
      seoTitle: '', seoDescription: '', tags: []
    }
  });

  const title = watch('title');

  useEffect(() => {
    if (title) setValue('slug', generateSlug(title), { shouldValidate: true });
  }, [title, setValue]);

  useEffect(() => {
    fetch('/api/admin/blog/tags')
      .then(res => res.json())
      .then(data => setExistingTags(data))
      .catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create post');
      toast.success('Post created successfully');
      router.push('/admin/blog');
    } catch (err) {
      toast.error(err.message || 'Error creating post');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">New Blog Post</h1>
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
            <label>Excerpt</label>
            <Textarea {...register('excerpt')} rows={3} />
          </div>

          <div className="space-y-2">
            <label>Content</label>
            <Textarea {...register('content', { required: true })} rows={15} className="font-mono" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Cover Image</label>
              <ImageUpload value={watch('coverImage')} onChange={(url) => setValue('coverImage', url)} />
            </div>
            <div className="space-y-2">
              <label>Status</label>
              <Select {...register('status')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label>Tags</label>
            <TagInput value={watch('tags')} onChange={(t) => setValue('tags', t)} suggestions={existingTags} />
          </div>

          <div className="border-t pt-4 space-y-4">
            <h3 className="font-semibold">SEO Settings</h3>
            <div className="space-y-2">
              <label>SEO Title</label>
              <Input {...register('seoTitle')} />
            </div>
            <div className="space-y-2">
              <label>SEO Description</label>
              <Textarea {...register('seoDescription')} rows={2} />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/blog')}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Save Post</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
