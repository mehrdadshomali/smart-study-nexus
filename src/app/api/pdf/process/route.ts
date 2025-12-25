import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { processPDFForRAG } from '@/lib/pdf/embeddings'

// POST /api/pdf/process - Process PDF for RAG
export async function POST(request: NextRequest) {
  try {
    const { fileId } = await request.json()

    if (!fileId) {
      return NextResponse.json(
        { error: 'fileId gerekli' },
        { status: 400 }
      )
    }

    // Get file from database
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    })

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 404 }
      )
    }

    if (file.type !== 'PDF') {
      return NextResponse.json(
        { error: 'Sadece PDF dosyaları işlenebilir' },
        { status: 400 }
      )
    }

    // Fetch PDF from storage URL
    const response = await fetch(file.url)
    if (!response.ok) {
      throw new Error('PDF indirilemedi')
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Process PDF
    const result = await processPDFForRAG(fileId, buffer)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('PDF processing error:', error)
    return NextResponse.json(
      { error: 'PDF işlenirken hata oluştu' },
      { status: 500 }
    )
  }
}
