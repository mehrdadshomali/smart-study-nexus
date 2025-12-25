'use client'

import { useState } from 'react'
import { PlusIcon, FolderIcon, MoreVerticalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFolderStore } from '@/store/folder-store'

export default function FoldersPage() {
  const { folders, addFolder } = useFolderStore()
  const [isCreating, setIsCreating] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      color: '#6366f1',
      parentId: null,
      userId: 'demo-user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    addFolder(newFolder)
    setNewFolderName('')
    setIsCreating(false)
  }

  const rootFolders = folders.filter((f) => !f.parentId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Klasörler</h1>
          <p className="text-slate-600">{folders.length} klasör</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Yeni Klasör
        </Button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <FolderIcon className="h-6 w-6 text-indigo-500" />
            <Input
              type="text"
              placeholder="Klasör adı..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              autoFocus
              className="flex-1"
            />
            <Button onClick={handleCreateFolder} size="sm">
              Oluştur
            </Button>
            <Button
              onClick={() => {
                setIsCreating(false)
                setNewFolderName('')
              }}
              variant="ghost"
              size="sm"
            >
              İptal
            </Button>
          </div>
        </div>
      )}

      {folders.length === 0 && !isCreating ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center">
          <FolderIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Henüz klasör yok
          </h3>
          <p className="text-slate-600 mb-4">
            Notlarını organize etmek için klasör oluştur
          </p>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Klasör Oluştur
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rootFolders.map((folder) => (
            <div
              key={folder.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${folder.color}20` }}
                  >
                    <FolderIcon
                      className="h-6 w-6"
                      style={{ color: folder.color || '#6366f1' }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{folder.name}</h3>
                    <p className="text-sm text-slate-500">
                      {folder._count?.notes || 0} not
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
