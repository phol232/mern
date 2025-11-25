# Ejemplos de Uso - API de Métricas de Optimización

## Endpoint de Métricas

### URL Base
```
http://localhost:4000/api/metrics/optimization
```

## 1. POST - Calcular métricas con valores personalizados

### Request
```http
POST http://localhost:4000/api/metrics/optimization
Content-Type: application/json

{
  "before": {
    "backend": 60,
    "frontend": 87,
    "mongo": 266,
    "mongoExpress": 103
  },
  "after": {
    "backend": 109,
    "frontend": 11,
    "mongo": 93,
    "mongoExpress": 0
  }
}
```

### Response (200 OK)
```json
{
  "status": "Green Software Optimized",
  "metrics": {
    "ram_before_mb": 516,
    "ram_after_mb": 213,
    "ram_saved_mb": 303,
    "percentage_saved": "58.72%",
    "emissions_per_MB_base": "0.0004 gCO2e",
    "emissions_saved_per_hour": "0.1217 gCO2e",
    "emissions_saved_per_day": "2.9208 gCO2e",
    "emissions_saved_per_month": "87.62 gCO2e",
    "emissions_saved_per_year": "1066.09 gCO2e",
    "emissions_saved_by_gzip": "746.26 gCO2e (Estimado)"
  },
  "message": "Servidor optimizado con compresión Gzip para reducir huella de carbono.",
  "breakdown": {
    "backend": {
      "before": "60MB",
      "after": "109MB",
      "saved": "-49MB",
      "percentage": "-81.7%"
    },
    "frontend": {
      "before": "87MB",
      "after": "11MB",
      "saved": "76MB",
      "percentage": "87.4%"
    },
    "mongo": {
      "before": "266MB",
      "after": "93MB",
      "saved": "173MB",
      "percentage": "65.0%"
    },
    "mongoExpress": {
      "before": "103MB",
      "after": "0MB (disabled in production)",
      "saved": "103MB",
      "percentage": "100%"
    }
  },
  "equivalencies": {
    "trees_planted_equivalent": "0.05 árboles/año",
    "km_driven_saved": "4.54 km en auto/año",
    "smartphones_charged": "130 cargas/año"
  }
}
```

## 2. POST - Calcular métricas con valores por defecto (body vacío)

### Request
```http
POST http://localhost:4000/api/metrics/optimization
Content-Type: application/json

{}
```

### Response
Devuelve las mismas métricas usando valores predeterminados del sistema.

## 3. GET - Obtener métricas por defecto (sin body)

### Request
```http
GET http://localhost:4000/api/metrics/optimization
```

### Response
Devuelve las métricas con valores predeterminados del sistema.

---

## Importar a Postman

### Colección JSON para Postman

Crea una nueva colección en Postman e importa este JSON:

```json
{
  "info": {
    "name": "Critico - Métricas de Optimización",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Calcular Métricas (Valores Personalizados)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"before\": {\n    \"backend\": 500,\n    \"frontend\": 150,\n    \"mongo\": 1750,\n    \"mongoExpress\": 250\n  },\n  \"after\": {\n    \"backend\": 74,\n    \"frontend\": 10,\n    \"mongo\": 110,\n    \"mongoExpress\": 0\n  }\n}"
        },
        "url": {
          "raw": "http://localhost:4000/api/metrics/optimization",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["api", "metrics", "optimization"]
        }
      }
    },
    {
      "name": "Obtener Métricas por Defecto (GET)",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:4000/api/metrics/optimization",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["api", "metrics", "optimization"]
        }
      }
    },
    {
      "name": "Calcular Métricas (Body Vacío)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{}"
        },
        "url": {
          "raw": "http://localhost:4000/api/metrics/optimization",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["api", "metrics", "optimization"]
        }
      }
    }
  ]
}
```

---

## Uso con cURL

### POST con valores personalizados
```bash
curl -X POST http://localhost:4000/api/metrics/optimization \
  -H "Content-Type: application/json" \
  -d '{
    "before": {
      "backend": 500,
      "frontend": 150,
      "mongo": 1750,
      "mongoExpress": 250
    },
    "after": {
      "backend": 74,
      "frontend": 10,
      "mongo": 110,
      "mongoExpress": 0
    }
  }'
```

### GET valores por defecto
```bash
curl http://localhost:4000/api/metrics/optimization
```

---

## Notas Importantes

- ✅ **Sin autenticación requerida** - Endpoint público
- ✅ **Sin token necesario** - Acceso libre
- ✅ **Valores opcionales** - Si no envías `before` y `after`, usa valores por defecto
- ✅ **Documentado en Swagger** - Disponible en `http://localhost:4000/api/docs`

## Probar el Endpoint

1. Asegúrate de que el servidor esté corriendo:
   ```bash
   docker-compose up -d backend
   ```

2. Abre Postman y crea una nueva request POST a:
   ```
   http://localhost:4000/api/metrics/optimization
   ```

3. En el body (raw JSON), pega:
   ```json
   {}
   ```

4. Haz clic en "Send" y verás las métricas de optimización.
