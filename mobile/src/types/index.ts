export interface Folder {
  id: string
  name: string
  color: string | null
  parentId: string | null
  userId: string
  createdAt: string
  updatedAt: string
  _count?: {
    notes: number
    questions: number
    files?: number
  }
}

export interface Note {
  id: string
  title: string
  content: unknown
  summary: string | null
  folderId: string | null
  userId: string
  createdAt: string
  updatedAt: string
  folder?: {
    id: string
    name: string
    color: string | null
  } | null
}

export interface FileItem {
  id: string
  name: string
  type: 'image' | 'document' | 'pdf' | 'other'
  uri: string
  size: number
  mimeType: string
  folderId: string | null
  userId: string
  createdAt: string
  updatedAt: string
  folder?: {
    id: string
    name: string
    color: string | null
  } | null
}

export interface Question {
  id: string
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'FILL_BLANK'
  questionText: string
  questionImage: string | null
  options: string[] | null
  correctAnswer: string
  explanation: string | null
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  nextReviewDate: string
  folderId: string | null
  noteId: string | null
}

export type SortOption = 'date_desc' | 'date_asc' | 'name_asc' | 'name_desc' | 'size_desc' | 'size_asc'
export type FileFilter = 'all' | 'image' | 'document' | 'pdf'
