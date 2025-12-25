# Smart-Study-Nexus Design Document

## Overview

Smart-Study-Nexus (SSN) is a comprehensive personal knowledge management and exam preparation platform. The system combines note-taking, AI-powered learning, spaced repetition, PDF analysis, mind mapping, and gamification into a unified web application.

The architecture follows a modern JAMstack approach with Next.js App Router for the frontend, Supabase for backend services (PostgreSQL, Auth, Storage, Edge Functions), and OpenAI/Anthropic APIs for AI capabilities.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Next.js   │  │   TipTap    │  │ React Flow  │              │
│  │  App Router │  │   Editor    │  │  Mind Map   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Framer     │  │ Tesseract   │  │   Zustand   │              │
│  │  Motion     │  │    OCR      │  │    State    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Next.js API Routes / Server Actions         │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   OpenAI    │  │  Supabase   │  │  Supabase   │              │
│  │     API     │  │    Auth     │  │   Storage   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 Supabase PostgreSQL                      │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │    │
│  │  │  Users  │ │ Folders │ │  Notes  │ │Questions│        │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │    │
│  │  │  Files  │ │Flashcard│ │Embedding│ │  Stats  │        │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Authentication Module
```typescript
interface AuthService {
  signUp(email: string, password: string): Promise<User>
  signIn(email: string, password: string): Promise<Session>
  signOut(): Promise<void>
  resetPassword(email: string): Promise<void>
  getSession(): Promise<Session | null>
}
```

### 2. Folder Service
```typescript
interface FolderService {
  create(data: CreateFolderInput): Promise<Folder>
  update(id: string, data: UpdateFolderInput): Promise<Folder>
  delete(id: string): Promise<void> // Cascade deletes children
  move(id: string, newParentId: string | null): Promise<Folder>
  getTree(userId: string): Promise<FolderTree>
  getById(id: string): Promise<Folder>
}

interface FolderTree {
  folders: Folder[]
  buildTree(): TreeNode[]
}
```

### 3. Note Service
```typescript
interface NoteService {
  create(data: CreateNoteInput): Promise<Note>
  update(id: string, data: UpdateNoteInput): Promise<Note>
  delete(id: string): Promise<void>
  getByFolder(folderId: string): Promise<Note[]>
  search(query: string, userId: string): Promise<Note[]>
  generateSummary(noteId: string): Promise<string>
}
```

### 4. File Service
```typescript
interface FileService {
  upload(file: File, folderId?: string): Promise<FileRecord>
  delete(id: string): Promise<void>
  getByFolder(folderId: string): Promise<FileRecord[]>
  filter(type: FileType): FileRecord[]
  sort(by: SortField, order: SortOrder): FileRecord[]
  processOCR(fileId: string): Promise<OCRResult>
}
```

### 5. Question Service
```typescript
interface QuestionService {
  create(data: CreateQuestionInput): Promise<Question>
  update(id: string, data: UpdateQuestionInput): Promise<Question>
  delete(id: string): Promise<void>
  getByFolder(folderId: string): Promise<Question[]>
  generateFromNote(noteId: string, count: number): Promise<Question[]>
}
```

### 6. Flashcard Service (Spaced Repetition)
```typescript
interface FlashcardService {
  create(data: CreateFlashcardInput): Promise<Flashcard>
  getDueCards(userId: string): Promise<Flashcard[]>
  review(cardId: string, quality: number): Promise<Flashcard>
  calculateNextReview(card: Flashcard, quality: number): SM2Result
}

interface SM2Result {
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: Date
}
```

### 7. PDF-RAG Service
```typescript
interface PDFRAGService {
  processDocument(fileId: string): Promise<void>
  extractChunks(text: string): TextChunk[]
  generateEmbeddings(chunks: TextChunk[]): Promise<Embedding[]>
  semanticSearch(query: string, documentId: string): Promise<TextChunk[]>
  generateAnswer(query: string, context: TextChunk[]): Promise<RAGResponse>
}
```

### 8. Mind Map Service
```typescript
interface MindMapService {
  getNodes(userId: string): Promise<MindMapNode[]>
  getEdges(userId: string): Promise<MindMapEdge[]>
  createEdge(sourceId: string, targetId: string): Promise<MindMapEdge>
  updateNodePosition(nodeId: string, position: Position): Promise<void>
  calculateRelationships(notes: Note[]): MindMapEdge[]
}
```

### 9. Gamification Service
```typescript
interface GamificationService {
  recordActivity(userId: string, type: ActivityType): Promise<void>
  calculateStreak(userId: string): Promise<number>
  getHeatmapData(userId: string, year: number): Promise<HeatmapData>
  checkAchievements(userId: string): Promise<Achievement[]>
}
```

