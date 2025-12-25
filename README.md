<p align="center">
  <img src="public/logo.svg" alt="Smart Study Nexus" width="120" height="120" />
</p>

<h1 align="center">🎓 Smart Study Nexus</h1>

<p align="center">
  <strong>Yapay Zeka Destekli Kişisel Bilgi Yönetimi ve Sınav Hazırlık Platformu</strong>
</p>

<p align="center">
  <a href="#özellikler">Özellikler</a> •
  <a href="#teknolojiler">Teknolojiler</a> •
  <a href="#kurulum">Kurulum</a> •
  <a href="#kullanım">Kullanım</a> •
  <a href="#mimari">Mimari</a> •
  <a href="#katkıda-bulunma">Katkıda Bulunma</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma-7.0-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai" alt="OpenAI" />
</p>

---

## 📖 Hakkında

**Smart Study Nexus**, bilgisayar mühendisliği öğrencileri ve profesyoneller için tasarlanmış, yapay zeka destekli kapsamlı bir öğrenme platformudur. Notlarınızı organize edin, PDF'lerle sohbet edin, flashcard'larla tekrar yapın ve çalışma performansınızı takip edin — hepsi tek bir yerde.

> 🚀 **Misyon:** Öğrenme sürecinizi devrimselleştirmek ve bilgiyi kalıcı hale getirmek.

---

## ✨ Özellikler

### 📝 Akıllı Not Yönetimi
- **Zengin Metin Editörü** — TipTap tabanlı, Markdown ve LaTeX desteği
- **Syntax Highlighting** — 100+ programlama dili desteği
- **Nested Klasörler** — Sınırsız derinlikte organizasyon
- **Otomatik Kaydetme** — Asla bir değişiklik kaybetmeyin

### 🤖 Yapay Zeka Entegrasyonu
- **PDF Chat (RAG)** — PDF'lerinizle doğal dilde sohbet edin
- **Otomatik Özet** — Notlarınızdan AI destekli özetler
- **Soru Üretimi** — İçerikten otomatik quiz soruları
- **Akıllı OCR** — Görsellerden metin çıkarma

### 🧠 Spaced Repetition (SM-2)
- **Flashcard Sistemi** — Anki tarzı aralıklı tekrar
- **Akıllı Zamanlama** — SM-2 algoritması ile optimal tekrar
- **İlerleme Takibi** — Mastery level ve istatistikler
- **Kart Animasyonları** — Akıcı flip efektleri

### 🗺️ Zihin Haritası
- **İnteraktif Görselleştirme** — React Flow ile not bağlantıları
- **Otomatik Bağlantılar** — Etiket ve klasör bazlı ilişkiler
- **Sürükle-Bırak** — Kolay düzenleme
- **AI Önerileri** — Akıllı bağlantı tavsiyeleri

### 📊 Gamification & Analytics
- **GitHub Tarzı Heatmap** — Günlük aktivite takibi
- **Streak Sistemi** — Motivasyon için ardışık gün sayacı
- **Detaylı İstatistikler** — Performans metrikleri
- **Başarı Rozetleri** — Hedef odaklı ödüller

### 📱 Mobil Uygulama
- **React Native (Expo)** — iOS ve Android desteği
- **Offline Çalışma** — İnternet olmadan erişim
- **Dosya Yükleme** — Kamera ve galeri entegrasyonu
- **Senkronizasyon** — Web ile gerçek zamanlı sync

---

## 🛠️ Teknolojiler

### Frontend
| Teknoloji | Açıklama |
|-----------|----------|
| **Next.js 16** | App Router, Server Components |
| **TypeScript** | Tip güvenliği |
| **Tailwind CSS** | Utility-first styling |
| **TipTap** | Zengin metin editörü |
| **React Flow** | Zihin haritası görselleştirme |
| **Framer Motion** | Animasyonlar |

### Backend
| Teknoloji | Açıklama |
|-----------|----------|
| **Prisma** | Type-safe ORM |
| **PostgreSQL** | İlişkisel veritabanı |
| **pgvector** | Vektör embeddings |
| **OpenAI API** | GPT-4 & Embeddings |

