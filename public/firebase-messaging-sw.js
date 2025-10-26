// Service Worker para Firebase Messaging
// Este arquivo roda em um Service Worker, não pode usar variáveis de ambiente do Next.js

// Configuração hardcoded para o Service Worker
const firebaseConfig = {
  apiKey: "AIzaSyDn9PDh_0kUduVCLQgmw-zW1VgSOi7JhHc",
  authDomain: "serviceelastiquality.firebaseapp.com",
  projectId: "serviceelastiquality",
  storageBucket: "serviceelastiquality.firebasestorage.app",
  messagingSenderId: "142160836053",
  appId: "1:142160836053:web:9ea6978f5326923f58f95c"
}

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

// Listener para mensagens em background
messaging.onBackgroundMessage((payload) => {
  console.log('Mensagem em background recebida:', payload)
  
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  }
  
  self.registration.showNotification(notificationTitle, notificationOptions)
})
