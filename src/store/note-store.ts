import { create } from 'zustand'
import type { Note } from '@/types'

interface NoteState {
  notes: Note[]
  selectedNoteId: string | null
  isLoading: boolean
  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  updateNote: (id: string, data: Partial<Note>) => void
  deleteNote: (id: string) => void
  setSelectedNote: (id: string | null) => void
  setLoading: (loading: boolean) => void
}

export const useNoteStore = create<NoteState>((set) => ({
  notes: [],
  selectedNoteId: null,
  isLoading: false,
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (id, data) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, ...data } : n)),
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId,
    })),
  setSelectedNote: (id) => set({ selectedNoteId: id }),
  setLoading: (isLoading) => set({ isLoading }),
}))
