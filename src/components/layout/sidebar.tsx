'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileTextIcon,
  HelpCircleIcon,
  PlayCircleIcon,
  BarChart3Icon,
  SearchIcon,
  PlusIcon,
  ChevronLeftIcon,
  LayersIcon,
  BrainIcon,
  FileIcon,
  MessageSquareIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FolderTree } from './folder-tree'

const navItems = [
  { href: '/', icon: BarChart3Icon, label: 'Dashboard' },
  { href: '/notes', icon: FileTextIcon, label: 'Notlar' },
  { href: '/files', icon: FileIcon, label: 'Dosyalar' },
  { href: '/flashcards', icon: LayersIcon, label: 'Flashcards' },
  { href: '/questions', icon: HelpCircleIcon, label: 'Sorular' },
  { href: '/quiz', icon: PlayCircleIcon, label: 'Quiz' },
  { href: '/mind-map', icon: BrainIcon, label: 'Zihin Haritası' },
  { href: '/pdf-chat', icon: MessageSquareIcon, label: 'PDF Chat' },
  { href: '/analytics', icon: BarChart3Icon, label: 'Analitik' },
  { href: '/search', icon: SearchIcon, label: 'Ara' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-slate-900 text-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!collapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Smart Study
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <ChevronLeftIcon
            className={cn('h-5 w-5 transition-transform', collapsed && 'rotate-180')}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
              pathname === item.href
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}

        {/* Folders Section */}
        {!collapsed && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Klasörler
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-white"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <FolderTree />
          </div>
        )}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-700">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Yeni Not
          </Button>
        </div>
      )}
    </aside>
  )
}
