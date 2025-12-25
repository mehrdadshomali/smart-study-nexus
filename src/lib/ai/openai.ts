import OpenAI from 'openai'

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Embedding model
export const EMBEDDING_MODEL = 'text-embedding-3-small'
export const EMBEDDING_DIMENSIONS = 1536

// Chat models
export const CHAT_MODEL = 'gpt-4o-mini'
export const CHAT_MODEL_ADVANCED = 'gpt-4o'

/**
 * Generate embedding for text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.slice(0, 8000), // Limit input length
  })
  
  return response.data[0].embedding
}

/**
 * Generate embeddings for multiple texts (batch)
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  // OpenAI allows up to 2048 inputs per request
  const batchSize = 100
  const allEmbeddings: number[][] = []

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize).map(t => t.slice(0, 8000))
    
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
    })

    allEmbeddings.push(...response.data.map(d => d.embedding))
  }

  return allEmbeddings
}

/**
 * Chat completion with streaming
 */
export async function* streamChat(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
  } = {}
): AsyncGenerator<string> {
  const {
    model = CHAT_MODEL,
    temperature = 0.7,
    maxTokens = 2000,
  } = options

  const stream = await openai.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    stream: true,
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content
    if (content) {
      yield content
    }
  }
}

/**
 * Chat completion (non-streaming)
 */
export async function chat(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
  } = {}
): Promise<string> {
  const {
    model = CHAT_MODEL,
    temperature = 0.7,
    maxTokens = 2000,
  } = options

  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  })

  return response.choices[0]?.message?.content || ''
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}
