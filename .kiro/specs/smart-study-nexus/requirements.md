# Requirements Document

## Introduction

Smart-Study-Nexus, bilgisayar mühendisliği öğrencileri için tasarlanmış kapsamlı bir kişisel bilgi yönetimi ve sınav hazırlık platformudur. Uygulama; not alma, yapay zeka destekli öğrenme, aralıklı tekrar (spaced repetition), PDF analizi, zihin haritası görselleştirmesi ve gamification özelliklerini tek çatı altında birleştirir.

## Glossary

- **Smart-Study-Nexus (SSN)**: Ana uygulama sistemi
- **Nested Folders**: İç içe geçmiş klasör yapısı
- **Spaced Repetition**: Aralıklı tekrar algoritması (SM-2)
- **Flashcard**: Ön-arka yüzlü çalışma kartı
- **RAG (Retrieval-Augmented Generation)**: PDF içeriğinden soru-cevap yapan AI sistemi
- **OCR (Optical Character Recognition)**: Görüntüden metin çıkarma
- **Mind Map**: Notlar arası ilişkileri gösteren interaktif ağ grafiği
- **Streak**: Ardışık günlük çalışma serisi
- **Heatmap**: GitHub tarzı aktivite görselleştirmesi
- **TipTap**: Zengin metin editörü kütüphanesi
- **React Flow**: Zihin haritası için kullanılan graf kütüphanesi

---

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to securely register and login to the application, so that my study data is protected and personalized.

#### Acceptance Criteria

1. WHEN a user submits valid email and password THEN the SSN SHALL create a new account and send verification email
2. WHEN a user attempts to login with correct credentials THEN the SSN SHALL authenticate and redirect to dashboard
3. WHEN a user attempts to login with incorrect credentials THEN the SSN SHALL display an error message and prevent access
4. WHEN a user requests password reset THEN the SSN SHALL send a reset link to the registered email
5. WHERE OAuth providers are configured THEN the SSN SHALL allow login via Google and GitHub

---

### Requirement 2: Nested Folder System

**User Story:** As a user, I want to organize my notes and files in a hierarchical folder structure, so that I can categorize my study materials efficiently.

#### Acceptance Criteria

1. WHEN a user creates a folder THEN the SSN SHALL store the folder with name, color, and optional parent reference
2. WHEN a user creates a subfolder inside another folder THEN the SSN SHALL establish parent-child relationship
3. WHEN a user deletes a folder THEN the SSN SHALL cascade delete all child folders and contained items
4. WHEN a user moves a folder THEN the SSN SHALL update the parent reference and maintain data integrity
5. WHEN displaying folder tree THEN the SSN SHALL render folders recursively with expand/collapse functionality
6. WHEN a user renames a folder THEN the SSN SHALL update the folder name and reflect changes immediately

---

### Requirement 3: Rich Text Editor with TipTap

**User Story:** As a user, I want to create and edit notes with rich formatting options, so that I can structure my study content effectively.

#### Acceptance Criteria

1. WHEN a user creates a note THEN the SSN SHALL provide TipTap editor with formatting toolbar
2. WHEN a user applies text formatting (bold, italic, underline, strikethrough) THEN the SSN SHALL render the formatted text immediately
3. WHEN a user adds headings (H1-H3) THEN the SSN SHALL apply appropriate heading styles
4. WHEN a user creates lists (bullet, numbered, checkbox) THEN the SSN SHALL render interactive list items
5. WHEN a user highlights text THEN the SSN SHALL apply selected highlight color (yellow, green, blue, pink, purple)
6. WHEN a user inserts a code block THEN the SSN SHALL render with syntax highlighting using lowlight
7. WHEN a user writes LaTeX syntax THEN the SSN SHALL render mathematical formulas using KaTeX
8. WHEN a user inserts Markdown THEN the SSN SHALL parse and render Markdown content
9. WHEN a user saves a note THEN the SSN SHALL persist TipTap JSON content to database
10. WHEN parsing note content THEN the SSN SHALL validate against TipTap JSON schema (round-trip property)

---

### Requirement 4: Image and File Management

**User Story:** As a user, I want to upload and manage images and documents, so that I can include visual materials in my studies.

#### Acceptance Criteria

