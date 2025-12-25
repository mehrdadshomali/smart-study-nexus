# Geliştirme Yol Haritası

## Faz 1: Temel Altyapı (1-2 hafta)

### 1.1 Proje Kurulumu
```bash
npx create-next-app@latest study-app --typescript --tailwind --app --src-dir
cd study-app
npm install @supabase/supabase-js @supabase/ssr @prisma/client
npm install -D prisma
npx prisma init
```

### 1.2 Supabase Kurulumu
1. supabase.com'da yeni proje oluştur
2. `.env.local` dosyasına credentials ekle:
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxx"
```

### 1.3 Auth Implementasyonu
- Supabase Auth ile email/password login
- OAuth (Google, GitHub) opsiyonel
- Middleware ile route koruması

---

## Faz 2: Klasör ve Not Sistemi (2-3 hafta)

### 2.1 Klasör CRUD
```typescript
// Temel işlemler
- Klasör oluşturma (nested destekli)
- Klasör düzenleme (isim, renk)
- Klasör silme (cascade)
- Klasör taşıma (drag & drop)
- Klasör ağacı görünümü (recursive component)
```

### 2.2 Not CRUD
```typescript
// Temel işlemler
- Not oluşturma
- Not düzenleme (TipTap editor)
- Not silme
- Klasöre atama/taşıma
```

### 2.3 TipTap Editor Kurulumu
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-highlight
npm install @tiptap/extension-code-block-lowlight lowlight
npm install katex @tiptap/extension-mathematics
```

Desteklenecek özellikler:
- Bold, italic, underline
- Başlıklar (H1-H3)
- Listeler (bullet, numbered)
- Highlight (sarı, yeşil, mavi, pembe)
- Code blocks (syntax highlighting)
- LaTeX formüller
- Resim ekleme

---

## Faz 3: Soru ve Quiz Sistemi (2-3 hafta)

### 3.1 Soru CRUD
- Çoktan seçmeli soru ekleme
- Doğru/Yanlış soruları
- Kısa cevaplı sorular
- Resimli soru desteği
- Nottan soru oluşturma

### 3.2 Quiz Modu
- Rastgele soru seçimi
- Zamanlı quiz
- Anlık geri bildirim
- Sonuç ekranı

---

## Faz 4: Spaced Repetition (1 hafta)

### SM-2 Algoritması
```typescript
// Basitleştirilmiş SM-2
function calculateNextReview(quality: number, question: Question) {
  // quality: 0-5 arası (0: tamamen unutulmuş, 5: mükemmel)
  
  if (quality < 3) {
    // Yanlış cevap - başa dön
    return { interval: 1, repetitions: 0 };
  }
  
  let interval: number;
  if (question.repetitions === 0) {
    interval = 1;
  } else if (question.repetitions === 1) {
    interval = 6;
  } else {
    interval = Math.round(question.interval * question.easeFactor);
  }
  
  const easeFactor = Math.max(1.3, 
    question.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );
  
  return {
    interval,
    easeFactor,
    repetitions: question.repetitions + 1,
    nextReviewDate: addDays(new Date(), interval)
  };
}
```

---

## Faz 5: AI Entegrasyonu (1-2 hafta)

### 5.1 Not Özetleme
```typescript
// OpenAI API ile özet oluşturma
POST /api/ai/summarize
Body: { noteContent: string }
Response: { summary: string }
```

### 5.2 Soru Üretme
```typescript
// Nottan otomatik soru üretme
POST /api/ai/generate-questions
Body: { noteContent: string, count: number, type: QuestionType }
Response: { questions: Question[] }
```

---

## Faz 6: Arama ve Analitik (1 hafta)

### 6.1 Global Arama
- Full-text search (PostgreSQL)
- Notlarda, sorularda, klasörlerde arama
- Filtreleme (tarih, klasör, tip)

### 6.2 Dashboard
- Günlük/haftalık çalışma süresi
- Doğru/yanlış oranları
- En çok çalışılan konular
- Streak takibi

---

## Öncelik Sırası

1. **Hemen başla:** Auth + Klasör sistemi + Basit not ekleme
2. **Sonra:** TipTap editor tam entegrasyonu
3. **Ardından:** Soru sistemi + Quiz modu
4. **Son:** AI + Spaced Repetition + Analytics

---

## İlk Adım: Klasör Sistemi Kodu

Aşağıdaki dosyaları oluşturarak başlayabilirsin:

1. `src/lib/prisma.ts` - Prisma client
2. `src/app/api/folders/route.ts` - Folder API
3. `src/components/layout/folder-tree.tsx` - Klasör ağacı UI
4. `src/hooks/use-folders.ts` - Folder state management

Hazır olduğunda bu dosyaları birlikte kodlayabiliriz!
