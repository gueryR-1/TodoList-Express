# Dependencias
node_modules/
frontend/node_modules/

# Variables de entorno
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
frontend/.env
frontend/.env.local
frontend/.env.development.local
frontend/.env.test.local
frontend/.env.production.local

# Build
dist/
frontend/dist/
build/
frontend/build/

# Cache
.cache/
.vite/
frontend/.vite/

# Logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*

# Sistema
.DS_Store
Thumbs.db

# Archivos subidos localmente por Multer
uploads/
uploads/tareas/

# Certificados locales HTTPS
certs/

# Cobertura de pruebas
coverage/

# Archivos temporales
*.tmp
*.

## Carga de base de datos de prueba

El proyecto incluye un script para cargar datos de prueba por lotes en MongoDB Atlas.

Primero se debe configurar el archivo `.env` en la raíz del proyecto usando como guía el archivo `.env.example`.

Luego ejecutar:

```bash
pnpm seed