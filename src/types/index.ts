export interface Folder {
  id: string
  name: string
  color: string | null
  parentId: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
  children?: Folder[]
  _count?: {
    notes: number
    questions: number
  }
}

export interface Note {
  id: string
  title: string
  content: unknown
  summary: string | null
  folderId: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
  folder?: Folder | null
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
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: Date
  folderId: string | null
  noteId: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Quiz {
  id: string
  title: string
  description: string | null
  timeLimit: number | null
  userId: string
  createdAt: Date
  questions?: Question[]
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number | null
  completedAt: Date
}
