#!/bin/bash

# Script pour démarrer le frontend Angular et le backend Node.js

echo "🚀 Démarrage des serveurs de développement..."

# Fonction pour démarrer le backend
start_backend() {
    echo "📦 Démarrage du backend..."
    cd Backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    echo "✅ Backend démarré (PID: $BACKEND_PID)"
}

# Fonction pour démarrer le frontend
start_frontend() {
    echo "🎨 Démarrage du frontend..."
    ng serve --port 4200 &
    FRONTEND_PID=$!
    echo "✅ Frontend démarré (PID: $FRONTEND_PID)"
}

# Fonction pour arrêter les serveurs
cleanup() {
    echo "🛑 Arrêt des serveurs..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Gérer Ctrl+C
trap cleanup INT

# Démarrer les serveurs
start_backend
sleep 3  # Attendre que le backend démarre
start_frontend

echo ""
echo "🎉 Serveurs démarrés !"
echo "📱 Frontend: http://localhost:4200"
echo "🔧 Backend:  http://localhost:3000"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"

# Attendre que les processus se terminent
wait
