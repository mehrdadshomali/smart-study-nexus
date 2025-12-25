import { NextRequest, NextResponse } from 'next/server'
import { chat } from '@/lib/ai/openai'
import { PROMPTS, fillPrompt } from '@/lib/ai/prompts'

// POST - Nottan soru üretme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, noteId, userId, count = 5 } = body

    if (!content || !userId) {
      return NextResponse.json(
        { error: 'content ve userId gerekli' },
        { status: 400 }
      )
    }

    // Extract text from TipTap JSON if needed
    let textContent = content
    if (typeof content === 'object') {
      textContent = extractTextFromTipTap(content)
    }

    if (!textContent || textContent.trim().length < 100) {
      return NextResponse.json(
        { error: 'İçerik soru üretmek için çok kısa' },
        { status: 400 }
      )
    }

    // Generate questions
    const prompt = fillPrompt(PROMPTS.GENERATE_QUESTIONS, {
      content: textContent.slice(0, 6000),
      count: String(Math.min(count, 10)),
    })

    const response = await chat([
      { role: 'user', content: prompt }
    ], {
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Parse JSON response
    let questions
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        questions = parsed.questions
      } else {
        throw new Error('JSON bulunamadı')
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json(
        { error: 'AI yanıtı işlenemedi' },
        { status: 500 }
      )
    }

    // Optionally save questions to database
    if (noteId) {
      const { prisma } = await import('@/lib/prisma')
      
      const createdQuestions = await Promise.all(
        questions.map((q: any) =>
          prisma.question.create({
            data: {
              type: q.type || 'MULTIPLE_CHOICE',
              questionText: q.questionText,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              difficulty: q.difficulty || 'MEDIUM',
              noteId,
              userId,
            },
          })
        )
      )

      // Record activity
      await prisma.activity.create({
        data: {
          userId,
          type: 'NOTE_EDITED',
          metadata: {
            action: 'questions_generated',
            noteId,
            questionCount: createdQuestions.length,
          },
        },
      })

      return NextResponse.json({
        questions: createdQuestions,
        saved: true,
      })
    }

    return NextResponse.json({ questions, saved: false })
  } catch (error) {
    console.error('Generate questions error:', error)
    return NextResponse.json({ error: 'Sorular üretilemedi' }, { status: 500 })
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
