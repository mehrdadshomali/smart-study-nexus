/**
 * PDF Embeddings - Generate and store embeddings for PDF chunks
 */

import { prisma } from '@/lib/prisma'
import { generateEmbeddings } from '@/lib/ai/openai'
import { chunkPDFByPages, type TextChunk } from '@/lib/algorithms/chunking'
import { parsePDF, type PDFPage } from './parser'

export interface ProcessingProgress {
  stage: 'parsing' | 'chunking' | 'embedding' | 'storing' | 'complete'
  progress: number
  message: string
}

/**
 * Process PDF file and generate embeddings
 */
export async function processPDFForRAG(
  fileId: string,
  buffer: Buffer,
  onProgress?: (progress: ProcessingProgress) => void
): Promise<{ chunkCount: number; pageCount: number }> {
  // Stage 1: Parse PDF
  onProgress?.({
    stage: 'parsing',
    progress: 10,
    message: 'PDF ayrıştırılıyor...',
  })

  const pdfResult = await parsePDF(buffer)

  // Stage 2: Chunk text
  onProgress?.({
    stage: 'chunking',
    progress: 30,
    message: 'Metin parçalanıyor...',
  })

  const chunks = chunkPDFByPages(pdfResult.pages, {
    chunkSize: 400,
    overlap: 50,
    minChunkSize: 100,
  })

  if (chunks.length === 0) {
    throw new Error('PDF içeriği bulunamadı')
  }

  // Stage 3: Generate embeddings
  onProgress?.({
    stage: 'embedding',
    progress: 50,
    message: `${chunks.length} parça için embedding oluşturuluyor...`,
  })

  const texts = chunks.map(c => c.content)
  const embeddings = await generateEmbeddings(texts)

  // Stage 4: Store in database
  onProgress?.({
    stage: 'storing',
    progress: 80,
    message: 'Veritabanına kaydediliyor...',
  })

  // Delete existing embeddings for this file
  await prisma.embedding.deleteMany({
    where: { fileId },
  })

  // Insert new embeddings using raw SQL for vector type
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    const embedding = embeddings[i]

    await prisma.$executeRaw`
      INSERT INTO "Embedding" (id, "fileId", "chunkIndex", content, "pageNumber", embedding, "createdAt")
      VALUES (
        ${`emb_${fileId}_${i}`},
        ${fileId},
        ${chunk.index},
        ${chunk.content},
        ${chunk.pageNumber},
        ${embedding}::vector,
        NOW()
      )
    `
  }

  // Update file as processed
  await prisma.file.update({
    where: { id: fileId },
    data: {
      isProcessed: true,
      pageCount: pdfResult.pageCount,
    },
  })

  onProgress?.({
    stage: 'complete',
    progress: 100,
    message: 'İşlem tamamlandı!',
  })

  return {
    chunkCount: chunks.length,
    pageCount: pdfResult.pageCount,
  }
}

/**
 * Search for relevant chunks using semantic similarity
 */
export async function searchSimilarChunks(
  fileId: string,
  queryEmbedding: number[],
  limit: number = 5
): Promise<Array<{
  content: string
  pageNumber: number | null
  similarity: number
}>> {
  // Use pgvector cosine similarity search
  const results = await prisma.$queryRaw<
    Array<{
      content: string
      pageNumber: number | null
      similarity: number
    }>
  >`
    SELECT 
      content,
      "pageNumber",
      1 - (embedding <=> ${queryEmbedding}::vector) as similarity
    FROM "Embedding"
    WHERE "fileId" = ${fileId}
    ORDER BY embedding <=> ${queryEmbedding}::vector
    LIMIT ${limit}
  `

  return results
}

/**
 * Get all chunks for a file (for debugging/display)
 */
export async function getFileChunks(fileId: string) {
  return prisma.embedding.findMany({
    where: { fileId },
    orderBy: { chunkIndex: 'asc' },
    select: {
      id: true,
      chunkIndex: true,
      content: true,
      pageNumber: true,
    },
  })
}