### Mobil
| Teknoloji | Açıklama |
|-----------|----------|
| **React Native** | Cross-platform |
| **Expo** | Geliştirme araçları |
| **Zustand** | State management |

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL 15+ (pgvector extension)
- OpenAI API Key

### 1. Repoyu Klonlayın
```bash
git clone https://github.com/yourusername/smart-study-nexus.git
cd smart-study-nexus
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın
```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/smartstudy"
OPENAI_API_KEY="sk-..."
```

### 4. Veritabanını Hazırlayın
```bash
npx prisma generate
npx prisma db push
```

### 5. Uygulamayı Başlatın
```bash
npm run dev
```

🎉 Uygulama `http://localhost:3000` adresinde çalışıyor!

### Mobil Uygulama
```bash
cd mobile
npm install
npx expo start
```

---

## 📁 Proje Yapısı

```
smart-study-nexus/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (dashboard)/        # Dashboard sayfaları
│   │   │   ├── analytics/      # İstatistikler
│   │   │   ├── files/          # Dosya yönetimi
│   │   │   ├── flashcards/     # Flashcard sistemi
│   │   │   ├── mind-map/       # Zihin haritası
│   │   │   ├── notes/          # Not editörü
│   │   │   └── pdf-chat/       # PDF RAG
│   │   └── api/                # API Routes
│   ├── components/             # React bileşenleri
│   │   ├── analytics/          # Heatmap, grafikler
│   │   ├── editor/             # TipTap editör
│   │   └── layout/             # Sidebar, header
│   └── lib/                    # Utility fonksiyonlar
│       ├── ai/                 # OpenAI entegrasyonu
│       ├── algorithms/         # SM-2, streak, chunking
│       └── pdf/                # PDF parsing, RAG
├── mobile/                     # React Native uygulaması
├── prisma/                     # Veritabanı şeması
└── docs/                       # Dokümantasyon
```

---

## 🎯 Kullanım

### PDF ile Sohbet
1. **Dosyalar** sayfasından PDF yükleyin
2. **PDF Chat** sayfasına gidin
3. PDF'i seçin ve işlenmesini bekleyin
4. Sorularınızı sorun, AI kaynaklarıyla yanıtlasın

### Flashcard Oluşturma
1. **Flashcards** sayfasına gidin
2. "Yeni Kart" butonuna tıklayın
3. Ön ve arka yüzü doldurun
4. **Review** modunda SM-2 ile tekrar yapın

### Zihin Haritası
1. Notlarınızı oluşturun ve etiketleyin
2. **Zihin Haritası** sayfasına gidin
3. Notlar arası bağlantıları sürükleyerek oluşturun
4. AI önerilerini kullanın

---

## 📐 Mimari

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Next.js   │  │   TipTap    │  │    React Flow       │  │
│  │  App Router │  │   Editor    │  │    Mind Map         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Notes    │  │  Flashcards │  │      PDF RAG        │  │
│  │    CRUD     │  │    SM-2     │  │   Embeddings        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Prisma    │  │  PostgreSQL │  │     pgvector        │  │
│  │    ORM      │  │   Database  │  │    Embeddings       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌─────────────────────────┐  ┌───────────────────────────┐ │
│  │       OpenAI API        │  │      Supabase Storage     │ │
│  │   GPT-4 • Embeddings    │  │    Files • Images • PDF   │ │
│  └─────────────────────────┘  └───────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔮 Yol Haritası

- [x] Temel not yönetimi
- [x] Flashcard sistemi (SM-2)
- [x] PDF Chat (RAG)
- [x] Zihin haritası
- [x] Analytics dashboard
- [x] Mobil uygulama
- [ ] Authentication (Supabase Auth)
- [ ] Sesli not alma
- [ ] Global arama
- [ ] Web Clipper eklentisi
- [ ] Çoklu dil desteği

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen şu adımları izleyin:

1. Repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👨‍💻 Geliştirici

<p align="center">
  <strong>Portfolyo Projesi</strong><br>
  Bilgisayar Mühendisliği Öğrencisi
</p>

---

<p align="center">
  <sub>⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!</sub>
</p>
