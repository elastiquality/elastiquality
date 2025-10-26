@echo off
echo =========================================
echo   Configuracao Firebase - Elastiquality
echo =========================================
echo.

REM Verificar se está logado
echo [1/6] Verificando login...
firebase login --no-localhost
echo.

REM Configurar projeto
echo [2/6] Configurando projeto...
firebase use elastiquality-b19c5
echo.

REM Inicializar Firestore
echo [3/6] Inicializando Firestore...
REM Esta acao precisa ser feita manualmente no console
echo ⚠ ATENCAO: Firestore precisa ser habilitado manualmente!
echo Abra: https://console.firebase.google.com/project/elastiquality-b19c5/firestore
echo.
echo Pressione qualquer tecla quando o Firestore estiver habilitado...
pause
echo.

REM Aplicar regras Firestore
echo [4/6] Aplicando regras Firestore...
firebase deploy --only firestore:rules
echo.

REM Aplicar regras Storage
echo [5/6] Aplicando regras Storage...
firebase deploy --only storage
echo.

REM Verificar status
echo [6/6] Verificando configuracao...
firebase projects:list
echo.

echo =========================================
echo   Configuracao concluida!
echo =========================================
pause

