# 🚀 Guía Rápida de Inicio - CRÍTICO

Esta guía te permitirá tener el sistema CRÍTICO funcionando en menos de 10 minutos.

## ⚡ Inicio Rápido (3 pasos)

### 1️⃣ Verificar Requisitos

```bash
# Verificar que tienes todo instalado
node --version    # Debe ser v18 o superior
docker --version  # Cualquier versión reciente
git --version     # Cualquier versión reciente
```

**¿No tienes algo instalado?** Ve a la [sección de instalación completa](README.md#-instalación-y-configuración) en el README.

### 2️⃣ Configurar el Proyecto

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd TallerProyectos2

# Copiar archivos de configuración
cp .env.example .env
cp cypress.env.example.json cypress.env.json

# Instalar dependencias de Cypress
npm install
```

### 3️⃣ Ejecutar el Sistema

```bash
# Iniciar Docker Desktop (Windows/macOS) o servicio Docker (Linux)

# Levantar todos los servicios
docker-compose up -d

# Esperar 30 segundos para que todo inicie...

# ¡Listo! Abre tu navegador
```

**URLs disponibles:**
- 🌐 Aplicación: http://localhost:5173
- 🔧 API Backend: http://localhost:4000
- 💾 Mongo Express: http://localhost:8081 (admin/admin)

---

## 🎯 Primeros Pasos en la Aplicación

### Crear tu Primera Cuenta

1. Abre http://localhost:5173
2. Haz clic en "Registrarse"
3. Completa el formulario:
   - Nombre completo
   - Email
   - Contraseña
   - Rol: Profesor o Estudiante

### Como Profesor

1. **Crear un Curso:**
   - Ve a "Mis Cursos"
   - Clic en "Crear Curso"
   - Completa: nombre, descripción, código

2. **Generar un Texto:**
   - Entra al curso
   - Clic en "Generar Texto"
   - Completa los parámetros:
     - Tema
     - Nivel de dificultad
     - Propósito educativo
   - Clic en "Generar"

3. **Analizar Sesgos:**
   - En el texto generado
   - Clic en "Analizar Sesgos"
   - Revisa el reporte CRÍTICO

4. **Crear Preguntas:**
   - Clic en "Generar Preguntas"
   - Se crearán 10 preguntas automáticamente

### Como Estudiante

1. **Inscribirse a un Curso:**
   - Ve a "Cursos Disponibles"
   - Busca un curso
   - Clic en "Inscribirse"
   - Ingresa el código del curso

2. **Leer Textos:**
   - Entra al curso
   - Selecciona un texto
   - Lee el contenido y glosario

3. **Responder Preguntas:**
   - Clic en "Responder Preguntas"
   - Completa tus respuestas
   - Envía para análisis

4. **Ver Análisis de Sesgos:**
   - Revisa el feedback
   - Identifica sesgos en tus respuestas
   - Mejora tu pensamiento crítico

---

## 🧪 Ejecutar Pruebas

```bash
# Abrir Cypress en modo interactivo
npm run cypress:open

# Ejecutar todas las pruebas
npm run cypress:run

# Ver reporte de pruebas
npm run cypress:report:open
```

---

## 🛑 Detener el Sistema

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar datos (limpieza completa)
docker-compose down -v
```

---

## 📊 Comandos Útiles

### Ver Logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend

# Solo base de datos
docker-compose logs -f mongo
```

### Reiniciar Servicios

```bash
# Reiniciar todo
docker-compose restart

# Reiniciar solo backend
docker-compose restart backend

# Reiniciar solo frontend
docker-compose restart frontend
```

### Estado de los Servicios

```bash
# Ver qué está ejecutándose
docker-compose ps

# Ver uso de recursos
docker stats
```

---

## 🔧 Configuración Avanzada

### Cambiar Puertos

Edita `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "3000:80"  # Cambiar 5173 por 3000
  
  backend:
    ports:
      - "5000:4000"  # Cambiar 4000 por 5000
```

### Configurar CORA Agent

Edita el archivo `.env`:

```env
CORA_AGENT_URL=https://tu-agente.agents.do-ai.run
CORA_API_KEY=tu-api-key
CORA_CHATBOT_ID=tu-chatbot-id
```

### Cambiar Credenciales de MongoDB

Edita `docker-compose.yml`:

```yaml
mongo:
  environment:
    MONGO_INITDB_ROOT_USERNAME: tu_usuario
    MONGO_INITDB_ROOT_PASSWORD: tu_contraseña
```

Y actualiza `.env`:

```env
MONGO_URI=mongodb://tu_usuario:tu_contraseña@mongo:27017/critico?authSource=admin
```

---

## 🐛 Problemas Comunes

### "Puerto ya en uso"

```bash
# Ver qué está usando el puerto
# Linux/macOS
lsof -i :5173

# Windows (PowerShell)
netstat -ano | findstr :5173

# Cambiar el puerto en docker-compose.yml
```

### "Cannot connect to Docker daemon"

```bash
# Linux
sudo systemctl start docker

# Windows/macOS
# Abrir Docker Desktop
```

### "MongoDB connection failed"

```bash
# Reiniciar MongoDB
docker-compose restart mongo

# Ver logs
docker-compose logs mongo

# Si persiste, limpiar y reiniciar
docker-compose down -v
docker-compose up -d
```

### Frontend muestra "Network Error"

1. Verifica que el backend esté ejecutándose:
   ```bash
   curl http://localhost:4000/api/health
   ```

2. Verifica la configuración en `critico-mern/client/.env`:
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```

3. Reinicia el frontend:
   ```bash
   docker-compose restart frontend
   ```

---

## 📱 Acceso desde Otros Dispositivos

Para acceder desde tu teléfono o tablet en la misma red:

1. Obtén tu IP local:
   ```bash
   # Linux/macOS
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Accede desde otro dispositivo:
   ```
   http://TU_IP:5173
   ```

3. Asegúrate de que el firewall permita las conexiones.

---

## 🎓 Siguientes Pasos

1. **Lee la documentación completa:** [README.md](README.md)
2. **Explora la API:** [Documentación API](critico-mern/DOCUMENTACION-API-BACKEND.md)
3. **Entiende el sistema:** [Documentación del Sistema](critico-mern/DOCUMENTACION-SISTEMA-COMPLETO.md)
4. **Aprende sobre CORA:** [Instrucciones del Agente](instrucciones.md)

---

## 💡 Tips y Trucos

### Desarrollo Local (Sin Docker)

Si prefieres ejecutar sin Docker:

```bash
# Terminal 1: Base de datos
docker-compose -f docker-compose.db-only.yml up

# Terminal 2: Backend
cd critico-mern/server
npm run dev

# Terminal 3: Frontend
cd critico-mern/client
npm run dev
```

### Poblar con Datos de Prueba

```bash
# Entrar al contenedor del backend
docker-compose exec backend sh

# Ejecutar seed
npm run db:seed

# Salir
exit
```

### Backup de la Base de Datos

```bash
# Crear backup
docker-compose exec mongo mongodump --out /data/backup

# Copiar backup a tu máquina
docker cp mongo:/data/backup ./backup

# Restaurar backup
docker-compose exec mongo mongorestore /data/backup
```

### Limpiar Todo y Empezar de Nuevo

```bash
# Detener y eliminar todo
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all

# Reconstruir desde cero
docker-compose up --build
```

---

## 🆘 ¿Necesitas Ayuda?

- 📖 Consulta el [README completo](README.md)
- 🐛 Revisa la [sección de solución de problemas](README.md#-solución-de-problemas)
- 💬 Abre un issue en el repositorio
- 📧 Contacta al equipo de desarrollo

---

**¡Feliz desarrollo con CRÍTICO! 🎉**
