import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// POST - Upload de imagem
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'general'

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Apenas imagens são aceitas.' },
        { status: 400 }
      )
    }

    // Validar tamanho (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 5MB.' },
        { status: 400 }
      )
    }

    // Criar referência no Storage
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const storageRef = ref(storage, `${folder}/${fileName}`)

    // Converter para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)

    // Upload
    await uploadBytes(storageRef, bytes)

    // Obter URL de download
    const downloadURL = await getDownloadURL(storageRef)

    return NextResponse.json({
      url: downloadURL,
      fileName,
      size: file.size,
      type: file.type
    })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload: ' + error.message },
      { status: 500 }
    )
  }
}

// GET - Obter URLs de imagens
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const folder = searchParams.get('folder')
    const fileName = searchParams.get('fileName')

    if (!folder || !fileName) {
      return NextResponse.json(
        { error: 'folder e fileName são obrigatórios' },
        { status: 400 }
      )
    }

    const storageRef = ref(storage, `${folder}/${fileName}`)
    const url = await getDownloadURL(storageRef)

    return NextResponse.json({ url })
  } catch (error: any) {
    console.error('Error getting file URL:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar arquivo: ' + error.message },
      { status: 500 }
    )
  }
}

