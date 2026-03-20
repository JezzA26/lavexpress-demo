# 📖 Setup Completo de LavExpress

Guía paso a paso para correr el proyecto completo en tu máquina.

---

## Requisitos Previos

- **Node.js** 16+ ([descarga aquí](https://nodejs.org))
- **npm** 8+ (incluido con Node.js)
- **Git** (para clonar el repo)
- **Terminal/CMD** acceso

Verifica que tengas todo:

```bash
node --version    # debe ser v16 o superior
npm --version     # debe ser 8 o superior
git --version     # debe tener git instalado
```

---

## Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/JezzA26/lavexpress-demo.git
cd lavexpress-demo
```

---

## Paso 2: Instalar Dependencias del Backend

```bash
cd backend
npm install
```

Esto instala:
- `express` — servidor web
- `sqlite3` — base de datos
- `jsonwebtoken` — autenticación JWT
- `bcryptjs` — hashing de contraseñas
- `cors` — permitir requests desde frontend
- `dotenv` — variables de entorno

**Tiempo estimado:** 2-3 minutos

---

## Paso 3: Iniciar el Backend

```bash
npm start
```

Deberías ver en la consola:

```
✅ Database connected: /ruta/a/lavexpress.db
✅ Default services created
✅ Demo user created (email: ajezz@demo.local, password: demo123)

🚀 LavExpress Backend running on http://localhost:5000
📡 Demo User: ajezz@demo.local / demo123
```

**Deja este terminal abierto.** El backend corre en segundo plano.

---

## Paso 4: En OTRA terminal, Abrir el Frontend

```bash
# Desde la raíz del proyecto (lavexpress-demo/)
cd frontend
```

### Opción A: Abrir en navegador directamente

Busca el archivo `index.html` en la carpeta `frontend/` y abre con doble-click, o:

```bash
# En macOS:
open index.html

# En Windows:
start index.html

# En Linux:
firefox index.html
```

### Opción B: Usar un servidor HTTP (recomendado)

```bash
# Si tienes Python 3:
python -m http.server 8000

# O si tienes Node.js http-server instalado:
npx http-server . -p 8000
```

Luego abre en tu navegador:
```
http://localhost:8000
```

---

## Paso 5: Login con Demo User

En la pantalla de login, usa:

**Email:** `ajezz@demo.local`  
**Password:** `demo123`

O crea una cuenta nueva con el botón "Crear Cuenta".

---

## ✅ Verificación Rápida

**Backend funciona si:**
- ✓ No hay errores en la terminal del backend
- ✓ Puedes ir a `http://localhost:5000/health` y ves `{"status":"ok",...}`
- ✓ El archivo `backend/lavexpress.db` se creó

**Frontend funciona si:**
- ✓ La página carga sin errores en el navegador
- ✓ Puedes hacer login con ajezz@demo.local / demo123
- ✓ Ves el home con los servicios (Lavado, Secado, Planchado, Doblado)

---

## 🐛 Troubleshooting

### Puerto 5000 ya está en uso

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solución:** Cambia el puerto en `backend/.env`:
```
PORT=5001
```

Luego en el frontend (`frontend/index.html`), busca esta línea:
```javascript
const API_URL = 'http://localhost:5000';
```

Y cámbiala a:
```javascript
const API_URL = 'http://localhost:5001';
```

### CORS Error

**Error:** `Access to XMLHttpRequest... has been blocked by CORS policy`

**Causa:** El backend no está corriendo.

**Solución:** Asegúrate de que el backend está en ejecución (`npm start` en la carpeta backend/).

### Base de datos corrupta

**Error:** `database disk image is malformed`

**Solución:** Elimina el archivo corrupto y reinicia:
```bash
rm backend/lavexpress.db
npm start  # Crea una nueva BD limpia
```

### Node modules no instalados

**Error:** `Error: Cannot find module 'express'`

**Solución:**
```bash
cd backend
npm install
```

---

## 📝 Notas Importantes

### Las contraseñas se guardan hasheadas
No se guardan en texto plano. Usamos bcryptjs (seguro).

### JWT tokens expiran en 7 días
Si el token expira, haz logout y login de nuevo.

### SQLite es local
La BD se guarda en `backend/lavexpress.db`. Para producción, usa PostgreSQL/MySQL.

### CORS está habilitado para localhost
Para producción, configura CORS específicamente en el frontend domain.

---

## 🚀 Desarrollo

### Estructura de carpetas

```
lavexpress-demo/
├── backend/
│   ├── server.js           # Servidor Express (punto de entrada)
│   ├── package.json        # Dependencias
│   ├── .env                # Variables de entorno
│   └── lavexpress.db       # Base de datos (se crea automáticamente)
├── frontend/
│   ├── index.html          # App completa (HTML + CSS + JS)
│   └── README.md           # Documentación frontend
├── README.md               # Este archivo
└── SETUP.md               # Guía de setup (este archivo)
```

### Hot Reload (desarrollo)

Para auto-reloadear el backend cuando cambias código:

```bash
cd backend
npm install -g nodemon
nodemon server.js
```

O edita `package.json` y cambia:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Luego:
```bash
npm run dev
```

---

## 📚 Próximos Pasos

1. **Customiza los servicios** — Edita los precios en `backend/server.js` (línea ~120)
2. **Agrega más estado** — Modifica los statuses en `frontend/index.html`
3. **Integra pagos** — Añade Stripe/Conekta en la pantalla de resumen
4. **Deploy a producción** — Heroku, Vercel, AWS, etc.

---

## ❓ Preguntas Frecuentes

**¿Puedo cambiar los puertos?**  
Sí. Backend en `.env`, frontend en `index.html` (línea API_URL).

**¿Puedo usar otra BD?**  
Sí. Reemplaza SQLite con PostgreSQL/MySQL (cambios en `server.js`).

**¿Cómo reseteo la BD?**  
```bash
rm backend/lavexpress.db
npm start
```

**¿Cómo agrego más usuarios?**  
Usa el botón "Crear Cuenta" en la pantalla de login.

---

## 🎉 ¡Listo!

La app está completa y funcional. Ahora puedes:

- ✅ Crear pedidos
- ✅ Ver estado en tiempo real
- ✅ Historial de pedidos
- ✅ Editar perfil
- ✅ Múltiples usuarios

¡Bienvenido a LavExpress! 🧺
