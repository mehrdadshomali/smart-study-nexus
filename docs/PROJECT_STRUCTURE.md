# Proje Dosya Yapısı

```
study-app/
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth layout grubu
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── (dashboard)/              # Ana uygulama layout grubu
│   │   │   ├── layout.tsx            # Sidebar + Header
│   │   │   ├── page.tsx              # Dashboard/Ana sayfa
│   │   │   ├── folders/
│   │   │   │   ├── page.tsx          # Tüm klasörler
│   │   │   │   └── [folderId]/page.tsx
│   │   │   ├── notes/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [noteId]/page.tsx
│   │   │   ├── questions/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [questionId]/page.tsx
│   │   │   ├── quiz/
│   │   │   │   ├── page.tsx          # Quiz listesi
│   │   │   │   ├── create/page.tsx   # Quiz oluştur
│   │   │   │   └── [quizId]/
│   │   │   │       ├── page.tsx      # Quiz detay
│   │   │   │       └── attempt/page.tsx
│   │   │   ├── review/page.tsx       # Spaced repetition
│   │   │   ├── search/page.tsx       # Global arama
│   │   │   └── analytics/page.tsx    # Dashboard/İstatistikler
│   │   │
│   │   ├── api/                      # API Routes
│   │   │   ├── folders/route.ts
│   │   │   ├── notes/route.ts
│   │   │   ├── questions/route.ts
│   │   │   ├── quiz/route.ts
│   │   │   ├── ai/
│   │   │   │   ├── summarize/route.ts
│   │   │   │   └── generate-questions/route.ts
│   │   │   └── search/route.ts
│   │   │
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                       # Shadcn/ui bileşenleri
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── folder-tree.tsx
│   │   ├── editor/
│   │   │   ├── tiptap-editor.tsx
│   │   │   ├── toolbar.tsx
│   │   │   └── extensions/
│   │   │       ├── highlight.ts
│   │   │       ├── latex.ts
│   │   │       └── code-block.ts
│   │   ├── notes/
│   │   │   ├── note-card.tsx
│   │   │   └── note-list.tsx
│   │   ├── questions/
│   │   │   ├── question-form.tsx
│   │   │   └── question-card.tsx
│   │   └── quiz/
│   │       ├── quiz-player.tsx
│   │       └── quiz-results.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── middleware.ts
│   │   ├── prisma.ts                 # Prisma client
│   │   ├── ai.ts                     # OpenAI/AI entegrasyonu
│   │   └── spaced-repetition.ts      # SM-2 algoritması
│   │
│   ├── hooks/
│   │   ├── use-folders.ts
│   │   ├── use-notes.ts
│   │   └── use-quiz.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── utils/
│       ├── cn.ts                     # className helper
│       └── date.ts
│
├── public/
│   └── ...
│
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Temel Bağımlılıklar

```json
{
  "dependencies": {
    "next": "14.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "@prisma/client": "^5.x",
    "@tiptap/react": "^2.x",
    "@tiptap/starter-kit": "^2.x",
    "@tiptap/extension-highlight": "^2.x",
    "@tiptap/extension-code-block-lowlight": "^2.x",
    "katex": "^0.16.x",
    "openai": "^4.x",
    "date-fns": "^3.x",
    "zustand": "^4.x",
    "recharts": "^2.x"
  }
}
```
