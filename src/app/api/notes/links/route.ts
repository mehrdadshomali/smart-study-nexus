import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/notes/links - Get all note links
export async function GET() {
  try {
    const links = await prisma.noteLink.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error('Get links error:', error)
    return NextResponse.json(
      { error: 'Bağlantılar alınırken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST /api/notes/links - Create a new link
export async function POST(request: NextRequest) {
  try {
    const { sourceId, targetId, label, linkType = 'MANUAL' } = await request.json()

    if (!sourceId || !targetId) {
      return NextResponse.json(
        { error: 'sourceId ve targetId gerekli' },
        { status: 400 }
      )
    }

    // Check if link already exists
    const existing = await prisma.noteLink.findUnique({
      where: {
        sourceId_targetId: { sourceId, targetId },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Bu bağlantı zaten mevcut' },
        { status: 400 }
      )
    }

    const link = await prisma.noteLink.create({
      data: {
        sourceId,
        targetId,
        label,
        linkType,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error('Create link error:', error)
    return NextResponse.json(
      { error: 'Bağlantı oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
}
