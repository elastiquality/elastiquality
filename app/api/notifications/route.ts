import { NextRequest, NextResponse } from 'next/server'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

// Esta função seria melhor implementada em Cloud Functions
// por questões de segurança da chave do servidor
export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()
    const { userId, title, body, data } = requestBody

    if (!userId || !title || !body) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: userId, title, body' },
        { status: 400 }
      )
    }

    // Buscar token FCM do usuário
    const firestore = getFirestore()
    const tokenDoc = await getDoc(doc(firestore, 'fcmTokens', userId))
    
    if (!tokenDoc.exists()) {
      return NextResponse.json(
        { error: 'Token FCM não encontrado para este usuário' },
        { status: 404 }
      )
    }

    const tokenData = tokenDoc.data()
    const fcmToken = tokenData.token

    // Nota: O envio real de notificações deve ser feito via Cloud Functions
    // por questões de segurança. Esta é apenas uma implementação básica.
    
    return NextResponse.json({
      success: true,
      message: 'Notificação enviada (usar Cloud Functions para envio real)',
      token: fcmToken
    })
  } catch (error: any) {
    console.error('Error in notifications API:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar notificação: ' + error.message },
      { status: 500 }
    )
  }
}

