# Smart-Study-Nexus - Tam Teknik Mimari

## 📁 Proje Dosya Yapısı

```
smart-study-nexus/
├── prisma/
│   ├── schema.prisma              # Veritabanı şeması
│   └── migrations/                # Migration dosyaları
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/               # Auth layout grubu
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   │
│   │   ├── (dashboard)/          # Ana uygulama
│   │   │   ├── layout.tsx        # Sidebar + Header
│   │   │   ├── page.tsx          # Dashboard/Ana sayfa
│   │   │   │
│   │   │   ├── folders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [folderId]/page.tsx
│   │   │   │
│   │   │   ├── notes/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [noteId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/page.tsx
│   │   │   │
│   │   │   ├── files/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [fileId]/page.tsx
│   │   │   │
│   │   │   ├── questions/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [questionId]/page.tsx
│   │   │   │
│   │   │   ├── flashcards/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── review/page.tsx
│   │   │   │
│   │   │   ├── quiz/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/page.tsx
│   │   │   │   └── [quizId]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── play/page.tsx
│   │   │   │       └── results/page.tsx
│   │   │   │
│   │   │   ├── pdf-chat/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [fileId]/page.tsx
│   │   │   │
│   │   │   ├── mind-map/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── search/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...supabase]/route.ts
│   │   │   │
│   │   │   ├── folders/
│   │   │   │   ├── route.ts
│   │   │   │   └── [folderId]/route.ts
│   │   │   │
│   │   │   ├── notes/
│   │   │   │   ├── route.ts
│   │   │   │   └── [noteId]/route.ts
│   │   │   │
│   │   │   ├── files/
│   │   │   │   ├── route.ts
│   │   │   │   ├── upload/route.ts
│   │   │   │   └── [fileId]/route.ts
│   │   │   │
│   │   │   ├── questions/
│   │   │   │   ├── route.ts
│   │   │   │   └── [questionId]/route.ts
│   │   │   │
│   │   │   ├── flashcards/
│   │   │   │   ├── route.ts
│   │   │   │   ├── due/route.ts
│   │   │   │   └── [cardId]/
│   │   │   │       ├── route.ts
│   │   │   │       └── review/route.ts
│   │   │   │
│   │   │   ├── quiz/
│   │   │   │   ├── route.ts
│   │   │   │   └── [quizId]/
│   │   │   │       ├── route.ts
│   │   │   │       └── submit/route.ts
│   │   │   │
│   │   │   ├── ai/
│   │   │   │   ├── summarize/route.ts
│   │   │   │   ├── generate-questions/route.ts
│   │   │   │   └── ocr/route.ts
│   │   │   │
│   │   │   ├── rag/
│   │   │   │   ├── process/route.ts
│   │   │   │   ├── search/route.ts
│   │   │   │   └── chat/route.ts
│   │   │   │
│   │   │   ├── search/route.ts
│   │   │   │
│   │   │   └── stats/
│   │   │       ├── route.ts
│   │   │       └── activity/route.ts
│   │   │
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                    # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── folder-tree.tsx
│   │   │   └── mobile-nav.tsx
│   │   │
│   │   ├── editor/
│   │   │   ├── tiptap-editor.tsx
│   │   │   ├── toolbar.tsx
│   │   │   ├── bubble-menu.tsx
│   │   │   └── extensions/
│   │   │       ├── highlight.ts
│   │   │       ├── latex.ts
│   │   │       ├── code-block.ts
│   │   │       └── image.ts
│   │   │
│   │   ├── notes/
│   │   │   ├── note-card.tsx
│   │   │   ├── note-list.tsx
│   │   │   └── note-preview.tsx
│   │   │
│   │   ├── files/
│   │   │   ├── file-card.tsx
│   │   │   ├── file-grid.tsx
│   │   │   ├── file-uploader.tsx
│   │   │   └── image-preview.tsx
│   │   │
│   │   ├── questions/
│   │   │   ├── question-form.tsx
│   │   │   ├── question-card.tsx
│   │   │   └── question-types/
│   │   │       ├── multiple-choice.tsx
│   │   │       ├── true-false.tsx
│   │   │       ├── short-answer.tsx
│   │   │       └── fill-blank.tsx
│   │   │
│   │   ├── flashcards/
│   │   │   ├── flashcard.tsx
│   │   │   ├── flashcard-deck.tsx
│   │   │   └── review-session.tsx
│   │   │
│   │   ├── quiz/
│   │   │   ├── quiz-player.tsx
│   │   │   ├── quiz-results.tsx
│   │   │   └── quiz-builder.tsx
│   │   │
│   │   ├── pdf-chat/
│   │   │   ├── pdf-viewer.tsx
│   │   │   ├── chat-panel.tsx
│   │   │   └── source-highlight.tsx
│   │   │
│   │   ├── mind-map/
│   │   │   ├── mind-map-canvas.tsx
│   │   │   ├── note-node.tsx
│   │   │   └── edge-types.tsx
│   │   │
│   │   ├── ocr/
│   │   │   ├── ocr-uploader.tsx
│   │   │   └── ocr-result.tsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── stats-cards.tsx
│   │   │   ├── study-chart.tsx
│   │   │   ├── heatmap.tsx
│   │   │   └── streak-badge.tsx
│   │   │
│   │   └── search/
│   │       ├── search-modal.tsx
│   │       └── search-results.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   │
│   │   ├── prisma.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── openai.ts
│   │   │   ├── embeddings.ts
│   │   │   └── prompts.ts
│   │   │
│   │   ├── algorithms/
│   │   │   ├── sm2.ts              # Spaced repetition
│   │   │   ├── streak.ts           # Streak calculation
│   │   │   └── chunking.ts         # Text chunking for RAG
│   │   │
│   │   ├── ocr/
│   │   │   └── tesseract.ts
│   │   │
│   │   ├── pdf/
│   │   │   └── parser.ts
│   │   │
│   │   └── utils/
│   │       ├── cn.ts
│   │       ├── date.ts
│   │       └── format.ts
│   │
│   ├── hooks/
│   │   ├── use-folders.ts
│   │   ├── use-notes.ts
│   │   ├── use-files.ts
│   │   ├── use-flashcards.ts
│   │   ├── use-quiz.ts
│   │   ├── use-search.ts
│   │   └── use-stats.ts
│   │
│   ├── store/
│   │   ├── folder-store.ts
│   │   ├── note-store.ts
│   │   ├── file-store.ts
│   │   └── ui-store.ts
│   │
│   └── types/
│       ├── index.ts
│       ├── database.ts
│       └── api.ts
│
├── tests/
│   ├── unit/
│   │   ├── sm2.test.ts
│   │   ├── streak.test.ts
│   │   └── chunking.test.ts
│   │
│   ├── property/
│   │   ├── folder.property.ts
│   │   ├── file.property.ts
│   │   ├── sm2.property.ts
│   │   ├── streak.property.ts
│   │   └── search.property.ts
│   │
│   └── integration/
│       ├── auth.test.ts
│       ├── notes.test.ts
│       └── quiz.test.ts
│
├── public/
│   └── ...
│
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

---

## 🗄️ Veritabanı Şeması (PostgreSQL)

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │───────│   Folder    │───────│    Note     │
└─────────────┘       └─────────────┘       └─────────────┘
      │                     │                     │
      │                     │                     │
      ▼                     ▼                     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    File     │       │  Question   │       │  NoteLink   │
└─────────────┘       └─────────────┘       └─────────────┘
      │                     │                     
      │                     │                     
      ▼                     ▼                     
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Embedding  │       │    Quiz     │       │  Flashcard  │
└─────────────┘       └─────────────┘       └─────────────┘
      │                     │                     │
      │                     │                     │
      ▼                     ▼                     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ ChatSession │       │ QuizAttempt │       │FlashcardRev │
└─────────────┘       └─────────────┘       └─────────────┘
                            │
                            ▼
                      ┌─────────────┐
                      │  Activity   │
                      └─────────────┘
                            │
                            ▼
                      ┌─────────────┐
                      │ StudyStats  │
                      └─────────────┘
```

