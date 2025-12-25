'use client'

import { useState } from 'react'
import { ChevronRightIcon, FolderIcon, FolderOpenIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFolderStore } from '@/store/folder-store'
import type { Folder } from '@/types'

interface FolderItemProps {
  folder: Folder
  level?: number
  allFolders: Folder[]
}

function FolderItem({ folder, level = 0, allFolders }: FolderItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedFolderId, setSelectedFolder } = useFolderStore()

  const children = allFolders.filter((f) => f.parentId === folder.id)
  const hasChildren = children.length > 0
  const isSelected = selectedFolderId === folder.id

  return (
    <div>
      <button
        onClick={() => {
          setSelectedFolder(folder.id)
          if (hasChildren) setIsOpen(!isOpen)
        }}
        className={cn(
          'flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors',
          isSelected
            ? 'bg-indigo-600/20 text-indigo-400'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren && (
          <ChevronRightIcon
            className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-90')}
          />
        )}
        {!hasChildren && <span className="w-4" />}
        {isOpen ? (
          <FolderOpenIcon className="h-4 w-4" style={{ color: folder.color || '#6366f1' }} />
        ) : (
          <FolderIcon className="h-4 w-4" style={{ color: folder.color || '#6366f1' }} />
        )}
        <span className="truncate">{folder.name}</span>
        {folder._count && (
          <span className="ml-auto text-xs text-slate-500">
            {folder._count.notes}
          </span>
        )}
      </button>

      {isOpen && hasChildren && (
        <div>
          {children.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              level={level + 1}
              allFolders={allFolders}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FolderTree() {
  const { folders } = useFolderStore()

  // Root klasörleri (parentId === null)
  const rootFolders = folders.filter((f) => !f.parentId)

  if (folders.length === 0) {
    return (
      <div className="px-3 py-4 text-center text-sm text-slate-500">
        Henüz klasör yok
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      {rootFolders.map((folder) => (
        <FolderItem key={folder.id} folder={folder} allFolders={folders} />
      ))}
    </div>
  )
}
