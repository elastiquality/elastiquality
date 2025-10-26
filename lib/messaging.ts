// Firebase Cloud Messaging (FCM) para notificações push
// Nota: Para usar no navegador, é necessário Service Worker

import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { auth, db } from './firebase'
import { initializeApp, getApps } from 'firebase/app'

// Usar a instância do Firebase já inicializada de firebase.ts
// Não precisamos inicializar aqui, o Firebase já está inicializado em firebase.ts
// apenas importamos getMessaging quando necessário

// Função para solicitar permissão de notificações
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    // Verificar se o navegador suporta Service Workers
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('Este navegador não suporta Service Workers')
      return null
    }

    // Solicitar permissão
    const permission = await Notification.requestPermission()
    
    if (permission !== 'granted') {
      console.warn('Permissão de notificações negada')
      return null
    }

    // Registrar Service Worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    
    // Obter token FCM (será implementado quando necessário)
    // const messaging = getMessaging()
    // const token = await getToken(messaging, {
    //   vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    // })

    return null // Placeholder
  } catch (error) {
    console.error('Erro ao solicitar permissão de notificações:', error)
    return null
  }
}

// Função para configurar listener de mensagens
export function setupMessageListener(callback: (payload: any) => void) {
  try {
    if (typeof window === 'undefined') return
    
    // const messaging = getMessaging()
    // onMessage(messaging, (payload) => {
    //   console.log('Mensagem recebida:', payload)
    //   callback(payload)
    // })
  } catch (error) {
    console.error('Erro ao configurar listener de mensagens:', error)
  }
}

// Função para salvar token FCM no Firestore
export async function saveFCMToken(userId: string, token: string) {
  try {
    const { doc, setDoc, getFirestore } = await import('firebase/firestore')
    const db = getFirestore()
    
    await setDoc(doc(db, 'fcmTokens', userId), {
      token,
      userId,
      updatedAt: new Date()
    }, { merge: true })
  } catch (error) {
    console.error('Erro ao salvar token FCM:', error)
  }
}

// Função para enviar notificação (usar Cloud Functions)
export async function sendNotification(userId: string, title: string, body: string, data?: any) {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title, body, data })
    })
    
    return await response.json()
  } catch (error) {
    console.error('Erro ao enviar notificação:', error)
  }
}

