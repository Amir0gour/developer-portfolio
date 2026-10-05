'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps { value: string[]; onChange: (tags: string[]) => void; placeholder?: string; className?: string; }

export default function TagInput({ value, onChange, placeholder = 'Type and press Enter', className }: TagInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); const tag = input.trim(); if (tag && !value.includes(tag)) onChange([...value, tag]); setInput(''); }
    if (e.key === 'Backspace' && !input && value.length > 0) onChange(value.slice(0, -1));
  };

  return (
    <div className={cn('flex flex-wrap gap-2 p-2 rounded-md border border-border bg-background min-h-[42px]', className)}>
      {value.map((tag) => (
        <span key={tag} className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-primary/10 text-primary">
          {tag}<button type="button" onClick={() => onChange(value.filter(t => t !== tag))} className="hover:text-destructive"><X className="h-3 w-3" /></button>
        </span>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={value.length === 0 ? placeholder : ''} className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" />
    </div>
  );
}
