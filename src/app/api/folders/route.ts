import { NextRequest, NextResponse } from 'next/server'

// GET - Tüm klasörleri getir
export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId gerekli' }, { status: 400 })
    }

    const folders = await prisma.folder.findMany({
      where: { userId },
      include: {
        _count: {
          select: { notes: true, questions: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(folders)
  } catch (error) {
    console.error('Folder GET error:', error)
    return NextResponse.json({ error: 'Klasörler alınamadı' }, { status: 500 })
  }
}

// POST - Yeni klasör oluştur
export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const body = await request.json()
    const { name, color, parentId, userId } = body

    if (!name || !userId) {
      return NextResponse.json({ error: 'name ve userId gerekli' }, { status: 400 })
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        color: color || '#6366f1',
        parentId: parentId || null,
        userId,
      },
      include: {
        _count: {
          select: { notes: true, questions: true },
        },
      },
    })

    return NextResponse.json(folder, { status: 201 })
  } catch (error) {
    console.error('Folder POST error:', error)
    return NextResponse.json({ error: 'Klasör oluşturulamadı' }, { status: 500 })
  }
}