1. WHEN a user uploads an image THEN the SSN SHALL store in Supabase Storage and create database reference
2. WHEN a user uploads a document (PDF, DOCX) THEN the SSN SHALL store file and extract metadata
3. WHEN displaying files THEN the SSN SHALL show thumbnail preview for images
4. WHEN a user filters files THEN the SSN SHALL filter by type (image, document, PDF, all)
5. WHEN a user sorts files THEN the SSN SHALL sort by date, name, or size (ascending/descending)
6. WHEN a user deletes a file THEN the SSN SHALL remove from storage and database
7. WHEN serializing file metadata THEN the SSN SHALL encode using JSON format (round-trip property)

---

### Requirement 5: Question Management

**User Story:** As a user, I want to create and manage study questions, so that I can test my knowledge on specific topics.

#### Acceptance Criteria

1. WHEN a user creates a question THEN the SSN SHALL support multiple types (multiple choice, true/false, short answer, fill blank)
2. WHEN a user adds a multiple choice question THEN the SSN SHALL store options array and correct answer index
3. WHEN a user attaches an image to a question THEN the SSN SHALL display image alongside question text
4. WHEN a user sets difficulty level THEN the SSN SHALL categorize as easy, medium, or hard
5. WHEN a user links question to a note THEN the SSN SHALL establish note-question relationship
6. WHEN a user assigns question to folder THEN the SSN SHALL organize question within folder hierarchy

---

### Requirement 6: Smart OCR (Image to Text)

**User Story:** As a user, I want to extract text from uploaded images, so that I can digitize handwritten notes and printed materials.

#### Acceptance Criteria

1. WHEN a user uploads an image for OCR THEN the SSN SHALL process using Tesseract.js
2. WHEN OCR completes successfully THEN the SSN SHALL return extracted text with confidence score
3. WHEN OCR detects multiple languages THEN the SSN SHALL attempt recognition in detected languages
4. WHEN extracted text is available THEN the SSN SHALL allow user to create note from OCR result
5. IF OCR fails or returns low confidence THEN the SSN SHALL notify user and suggest image quality improvements

---

### Requirement 7: PDF-RAG (Chat with PDF)

**User Story:** As a user, I want to ask questions about my PDF documents and receive AI-generated answers, so that I can quickly find information in lengthy materials.

#### Acceptance Criteria

1. WHEN a user uploads a PDF for RAG THEN the SSN SHALL extract text and split into chunks
2. WHEN text chunks are created THEN the SSN SHALL generate embeddings using OpenAI API
3. WHEN embeddings are generated THEN the SSN SHALL store vectors in Supabase pgvector
4. WHEN a user asks a question about PDF THEN the SSN SHALL perform semantic search on embeddings
5. WHEN relevant chunks are retrieved THEN the SSN SHALL send to LLM with user question for answer generation
6. WHEN AI generates answer THEN the SSN SHALL display response with source page references
7. WHEN a user continues conversation THEN the SSN SHALL maintain chat history context

---

### Requirement 8: Spaced Repetition (Flashcards)

**User Story:** As a user, I want to review flashcards using spaced repetition algorithm, so that I can memorize information efficiently over time.

#### Acceptance Criteria

1. WHEN a user creates a flashcard THEN the SSN SHALL store front content, back content, and initial SM-2 parameters
2. WHEN a user reviews a flashcard THEN the SSN SHALL display front side first with reveal option
3. WHEN a user rates recall quality (0-5) THEN the SSN SHALL calculate next review date using SM-2 algorithm
4. WHEN calculating next interval THEN the SSN SHALL update easeFactor, interval, and repetitions
5. WHEN a user starts review session THEN the SSN SHALL fetch cards due for review (nextReviewDate <= today)
6. WHEN review session completes THEN the SSN SHALL update all card statistics and study stats
7. WHEN displaying review queue THEN the SSN SHALL show count of cards due today

---

### Requirement 9: AI Summary and Quiz Generation

**User Story:** As a user, I want AI to generate summaries and quiz questions from my notes, so that I can quickly review and test my understanding.

#### Acceptance Criteria

1. WHEN a user requests note summary THEN the SSN SHALL send note content to LLM and return concise summary
2. WHEN a user requests quiz generation THEN the SSN SHALL analyze note content and generate relevant questions
3. WHEN generating questions THEN the SSN SHALL create mix of question types based on content
4. WHEN AI generates content THEN the SSN SHALL allow user to edit before saving
5. WHEN saving AI-generated questions THEN the SSN SHALL link to source note

---

### Requirement 10: Mind Map Visualization

**User Story:** As a user, I want to visualize connections between my notes as an interactive mind map, so that I can understand relationships between concepts.

#### Acceptance Criteria

