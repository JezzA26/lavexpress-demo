# 📡 LavExpress API Reference

Documentación completa de endpoints disponibles.

**Base URL:** `http://localhost:5000`

---

## 🔐 Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "securepass123",
  "phone": "+52 123 456 7890",
  "address": "Veracruz, Ver."
}
```

**Response (201):**
```json
{
  "message": "User registered",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+52 123 456 7890",
    "address": "Veracruz, Ver."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "ajezz@demo.local",
  "password": "demo123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Ajezz Demo",
    "email": "ajezz@demo.local",
    "phone": "+52 123 456 7890",
    "address": "Veracruz, Ver."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 👤 User Routes

### Get Current User
```http
GET /user
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Ajezz Demo",
  "email": "ajezz@demo.local",
  "phone": "+52 123 456 7890",
  "address": "Veracruz, Ver."
}
```

---

### Update User Profile
```http
PUT /user
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Ajezz Demo Updated",
  "phone": "+52 999 888 7777",
  "address": "Veracruz, Ver. (Nuevo)"
}
```

**Response (200):**
```json
{
  "message": "User updated",
  "user": {
    "id": 1,
    "name": "Ajezz Demo Updated",
    "email": "ajezz@demo.local",
    "phone": "+52 999 888 7777",
    "address": "Veracruz, Ver. (Nuevo)"
  }
}
```

---

## 🧺 Services

### Get All Services
```http
GET /services
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Lavado",
    "icon": "🫧",
    "base_price": 35,
    "unit": "kg",
    "description": "Lavado y secado básico",
    "created_at": "2026-03-20T07:20:00.000Z"
  },
  {
    "id": 2,
    "name": "Secado",
    "icon": "💨",
    "base_price": 25,
    "unit": "kg",
    "description": "Solo secado de ropa",
    "created_at": "2026-03-20T07:20:00.000Z"
  },
  {
    "id": 3,
    "name": "Planchado",
    "icon": "👔",
    "base_price": 15,
    "unit": "pieza",
    "description": "Planchado profesional",
    "created_at": "2026-03-20T07:20:00.000Z"
  },
  {
    "id": 4,
    "name": "Doblado",
    "icon": "🗂️",
    "base_price": 10,
    "unit": "kg",
    "description": "Doblado y organización",
    "created_at": "2026-03-20T07:20:00.000Z"
  }
]
```

---

## 📦 Orders

### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "pickup_address": "Calle Principal 123, Veracruz",
  "delivery_address": "Calle Principal 123, Veracruz",
  "pickup_date": "2026-03-22",
  "pickup_time": "10:00",
  "delivery_date": "2026-03-24",
  "notes": "Colores separados, pieza delicada",
  "items": [
    {
      "service_id": 1,
      "quantity": 5
    },
    {
      "service_id": 3,
      "quantity": 3
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Order created",
  "order": {
    "id": 1,
    "user_id": 1,
    "order_number": "LV-1711010400123",
    "status": "pendiente",
    "pickup_address": "Calle Principal 123, Veracruz",
    "delivery_address": "Calle Principal 123, Veracruz",
    "pickup_date": "2026-03-22",
    "pickup_time": "10:00",
    "delivery_date": "2026-03-24",
    "total_price": 220,
    "notes": "Colores separados, pieza delicada",
    "created_at": "2026-03-20T07:20:00.000Z",
    "updated_at": "2026-03-20T07:20:00.000Z"
  },
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "service_id": 1,
      "quantity": 5,
      "unit_price": 35,
      "subtotal": 175
    },
    {
      "id": 2,
      "order_id": 1,
      "service_id": 3,
      "quantity": 3,
      "unit_price": 15,
      "subtotal": 45
    }
  ]
}
```

---

### Get User Orders
```http
GET /orders
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "order_number": "LV-1711010400123",
    "status": "pendiente",
    "pickup_address": "Calle Principal 123, Veracruz",
    "delivery_address": "Calle Principal 123, Veracruz",
    "pickup_date": "2026-03-22",
    "pickup_time": "10:00",
    "delivery_date": "2026-03-24",
    "total_price": 220,
    "notes": "Colores separados, pieza delicada",
    "created_at": "2026-03-20T07:20:00.000Z",
    "updated_at": "2026-03-20T07:20:00.000Z"
  }
]
```

---

### Get Order Details
```http
GET /orders/1
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "order": {
    "id": 1,
    "user_id": 1,
    "order_number": "LV-1711010400123",
    "status": "pendiente",
    "pickup_address": "Calle Principal 123, Veracruz",
    "delivery_address": "Calle Principal 123, Veracruz",
    "pickup_date": "2026-03-22",
    "pickup_time": "10:00",
    "delivery_date": "2026-03-24",
    "total_price": 220,
    "notes": "Colores separados, pieza delicada",
    "created_at": "2026-03-20T07:20:00.000Z",
    "updated_at": "2026-03-20T07:20:00.000Z"
  },
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "service_id": 1,
      "quantity": 5,
      "unit_price": 35,
      "subtotal": 175,
      "name": "Lavado",
      "icon": "🫧"
    },
    {
      "id": 2,
      "order_id": 1,
      "service_id": 3,
      "quantity": 3,
      "unit_price": 15,
      "subtotal": 45,
      "name": "Planchado",
      "icon": "👔"
    }
  ]
}
```

---

### Update Order Status
```http
PATCH /orders/1/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "en-proceso"
}
```

**Valid statuses:**
- `pendiente`
- `en-proceso`
- `completado`

**Response (200):**
```json
{
  "message": "Order status updated",
  "order": {
    "id": 1,
    "user_id": 1,
    "order_number": "LV-1711010400123",
    "status": "en-proceso",
    "pickup_address": "Calle Principal 123, Veracruz",
    "delivery_address": "Calle Principal 123, Veracruz",
    "pickup_date": "2026-03-22",
    "pickup_time": "10:00",
    "delivery_date": "2026-03-24",
    "total_price": 220,
    "notes": "Colores separados, pieza delicada",
    "created_at": "2026-03-20T07:20:00.000Z",
    "updated_at": "2026-03-20T07:20:15.000Z"
  }
}
```

---

## 🏥 Health Check

### Verify Backend is Running
```http
GET /health
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-03-20T07:20:00.000Z"
}
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Order not found"
}
```

### 500 Server Error
```json
{
  "error": "Database error"
}
```

---

## 📍 Quick Examples

### cURL - Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ajezz@demo.local",
    "password": "demo123"
  }'
```

