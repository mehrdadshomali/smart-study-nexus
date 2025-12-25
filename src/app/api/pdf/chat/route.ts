import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateRAGAnswer } from '@/lib/pdf/rag'

// POST /api/pdf/chat - Chat with PDF
export async function POST(request: NextRequest) {
  try {
    const { fileId, sessionId, question } = await request.json()

    if (!fileId || !question) {
      return NextResponse.json(
        { error: 'fileId ve question gerekli' },
        { status: 400 }
      )
    }

    // Check if file exists and is processed
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    })

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 404 }
      )
    }

    if (!file.isProcessed) {
      return NextResponse.json(
        { error: 'PDF henüz işlenmemiş. Önce /api/pdf/process endpoint\'ini çağırın.' },
        { status: 400 }
      )
    }

    // Get or create chat session
    let session = sessionId
      ? await prisma.chatSession.findUnique({ where: { id: sessionId } })
      : null

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          fileId,
          userId: file.userId,
          title: question.slice(0, 50),
        },
      })
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'USER',
        content: question,
      },
    })

    // Generate RAG answer
    const result = await generateRAGAnswer(fileId, question)

    // Save assistant message
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'ASSISTANT',
        content: result.answer,
        sources: result.sources,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      answer: result.answer,
      sources: result.sources,
    })
  } catch (error) {
    console.error('PDF chat error:', error)
    return NextResponse.json(
      { error: 'Soru yanıtlanırken hata oluştu' },
      { status: 500 }
    )
  }
}
