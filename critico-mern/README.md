# 🧠 CRÍTICO - Sistema de Pensamiento Crítico

Sistema educativo MERN (MongoDB, Express, React, Node.js) para la generación de textos académicos con detección de sesgos y evaluación de comprensión, integrado con el agente CORA-Edu v1.

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
  - [Windows](#windows)
  - [Linux](#linux)
  - [macOS](#macos)
- [Configuración del Proyecto](#-configuración-del-proyecto)
- [Ejecución del Proyecto](#-ejecución-del-proyecto)
- [Pruebas E2E con Cypress](#-pruebas-e2e-con-cypress)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Solución de Problemas](#-solución-de-problemas)
- [Documentación Adicional](#-documentación-adicional)

---

## 🎯 Descripción del Proyecto

**CRÍTICO** es un sistema educativo que permite:

- 📝 Generación de textos académicos con control de calidad
- 🔍 Detección automática de sesgos lingüísticos y cognitivos
- ❓ Creación de preguntas de comprensión (literales, inferenciales y críticas)
- 👥 Gestión de cursos, profesores y estudiantes
- 🤖 Integración con chatbot educativo (CORA)
- 📊 Análisis de respuestas de estudiantes

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    CRÍTICO System                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Frontend   │  │   Backend    │  │   MongoDB    │ │
│  │  React+Vite  │◄─┤  Express.js  │◄─┤   Database   │ │
│  │  Port: 5173  │  │  Port: 4000  │  │  Port: 27017 │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                  │                            │
│         │                  │                            │
│         └──────────────────┴────────────────────────────┤
│                           │                             │
│                  ┌────────▼────────┐                    │
│                  │   CORA Agent    │                    │
│                  │  (External AI)  │                    │
│                  └─────────────────┘                    │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │Mongo Express │  │   Cypress    │                    │
│  │  Port: 8081  │  │  E2E Tests   │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Requisitos Previos

### Requisitos Comunes (Todos los Sistemas Operativos)

1. **Node.js** (versión 18 o superior)
2. **Docker** y **Docker Compose**
3. **Git**
4. **Editor de código** (recomendado: VS Code)

---

## 🚀 Instalación y Configuración

### Windows

#### 1. Instalar Node.js

```powershell
# Opción 1: Descargar desde el sitio oficial
# Visita: https://nodejs.org/
# Descarga la versión LTS (Long Term Support)

# Opción 2: Usar Chocolatey (si lo tienes instalado)
choco install nodejs-lts

# Verificar instalación
node --version
npm --version
```

#### 2. Instalar Docker Desktop

```powershell
# Descargar Docker Desktop para Windows
# Visita: https://www.docker.com/products/docker-desktop/

# Después de instalar, verificar:
docker --version
docker-compose --version
```

**Nota importante para Windows:**
- Asegúrate de tener WSL 2 (Windows Subsystem for Linux) habilitado
- Docker Desktop debe estar ejecutándose antes de iniciar el proyecto

#### 3. Instalar Git

```powershell
# Opción 1: Descargar desde el sitio oficial
# Visita: https://git-scm.com/download/win

# Opción 2: Usar Chocolatey
choco install git

# Verificar instalación
git --version
```

#### 4. Clonar el Repositorio

```powershell
# Navegar a la carpeta donde quieres el proyecto
cd C:\Users\TuUsuario\Proyectos

# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd TallerProyectos2
```

---

### Linux

#### 1. Instalar Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fedora
sudo dnf install nodejs

# Arch Linux
sudo pacman -S nodejs npm

# Verificar instalación
node --version
npm --version
```

#### 2. Instalar Docker y Docker Compose

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# Fedora
sudo dnf install docker docker-compose

# Arch Linux
sudo pacman -S docker docker-compose

# Iniciar y habilitar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Agregar tu usuario al grupo docker (para no usar sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalación
docker --version
docker-compose --version
```

#### 3. Instalar Git

```bash
# Ubuntu/Debian
sudo apt-get install git

# Fedora
sudo dnf install git

# Arch Linux
sudo pacman -S git

# Verificar instalación
git --version
```

#### 4. Clonar el Repositorio

```bash
# Navegar a la carpeta donde quieres el proyecto
cd ~/proyectos

# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd TallerProyectos2
```

---

### macOS

#### 1. Instalar Homebrew (si no lo tienes)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Instalar Node.js

```bash
# Usando Homebrew
brew install node@18

# Verificar instalación
node --version
npm --version
```

#### 3. Instalar Docker Desktop

```bash
# Opción 1: Descargar desde el sitio oficial
# Visita: https://www.docker.com/products/docker-desktop/

# Opción 2: Usar Homebrew
brew install --cask docker

# Después de instalar, abre Docker Desktop desde Applications
# Verificar instalación
docker --version
docker-compose --version
```

#### 4. Instalar Git

```bash
# Git viene preinstalado en macOS, pero puedes actualizarlo
brew install git

# Verificar instalación
git --version
```

#### 5. Clonar el Repositorio

```bash
# Navegar a la carpeta donde quieres el proyecto
cd ~/proyectos

# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd TallerProyectos2
```

---

## ⚙️ Configuración del Proyecto

### 1. Configurar Variables de Entorno

#### Archivo Principal (.env en la raíz)

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar el archivo .env con tus valores
```

Contenido del archivo `.env`:

```env
# Backend Configuration
PORT=4000
NODE_ENV=production
MONGO_URI=mongodb://root:root@mongo:27017/critico?authSource=admin
JWT_SECRET=tu-secreto-jwt-super-seguro-cambiar-en-produccion

# Cora AI Configuration
CORA_AGENT_URL=https://tu-agente-cora.agents.do-ai.run
CORA_API_KEY=tu-api-key-aqui
CORA_CHATBOT_ID=tu-chatbot-id-aqui
```

#### Archivo de Cypress (cypress.env.json)

```bash
# Copiar el archivo de ejemplo
cp cypress.env.example.json cypress.env.json

# Editar con tus credenciales de prueba
```

Contenido del archivo `cypress.env.json`:

```json
{
  "teacherEmail": "profesor@test.com",
  "teacherPassword": "password123",
  "studentEmail": "estudiante@test.com",
  "studentPassword": "password123"
}
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias de Cypress (raíz del proyecto)
npm install

# Instalar dependencias del backend
cd critico-mern/server
npm install
cd ../..

# Instalar dependencias del frontend
cd critico-mern/client
npm install
cd ../..
```

---

## 🎮 Ejecución del Proyecto

### Opción 1: Ejecución con Docker (Recomendado)

Esta opción ejecuta todo el sistema (frontend, backend, base de datos) en contenedores Docker.

```bash
# Asegúrate de estar en la raíz del proyecto
cd TallerProyectos2

# Construir y levantar todos los servicios
docker-compose up --build

# O en modo detached (segundo plano)
docker-compose up -d --build
```

**Servicios disponibles:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Mongo Express: http://localhost:8081 (usuario: admin, contraseña: admin)
- MongoDB: localhost:27017

**Comandos útiles:**

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (limpieza completa)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart backend
```

### Opción 2: Solo Base de Datos con Docker

Si prefieres ejecutar el frontend y backend localmente (para desarrollo):

```bash
# Levantar solo MongoDB y Mongo Express
docker-compose -f docker-compose.db-only.yml up -d

# Backend (en una terminal)
cd critico-mern/server
npm run dev

# Frontend (en otra terminal)
cd critico-mern/client
npm run dev
```

### Opción 3: Desarrollo Local Completo (Sin Docker)

#### Instalar y Ejecutar MongoDB Localmente

**Windows:**
```powershell
# Descargar MongoDB Community Server
# https://www.mongodb.com/try/download/community

# Iniciar MongoDB
mongod --dbpath C:\data\db
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# Fedora
sudo dnf install mongodb
sudo systemctl start mongod
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Ejecutar Backend y Frontend

```bash
# Terminal 1: Backend
cd critico-mern/server
cp .env.example .env
# Editar .env y cambiar MONGO_URI a: mongodb://localhost:27017/critico
npm run dev

# Terminal 2: Frontend
cd critico-mern/client
npm run dev
```

---

## 🧪 Pruebas E2E con Cypress

### Configuración Inicial

```bash
# Asegúrate de que el sistema esté ejecutándose
# (Frontend en http://localhost:5173)

# Instalar dependencias de Cypress (si no lo hiciste antes)
npm install
```

### Ejecutar Pruebas

```bash
# Abrir Cypress en modo interactivo
npm run cypress:open

# Ejecutar todas las pruebas en modo headless
npm run cypress:run

# Ejecutar pruebas en Chrome
npm run cypress:run:chrome

# Ejecutar pruebas en Firefox
npm run cypress:run:firefox

# Ejecutar pruebas y generar reporte
npm run cypress:run:organized

# Ver reporte HTML
npm run cypress:report:open
```

### Limpiar Artefactos de Pruebas

```bash
# Limpiar todos los artefactos (screenshots, videos, reportes)
npm run cypress:clean

# Limpiar artefactos antiguos (más de 7 días)
npm run cypress:clean:old
```

---

## 📁 Estructura del Proyecto

```
TallerProyectos2/
├── critico-mern/                    # Aplicación principal MERN
│   ├── client/                      # Frontend React
│   │   ├── src/
│   │   │   ├── components/          # Componentes reutilizables
│   │   │   ├── contexts/            # Context API (AuthContext, etc.)
│   │   │   ├── layouts/             # Layouts (Dashboard, etc.)
│   │   │   ├── pages/               # Páginas de la aplicación
│   │   │   ├── services/            # Servicios API
│   │   │   └── App.jsx              # Componente principal
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── Dockerfile
│   │
│   ├── server/                      # Backend Express
│   │   ├── src/
│   │   │   ├── controllers/         # Controladores
│   │   │   ├── models/              # Modelos Mongoose
│   │   │   ├── routes/              # Rutas API
│   │   │   ├── middleware/          # Middlewares
│   │   │   ├── services/            # Lógica de negocio
│   │   │   ├── utils/               # Utilidades
│   │   │   ├── app.js               # Configuración Express
│   │   │   └── index.js             # Punto de entrada
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── docker-compose.dev.yml       # Docker Compose para desarrollo
│
├── cypress/                         # Pruebas E2E
│   ├── e2e/                         # Tests organizados por módulo
│   │   ├── teacher/                 # Tests de profesor
│   │   ├── student/                 # Tests de estudiante
│   │   ├── bias-detection/          # Tests de detección de sesgos
│   │   └── validation/              # Tests de validación
│   ├── fixtures/                    # Datos de prueba
│   ├── support/                     # Comandos personalizados
│   └── scripts/                     # Scripts de utilidad
│
├── init/                            # Scripts de inicialización DB
│   └── 01-init-db.js
│
├── docker-compose.yml               # Docker Compose producción
├── docker-compose.db-only.yml       # Solo base de datos
├── cypress.config.ts                # Configuración Cypress
├── package.json                     # Dependencias Cypress
├── .env                             # Variables de entorno
└── README.md                        # Este archivo
```

---

## 📜 Scripts Disponibles

### Scripts de Cypress (Raíz del Proyecto)

```bash
npm run cypress:open              # Abrir Cypress en modo interactivo
npm run cypress:run               # Ejecutar todas las pruebas
npm run cypress:run:chrome        # Ejecutar en Chrome
npm run cypress:run:firefox       # Ejecutar en Firefox
npm run cypress:run:organized     # Ejecutar y organizar artefactos
npm run cypress:report            # Generar reporte HTML
npm run cypress:report:open       # Generar y abrir reporte
npm run cypress:organize          # Organizar artefactos
npm run cypress:clean             # Limpiar todos los artefactos
npm run cypress:clean:old         # Limpiar artefactos antiguos
```

### Scripts del Backend

```bash
npm start                         # Iniciar en producción
npm run dev                       # Iniciar con nodemon (desarrollo)
npm test                          # Ejecutar tests
npm run test:watch                # Tests en modo watch
npm run test:coverage             # Tests con cobertura
npm run db:structure              # Crear estructura de BD
npm run db:reset                  # Resetear base de datos
npm run db:seed                   # Poblar con datos de prueba
```

### Scripts del Frontend

```bash
npm run dev                       # Iniciar servidor de desarrollo
npm run build                     # Construir para producción
npm run preview                   # Previsualizar build de producción
npm test                          # Ejecutar tests
npm run test:watch                # Tests en modo watch
npm run test:coverage             # Tests con cobertura
```

---

## 🔧 Solución de Problemas

### Problema: Docker no inicia

**Windows:**
```powershell
# Verificar que WSL 2 esté habilitado
wsl --list --verbose

# Actualizar WSL si es necesario
wsl --update

# Reiniciar Docker Desktop
```

**Linux:**
```bash
# Verificar estado de Docker
sudo systemctl status docker

# Reiniciar Docker
sudo systemctl restart docker

# Ver logs de Docker
sudo journalctl -u docker
```

**macOS:**
```bash
# Reiniciar Docker Desktop desde la aplicación
# O desde terminal:
killall Docker && open /Applications/Docker.app
```

### Problema: Puerto ya en uso

```bash
# Ver qué proceso está usando el puerto
# Windows (PowerShell)
netstat -ano | findstr :4000

# Linux/macOS
lsof -i :4000

# Matar el proceso (reemplaza PID con el número del proceso)
# Windows
taskkill /PID <PID> /F

# Linux/macOS
kill -9 <PID>
```

### Problema: Error de conexión a MongoDB

```bash
# Verificar que MongoDB esté ejecutándose
docker-compose ps

# Ver logs de MongoDB
docker-compose logs mongo

# Reiniciar MongoDB
docker-compose restart mongo

# Si persiste, eliminar volúmenes y reiniciar
docker-compose down -v
docker-compose up -d
```

### Problema: Dependencias no se instalan

```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# En Windows (PowerShell)
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### Problema: Frontend no se conecta al Backend

1. Verificar que el backend esté ejecutándose en http://localhost:4000
2. Verificar la variable `VITE_API_URL` en `critico-mern/client/.env`
3. Limpiar caché del navegador
4. Verificar CORS en el backend

### Problema: Cypress no encuentra la aplicación

1. Verificar que la aplicación esté ejecutándose en http://localhost:5173
2. Verificar la configuración de `baseUrl` en `cypress.config.ts`
3. Verificar que las credenciales en `cypress.env.json` sean correctas

---

## 📚 Documentación Adicional

- [Documentación API Backend](critico-mern/DOCUMENTACION-API-BACKEND.md)
- [Documentación Sistema Completo](critico-mern/DOCUMENTACION-SISTEMA-COMPLETO.md)
- [Instrucciones del Agente CORA](instrucciones.md)
- [Reportes de Cypress](cypress/REPORTING.md)
- [Resumen de Correcciones Cypress](CYPRESS_FIXES_SUMMARY.md)

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👥 Autores

- Equipo de desarrollo CRÍTICO

---

## 🙏 Agradecimientos

- Sistema CRÍTICO de detección de sesgos
- Agente CORA-Edu v1
- Comunidad MERN Stack

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al equipo de desarrollo.
