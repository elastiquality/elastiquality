import { NextRequest, NextResponse } from 'next/server'
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp, doc, getDoc } from 'firebase/firestore'

// GET - Buscar chat rooms e mensagens
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || 'rooms'
    const userId = searchParams.get('userId')
    const roomId = searchParams.get('roomId')

    const firestore = getFirestore()

    if (action === 'rooms') {
      // Buscar chat rooms do usuário
      if (!userId) {
        return NextResponse.json(
          { error: 'userId é obrigatório' },
          { status: 400 }
        )
      }

      const chatRoomsRef = collection(firestore, 'chatRooms')
      const roomsQuery = query(
        chatRoomsRef,
        where('participants', 'array-contains', { userId })
      )
      
      const snapshot = await getDocs(roomsQuery)
      const rooms = []

      for (const roomDoc of snapshot.docs) {
        const roomData = roomDoc.data()
        
        // Buscar última mensagem
        const messagesRef = collection(firestore, 'messages')
        const messagesQuery = query(
          messagesRef,
          where('roomId', '==', roomDoc.id),
          orderBy('createdAt', 'desc'),
          limit(1)
        )
        const lastMessageSnapshot = await getDocs(messagesQuery)
        
        rooms.push({
          id: roomDoc.id,
          ...roomData,
          lastMessage: lastMessageSnapshot.docs[0]?.data() || null,
          createdAt: roomData.createdAt?.toDate().toISOString() || '',
          updatedAt: roomData.updatedAt?.toDate().toISOString() || ''
        })
      }

      return NextResponse.json({ rooms })
    } else if (action === 'messages') {
      // Buscar mensagens de uma sala
      if (!roomId) {
        return NextResponse.json(
          { error: 'roomId é obrigatório' },
          { status: 400 }
        )
      }

      const messagesRef = collection(firestore, 'messages')
      const messagesQuery = query(
        messagesRef,
        where('roomId', '==', roomId),
        orderBy('createdAt', 'asc')
      )

      const snapshot = await getDocs(messagesQuery)
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || '',
      }))

      return NextResponse.json({ messages })
    } else if (action === 'room') {
      // Buscar informações de uma sala específica
      if (!roomId) {
        return NextResponse.json(
          { error: 'roomId é obrigatório' },
          { status: 400 }
        )
      }

      const roomDoc = await getDoc(doc(firestore, 'chatRooms', roomId))
      
      if (!roomDoc.exists()) {
        return NextResponse.json(
          { error: 'Sala não encontrada' },
          { status: 404 }
        )
      }

      return NextResponse.json({ room: { id: roomDoc.id, ...roomDoc.data() } })
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (error: any) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados do chat: ' + error.message },
      { status: 500 }
    )
  }
}

// POST - Criar sala ou enviar mensagem
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    const firestore = getFirestore()

    if (action === 'create-room') {
      const { participants, requestId } = data

      if (!participants || participants.length < 2) {
        return NextResponse.json(
          { error: 'São necessários pelo menos 2 participantes' },
          { status: 400 }
        )
      }

      // Verificar se já existe sala
      const chatRoomsRef = collection(firestore, 'chatRooms')
      const existingRoomsQuery = query(
        chatRoomsRef,
        where('participants', 'array-contains', participants[0])
      )
      const existingRooms = await getDocs(existingRoomsQuery)
      
      for (const room of existingRooms.docs) {
        const roomData = room.data()
        const roomParticipants = roomData.participants.map((p: any) => p.userId)
        const newParticipants = participants.map((p: any) => p.userId)
        
        if (JSON.stringify(roomParticipants.sort()) === JSON.stringify(newParticipants.sort())) {
          return NextResponse.json({
            id: room.id,
            ...roomData,
            alreadyExists: true
          })
        }
      }

      // Criar nova sala
      const newRoom = {
        participants,
        requestId: requestId || null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }

      const docRef = await addDoc(chatRoomsRef, newRoom)

      return NextResponse.json({
        id: docRef.id,
        ...newRoom,
        createdAt: newRoom.createdAt.toDate().toISOString(),
        updatedAt: newRoom.updatedAt.toDate().toISOString()
      }, { status: 201 })
    } else if (action === 'send-message') {
      const { roomId, senderId, senderName, text } = data

      if (!roomId || !senderId || !text) {
        return NextResponse.json(
          { error: 'Campos obrigatórios: roomId, senderId, text' },
          { status: 400 }
        )
      }

      const messagesRef = collection(firestore, 'messages')
      const newMessage = {
        roomId,
        senderId,
        senderName: senderName || 'Usuário',
        text,
        read: false,
        attachments: [],
        createdAt: Timestamp.now()
      }

      const docRef = await addDoc(messagesRef, newMessage)

      // Atualizar timestamp da sala
      const roomRef = doc(firestore, 'chatRooms', roomId)
      await updateDoc(roomRef, {
        updatedAt: Timestamp.now()
      })

      return NextResponse.json({
        id: docRef.id,
        ...newMessage,
        createdAt: newMessage.createdAt.toDate().toISOString()
      }, { status: 201 })
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (error: any) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Erro ao processar: ' + error.message },
      { status: 500 }
    )
  }
}

// PUT - Atualizar mensagens como lidas
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { roomId, userId } = body

    if (!roomId || !userId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: roomId, userId' },
        { status: 400 }
      )
    }

    const firestore = getFirestore()
    const messagesRef = collection(firestore, 'messages')
    const messagesQuery = query(
      messagesRef,
      where('roomId', '==', roomId),
      where('senderId', '!=', userId),
      where('read', '==', false)
    )

    const snapshot = await getDocs(messagesQuery)
    
    // Firestore não suporta update em batch com where, então atualizamos individualmente
    const updates: Promise<void>[] = []
    snapshot.docs.forEach(doc => {
      updates.push(updateDoc(doc.ref, { read: true }))
    })
    
    await Promise.all(updates)

    return NextResponse.json({ success: true, updated: snapshot.size })
  } catch (error: any) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { error: 'Erro ao marcar mensagens como lidas: ' + error.message },
      { status: 500 }
    )
  }
}

// Helper function
async function updateDoc(docRef: any, data: any) {
  const { doc, updateDoc: firestoreUpdateDoc } = await import('firebase/firestore')
  await firestoreUpdateDoc(docRef, data)
}

