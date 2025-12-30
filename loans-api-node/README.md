# Loans API - Node.js

API REST para gestión de préstamos construida con Node.js, Express y Sequelize.

## 🚀 Características

- ✅ Arquitectura limpia con separación de responsabilidades
- ✅ Patrón Repository para acceso a datos
- ✅ Controladores delgados
- ✅ Servicios de negocio reutilizables
- ✅ Base de datos MySQL
- ✅ Configuración con variables de entorno
- ✅ CORS habilitado

## 📁 Estructura del Proyecto

```
loans-api-node/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de BD
│   ├── controllers/
│   │   ├── PersonController.js  # CRUD personas
│   │   └── LoanController.js    # CRUD préstamos
│   ├── models/
│   │   ├── index.js            # Asociaciones
│   │   ├── Person.js           # Modelo Persona
│   │   ├── Loan.js             # Modelo Préstamo
│   │   └── Movement.js         # Modelo Movimiento
│   ├── repositories/
│   │   ├── BaseRepository.js   # Repository base
│   │   ├── PersonRepository.js # Repository personas
│   │   └── LoanRepository.js   # Repository préstamos
│   ├── routes/
│   │   ├── people.js           # Rutas personas
│   │   └── loans.js            # Rutas préstamos
│   └── services/
│       └── loanService.js      # Lógica de préstamos
├── .env                        # Variables de entorno
├── .gitignore                  # Archivos ignorados
├── app.js                      # Configuración Express
├── index.js                    # Punto de entrada
└── package.json
```

## 🛠️ Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <repository-url>
   cd loans-api-node
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura la base de datos MySQL:**
   - Asegúrate de tener MySQL instalado y ejecutándose
   - Crea una base de datos llamada `loans_db`
   - El usuario por defecto es `root` sin contraseña

4. **Configura las variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=loans_db
   DB_USER=root
   DB_PASSWORD=
   DB_DIALECT=mysql

   # Server Configuration
   PORT=8093
   NODE_ENV=development
   ```

5. **Inicia el servidor:**
   ```bash
   npm start
   ```

   Para desarrollo con recarga automática:
   ```bash
   npm run dev
   ```

## 📡 Endpoints de la API

### Personas
- `GET /api/people` - Listar todas las personas
- `GET /api/people/search?search=term` - Buscar personas
- `GET /api/people/recent` - Personas recientes
- `GET /api/people/:id` - Obtener persona por ID
- `GET /api/people/:id/loans` - Obtener préstamos de una persona
- `POST /api/people` - Crear nueva persona

### Préstamos
- `GET /api/loans` - Listar todos los préstamos
- `GET /api/loans/:id` - Obtener préstamo por ID
- `POST /api/loans` - Crear nuevo préstamo
- `POST /api/loans/:id/payment` - Registrar pago
- `POST /api/loans/:id/partial-payment` - Registrar abono parcial
- `GET /api/loans/:id/movements` - Obtener movimientos del préstamo

## 🗄️ Base de Datos

### Tablas
- **person** - Información de las personas
- **loan** - Información de los préstamos
- **movement** - Movimientos y transacciones

### Relaciones
- Una persona puede tener múltiples préstamos
- Un préstamo puede tener múltiples movimientos

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_NAME` | Nombre de la BD | `loans_db` |
| `DB_USER` | Usuario MySQL | `root` |
| `DB_PASSWORD` | Contraseña MySQL | `''` |
| `DB_DIALECT` | Dialecto de BD | `mysql` |
| `PORT` | Puerto del servidor | `8093` |
| `NODE_ENV` | Entorno | `development` |

## 🏗️ Arquitectura

La aplicación sigue el patrón de arquitectura limpia:

- **Controllers**: Manejan las solicitudes HTTP
- **Services**: Contienen la lógica de negocio
- **Repositories**: Abstraen el acceso a datos
- **Models**: Definen la estructura de datos

## 📝 Scripts Disponibles

- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm test` - Ejecuta los tests (no implementados aún)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.