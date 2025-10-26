import { NextRequest, NextResponse } from 'next/server'
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, Timestamp, updateDoc, doc } from 'firebase/firestore'

// GET - Listar propostas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const requestId = searchParams.get('requestId')
    const professionalId = searchParams.get('professionalId')
    const clientId = searchParams.get('clientId')
    const status = searchParams.get('status') || 'PENDING'

    const firestore = getFirestore()
    const proposalsRef = collection(firestore, 'proposals')
    
    let q: any = proposalsRef

    // Filtros
    if (requestId) {
      q = query(q, where('requestId', '==', requestId))
    }
    
    if (professionalId) {
      q = query(q, where('professionalId', '==', professionalId))
    }
    
    if (clientId) {
      // Precisamos filtrar pelos pedidos do cliente
      // Isso requer uma query mais complexa
      q = query(q, where('status', '==', status))
    }

    // Ordenação
    q = query(q, orderBy('createdAt', 'desc'))

    const snapshot = await getDocs(q)
    const proposals = snapshot.docs.map(doc => {
      const data = doc.data() as any
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
      }
    })

    // Se clientId fornecido, filtrar propostas dos pedidos desse cliente
    let filteredProposals = proposals
    if (clientId && !requestId) {
      // Buscar requests do cliente
      const serviceRequestsRef = collection(firestore, 'serviceRequests')
      const requestsSnapshot = await getDocs(
        query(serviceRequestsRef, where('clientId', '==', clientId))
      )
      const requestIds = requestsSnapshot.docs.map(d => d.id)
      
      filteredProposals = proposals.filter(p => requestIds.includes(p.requestId))
    }

    return NextResponse.json({
      proposals: filteredProposals,
      total: filteredProposals.length
    })
  } catch (error: any) {
    console.error('Error fetching proposals:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar propostas: ' + error.message },
      { status: 500 }
    )
  }
}

// POST - Criar nova proposta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      requestId,
      professionalId,
      professionalName,
      price,
      description,
      estimatedTime,
      attachments
    } = body

    // Validação
    if (!requestId || !professionalId || !professionalName || !price || !description) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: requestId, professionalId, professionalName, price, description' },
        { status: 400 }
      )
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: 'O preço deve ser maior que zero' },
        { status: 400 }
      )
    }

    const firestore = getFirestore()
    const proposalsRef = collection(firestore, 'proposals')

    // Verificar se já existe proposta do mesmo profissional para este pedido
    const existingProposalQuery = query(
      proposalsRef,
      where('requestId', '==', requestId),
      where('professionalId', '==', professionalId)
    )
    const existingSnapshot = await getDocs(existingProposalQuery)
    
    if (!existingSnapshot.empty) {
      return NextResponse.json(
        { error: 'Você já enviou uma proposta para este pedido' },
        { status: 400 }
      )
    }

    // Criar proposta
    const newProposal = {
      requestId,
      professionalId,
      professionalName,
      price,
      description,
      estimatedTime: estimatedTime || 'A definir',
      status: 'PENDING',
      attachments: attachments || [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }

    const docRef = await addDoc(proposalsRef, newProposal)

    return NextResponse.json({
      id: docRef.id,
      ...newProposal,
      createdAt: newProposal.createdAt.toDate().toISOString(),
      updatedAt: newProposal.updatedAt.toDate().toISOString()
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating proposal:', error)
    return NextResponse.json(
      { error: 'Erro ao criar proposta: ' + error.message },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar status da proposta
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { proposalId, status } = body

    if (!proposalId || !status) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: proposalId, status' },
        { status: 400 }
      )
    }

    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      )
    }

    const firestore = getFirestore()
    const proposalRef = doc(firestore, 'proposals', proposalId)

    await updateDoc(proposalRef, {
      status,
      updatedAt: Timestamp.now()
    })

    return NextResponse.json({
      success: true,
      message: 'Proposta atualizada com sucesso'
    })
  } catch (error: any) {
    console.error('Error updating proposal:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar proposta: ' + error.message },
      { status: 500 }
    )
  }
}