### Tablo İlişkileri

| Tablo | İlişki | Açıklama |
|-------|--------|----------|
| User → Folder | 1:N | Kullanıcının klasörleri |
| Folder → Folder | Self-ref | İç içe klasörler (parent-child) |
| Folder → Note | 1:N | Klasördeki notlar |
| Folder → Question | 1:N | Klasördeki sorular |
| Folder → File | 1:N | Klasördeki dosyalar |
| Note → Question | 1:N | Nottan oluşturulan sorular |
| Note → NoteLink | N:N | Notlar arası bağlantılar (Mind Map) |
| Note → Tag | N:N | Not etiketleri |
| File → Embedding | 1:N | PDF chunk embeddings |
| File → ChatSession | 1:N | PDF chat oturumları |
| Question → QuizQuestion | N:N | Quiz soruları |
| Quiz → QuizAttempt | 1:N | Quiz denemeleri |
| Flashcard → FlashcardReview | 1:N | Kart tekrar geçmişi |
| User → Activity | 1:N | Kullanıcı aktiviteleri |
| User → StudyStats | 1:N | Günlük çalışma istatistikleri |

---

## 🔧 PDF-RAG Entegrasyonu

### İşlem Akışı

```
1. PDF Upload
   └── Supabase Storage'a yükle
   
2. Text Extraction
   └── pdf-parse ile metin çıkar
   
3. Chunking
   └── ~500 token'lık parçalara böl
   └── %10 overlap ile bağlam koru
   
4. Embedding Generation
   └── OpenAI text-embedding-3-small
   └── Her chunk için 1536 boyutlu vektör
   
5. Vector Storage
   └── Supabase pgvector extension
   └── embeddings tablosuna kaydet
   
6. Query Processing
   └── Kullanıcı sorusunu embed et
   └── Cosine similarity ile arama
   └── Top-5 chunk getir
   
7. Answer Generation
   └── Context + Question → GPT-4
   └── Kaynak sayfa referansları ekle
```

