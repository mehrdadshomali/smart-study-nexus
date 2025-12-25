/**
 * PDF RAG (Retrieval Augmented Generation) - Chat with PDF
 */

import { generateEmbedding, streamChat, chat } from '@/lib/ai/openai'
import { searchSimilarChunks } from './embeddings'

export interface RAGContext {
  content: string
  pageNumber: number | null
  similarity: number
}

export interface RAGResponse {
  answer: string
  sources: Array<{
    pageNumber: number | null
    excerpt: string
  }>
}

/**
 * Build context prompt from retrieved chunks
 */
function buildContextPrompt(contexts: RAGContext[]): string {
  return contexts
    .map((ctx, i) => {
      const pageInfo = ctx.pageNumber ? `[Sayfa ${ctx.pageNumber}]` : ''
      return `${pageInfo}\n${ctx.content}`
    })
    .join('\n\n---\n\n')
}

/**
 * Generate answer using RAG
 */
export async function generateRAGAnswer(
  fileId: string,
  question: string,
  options: {
    topK?: number
    temperature?: number
  } = {}
): Promise<RAGResponse> {
  const { topK = 5, temperature = 0.3 } = options

  // Generate embedding for the question
  const queryEmbedding = await generateEmbedding(question)

  // Search for relevant chunks
  const contexts = await searchSimilarChunks(fileId, queryEmbedding, topK)

  if (contexts.length === 0) {
    return {
      answer: 'Bu PDF\'de sorunuzla ilgili bilgi bulunamadı.',
      sources: [],
    }
  }

  // Build context
  const contextText = buildContextPrompt(contexts)

  // Generate answer
  const systemPrompt = `Sen bir PDF doküman asistanısın. Kullanıcının sorularını SADECE verilen bağlam bilgisini kullanarak yanıtla.

Kurallar:
1. Sadece verilen bağlamdaki bilgileri kullan
2. Bağlamda olmayan bilgileri uydurma
3. Emin olmadığın konularda "Bu bilgi dokümanda bulunmuyor" de
4. Yanıtlarını Türkçe ver
5. Kaynak sayfa numaralarını belirt

Bağlam:
${contextText}`

  const answer = await chat(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question },
    ],
    { temperature }
  )

  // Extract sources
  const sources = contexts
    .filter(ctx => ctx.similarity > 0.7)
    .map(ctx => ({
      pageNumber: ctx.pageNumber,
      excerpt: ctx.content.slice(0, 200) + '...',
    }))

  return {
    answer,
    sources,
  }
}

/**
 * Stream RAG answer
 */
export async function* streamRAGAnswer(
  fileId: string,
  question: string,
  options: {
    topK?: number
    temperature?: number
  } = {}
): AsyncGenerator<{ type: 'context' | 'token' | 'done'; data: any }> {
  const { topK = 5, temperature = 0.3 } = options

  // Generate embedding for the question
  const queryEmbedding = await generateEmbedding(question)

  // Search for relevant chunks
  const contexts = await searchSimilarChunks(fileId, queryEmbedding, topK)

  // Yield context info
  yield {
    type: 'context',
    data: contexts.map(ctx => ({
      pageNumber: ctx.pageNumber,
      excerpt: ctx.content.slice(0, 150),
      similarity: ctx.similarity,
    })),
  }

  if (contexts.length === 0) {
    yield { type: 'token', data: 'Bu PDF\'de sorunuzla ilgili bilgi bulunamadı.' }
    yield { type: 'done', data: null }
    return
  }

  // Build context
  const contextText = buildContextPrompt(contexts)

  const systemPrompt = `Sen bir PDF doküman asistanısın. Kullanıcının sorularını SADECE verilen bağlam bilgisini kullanarak yanıtla.

Kurallar:
1. Sadece verilen bağlamdaki bilgileri kullan
2. Bağlamda olmayan bilgileri uydurma
3. Emin olmadığın konularda "Bu bilgi dokümanda bulunmuyor" de
4. Yanıtlarını Türkçe ver

Bağlam:
${contextText}`

  // Stream the answer
  for await (const token of streamChat(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question },
    ],
    { temperature }
  )) {
    yield { type: 'token', data: token }
  }

  yield { type: 'done', data: null }
}
