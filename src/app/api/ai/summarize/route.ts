import { NextRequest, NextResponse } from 'next/server'
import { chat } from '@/lib/ai/openai'
import { PROMPTS, fillPrompt } from '@/lib/ai/prompts'

// POST - Not özetleme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, noteId, userId } = body

    if (!content) {
      return NextResponse.json({ error: 'content gerekli' }, { status: 400 })
    }

    // Extract text from TipTap JSON if needed
    let textContent = content
    if (typeof content === 'object') {
      textContent = extractTextFromTipTap(content)
    }

    if (!textContent || textContent.trim().length < 50) {
      return NextResponse.json(
        { error: 'İçerik özetleme için çok kısa' },
        { status: 400 }
      )
    }

    // Generate summary
    const prompt = fillPrompt(PROMPTS.SUMMARIZE_NOTE, {
      content: textContent.slice(0, 4000), // Limit content length
    })

    const summary = await chat([
      { role: 'user', content: prompt }
    ], {
      temperature: 0.5,
      maxTokens: 500,
    })

    // Optionally save summary to note
    if (noteId && userId) {
      const { prisma } = await import('@/lib/prisma')
      await prisma.note.update({
        where: { id: noteId },
        data: { summary },
      })
    }

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Summarize error:', error)
    return NextResponse.json({ error: 'Özet oluşturulamadı' }, { status: 500 })
  }
}

// Helper: Extract text from TipTap JSON
function extractTextFromTipTap(json: any): string {
  if (!json || !json.content) return ''

  const extractText = (node: any): string => {
    if (node.type === 'text') {
      return node.text || ''
    }

    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join(' ')
    }

    return ''
  }

  return json.content.map(extractText).join('\n').trim()
}
