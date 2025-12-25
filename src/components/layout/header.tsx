'use client'

import { SearchIcon, BellIcon, UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Header() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Notlarda, sorularda ara..."
            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-slate-600">
          <BellIcon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-600">
          <UserIcon className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
