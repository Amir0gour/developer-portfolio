'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Select, Card, Badge, ConfirmDialog, EmptyState, Skeleton } from '@/components/ui';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/blog/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Post deleted');
        fetchPosts();
      } else {
        toast.error('Failed to delete post');
      }
    } catch (err) {
      toast.error('Error deleting post');
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = posts.filter(p => statusFilter === 'all' || p.status === statusFilter);

  if (loading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog/new">
          <Button><Plus className="w-4 h-4 mr-2" /> New Post</Button>
        </Link>
      </div>
      
      <Card className="p-4">
        <div className="flex gap-4 mb-4">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-48">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No posts found" description="Create a new blog post to get started." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Tags</th>
                  <th className="p-3">Published Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post.id} className="border-b">
                    <td className="p-3 font-medium">{post.title}</td>
                    <td className="p-3">
                      <Badge variant={post.status === 'published' ? 'success' : 'warning'}>
                        {post.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{post.tags?.join(', ') || '-'}</td>
                    <td className="p-3 text-sm">{post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : '-'}</td>
                    <td className="p-3 text-right space-x-2">
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteId(post.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete}
        title="Delete Post"
        description="Are you sure you want to delete this blog post?"
      />
    </div>
  );
}