## Data Models

### Database Schema (PostgreSQL/Prisma)

```prisma
// User & Auth
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  avatarUrl     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  folders       Folder[]
  notes         Note[]
  questions     Question[]
  flashcards    Flashcard[]
  files         File[]
  quizAttempts  QuizAttempt[]
  studyStats    StudyStats[]
  activities    Activity[]
  chatSessions  ChatSession[]
}

// Folder System (Nested)
model Folder {
  id          String    @id @default(cuid())
  name        String
  color       String?   @default("#6366f1")
  icon        String?
  parentId    String?
  userId      String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  parent      Folder?   @relation("FolderHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children    Folder[]  @relation("FolderHierarchy")
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  notes       Note[]
  questions   Question[]
  flashcards  Flashcard[]
  files       File[]

  @@index([userId])
  @@index([parentId])
}

// Notes with TipTap Content
model Note {
  id          String    @id @default(cuid())
  title       String
  content     Json      // TipTap JSON format
  summary     String?   // AI-generated summary
  folderId    String?
  userId      String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  folder      Folder?   @relation(fields: [folderId], references: [id], onDelete: SetNull)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  questions   Question[]
  tags        NoteTag[]
  links       NoteLink[] @relation("SourceNote")
  linkedBy    NoteLink[] @relation("TargetNote")

  @@index([userId])
  @@index([folderId])
}

// Note Links (for Mind Map)
model NoteLink {
  id          String    @id @default(cuid())
  sourceId    String
  targetId    String
  label       String?
  createdAt   DateTime  @default(now())

  source      Note      @relation("SourceNote", fields: [sourceId], references: [id], onDelete: Cascade)
  target      Note      @relation("TargetNote", fields: [targetId], references: [id], onDelete: Cascade)

  @@unique([sourceId, targetId])
}

// Tags
model Tag {
  id        String    @id @default(cuid())
  name      String    @unique
  color     String?
  notes     NoteTag[]
}

model NoteTag {
  noteId    String
  tagId     String
  note      Note      @relation(fields: [noteId], references: [id], onDelete: Cascade)
  tag       Tag       @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([noteId, tagId])
}

// Files & Media
model File {
  id          String    @id @default(cuid())
  name        String
  type        FileType
  mimeType    String
  size        Int
  url         String
  storagePath String
  folderId    String?
  userId      String
  ocrText     String?   // Extracted OCR text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  folder      Folder?   @relation(fields: [folderId], references: [id], onDelete: SetNull)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  embeddings  Embedding[]
  chatSessions ChatSession[]

  @@index([userId])
  @@index([folderId])
  @@index([type])
}

enum FileType {
  IMAGE
  PDF
  DOCUMENT
  AUDIO
  OTHER
}

// Questions
model Question {
  id              String    @id @default(cuid())
  type            QuestionType
  questionText    String
  questionImage   String?
  options         Json?     // For multiple choice: ["A", "B", "C", "D"]
  correctAnswer   String
  explanation     String?
  difficulty      Difficulty @default(MEDIUM)
  folderId        String?
  noteId          String?
  userId          String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  folder          Folder?   @relation(fields: [folderId], references: [id], onDelete: SetNull)
  note            Note?     @relation(fields: [noteId], references: [id], onDelete: SetNull)
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  quizQuestions   QuizQuestion[]
  attempts        QuestionAttempt[]

  @@index([userId])
  @@index([folderId])
}

enum QuestionType {
  MULTIPLE_CHOICE
  TRUE_FALSE
  SHORT_ANSWER
  FILL_BLANK
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

// Flashcards (Spaced Repetition)
model Flashcard {
  id              String    @id @default(cuid())
  front           String    // Front content (question)
  back            String    // Back content (answer)
  frontImage      String?
  backImage       String?
  
  // SM-2 Algorithm Fields
  easeFactor      Float     @default(2.5)
  interval        Int       @default(0)  // Days
  repetitions     Int       @default(0)
  nextReviewDate  DateTime  @default(now())
  lastReviewDate  DateTime?
  
  folderId        String?
  userId          String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  folder          Folder?   @relation(fields: [folderId], references: [id], onDelete: SetNull)
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  reviews         FlashcardReview[]

  @@index([userId])
  @@index([nextReviewDate])
}

model FlashcardReview {
  id            String    @id @default(cuid())
  flashcardId   String
  quality       Int       // 0-5 rating
  reviewedAt    DateTime  @default(now())

  flashcard     Flashcard @relation(fields: [flashcardId], references: [id], onDelete: Cascade)

  @@index([flashcardId])
}

// PDF-RAG Embeddings
model Embedding {
  id          String    @id @default(cuid())
  fileId      String
  chunkIndex  Int
  content     String    // Text chunk
  embedding   Unsupported("vector(1536)")  // OpenAI embedding
  pageNumber  Int?
  createdAt   DateTime  @default(now())

  file        File      @relation(fields: [fileId], references: [id], onDelete: Cascade)

  @@index([fileId])
}

// Chat Sessions (PDF-RAG)
model ChatSession {
  id          String    @id @default(cuid())
  fileId      String
  userId      String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  file        File      @relation(fields: [fileId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages    ChatMessage[]

  @@index([userId])
  @@index([fileId])
}

model ChatMessage {
  id          String    @id @default(cuid())
  sessionId   String
  role        MessageRole
  content     String
  sources     Json?     // Page references
  createdAt   DateTime  @default(now())

  session     ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@index([sessionId])
}

enum MessageRole {
  USER
  ASSISTANT
}

// Quiz System
model Quiz {
  id          String    @id @default(cuid())
  title       String
  description String?
  timeLimit   Int?      // Minutes
  userId      String
  createdAt   DateTime  @default(now())

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  questions   QuizQuestion[]
  attempts    QuizAttempt[]

  @@index([userId])
}

model QuizQuestion {
  quizId      String
  questionId  String
  order       Int

  quiz        Quiz      @relation(fields: [quizId], references: [id], onDelete: Cascade)
  question    Question  @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@id([quizId, questionId])
}

model QuizAttempt {
  id              String    @id @default(cuid())
  quizId          String
  userId          String
  score           Float
  totalQuestions  Int
  correctAnswers  Int
  timeSpent       Int?      // Seconds
  completedAt     DateTime  @default(now())

  quiz            Quiz      @relation(fields: [quizId], references: [id], onDelete: Cascade)
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  answers         QuestionAttempt[]

  @@index([userId])
  @@index([quizId])
}

model QuestionAttempt {
  id              String    @id @default(cuid())
  questionId      String
  quizAttemptId   String?
  userAnswer      String
  isCorrect       Boolean
  timeSpent       Int?
  attemptedAt     DateTime  @default(now())

  question        Question    @relation(fields: [questionId], references: [id], onDelete: Cascade)
  quizAttempt     QuizAttempt? @relation(fields: [quizAttemptId], references: [id], onDelete: Cascade)

  @@index([questionId])
}

// Gamification
model Activity {
  id          String    @id @default(cuid())
  userId      String
  type        ActivityType
  metadata    Json?
  createdAt   DateTime  @default(now())

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([createdAt])
}

enum ActivityType {
  NOTE_CREATED
  NOTE_EDITED
  QUESTION_ANSWERED
  FLASHCARD_REVIEWED
  QUIZ_COMPLETED
  FILE_UPLOADED
  STREAK_ACHIEVED
}

model StudyStats {
  id              String    @id @default(cuid())
  userId          String
  date            DateTime  @db.Date
  studyMinutes    Int       @default(0)
  notesCreated    Int       @default(0)
  questionsAnswered Int     @default(0)
  correctAnswers  Int       @default(0)
  flashcardsReviewed Int    @default(0)

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date])
  @@index([userId])
}

// Voice Notes
model VoiceNote {
  id            String    @id @default(cuid())
  audioUrl      String
  transcription String?
  duration      Int       // Seconds
  noteId        String?   // If converted to note
  userId        String
  createdAt     DateTime  @default(now())

  @@index([userId])
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Folder Hierarchy Integrity
*For any* folder tree, moving a folder to a new parent SHALL NOT create circular references (a folder cannot be its own ancestor)
**Validates: Requirements 2.4**

### Property 2: Cascade Delete Completeness
*For any* folder with children, deleting the folder SHALL result in all descendant folders and contained items being removed from the database
**Validates: Requirements 2.3**

### Property 3: TipTap Content Round-Trip
*For any* valid TipTap JSON content, serializing to database and deserializing back SHALL produce equivalent content
**Validates: Requirements 3.10**

### Property 4: File Metadata Round-Trip
*For any* file metadata object, JSON serialization followed by deserialization SHALL produce an equivalent object
**Validates: Requirements 4.7**

### Property 5: File Sorting Consistency
*For any* list of files and sort criteria, the sorted result SHALL maintain the specified order (ascending or descending by the chosen field)
**Validates: Requirements 4.5**

### Property 6: File Filtering Correctness
*For any* file list and filter type, all returned files SHALL match the specified type filter
**Validates: Requirements 4.4**

### Property 7: SM-2 Algorithm Correctness
*For any* flashcard and quality rating (0-5), the calculated next review date SHALL be greater than or equal to the current date, and easeFactor SHALL remain >= 1.3
**Validates: Requirements 8.4**

### Property 8: Due Cards Selection
*For any* user's flashcard collection, getDueCards SHALL return only cards where nextReviewDate <= current date
**Validates: Requirements 8.5**

### Property 9: Streak Calculation
*For any* sequence of daily activities, streak count SHALL equal the number of consecutive days with at least one activity, starting from today
**Validates: Requirements 12.2**

### Property 10: Streak Reset
*For any* activity history with a gap of one or more days, the streak SHALL reset to count only consecutive days from the most recent activity
**Validates: Requirements 12.3**

### Property 11: Quiz Score Calculation
*For any* completed quiz, the score SHALL equal (correctAnswers / totalQuestions) * 100
**Validates: Requirements 15.4**

### Property 12: Mind Map Edge Creation
*For any* two notes sharing the same tag or folder, an edge SHALL exist between their corresponding nodes in the mind map
**Validates: Requirements 10.2**

### Property 13: Search Result Relevance
*For any* search query, all returned results SHALL contain the query term in at least one searchable field (title, content, name)
**Validates: Requirements 14.1**

### Property 14: Semantic Search Relevance
*For any* RAG query, the top-k retrieved chunks SHALL have cosine similarity above a minimum threshold with the query embedding
**Validates: Requirements 7.4**

## Error Handling

### Authentication Errors
- Invalid credentials: Return 401 with user-friendly message
- Session expired: Redirect to login with return URL
- OAuth failure: Display provider-specific error and retry option

### Database Errors
- Connection failure: Retry with exponential backoff, show offline mode
- Constraint violation: Return 400 with field-specific validation errors
- Not found: Return 404 with resource type information

### File Upload Errors
- Size limit exceeded: Return 413 with max size information
- Invalid type: Return 415 with allowed types list
- Storage failure: Retry upload, notify user of failure

### AI Service Errors
- Rate limit: Queue request, show estimated wait time
- API failure: Fallback to cached response if available
- Timeout: Cancel request, allow retry

### OCR Errors
- Low confidence: Return partial result with warning
- Processing failure: Suggest image quality improvements

## Testing Strategy

### Unit Testing (Vitest)
- Test pure functions: SM-2 algorithm, streak calculation, sorting/filtering
- Test data transformations: TipTap serialization, file metadata parsing
- Test validation logic: Input validation, schema validation

### Property-Based Testing (fast-check)
- Round-trip properties for serialization
- Invariant properties for data structures
- Algorithm correctness properties

### Integration Testing
- API route testing with mock database
- Supabase client integration
- File upload/download flows

### E2E Testing (Playwright)
- User authentication flows
- Note creation and editing
- Quiz completion flow
- File management operations

---

## PDF-RAG Technical Implementation

### Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Upload    │────▶│   Extract   │────▶│   Chunk     │
│    PDF      │     │    Text     │     │   Text      │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Store     │◀────│   Generate  │◀────│   Embed     │
│  pgvector   │     │  Embeddings │     │   Chunks    │
└─────────────┘     └─────────────┘     └─────────────┘

Query Flow:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│   Embed     │────▶│  Semantic   │
│   Query     │     │   Query     │     │   Search    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Display   │◀────│   Generate  │◀────│  Retrieve   │
│   Answer    │     │   Answer    │     │   Context   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Implementation Steps
1. **PDF Text Extraction**: Use pdf-parse library to extract text
2. **Text Chunking**: Split into ~500 token chunks with overlap
3. **Embedding Generation**: OpenAI text-embedding-3-small
4. **Vector Storage**: Supabase pgvector extension
5. **Semantic Search**: Cosine similarity search
6. **Answer Generation**: GPT-4 with retrieved context

---

## Mind Map Technical Implementation

### React Flow Integration
```typescript
// Node structure
interface MindMapNode {
  id: string
  type: 'note'
  position: { x: number, y: number }
  data: {
    noteId: string
    title: string
    color: string
    preview: string
  }
}

// Edge structure  
interface MindMapEdge {
  id: string
  source: string
  target: string
  type: 'default' | 'tag' | 'folder'
  animated?: boolean
  label?: string
}
```

### Relationship Detection
1. **Tag-based**: Notes sharing same tags get connected
2. **Folder-based**: Notes in same folder get lighter connections
3. **Manual links**: User-created explicit connections
4. **AI-suggested**: Based on content similarity (optional)

### Layout Algorithm
- Force-directed layout for initial positioning
- User can drag nodes to customize
- Positions persisted to database
