# Todo List - Versión 1

Proyecto básico Todo List

## Funciones

- Crear una tarea.
- Asignar estado inicial.
- Ver la lista de tareas.
- Cambiar el estado de una tarea.
- Eliminar una tarea.

## Estados disponibles

- Pendiente
- En proceso
- Completada

## Tecnologías

    - Node.js
    - Express.js
    - MongoDB Atlas
    - Mongoose
    - Thunder Client / Postman / cURL
---------------------------------------------------------
*DEPENDENCIAS A INSTALAR 

    pnpm install
    pnpm dev

dependencia para passport:

    pnpm add passport passport-jwt passport-local jsonwebtoken bcryptjs

passport        → middleware principal de autenticación
passport-jwt    → valida tokens JWT en rutas protegidas
passport-local  → valida usuario y contraseña
jsonwebtoken    → genera tokens
bcryptjs        → encripta contraseñas


Instalar CORS  para permitir usar otro puerto y permitir conexion entre puertos.
    
    pnpm add cors

Para Crear el Proyecto react:

    pnpm create vite frontend --template react

en "cd frontend" instalamos dependencias con:

    pnpm install


------------------------------------------
ENDPOINTS:

    POST /api/auth/registro
    POST /api/auth/login
    GET /api/tareas
    POST /api/tareas
    PUT /api/tareas/:id
    PATCH /api/tareas/:id
    DELETE /api/tareas/:id

GET:

    /api/tareas
    /api/tareas/id

POST: Crear Tareas

    /api/tareas

    {
    "titulo": "Estudiar Express",
    "estado": "pendiente"
    }

PATCH
    {
    "estado": "pendiente"
    }

DELETE:

    /api/tareas/id 

para buscar por estado:

        /api/tareas?estado=completada //en_proceso //pendiente

ENDPOINTS PASSPORT:

    POST /api/auth/registro
    POST /api/auth/login
    GET  /api/auth/perfil

LIBRERIA MULTER:

permite recibir archivos desde formularios multipart/form-data.

Endpoints:

    POST /api/tareas/:id/archivo       subir archivo a una tarea
    GET /api/tareas/:id/archivo        descargar archivo de una tarea
    DELETE /api/tareas/:id/archivo     eliminar archivo de una tarea

*******************************************************************************
| Método   | Endpoint                 | Para qué sirve                 | Body |
| -------- | ------------------------ | ------------------------------ | ---- |
| `GET`    | `/api/tareas`            | Listar todas las tareas        | No   |
| `GET`    | `/api/tareas/:id`        | Buscar una tarea por ID        | No   |
| `POST`   | `/api/tareas`            | Crear una nueva tarea          | Sí   |
| `PATCH`  | `/api/tareas/:id/estado` | Cambiar el estado de una tarea | Sí   |
| `DELETE` | `/api/tareas/:id`        | Eliminar una tarea             | No   |
*******************************************************************************

        