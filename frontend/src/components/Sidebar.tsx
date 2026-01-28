'use client';

import { useState } from 'react';
import {
  MessageSquarePlus,
  History,
  Settings,
  LayoutGrid,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarItem } from './SidebarItem';
import { ModeToggle } from './mode-toggle';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 flex items-center gap-2 border-b border-border/40 h-16">
        <ShieldCheck className="w-6 h-6 text-primary" />
        {!collapsed && <span className="font-bold text-lg tracking-tight">AxiomeraAI</span>}
      </div>

      {/* Main Nav */}
      <div className="flex-1 p-3 space-y-1 overflow-y-auto">
        <SidebarItem
          icon={MessageSquarePlus}
          label={collapsed ? "" : "New Chat"}
          active
        />

        {!collapsed && (
          <div className="pt-6 pb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            History
          </div>
        )}

        <SidebarItem
          icon={History}
          label={collapsed ? "" : "P vs NP Proof"}
        />
        <SidebarItem
          icon={History}
          label={collapsed ? "" : "React Optimization"}
        />
        <SidebarItem
          icon={History}
          label={collapsed ? "" : "Climate Model"}
        />
      </div>

      {/* Footer Nav */}
      <div className="p-3 border-t border-border/40 space-y-1">
         <SidebarItem
          icon={LayoutGrid}
          label={collapsed ? "" : "Templates"}
        />
        <SidebarItem
          icon={Settings}
          label={collapsed ? "" : "Settings"}
        />

        <div className="pt-2 flex items-center justify-between px-1">
             {!collapsed && <span className="text-xs text-muted-foreground">Theme</span>}
             <div className="relative">
                <ModeToggle />
             </div>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-card border border-border rounded-full p-1 text-muted-foreground hover:text-foreground shadow-sm"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
