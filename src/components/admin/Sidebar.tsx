'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { LayoutDashboard, User, FolderKanban, Briefcase, GraduationCap, Wrench, Award, Trophy, FileText, MessageSquare, Share2, Image, Settings, Search, Activity, LogOut, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/admin/profile', icon: User },
  { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { label: 'Experience', href: '/admin/experience', icon: Briefcase },
  { label: 'Education', href: '/admin/education', icon: GraduationCap },
  { label: 'Skills', href: '/admin/skills', icon: Wrench },
  { label: 'Certifications', href: '/admin/certifications', icon: Award },
  { label: 'Achievements', href: '/admin/achievements', icon: Trophy },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Social Links', href: '/admin/social-links', icon: Share2 },
  { label: 'Media', href: '/admin/media', icon: Image },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'SEO', href: '/admin/seo', icon: Search },
  { label: 'Activity', href: '/admin/activity', icon: Activity },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="fixed top-4 left-4 z-50 p-2 rounded-md bg-card border border-border lg:hidden"><Menu className="h-5 w-5" /></button>
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={cn('fixed top-0 left-0 z-50 h-screen bg-card border-r border-border flex flex-col transition-all duration-300', collapsed ? 'w-16' : 'w-64', mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && <h1 className="text-lg font-bold gradient-text">Admin</h1>}
          <button onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }} className="p-1 rounded hover:bg-accent hidden lg:block">{collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}</button>
          <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-accent lg:hidden"><X className="h-4 w-4" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground')}>
                <item.icon className="h-5 w-5 flex-shrink-0" />{!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors')}>
            <LogOut className="h-5 w-5 flex-shrink-0" />{!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