1. WHEN a user opens mind map view THEN the SSN SHALL render notes as nodes using React Flow
2. WHEN notes share tags or folder THEN the SSN SHALL create edges between related nodes
3. WHEN a user manually links notes THEN the SSN SHALL create explicit edge relationship
4. WHEN a user clicks a node THEN the SSN SHALL display note preview panel
5. WHEN a user drags a node THEN the SSN SHALL update node position and persist layout
6. WHEN a user zooms or pans THEN the SSN SHALL smoothly transform viewport
7. WHEN displaying mind map THEN the SSN SHALL color-code nodes by folder or tag

---

### Requirement 11: Code Playground

**User Story:** As a user, I want to include code snippets with syntax highlighting in my notes, so that I can document programming concepts effectively.

#### Acceptance Criteria

1. WHEN a user inserts code block THEN the SSN SHALL provide language selection dropdown
2. WHEN code block has language specified THEN the SSN SHALL apply syntax highlighting using lowlight
3. WHEN a user edits code THEN the SSN SHALL update highlighting in real-time
4. WHEN displaying code THEN the SSN SHALL show line numbers and copy button
5. WHERE executable languages are supported THEN the SSN SHALL provide run button for code execution

---

### Requirement 12: Gamification (Streaks and Heatmap)

**User Story:** As a user, I want to track my daily study activity with streaks and heatmaps, so that I can stay motivated and consistent.

#### Acceptance Criteria

1. WHEN a user completes study activity THEN the SSN SHALL record activity timestamp and type
2. WHEN calculating streak THEN the SSN SHALL count consecutive days with study activity
3. WHEN a user misses a day THEN the SSN SHALL reset streak counter to zero
4. WHEN displaying heatmap THEN the SSN SHALL render GitHub-style contribution graph for past year
5. WHEN a user achieves milestone THEN the SSN SHALL display achievement notification
6. WHEN displaying dashboard THEN the SSN SHALL show current streak, total study time, and activity summary

---

### Requirement 13: Voice Notes (Voice-to-Text)

**User Story:** As a user, I want to record voice notes and have them transcribed, so that I can capture ideas quickly without typing.

#### Acceptance Criteria

1. WHEN a user starts voice recording THEN the SSN SHALL capture audio using Web Audio API
2. WHEN recording completes THEN the SSN SHALL send audio to transcription service
3. WHEN transcription completes THEN the SSN SHALL display text with option to create note
4. WHEN a user edits transcription THEN the SSN SHALL allow corrections before saving
5. WHEN saving voice note THEN the SSN SHALL store both audio file and transcription text

---

### Requirement 14: Global Search

**User Story:** As a user, I want to search across all my content, so that I can quickly find specific information.

#### Acceptance Criteria

1. WHEN a user enters search query THEN the SSN SHALL search notes, questions, files, and folders
2. WHEN displaying results THEN the SSN SHALL group by content type with relevance ranking
3. WHEN a user clicks result THEN the SSN SHALL navigate to the specific item
4. WHEN searching THEN the SSN SHALL support full-text search with highlighting of matches
5. WHEN filtering search THEN the SSN SHALL allow filtering by type, folder, date range

---

### Requirement 15: Quiz Mode

**User Story:** As a user, I want to take quizzes from my questions, so that I can test my knowledge and track progress.

#### Acceptance Criteria

1. WHEN a user starts quiz THEN the SSN SHALL allow selection of question source (folder, all, random)
2. WHEN quiz begins THEN the SSN SHALL display questions one at a time with answer input
3. WHEN a user submits answer THEN the SSN SHALL validate and show correct/incorrect feedback
4. WHEN quiz completes THEN the SSN SHALL display score, time spent, and question breakdown
5. WHEN saving quiz attempt THEN the SSN SHALL record all answers and update question statistics
6. WHEN reviewing quiz THEN the SSN SHALL show incorrect answers with explanations

---

### Requirement 16: Analytics Dashboard

**User Story:** As a user, I want to view my study analytics, so that I can understand my learning patterns and progress.

#### Acceptance Criteria

1. WHEN displaying dashboard THEN the SSN SHALL show total notes, questions, study time
2. WHEN displaying charts THEN the SSN SHALL render weekly study time graph
3. WHEN displaying accuracy THEN the SSN SHALL calculate and show quiz accuracy percentage
4. WHEN displaying topics THEN the SSN SHALL show most studied folders/tags
5. WHEN displaying progress THEN the SSN SHALL show spaced repetition mastery levels
