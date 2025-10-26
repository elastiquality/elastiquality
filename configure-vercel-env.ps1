# Script para configurar variáveis de ambiente no Vercel
Write-Host "Configurando variáveis de ambiente no Vercel..." -ForegroundColor Cyan

# Variáveis Firebase
$vars = @{
    "NEXT_PUBLIC_FIREBASE_API_KEY" = "AIzaSyDn9PDh_0kUduVCLQgmw-zW1VgSOi7JhHc"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" = "serviceelastiquality.firebaseapp.com"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID" = "serviceelastiquality"
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" = "serviceelastiquality.firebasestorage.app"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" = "142160836053"
    "NEXT_PUBLIC_FIREBASE_APP_ID" = "1:142160836053:web:9ea6978f5326923f58f95c"
    "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" = "G-9PRJM081DJ"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" = "pk_live_YOUR_KEY_HERE"
    "STRIPE_SECRET_KEY" = "sk_live_YOUR_KEY_HERE"
    "STRIPE_WEBHOOK_SECRET" = "whsec_YOUR_KEY_HERE"
    "NEXT_PUBLIC_APP_URL" = "https://elastiquality.pt"
}

foreach ($key in $vars.Keys) {
    Write-Host "Configurando $key..." -ForegroundColor Yellow
    $value = $vars[$key]
    echo $value | vercel env add $key production
}

Write-Host "`nTodas as variáveis foram configuradas!" -ForegroundColor Green
Write-Host "Agora faça o re-deploy: vercel --prod" -ForegroundColor Cyan