### Örnek Kod

```typescript
// lib/algorithms/chunking.ts
export function chunkText(text: string, chunkSize = 500, overlap = 50): TextChunk[] {
  const words = text.split(/\s+/)
  const chunks: TextChunk[] = []
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ')
    chunks.push({
      content: chunk,
      index: chunks.length,
      startWord: i,
      endWord: Math.min(i + chunkSize, words.length)
    })
  }
  
  return chunks
}

// lib/ai/embeddings.ts
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  return response.data[0].embedding
}

// Semantic search with pgvector
const results = await prisma.$queryRaw`
  SELECT id, content, page_number,
         1 - (embedding <=> ${queryEmbedding}::vector) as similarity
  FROM embeddings
  WHERE file_id = ${fileId}
  ORDER BY embedding <=> ${queryEmbedding}::vector
  LIMIT 5
`
```

---

## 🧠 Mind Map Entegrasyonu

### React Flow Yapısı

```typescript
// components/mind-map/mind-map-canvas.tsx
import ReactFlow, { 
  Node, 
  Edge, 
  Controls, 
  Background 
} from 'reactflow'

interface MindMapProps {
  notes: Note[]
  links: NoteLink[]
}

export function MindMapCanvas({ notes, links }: MindMapProps) {
  // Notes → Nodes
  const nodes: Node[] = notes.map(note => ({
    id: note.id,
    type: 'noteNode',
    position: note.position || calculatePosition(note),
    data: {
      title: note.title,
      color: note.folder?.color,
      preview: extractPreview(note.content)
    }
  }))
  
  // Links → Edges
  const edges: Edge[] = [
    // Explicit links
    ...links.map(link => ({
      id: link.id,
      source: link.sourceId,
      target: link.targetId,
      type: 'default',
      label: link.label
    })),
    // Tag-based connections
    ...calculateTagEdges(notes),
    // Folder-based connections
    ...calculateFolderEdges(notes)
  ]
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeDragStop={handleNodeDragStop}
    >
      <Controls />
      <Background />
    </ReactFlow>
  )
}
```

### İlişki Algılama

```typescript
// Aynı tag'e sahip notları bağla
function calculateTagEdges(notes: Note[]): Edge[] {
  const tagMap = new Map<string, string[]>()
  
  notes.forEach(note => {
    note.tags?.forEach(tag => {
      if (!tagMap.has(tag.id)) tagMap.set(tag.id, [])
      tagMap.get(tag.id)!.push(note.id)
    })
  })
  
  const edges: Edge[] = []
  tagMap.forEach((noteIds, tagId) => {
    for (let i = 0; i < noteIds.length - 1; i++) {
      for (let j = i + 1; j < noteIds.length; j++) {
        edges.push({
          id: `tag-${tagId}-${noteIds[i]}-${noteIds[j]}`,
          source: noteIds[i],
          target: noteIds[j],
          type: 'tag',
          animated: true,
          style: { stroke: '#94a3b8', strokeDasharray: '5,5' }
        })
      }
    }
  })
  
  return edges
}
```

---

## 📦 Gerekli Paketler

```json
{
  "dependencies": {
    "next": "^14.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "@prisma/client": "^5.x",
    
    "@tiptap/react": "^2.x",
    "@tiptap/starter-kit": "^2.x",
    "@tiptap/extension-highlight": "^2.x",
    "@tiptap/extension-code-block-lowlight": "^2.x",
    "lowlight": "^3.x",
    "katex": "^0.16.x",
    
    "reactflow": "^11.x",
    "tesseract.js": "^5.x",
    "pdf-parse": "^1.x",
    
    "openai": "^4.x",
    "framer-motion": "^11.x",
    "lucide-react": "^0.x",
    "zustand": "^4.x",
    "date-fns": "^3.x",
    "recharts": "^2.x"
  },
  "devDependencies": {
    "prisma": "^5.x",
    "vitest": "^1.x",
    "fast-check": "^3.x",
    "@testing-library/react": "^14.x",
    "playwright": "^1.x"
  }
}
```

---

## 🚀 Başlangıç Komutları

```bash
# 1. Proje oluştur
npx create-next-app@latest smart-study-nexus --typescript --tailwind --app --src-dir

# 2. Bağımlılıkları yükle
npm install @supabase/supabase-js @supabase/ssr @prisma/client
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-highlight
npm install reactflow tesseract.js pdf-parse openai
npm install framer-motion lucide-react zustand date-fns recharts

# 3. Prisma kur
npm install -D prisma
npx prisma init

# 4. Supabase'de pgvector aktif et
# SQL Editor'da: CREATE EXTENSION IF NOT EXISTS vector;

# 5. Migration çalıştır
npx prisma migrate dev --name init

# 6. Geliştirmeyi başlat
npm run dev
```
