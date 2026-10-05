'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Select, Card, ConfirmDialog, Modal, EmptyState, Skeleton } from '@/components/ui';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useForm as useRHForm } from 'react-hook-form';

export default function SkillsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isSkillModalOpen, setSkillModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: null, id: null });
  const [editingItem, setEditingItem] = useState(null);
  
  const categoryForm = useRHForm({ defaultValues: { name: '', icon: '', order: 0 } });
  const skillForm = useRHForm({ defaultValues: { name: '', level: 'beginner', icon: '', order: 0, categoryId: '' } });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/skills/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const onCategorySubmit = async (data) => {
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `/api/admin/skills/categories/${editingItem.id}` : '/api/admin/skills/categories';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Failed to save category');
      toast.success(`Category ${editingItem ? 'updated' : 'added'}`);
      setCategoryModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const onSkillSubmit = async (data) => {
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `/api/admin/skills/${editingItem.id}` : '/api/admin/skills';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Failed to save skill');
      toast.success(`Skill ${editingItem ? 'updated' : 'added'}`);
      setSkillModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    const { type, id } = deleteConfirm;
    try {
      const res = await fetch(`/api/admin/skills/${type === 'category' ? 'categories/' : ''}${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(`${type} deleted`);
        fetchData();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteConfirm({ isOpen: false, type: null, id: null });
    }
  };

  const openAddCategory = () => {
    setEditingItem(null);
    categoryForm.reset({ name: '', icon: '', order: 0 });
    setCategoryModalOpen(true);
  };

  const openEditCategory = (cat) => {
    setEditingItem(cat);
    categoryForm.reset({ name: cat.name, icon: cat.icon || '', order: cat.order || 0 });
    setCategoryModalOpen(true);
  };

  const openAddSkill = (categoryId) => {
    setEditingItem(null);
    skillForm.reset({ name: '', level: 'beginner', icon: '', order: 0, categoryId });
    setSkillModalOpen(true);
  };

  const openEditSkill = (skill, categoryId) => {
    setEditingItem(skill);
    skillForm.reset({ name: skill.name, level: skill.level, icon: skill.icon || '', order: skill.order || 0, categoryId });
    setSkillModalOpen(true);
  };

  if (loading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Skills Management</h1>
        <Button onClick={openAddCategory}><Plus className="w-4 h-4 mr-2" /> Add Category</Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="No categories found" description="Add a category to start organizing your skills." />
      ) : (
        <div className="space-y-6">
          {categories.map(cat => (
            <Card key={cat.id} className="p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-xl font-semibold flex items-center">
                  {cat.icon && <span className="mr-2">{cat.icon}</span>}
                  {cat.name}
                </h2>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openAddSkill(cat.id)}>
                    <Plus className="w-3 h-3 mr-1" /> Add Skill
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEditCategory(cat)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteConfirm({ isOpen: true, type: 'category', id: cat.id })}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cat.skills && cat.skills.map(skill => (
                  <div key={skill.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/20">
                    <div>
                      <p className="font-medium flex items-center">
                        {skill.icon && <span className="mr-2">{skill.icon}</span>}
                        {skill.name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{skill.level}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditSkill(skill, cat.id)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteConfirm({ isOpen: true, type: 'skill', id: skill.id })}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {(!cat.skills || cat.skills.length === 0) && (
                  <p className="text-sm text-muted-foreground italic col-span-full">No skills added yet.</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)} title={editingItem ? "Edit Category" : "Add Category"}>
        <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
          <div className="space-y-2">
            <label>Name</label>
            <Input {...categoryForm.register('name', { required: true })} />
          </div>
          <div className="space-y-2">
            <label>Icon (emoji/class)</label>
            <Input {...categoryForm.register('icon')} />
          </div>
          <div className="space-y-2">
            <label>Order</label>
            <Input type="number" {...categoryForm.register('order')} />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setCategoryModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isSkillModalOpen} onClose={() => setSkillModalOpen(false)} title={editingItem ? "Edit Skill" : "Add Skill"}>
        <form onSubmit={skillForm.handleSubmit(onSkillSubmit)} className="space-y-4">
          <input type="hidden" {...skillForm.register('categoryId')} />
          <div className="space-y-2">
            <label>Name</label>
            <Input {...skillForm.register('name', { required: true })} />
          </div>
          <div className="space-y-2">
            <label>Level</label>
            <Select {...skillForm.register('level')}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label>Icon</label>
            <Input {...skillForm.register('icon')} />
          </div>
          <div className="space-y-2">
            <label>Order</label>
            <Input type="number" {...skillForm.register('order')} />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setSkillModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={deleteConfirm.isOpen} 
        onClose={() => setDeleteConfirm({ isOpen: false, type: null, id: null })} 
        onConfirm={handleDelete}
        title={`Delete ${deleteConfirm.type}`}
        description={`Are you sure you want to delete this ${deleteConfirm.type}? This action cannot be undone.`}
      />
    </div>
  );
}
