# 🔧 Guía de Solución de Problemas - CRÍTICO

Esta guía te ayudará a resolver los problemas más comunes al configurar y ejecutar el sistema CRÍTICO.

## 📋 Índice

- [Problemas de Instalación](#-problemas-de-instalación)
- [Problemas con Docker](#-problemas-con-docker)
- [Problemas de Conexión](#-problemas-de-conexión)
- [Problemas con la Base de Datos](#-problemas-con-la-base-de-datos)
- [Problemas con el Frontend](#-problemas-con-el-frontend)
- [Problemas con el Backend](#-problemas-con-el-backend)
- [Problemas con Cypress](#-problemas-con-cypress)
- [Problemas de Rendimiento](#-problemas-de-rendimiento)
- [Errores Comunes](#-errores-comunes)

---

## 🔨 Problemas de Instalación

### Node.js no se instala correctamente

**Síntomas:**
- Comando `node` no encontrado
- Versión incorrecta de Node.js

**Solución Windows:**
```powershell
# Desinstalar versión anterior
# Panel de Control > Programas > Desinstalar Node.js

# Descargar e instalar versión LTS desde:
# https://nodejs.org/

# Verificar instalación
node --version
npm --version

# Si persiste, agregar a PATH manualmente:
# Panel de Control > Sistema > Variables de entorno
# Agregar: C:\Program Files\nodejs\
```

**Solución Linux:**
```bash
# Eliminar instalación anterior
sudo apt-get remove nodejs npm

# Instalar usando NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar
node --version
npm --version
```

**Solución macOS:**
```bash
# Desinstalar versión anterior
brew uninstall node

# Instalar versión correcta
brew install node@18
brew link node@18

# Verificar
node --version
npm --version
```

### Docker no se instala o no inicia

**Windows:**

**Problema: WSL 2 no está habilitado**
```powershell
# Habilitar WSL
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Habilitar Virtual Machine Platform
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Reiniciar el sistema

# Establecer WSL 2 como predeterminado
wsl --set-default-version 2

# Instalar una distribución de Linux
wsl --install -d Ubuntu
```

**Problema: Virtualización no habilitada**
1. Reiniciar y entrar al BIOS/UEFI
2. Buscar "Virtualization Technology" o "Intel VT-x" o "AMD-V"
3. Habilitarlo
4. Guardar y reiniciar

**Linux:**

**Problema: Permisos de Docker**
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Aplicar cambios sin cerrar sesión
newgrp docker

# Verificar
docker run hello-world
```

**Problema: Docker no inicia**
```bash
# Verificar estado
sudo systemctl status docker

# Iniciar Docker
sudo systemctl start docker

# Habilitar inicio automático
sudo systemctl enable docker

# Ver logs si falla
sudo journalctl -u docker -n 50
```

**macOS:**

**Problema: Docker Desktop no abre**
```bash
# Eliminar configuración corrupta
rm -rf ~/Library/Group\ Containers/group.com.docker
rm -rf ~/Library/Containers/com.docker.docker

# Reinstalar Docker Desktop
brew uninstall --cask docker
brew install --cask docker

# Abrir Docker Desktop
open /Applications/Docker.app
```

---

## 🐳 Problemas con Docker

### Error: "Cannot connect to the Docker daemon"

**Síntomas:**
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**Solución:**
```bash
# Windows/macOS: Asegúrate de que Docker Desktop esté ejecutándose

# Linux: Iniciar servicio Docker
sudo systemctl start docker

# Verificar estado
docker info
```

### Error: "Port is already allocated"

**Síntomas:**
```
Error starting userland proxy: listen tcp 0.0.0.0:5173: bind: address already in use
```

**Solución:**

**Opción 1: Identificar y detener el proceso**
```bash
# Linux/macOS
lsof -i :5173
kill -9 <PID>

# Windows (PowerShell como Administrador)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Opción 2: Cambiar el puerto**

Edita `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "3000:80"  # Cambiar 5173 por otro puerto
```

### Error: "No space left on device"

**Síntomas:**
```
Error: No space left on device
```

**Solución:**
```bash
# Ver uso de espacio de Docker
docker system df

# Limpiar contenedores detenidos
docker container prune -f

# Limpiar imágenes no usadas
docker image prune -a -f

# Limpiar volúmenes no usados
docker volume prune -f

# Limpiar todo (¡cuidado!)
docker system prune -a --volumes -f
```

### Contenedores no inician correctamente

**Diagnóstico:**
```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongo

# Ver logs en tiempo real
docker-compose logs -f backend
```

**Solución:**
```bash
# Reiniciar servicios
docker-compose restart

# Reconstruir y reiniciar
docker-compose down
docker-compose up --build

# Limpieza completa y reinicio
docker-compose down -v
docker-compose up --build
```

---

## 🔌 Problemas de Conexión

### Frontend no se conecta al Backend

**Síntomas:**
- Error "Network Error" en el navegador
- Requests fallan con código 0 o timeout

**Diagnóstico:**
```bash
# Verificar que el backend esté ejecutándose
curl http://localhost:4000/api/health

# O desde el navegador:
# http://localhost:4000/api/health
```

**Solución 1: Verificar configuración del Frontend**

Archivo: `critico-mern/client/.env`
```env
VITE_API_URL=http://localhost:4000/api
```

**Solución 2: Verificar CORS en el Backend**

Archivo: `critico-mern/server/src/app.js`
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

**Solución 3: Reiniciar servicios**
```bash
docker-compose restart backend frontend
```

### No se puede acceder a MongoDB

**Síntomas:**
- Error "MongoNetworkError"
- "Connection refused"

**Diagnóstico:**
```bash
# Verificar que MongoDB esté ejecutándose
docker-compose ps mongo

# Ver logs de MongoDB
docker-compose logs mongo

# Probar conexión
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"
```

**Solución:**
```bash
# Reiniciar MongoDB
docker-compose restart mongo

# Si persiste, verificar el archivo .env
# MONGO_URI=mongodb://root:root@mongo:27017/critico?authSource=admin

# Limpiar y reiniciar
docker-compose down -v
docker-compose up -d
```

### Error de autenticación en MongoDB

**Síntomas:**
```
MongoServerError: Authentication failed
```

**Solución:**
```bash
# Verificar credenciales en .env
cat .env | grep MONGO

# Deben coincidir con docker-compose.yml
# Usuario: root
# Contraseña: root

# Si cambiaste las credenciales, elimina el volumen
docker-compose down -v
docker-compose up -d
```

---

## 💾 Problemas con la Base de Datos

### Base de datos no se inicializa

**Síntomas:**
- Colecciones vacías
- No hay datos de prueba

**Solución:**
```bash
# Entrar al contenedor del backend
docker-compose exec backend sh

# Crear estructura de base de datos
npm run db:structure

# Poblar con datos de prueba
npm run db:seed

# Salir
exit
```

### Datos corruptos o inconsistentes

**Solución:**
```bash
# Resetear base de datos
docker-compose exec backend npm run db:reset

# O eliminar volumen y reiniciar
docker-compose down -v
docker-compose up -d

# Esperar a que inicie y poblar
docker-compose exec backend npm run db:seed
```

### Backup y Restauración

**Crear Backup:**
```bash
# Crear directorio para backups
mkdir -p ./backups

# Crear backup
docker-compose exec mongo mongodump \
  --username=root \
  --password=root \
  --authenticationDatabase=admin \
  --db=critico \
  --out=/data/backup

# Copiar a tu máquina
docker cp mongo:/data/backup ./backups/backup-$(date +%Y%m%d)
```

**Restaurar Backup:**
```bash
# Copiar backup al contenedor
docker cp ./backups/backup-20240101 mongo:/data/restore

# Restaurar
docker-compose exec mongo mongorestore \
  --username=root \
  --password=root \
  --authenticationDatabase=admin \
  --db=critico \
  /data/restore/critico
```

---

## 🎨 Problemas con el Frontend

### Página en blanco o error 404

**Síntomas:**
- Pantalla blanca
- "Cannot GET /"

**Solución:**
```bash
# Ver logs del frontend
docker-compose logs frontend

# Reconstruir frontend
docker-compose up -d --build frontend

# Si usas desarrollo local:
cd critico-mern/client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Cambios no se reflejan

**Síntomas:**
- Modificaciones en el código no aparecen

**Solución:**
```bash
# Limpiar caché del navegador
# Chrome: Ctrl+Shift+Delete (Windows/Linux) o Cmd+Shift+Delete (macOS)

# Reconstruir sin caché
docker-compose build --no-cache frontend
docker-compose up -d frontend

# En desarrollo local:
cd critico-mern/client
rm -rf node_modules/.vite
npm run dev
```

### Error de compilación de Vite

**Síntomas:**
```
Error: Failed to parse source for import analysis
```

**Solución:**
```bash
# Limpiar y reinstalar dependencias
cd critico-mern/client
rm -rf node_modules package-lock.json
npm install

# Limpiar caché de Vite
rm -rf node_modules/.vite

# Reiniciar
npm run dev
```

---

## ⚙️ Problemas con el Backend

### Error al iniciar el servidor

**Síntomas:**
```
Error: Cannot find module 'express'
```

**Solución:**
```bash
# Reinstalar dependencias
cd critico-mern/server
rm -rf node_modules package-lock.json
npm install

# O en Docker:
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Error de JWT

**Síntomas:**
```
JsonWebTokenError: invalid token
```

**Solución:**
```bash
# Verificar JWT_SECRET en .env
cat .env | grep JWT_SECRET

# Debe ser una cadena larga y segura
# JWT_SECRET=tu-secreto-super-seguro-de-al-menos-32-caracteres

# Reiniciar backend
docker-compose restart backend
```

### Error de CORA Agent

**Síntomas:**
```
Error: CORA_AGENT_URL is not defined
```

**Solución:**

Edita `.env`:
```env
CORA_AGENT_URL=https://tu-agente.agents.do-ai.run
CORA_API_KEY=tu-api-key
CORA_CHATBOT_ID=tu-chatbot-id
```

```bash
# Reiniciar backend
docker-compose restart backend
```

---

## 🧪 Problemas con Cypress

### Cypress no abre

**Síntomas:**
```
Error: Cannot find module 'cypress'
```

**Solución:**
```bash
# Instalar dependencias
npm install

# Si persiste, reinstalar Cypress
npm install cypress --save-dev

# Verificar instalación
npx cypress verify
```

### Tests fallan por timeout

**Síntomas:**
```
Timed out retrying after 10000ms
```

**Solución:**

Edita `cypress.config.ts`:
```typescript
export default defineConfig({
  e2e: {
    defaultCommandTimeout: 20000,  // Aumentar timeout
    requestTimeout: 60000,
    responseTimeout: 60000,
    pageLoadTimeout: 120000,
  },
});
```

### Tests fallan por credenciales

**Síntomas:**
```
Error: Invalid credentials
```

**Solución:**

1. Verifica `cypress.env.json`:
```json
{
  "teacherEmail": "profesor@test.com",
  "teacherPassword": "password123",
  "studentEmail": "estudiante@test.com",
  "studentPassword": "password123"
}
```

2. Crea usuarios de prueba:
```bash
# Accede a la aplicación y registra los usuarios manualmente
# O usa el seed:
docker-compose exec backend npm run db:seed
```

### Cypress no encuentra elementos

**Síntomas:**
```
Timed out retrying: Expected to find element
```

**Solución:**
```javascript
// Usar esperas explícitas
cy.get('[data-testid="button"]', { timeout: 10000 })
  .should('be.visible')
  .click();

// O esperar a que la página cargue
cy.wait(2000);
```

---

## 🚀 Problemas de Rendimiento

### Aplicación lenta

**Diagnóstico:**
```bash
# Ver uso de recursos
docker stats

# Ver logs para errores
docker-compose logs -f
```

**Solución:**

1. **Aumentar recursos de Docker:**
   - Docker Desktop > Settings > Resources
   - Aumentar CPU y RAM

2. **Optimizar base de datos:**
```bash
# Crear índices
docker-compose exec mongo mongosh critico --eval "
  db.users.createIndex({ email: 1 });
  db.courses.createIndex({ code: 1 });
  db.texts.createIndex({ courseId: 1 });
"
```

3. **Limpiar logs:**
```bash
# Limpiar logs de Docker
docker-compose down
docker system prune -f
docker-compose up -d
```

### Build muy lento

**Solución:**
```bash
# Usar caché de Docker
docker-compose build

# Si persiste, limpiar y reconstruir
docker-compose down
docker system prune -a -f
docker-compose up --build
```

---

## ❌ Errores Comunes

### Error: "EADDRINUSE"

```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solución:**
```bash
# Ver qué está usando el puerto
lsof -i :4000  # Linux/macOS
netstat -ano | findstr :4000  # Windows

# Matar el proceso
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows
```

### Error: "ECONNREFUSED"

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solución:**
```bash
# Verificar que MongoDB esté ejecutándose
docker-compose ps mongo

# Reiniciar MongoDB
docker-compose restart mongo

# Verificar conexión
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"
```

### Error: "MODULE_NOT_FOUND"

```
Error: Cannot find module './config'
```

**Solución:**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar que el archivo exista
ls -la src/config.js
```

### Error: "Permission denied"

**Linux:**
```bash
# Dar permisos al directorio
sudo chown -R $USER:$USER .

# O ejecutar con sudo (no recomendado)
sudo docker-compose up
```

**Windows:**
```powershell
# Ejecutar PowerShell como Administrador
# Click derecho > Ejecutar como administrador
```

---

## 🆘 Último Recurso: Limpieza Completa

Si nada funciona, intenta una limpieza completa:

```bash
# 1. Detener todo
docker-compose down -v

# 2. Eliminar imágenes del proyecto
docker rmi critico/backend:latest critico/frontend:latest

# 3. Limpiar Docker
docker system prune -a --volumes -f

# 4. Eliminar node_modules
rm -rf node_modules
rm -rf critico-mern/client/node_modules
rm -rf critico-mern/server/node_modules

# 5. Reinstalar dependencias
npm install
cd critico-mern/server && npm install && cd ../..
cd critico-mern/client && npm install && cd ../..

# 6. Reconstruir desde cero
docker-compose up --build

# 7. Poblar base de datos
docker-compose exec backend npm run db:seed
```

---

## 📞 Obtener Ayuda

Si después de seguir esta guía aún tienes problemas:

1. **Recopila información:**
   ```bash
   # Versiones
   node --version
   npm --version
   docker --version
   docker-compose --version
   
   # Sistema operativo
   uname -a  # Linux/macOS
   systeminfo  # Windows
   
   # Logs
   docker-compose logs > logs.txt
   ```

2. **Busca en la documentación:**
   - [README.md](README.md)
   - [GUIA-RAPIDA.md](GUIA-RAPIDA.md)

3. **Abre un issue:**
   - Incluye la información recopilada
   - Describe el problema detalladamente
   - Indica qué soluciones intentaste

4. **Contacta al equipo de desarrollo**

---

**¡No te rindas! La mayoría de los problemas tienen solución. 💪**
