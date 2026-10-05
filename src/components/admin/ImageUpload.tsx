'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageUploadProps { value: string; onChange: (url: string) => void; accept?: string; className?: string; }

export default function ImageUpload({ value, onChange, accept, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
      const data = await res.json();
      onChange(data.url);
      toast.success('Uploaded');
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Upload failed'); }
    finally { setUploading(false); }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: accept ? { [accept]: [] } : { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'] }, maxFiles: 1, disabled: uploading,
  });

  if (value) {
    return (
      <div className={cn('relative inline-block', className)}>
        <Image src={value} alt="Upload" width={200} height={200} className="rounded-lg border border-border object-cover" />
        <button type="button" onClick={() => onChange('')} className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground"><X className="h-4 w-4" /></button>
      </div>
    );
  }

  return (
    <div {...getRootProps()} className={cn('border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors', isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50', uploading && 'opacity-50 cursor-not-allowed', className)}>
      <input {...getInputProps()} />
      {uploading ? <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" /> : <><Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" /><p className="text-sm text-muted-foreground">{isDragActive ? 'Drop here' : 'Drag & drop or click to upload'}</p></>}
    </div>
  );
}
