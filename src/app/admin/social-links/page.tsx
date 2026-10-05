'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { Button, Input, Select, Card, Switch, ConfirmDialog, Modal, EmptyState, Skeleton } from '@/components/ui';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useForm as useRHForm } from 'react-hook-form';

export default function SocialLinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useRHForm({
    defaultValues: { platform: 'github', url: '', enabled: true, order: 0 }
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/admin/social-links');
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      toast.error('Failed to load social links');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `/api/admin/social-links/${editingItem.id}` : '/api/admin/social-links';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Failed to save link');
      toast.success(`Social link ${editingItem ? 'updated' : 'added'}`);
      setModalOpen(false);
      fetchLinks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggle = async (id, enabled) => {
    try {
      await fetch(`/api/admin/social-links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });
      fetchLinks();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/social-links/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Social link deleted');
        fetchLinks();
      }
    } catch (err) {
      toast.error('Error deleting link');
    } finally {
      setDeleteId(null);
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    reset({ platform: 'github', url: '', enabled: true, order: 0 });
    setModalOpen(true);
  };

  const openEdit = (link) => {
    setEditingItem(link);
    reset(link);
    setModalOpen(true);
  };

  if (loading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Social Links</h1>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Add Link</Button>
      </div>
      
      <Card className="p-4">
        {links.length === 0 ? (
          <EmptyState title="No social links" description="Add your social media profiles." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Platform</th>
                  <th className="p-3">URL</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map(link => (
                  <tr key={link.id} className="border-b">
                    <td className="p-3 font-medium capitalize">{link.platform}</td>
                    <td className="p-3 text-sm text-muted-foreground truncate max-w-xs">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{link.url}</a>
                    </td>
                    <td className="p-3">
                      <Switch 
                        checked={link.enabled} 
                        onCheckedChange={(v) => handleToggle(link.id, v)} 
                      />
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(link)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteId(link.id)}>
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

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingItem ? "Edit Link" : "Add Link"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label>Platform</label>
            <Select {...register('platform')}>
              <option value="github">GitHub</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter / X</option>
              <option value="email">Email</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="website">Website (Other)</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label>URL</label>
            <Input type="url" {...register('url', { required: true })} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={watch('enabled')} onCheckedChange={(v) => setValue('enabled', v)} />
            <label>Enabled</label>
          </div>
          <div className="space-y-2">
            <label>Order</label>
            <Input type="number" {...register('order')} />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Save</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete}
        title="Delete Link"
        description="Are you sure you want to delete this social link?"
      />
    </div>
  );
}
