import { NextRequest, NextResponse } from 'next/server'
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore'

// GET - Listar solicitações de serviços
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const district = searchParams.get('district')
    const status = searchParams.get('status') || 'PENDING'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    const firestore = getFirestore()
    const serviceRequestsRef = collection(firestore, 'serviceRequests')
    
    let q: any = serviceRequestsRef

    // Filtros
    if (category && category !== 'all') {
      q = query(q, where('category', '==', category))
    }
    
    if (district && district !== 'all') {
      q = query(q, where('location.district', '==', district))
    }
    
    if (status && status !== 'all') {
      q = query(q, where('status', '==', status))
    }

    // Ordenação
    q = query(q, orderBy('createdAt', 'desc'), limit(pageSize))

    const snapshot = await getDocs(q)
    const requests = snapshot.docs.map(doc => {
      const data = doc.data() as any
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        deadline: data.deadline?.toDate().toISOString() || null
      }
    })

    return NextResponse.json({
      requests,
      total: snapshot.size,
      page,
      pageSize
    })
  } catch (error: any) {
    console.error('Error fetching service requests:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar solicitações: ' + error.message },
      { status: 500 }
    )
  }
}

// POST - Criar nova solicitação de serviço
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      clientId,
      title,
      description,
      category,
      budgetMin,
      budgetMax,
      location,
      images,
      urgency,
      deadline
    } = body

    // Validação
    if (!clientId || !title || !description || !category || !location) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: clientId, title, description, category, location' },
        { status: 400 }
      )
    }

    // Validar localização
    if (!location.district || !location.council || !location.parish) {
      return NextResponse.json(
        { error: 'Localização incompleta. Informe distrito, concelho e freguesia' },
        { status: 400 }
      )
    }

    const firestore = getFirestore()
    const serviceRequestsRef = collection(firestore, 'serviceRequests')

    // Criar documento
    const newRequest = {
      clientId,
      title,
      description,
      category,
      budgetMin: budgetMin || null,
      budgetMax: budgetMax || null,
      location,
      images: images || [],
      status: 'PENDING',
      urgency: urgency || 'MEDIUM',
      deadline: deadline ? Timestamp.fromDate(new Date(deadline)) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }

    const docRef = await addDoc(serviceRequestsRef, newRequest)

    return NextResponse.json({
      id: docRef.id,
      ...newRequest,
      createdAt: newRequest.createdAt.toDate().toISOString(),
      updatedAt: newRequest.updatedAt.toDate().toISOString(),
      deadline: newRequest.deadline?.toDate().toISOString() || null
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating service request:', error)
    return NextResponse.json(
      { error: 'Erro ao criar solicitação: ' + error.message },
      { status: 500 }
    )
  }
}

