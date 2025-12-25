import { create } from 'zustand'
import type { Folder } from '@/types'

interface FolderState {
  folders: Folder[]
  selectedFolderId: string | null
  isLoading: boolean
  setFolders: (folders: Folder[]) => void
  addFolder: (folder: Folder) => void
  updateFolder: (id: string, data: Partial<Folder>) => void
  deleteFolder: (id: string) => void
  setSelectedFolder: (id: string | null) => void
  setLoading: (loading: boolean) => void
}

export const useFolderStore = create<FolderState>((set) => ({
  folders: [],
  selectedFolderId: null,
  isLoading: false,
  setFolders: (folders) => set({ folders }),
  addFolder: (folder) => set((state) => ({ folders: [...state.folders, folder] })),
  updateFolder: (id, data) =>
    set((state) => ({
      folders: state.folders.map((f) => (f.id === id ? { ...f, ...data } : f)),
    })),
  deleteFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
      selectedFolderId: state.selectedFolderId === id ? null : state.selectedFolderId,
    })),
  setSelectedFolder: (id) => set({ selectedFolderId: id }),
  setLoading: (isLoading) => set({ isLoading }),
}))
