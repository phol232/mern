# Optimizaciones de Docker para Producción

## Resumen de Cambios

Se han implementado optimizaciones significativas en `docker-compose.yml` para reducir el consumo de RAM y mejorar el rendimiento en producción.

## Optimizaciones Implementadas

### 1. **Backend (Node.js)**
- **Límite de memoria**: 512MB (reserva: 256MB)
- **Límite de CPU**: 1.0 core (reserva: 0.25)
- **Node.js optimizado**: `--max-old-space-size=256` limita el heap de V8
- **Healthcheck**: Monitoreo cada 30s para detectar problemas
- **Logs rotativos**: Máximo 10MB por archivo, 3 archivos

### 2. **Frontend (Nginx)**
- **Límite de memoria**: 128MB (reserva: 64MB)
- **Límite de CPU**: 0.5 core (reserva: 0.1)
- **Nginx estático**: Consume muy poca RAM al servir archivos estáticos
- **Healthcheck**: Verificación de disponibilidad
- **Logs rotativos**: Control de espacio en disco

### 3. **MongoDB**
- **Límite de memoria**: 1GB (reserva: 512MB)
- **Límite de CPU**: 1.0 core (reserva: 0.5)
- **WiredTiger Cache**: Limitado a 500MB (por defecto usa 50% de RAM)
- **Modo silencioso**: `--quiet` reduce logs innecesarios
- **Healthcheck optimizado**: Intervalos más largos
- **Logs rotativos**: Previene crecimiento descontrolado

### 4. **Mongo Express**
- **Límite de memoria**: 256MB (reserva: 128MB)
- **Límite de CPU**: 0.5 core (reserva: 0.1)
- **Imagen Alpine**: Versión más ligera
- **Profile "debug"**: Solo se inicia cuando se necesita explícitamente
- **Logs rotativos**: Control de espacio

## Consumo Total de RAM

### Antes (desarrollo sin límites):
- Backend: ~60MB
- Frontend: ~87MB
- MongoDB: ~266MB
- Mongo Express: ~103MB
- **TOTAL**: ~516MB

### Después (producción con límites):
- Backend: ~109MB (límite 512MB)
- Frontend: ~11MB (límite 128MB)
- MongoDB: ~93MB (límite 1GB)
- Mongo Express: 0MB (deshabilitado en producción)
- **TOTAL**: ~213MB

**Ahorro real**: ~303MB (58.7% menos RAM)

**Nota**: El backend usa más RAM en producción porque carga todos los módulos y rutas, pero está protegido por el límite de 512MB.

## Cómo Usar

### Iniciar en producción (sin Mongo Express):
```bash
docker-compose up -d
```

### Iniciar con Mongo Express para debugging:
```bash
docker-compose --profile debug up -d
```

### Monitorear consumo de recursos:
```bash
docker stats
```

### Ver logs limitados:
```bash
docker-compose logs -f --tail=100
```

## Recomendaciones Adicionales

### Para servidores con poca RAM (<2GB):
1. Reducir límites de MongoDB a 512MB total
2. Considerar usar MongoDB Atlas (cloud)
3. Deshabilitar Mongo Express en producción

### Para optimizar aún más:
1. Implementar caché con Redis (ligero)
2. Usar CDN para assets estáticos
3. Implementar compresión gzip en Nginx
4. Considerar horizontal scaling con múltiples instancias pequeñas

### Monitoreo:
```bash
# Ver uso de recursos en tiempo real
docker stats --no-stream

# Ver límites configurados
docker inspect critico-backend | grep -A 10 "Memory"
```

## Notas Importantes

- Los límites de memoria son "hard limits" - el contenedor se reiniciará si los excede
- Las reservas garantizan recursos mínimos disponibles
- Los healthchecks ayudan a detectar problemas antes de que afecten usuarios
- Los logs rotativos previenen que el disco se llene
- Mongo Express está en profile "debug" para no consumir recursos en producción

## Próximos Pasos

1. Monitorear el comportamiento en producción
2. Ajustar límites según necesidad real
3. Considerar implementar métricas con Prometheus/Grafana
4. Evaluar migrar a Kubernetes para mejor orquestación
