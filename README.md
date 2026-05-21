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

DEPENDENCIAS A INSTALAR 
    npm install -g pnpm
    pnpm add express pug
    pnpm add -D nodemon


GET:

    http://localhost:3000/api/tareas

    http://localhost:3000/api/tareas/id



POST: Crear Tareas

    http://localhost:3000/api/tareas

    {
    "titulo": "Estudiar Express",
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
