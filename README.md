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

DEPENDENCIAS A INSTALAR 

    pnpm install
    pnpm dev

------------------------------------------
    GET /api/tareas
    POST /api/tareas
    PATCH /api/tareas/:id/estado
    DELETE /api/tareas/:id

GET:

    http://localhost:3000/api/tareas

    http://localhost:3000/api/tareas/id



POST: Crear Tareas

    http://localhost:3000/api/tareas

    {
    "titulo": "Estudiar Express",
    "estado": "pendiente"
    }

PATCH
    {
    "estado": "pendiente"
    }

DELETE:

    http://localhost:3000/api/tareas/id 


*******************************************************************************
| Método   | Endpoint                 | Para qué sirve                 | Body |
| -------- | ------------------------ | ------------------------------ | ---- |
| `GET`    | `/api/tareas`            | Listar todas las tareas        | No   |
| `GET`    | `/api/tareas/:id`        | Buscar una tarea por ID        | No   |
| `POST`   | `/api/tareas`            | Crear una nueva tarea          | Sí   |
| `PATCH`  | `/api/tareas/:id/estado` | Cambiar el estado de una tarea | Sí   |
| `DELETE` | `/api/tareas/:id`        | Eliminar una tarea             | No   |
*******************************************************************************

para buscar por estado

        http://localhost:3000/api/tareas?estado=completada
        