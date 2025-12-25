/**
 * Text Chunking for PDF-RAG
 * 
 * Splits text into overlapping chunks for embedding generation
 */

export interface TextChunk {
  content: string
  index: number
  startChar: number
  endChar: number
  pageNumber?: number
  wordCount: number
}

export interface ChunkingOptions {
  chunkSize?: number      // Target words per chunk (default: 400)
  overlap?: number        // Overlap words between chunks (default: 50)
  minChunkSize?: number   // Minimum words for a valid chunk (default: 100)
}

/**
 * Split text into overlapping chunks
 * 
 * Property: All text content should be preserved across chunks
 * Property: Chunks should have specified overlap
 */
export function chunkText(
  text: string,
  options: ChunkingOptions = {}
): TextChunk[] {
  const {
    chunkSize = 400,
    overlap = 50,
    minChunkSize = 100,
  } = options

  // Clean and normalize text
  const cleanedText = text
    .replace(/\s+/g, ' ')
    .trim()

  if (!cleanedText) return []

  const words = cleanedText.split(' ')
  const chunks: TextChunk[] = []

  if (words.length <= chunkSize) {
    // Text is smaller than chunk size, return as single chunk
    return [{
      content: cleanedText,
      index: 0,
      startChar: 0,
      endChar: cleanedText.length,
      wordCount: words.length,
    }]
  }

  let startIndex = 0
  let charOffset = 0

  while (startIndex < words.length) {
    const endIndex = Math.min(startIndex + chunkSize, words.length)
    const chunkWords = words.slice(startIndex, endIndex)
    const chunkContent = chunkWords.join(' ')

    // Only add chunk if it meets minimum size (except for last chunk)
    if (chunkWords.length >= minChunkSize || startIndex + chunkSize >= words.length) {
      chunks.push({
        content: chunkContent,
        index: chunks.length,
        startChar: charOffset,
        endChar: charOffset + chunkContent.length,
        wordCount: chunkWords.length,
      })
    }

    // Move start index, accounting for overlap
    const step = chunkSize - overlap
    
    // Calculate character offset for next chunk
    const steppedWords = words.slice(startIndex, startIndex + step)
    charOffset += steppedWords.join(' ').length + 1 // +1 for space

    startIndex += step

    // Prevent infinite loop
    if (step <= 0) break
  }

  return chunks
}

/**
 * Split PDF text by pages, then chunk each page
 */
export interface PageText {
  pageNumber: number
  text: string
}

export function chunkPDFByPages(
  pages: PageText[],
  options: ChunkingOptions = {}
): TextChunk[] {
  const allChunks: TextChunk[] = []
  let globalIndex = 0

  for (const page of pages) {
    const pageChunks = chunkText(page.text, options)
    
    for (const chunk of pageChunks) {
      allChunks.push({
        ...chunk,
        index: globalIndex++,
        pageNumber: page.pageNumber,
      })
    }
  }

  return allChunks
}

/**
 * Estimate token count (rough approximation)
 * OpenAI uses ~4 characters per token on average
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Split text to fit within token limit
 */
export function splitToTokenLimit(text: string, maxTokens: number = 8000): string[] {
  const estimatedTokens = estimateTokenCount(text)
  
  if (estimatedTokens <= maxTokens) {
    return [text]
  }

  const chunks: string[] = []
  const maxChars = maxTokens * 4
  
  let remaining = text
  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      chunks.push(remaining)
      break
    }

    // Find a good break point (end of sentence or paragraph)
    let breakPoint = maxChars
    
    // Try to break at paragraph
    const paragraphBreak = remaining.lastIndexOf('\n\n', maxChars)
    if (paragraphBreak > maxChars * 0.5) {
      breakPoint = paragraphBreak + 2
    } else {
      // Try to break at sentence
      const sentenceBreak = remaining.lastIndexOf('. ', maxChars)
      if (sentenceBreak > maxChars * 0.5) {
        breakPoint = sentenceBreak + 2
      }
    }

    chunks.push(remaining.slice(0, breakPoint).trim())
    remaining = remaining.slice(breakPoint).trim()
  }

  return chunks
}

/**
 * Merge small chunks that are below minimum size
 */
export function mergeSmallChunks(chunks: TextChunk[], minSize: number = 100): TextChunk[] {
  if (chunks.length <= 1) return chunks

  const merged: TextChunk[] = []
  let buffer: TextChunk | null = null

  for (const chunk of chunks) {
    if (buffer === null) {
      if (chunk.wordCount < minSize) {
        buffer = chunk
      } else {
        merged.push(chunk)
      }
    } else {
      // Merge with buffer
      const mergedContent = buffer.content + ' ' + chunk.content
      const mergedChunk: TextChunk = {
        content: mergedContent,
        index: buffer.index,
        startChar: buffer.startChar,
        endChar: chunk.endChar,
        pageNumber: buffer.pageNumber,
        wordCount: buffer.wordCount + chunk.wordCount,
      }

      if (mergedChunk.wordCount >= minSize) {
        merged.push(mergedChunk)
        buffer = null
      } else {
        buffer = mergedChunk
      }
    }
  }

  // Don't forget remaining buffer
  if (buffer) {
    merged.push(buffer)
  }

  // Re-index
  return merged.map((chunk, index) => ({ ...chunk, index }))
}
