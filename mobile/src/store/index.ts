import { create } from 'zustand'
import type { Folder, Note, FileItem, SortOption, FileFilter } from '../types'

interface AppState {
  folders: Folder[]
  notes: Note[]
  files: FileItem[]
  selectedFolderId: string | null
  isLoading: boolean
  
  // Sort & Filter
  fileSortOption: SortOption
  fileFilter: FileFilter
  
  // Folder actions
  setFolders: (folders: Folder[]) => void
  addFolder: (folder: Folder) => void
  deleteFolder: (id: string) => void
  
  // Note actions
  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  updateNote: (id: string, data: Partial<Note>) => void
  deleteNote: (id: string) => void
  
  // File actions
  setFiles: (files: FileItem[]) => void
  addFile: (file: FileItem) => void
  deleteFile: (id: string) => void
  
  // Sort & Filter actions
  setFileSortOption: (option: SortOption) => void
  setFileFilter: (filter: FileFilter) => void
  
  // Other actions
  setSelectedFolder: (id: string | null) => void
  setLoading: (loading: boolean) => void
  
  // Computed
  getSortedFiles: () => FileItem[]
  getFilteredFiles: () => FileItem[]
}

export const useStore = create<AppState>((set, get) => ({
  folders: [],
  notes: [],
  files: [],
  selectedFolderId: null,
  isLoading: false,
  fileSortOption: 'date_desc',
  fileFilter: 'all',

  // Folder actions
  setFolders: (folders) => set({ folders }),
  addFolder: (folder) => set((state) => ({ folders: [...state.folders, folder] })),
  deleteFolder: (id) => set((state) => ({
    folders: state.folders.filter((f) => f.id !== id),
    selectedFolderId: state.selectedFolderId === id ? null : state.selectedFolderId,
  })),

  // Note actions
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (id, data) => set((state) => ({
    notes: state.notes.map((n) => (n.id === id ? { ...n, ...data } : n)),
  })),
  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter((n) => n.id !== id),
  })),

  // File actions
  setFiles: (files) => set({ files }),
  addFile: (file) => set((state) => ({ files: [file, ...state.files] })),
  deleteFile: (id) => set((state) => ({
    files: state.files.filter((f) => f.id !== id),
  })),

  // Sort & Filter actions
  setFileSortOption: (fileSortOption) => set({ fileSortOption }),
  setFileFilter: (fileFilter) => set({ fileFilter }),

  // Other actions
  setSelectedFolder: (id) => set({ selectedFolderId: id }),
  setLoading: (isLoading) => set({ isLoading }),

  // Computed - Get sorted files
  getSortedFiles: () => {
    const { files, fileSortOption } = get()
    const sorted = [...files]
    
    switch (fileSortOption) {
      case 'date_desc':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'date_asc':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      case 'size_desc':
        return sorted.sort((a, b) => b.size - a.size)
      case 'size_asc':
        return sorted.sort((a, b) => a.size - b.size)
      default:
        return sorted
    }
  },

  // Computed - Get filtered files
  getFilteredFiles: () => {
    const { fileFilter } = get()
    const sortedFiles = get().getSortedFiles()
    
    if (fileFilter === 'all') return sortedFiles
    return sortedFiles.filter((f) => f.type === fileFilter)
  },
}))
