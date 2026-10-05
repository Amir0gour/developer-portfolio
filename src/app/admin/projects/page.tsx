'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Input, Card, Badge, ConfirmDialog, EmptyState, Skeleton } from '@/components/ui';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/projects/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Project deleted');
        fetchProjects();
      } else {
        toast.error('Failed to delete project');
      }
    } catch (err) {
      toast.error('Error deleting project');
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link href="/admin/projects/new">
          <Button><Plus className="w-4 h-4 mr-2" /> New Project</Button>
        </Link>
      </div>
      
      <Card className="p-4">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search projects..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No projects found" description="Try a different search term or create a new project." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(project => (
                  <tr key={project.id} className="border-b">
                    <td className="p-3 font-medium">{project.title}</td>
                    <td className="p-3 capitalize">{project.category}</td>
                    <td className="p-3 space-x-2">
                      {project.featured && <Badge variant="default">Featured</Badge>}
                      {project.published ? <Badge variant="success">Published</Badge> : <Badge variant="secondary">Draft</Badge>}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        <Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteId(project.id)}>
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
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
      />
    </div>
  );
}
