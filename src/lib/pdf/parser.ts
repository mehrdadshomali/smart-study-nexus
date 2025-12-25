/**
 * PDF Parser - Extract text from PDF files
 */

import * as pdfParse from 'pdf-parse'

// Handle both ESM and CJS imports
const pdf = (pdfParse as any).default || pdfParse

export interface PDFPage {
  pageNumber: number
  text: string
}

export interface PDFParseResult {
  text: string
  pages: PDFPage[]
  pageCount: number
  metadata: {
    title?: string
    author?: string
    subject?: string
    creator?: string
  }
}

/**
 * Parse PDF buffer and extract text with page information
 */
export async function parsePDF(buffer: Buffer): Promise<PDFParseResult> {
  const pages: PDFPage[] = []
  let currentPage = 0

  const options = {
    pagerender: (pageData: any) => {
      return pageData.getTextContent().then((textContent: any) => {
        currentPage++
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()

        if (pageText) {
          pages.push({
            pageNumber: currentPage,
            text: pageText,
          })
        }

        return pageText
      })
    },
  }

  const data = await pdf(buffer, options)

  return {
    text: data.text,
    pages,
    pageCount: data.numpages,
    metadata: {
      title: data.info?.Title,
      author: data.info?.Author,
      subject: data.info?.Subject,
      creator: data.info?.Creator,
    },
  }
}

/**
 * Extract text from specific page range
 */
export async function extractPageRange(
  buffer: Buffer,
  startPage: number,
  endPage: number
): Promise<string> {
  const result = await parsePDF(buffer)
  
  return result.pages
    .filter(p => p.pageNumber >= startPage && p.pageNumber <= endPage)
    .map(p => p.text)
    .join('\n\n')
}
