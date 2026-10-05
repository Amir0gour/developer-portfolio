'use client';

import { useState, useEffect } from 'react';
import { Button, Card, ConfirmDialog, EmptyState, Skeleton } from '@/components/ui';
import { UploadCloud, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MediaPage() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      setMedia(data);
    } catch (err) {
      toast.error('Failed to load media files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        toast.success('File uploaded successfully');
        fetchMedia();
      } else {
        toast.error('Upload failed');
      }
    } catch (err) {
      toast.error('Error uploading file');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/media/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('File deleted');
        fetchMedia();
      }
    } catch (err) {
      toast.error('Error deleting file');
    } finally {
      setDeleteId(null);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Media Library</h1>
      
      <Card className="p-8 border-dashed flex flex-col items-center justify-center bg-muted/20">
        <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
        <p className="text-sm text-muted-foreground mb-4">Drag and drop or click to browse</p>
        <div className="relative">
          <Button disabled={uploading}>{uploading ? 'Uploading...' : 'Select File'}</Button>
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={handleFileUpload}
            disabled={uploading}
            accept="image/*"
          />
        </div>
      </Card>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : media.length === 0 ? (
        <EmptyState title="No media files" description="Upload images to use in your projects or blog posts." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map(item => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="aspect-square bg-muted relative">
                <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <Button variant="secondary" size="icon" onClick={() => copyToClipboard(item.url)} title="Copy URL">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => setDeleteId(item.id)} title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2 text-xs">
                <p className="truncate font-medium" title={item.filename}>{item.filename}</p>
                <div className="flex justify-between text-muted-foreground mt-1">
                  <span>{formatSize(item.size)}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete}
        title="Delete File"
        description="Are you sure you want to delete this file? Any content using it will break."
      />
    </div>
  );
}