### cURL - Get Services
```bash
curl http://localhost:5000/services
```

### cURL - Create Order
```bash
curl -X POST http://localhost:5000/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "pickup_address": "Tu dirección",
    "delivery_address": "Tu dirección",
    "pickup_date": "2026-03-22",
    "pickup_time": "10:00",
    "delivery_date": "2026-03-24",
    "items": [
      {"service_id": 1, "quantity": 5}
    ]
  }'
```

### JavaScript - Fetch
```javascript
// Login
const response = await fetch('http://localhost:5000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'ajezz@demo.local',
    password: 'demo123'
  })
});

const { token } = await response.json();

// Get Orders
const orders = await fetch('http://localhost:5000/orders', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const data = await orders.json();
console.log(data);
```

---

## 🔒 Security Notes

- ✅ Todas las contraseñas se hashean con bcryptjs
- ✅ JWT tokens expiran en 7 días
- ✅ Los usuarios solo ven sus propios pedidos
- ✅ Validación de entrada en todos los endpoints
- ✅ CORS habilitado para localhost

Para producción:
- Usa HTTPS (no HTTP)
- Configura JWT_SECRET con valor fuerte
- Restringue CORS a tu dominio específico
- Usa PostgreSQL en lugar de SQLite
- Agrega rate limiting

---

**Última actualización:** 2026-03-20
