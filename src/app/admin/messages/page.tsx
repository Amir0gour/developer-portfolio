'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Card, Badge, Modal, ConfirmDialog, EmptyState, Skeleton, Pagination } from '@/components/ui';
import { Search, Star, Trash2, Mail, Archive, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, [statusFilter, search, page]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (statusFilter !== 'all') query.append('status', statusFilter);
      if (search) query.append('search', search);

      const res = await fetch(`/api/admin/messages?${query}`);
      const data = await res.json();
      setMessages(data.messages || data);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const updateMessage = async (id, updates) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        toast.success('Message updated');
        fetchMessages();
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage({ ...selectedMessage, ...updates });
        }
      }
    } catch (err) {
      toast.error('Error updating message');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/messages/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Message deleted');
        setSelectedMessage(null);
        fetchMessages();
      }
    } catch (err) {
      toast.error('Error deleting message');
    } finally {
      setDeleteId(null);
    }
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      updateMessage(msg.id, { status: 'read' });
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'unread': return <Badge className="bg-blue-500">Unread</Badge>;
      case 'read': return <Badge variant="secondary">Read</Badge>;
      case 'archived': return <Badge variant="outline">Archived</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>
      
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'unread', 'read', 'archived', 'important'].map(filter => (
              <Button 
                key={filter} 
                variant={statusFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setStatusFilter(filter); setPage(1); }}
                className="capitalize"
              >
                {filter}
              </Button>
            ))}
          </div>
          
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {loading ? (
          <Skeleton className="h-96 w-full" />
        ) : messages.length === 0 ? (
          <EmptyState title="No messages found" description="Try a different filter or search term." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3 w-10"></th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => (
                  <tr key={msg.id} className={`border-b hover:bg-muted/50 cursor-pointer ${msg.status === 'unread' ? 'font-semibold bg-muted/20' : ''}`} onClick={() => openMessage(msg)}>
                    <td className="p-3" onClick={(e) => { e.stopPropagation(); updateMessage(msg.id, { isImportant: !msg.isImportant }); }}>
                      <Star className={`w-5 h-5 ${msg.isImportant ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                    </td>
                    <td className="p-3">
                      <div>{msg.name}</div>
                      <div className="text-xs text-muted-foreground font-normal">{msg.email}</div>
                    </td>
                    <td className="p-3 truncate max-w-[200px]">{msg.subject}</td>
                    <td className="p-3">{statusBadge(msg.status)}</td>
                    <td className="p-3 text-sm">{new Date(msg.createdAt || msg.date).toLocaleString()}</td>
                    <td className="p-3 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => updateMessage(msg.id, { status: 'archived' })} title="Archive">
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(msg.id)} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-4 flex justify-center">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </div>
        )}
      </Card>

      <Modal isOpen={!!selectedMessage} onClose={() => setSelectedMessage(null)} title="View Message">
        {selectedMessage && (
          <div className="space-y-4">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h3 className="font-bold text-lg flex items-center">
                  {selectedMessage.subject}
                  {selectedMessage.isImportant && <Star className="w-4 h-4 ml-2 fill-yellow-400 text-yellow-400" />}
                </h3>
                <p className="text-sm">From: <strong>{selectedMessage.name}</strong> &lt;{selectedMessage.email}&gt;</p>
                <p className="text-xs text-muted-foreground">Date: {new Date(selectedMessage.createdAt || selectedMessage.date).toLocaleString()}</p>
              </div>
              <div>{statusBadge(selectedMessage.status)}</div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-md whitespace-pre-wrap min-h-[150px]">
              {selectedMessage.message || selectedMessage.content}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => updateMessage(selectedMessage.id, { status: selectedMessage.status === 'unread' ? 'read' : 'unread' })}>
                  Mark as {selectedMessage.status === 'unread' ? 'Read' : 'Unread'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => updateMessage(selectedMessage.id, { isImportant: !selectedMessage.isImportant })}>
                  {selectedMessage.isImportant ? 'Remove Star' : 'Star'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => { updateMessage(selectedMessage.id, { status: 'archived' }); setSelectedMessage(null); }}>
                  Archive
                </Button>
              </div>
              <Button variant="destructive" size="sm" onClick={() => setDeleteId(selectedMessage.id)}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
      />
    </div>
  );
}
