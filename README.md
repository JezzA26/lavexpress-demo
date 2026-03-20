# 🧺 LavExpress — Lavandería a Domicilio

Demo completa y funcional de aplicación web para gestionar servicios de lavandería a domicilio en Veracruz.

**Stack:** Node.js + Express (backend) | HTML5 + Vanilla JS (frontend) | SQLite (BD)

---

## 📋 Características

✅ **Autenticación completa** (registro, login, JWT)  
✅ **Gestión de pedidos** (crear, listar, ver estado)  
✅ **Seguimiento en tiempo real** (4 estados: pendiente, en-proceso, completado)  
✅ **Sistema de servicios** (Lavado, Secado, Planchado, Doblado)  
✅ **Historial de pedidos** con filtrado por estado  
✅ **Perfil de usuario** con edición  
✅ **Interfaz responsiva** (mobile-first)  
✅ **API REST** con manejo de errores  
✅ **BD relacional** con constraints  

---

## 🚀 Quick Start

### 1. Clonar y estructura

```bash
git clone https://github.com/JezzA26/lavexpress-demo.git
cd lavexpress-demo
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

Backend corre en `http://localhost:5000`

**Demo credentials:**
- Email: `ajezz@demo.local`
- Password: `demo123`

### 3. Frontend (en otro terminal)

```bash
cd frontend
# Abre index.html en navegador o:
npx http-server . -p 8000
```

Frontend en `http://localhost:8000`

---

## 📱 Pantallas Incluidas

1. **Login/Registro** — Autenticación con JWT
2. **Home** — Dashboard con servicios activos
3. **Nuevo Pedido (3 pasos)**
   - Paso 1: Seleccionar servicios y cantidades
   - Paso 2: Dirección, fecha/hora, notas
   - Paso 3: Resumen y confirmación
4. **Estado** — Seguimiento en vivo del pedido activo
5. **Historial** — Todos los pedidos del usuario
6. **Perfil** — Editar datos personales

---

## 🛠️ API Reference

### Auth

```
POST /auth/register
POST /auth/login
GET /user
PUT /user
```

### Services

```
GET /services
```

### Orders

```
POST /orders
GET /orders
GET /orders/:id
PATCH /orders/:id/status
```

**Headers obligatorios:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 📊 Schema de BD

### users
- id (PK)
- name, email (unique), password, phone, address
- created_at

### services
- id (PK)
- name (unique), icon, base_price, unit, description
- created_at

### orders
- id (PK)
- user_id (FK), order_number (unique), status
- pickup_address, delivery_address, pickup_date, pickup_time, delivery_date
- total_price, notes
- created_at, updated_at

### order_items
- id (PK)
- order_id (FK), service_id (FK)
- quantity, unit_price, subtotal

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcryptjs
- ✅ JWT tokens con expiración (7 días)
- ✅ CORS habilitado
- ✅ Validación de entrada en todos los endpoints
- ✅ Autorización: users solo ven/editan sus propios datos

---

## 🎨 Diseño

- **Color scheme:** Azul (#1a73e8) + gradientes
- **Tipografía:** Segoe UI
- **Responsive:** Mobile-first, funciona en todos los dispositivos
- **Animaciones:** Suaves transiciones CSS3

---

## 📦 Stack

**Frontend:**
- HTML5 + CSS3 + Vanilla JavaScript
- Fetch API para consumir backend
- LocalStorage para persistencia

**Backend:**
- Node.js 16+
- Express.js
- SQLite3
- JWT (jsonwebtoken)
- bcryptjs
- CORS

---

## 🔄 Próximas Fases

- [ ] Integración de pagos (Stripe/Conekta)
- [ ] Notificaciones push
- [ ] App móvil nativa (React Native/Flutter)
- [ ] Dashboard admin
- [ ] Rating de servicios
- [ ] Sistema de promociones
- [ ] Integración con Google Maps
- [ ] Reportes de ganancias

---

## 👨‍💻 Autor

**AjezClaw** — InstaClaw AI Agent

---

## 📄 Licencia

MIT — Libre para usar, modificar y distribuir.

---

## 🤝 Soporte

Para issues, preguntas o contribuciones: contacta a Ajezz26

**Demo en vivo:** Disponible en GitHub Pages (próximamente)
