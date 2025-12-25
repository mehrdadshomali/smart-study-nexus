import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/files - List files with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const folderId = searchParams.get('folderId')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {}
    
    if (type) {
      where.type = type
    }
    
    if (folderId) {
      where.folderId = folderId
    }

    // Build orderBy
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const files = await prisma.file.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        type: true,
        mimeType: true,
        size: true,
        url: true,
        pageCount: true,
        isProcessed: true,
        ocrStatus: true,
        createdAt: true,
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(files)
  } catch (error) {
    console.error('Get files error:', error)
    return NextResponse.json(
      { error: 'Dosyalar alınırken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST /api/files - Create file record (after upload to storage)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, mimeType, size, url, storagePath, folderId, userId } = body

    if (!name || !type || !mimeType || !size || !url || !storagePath || !userId) {
      return NextResponse.json(
        { error: 'Eksik alanlar' },
        { status: 400 }
      )
    }

    const file = await prisma.file.create({
      data: {
        name,
        type,
        mimeType,
        size,
        url,
        storagePath,
        folderId,
        userId,
      },
    })

    return NextResponse.json(file, { status: 201 })
  } catch (error) {
    console.error('Create file error:', error)
    return NextResponse.json(
      { error: 'Dosya kaydedilirken hata oluştu' },
      { status: 500 }
    )
  }
}
