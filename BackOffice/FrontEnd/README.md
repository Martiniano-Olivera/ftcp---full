# Fotocopiadora BackOffice

Sistema de gestión de pedidos de impresión para fotocopiadora, desarrollado en Angular 17 con Material Design.

## 🚀 Características

- **Autenticación segura** con JWT real
- **Gestión de pedidos** pendientes y completados
- **Filtros avanzados** por cliente, estado y fecha
- **Integración con WhatsApp** para notificaciones
- **Interfaz responsive** optimizada para móviles
- **Auto-refresh** cada 30 segundos
- **Arquitectura modular** preparada para escalabilidad

## 🛠️ Tecnologías

- **Frontend**: Angular 17+ con Standalone Components
- **UI Framework**: Angular Material 17+
- **Estado**: Signals de Angular
- **HTTP**: HttpClient con interceptores
- **Routing**: Lazy loading y guards
- **Estilos**: SCSS con diseño responsive
- **Testing**: Karma + Jasmine

## 📋 Requisitos Previos

- Node.js 18+ 
- npm 9+ o yarn
- Angular CLI 17+

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd fotocopiadora-backoffice
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en desarrollo
```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 🔐 Credenciales de Acceso

**Usuario Demo:**
- **Username**: `admin`
- **Password**: `demo`

El formulario de login envía una petición `POST` a `${environment.apiUrl}/auth/login` y almacena el `access_token` recibido en `localStorage` bajo la clave `token`. Todas las solicitudes posteriores adjuntan este token en el encabezado `Authorization`.

## 📱 Funcionalidades

### Módulo de Autenticación
- Login con validaciones reactivas
- JWT real almacenado en localStorage
- Redirección automática post-autenticación
- Manejo de errores de login

### Módulo de Pedidos Pendientes
- Lista de pedidos con estado "pendiente" y "procesando"
- Filtros por cliente, estado y fecha
- Búsqueda en tiempo real
- Acciones:
  - Marcar como listo
  - Contactar cliente por WhatsApp
- Auto-refresh cada 30 segundos

### Módulo de Pedidos Completados
- Historial completo de pedidos finalizados
- Filtros por rango de fechas
- Exportación de datos (preparado)
- Visualización de comprobantes de pago

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/
│   ├── core/                 # Servicios singleton, interceptores, guards
│   │   ├── guards/          # Guards de autenticación
│   │   ├── interceptors/    # Interceptores HTTP
│   │   ├── models/          # Interfaces y tipos
│   │   └── services/        # Servicios principales
│   ├── features/            # Módulos de funcionalidad
│   │   ├── auth/           # Autenticación
│   │   └── pedidos/        # Gestión de pedidos
│   ├── layouts/             # Layouts de la aplicación
│   ├── shared/              # Componentes reutilizables
│   ├── app.component.ts     # Componente raíz
│   ├── app.config.ts        # Configuración de la app
│   └── app.routes.ts        # Configuración de rutas
├── environments/             # Configuraciones de entorno
└── assets/                  # Recursos estáticos
```

## 🔧 Configuración

### Variables de Entorno

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  whatsappBaseUrl: 'https://wa.me/',
  autoRefreshInterval: 30000
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.fotocopiadora.com',
  whatsappBaseUrl: 'https://wa.me/',
  autoRefreshInterval: 30000
};
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm start              # Servidor de desarrollo
npm run build         # Build de producción
npm run watch         # Build en modo watch

# Testing
npm test              # Ejecutar tests unitarios
npm run test:watch    # Tests en modo watch

# Linting
npm run lint          # Verificar código
```

## 🧪 Testing

El proyecto incluye configuración completa para testing:

- **Unit Tests**: Karma + Jasmine
- **Component Testing**: TestBed de Angular
- **Service Testing**: Mocks y spies
- **Coverage**: Reportes de cobertura automáticos

```bash
npm test              # Ejecutar todos los tests
npm run test:coverage # Tests con reporte de cobertura
```

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px  
- **Mobile**: 320px - 767px

## 🔒 Seguridad

- **JWT Interceptor**: Agrega tokens automáticamente
- **Auth Guards**: Protección de rutas privadas
- **Error Interceptor**: Manejo global de errores HTTP
- **Input Validation**: Validación de formularios reactivos

## 🚀 Preparación para Producción

### 1. Build de Producción
```bash
npm run build
```

### 2. Configuración de Servidor
- Configurar proxy para API
- Habilitar HTTPS
- Configurar CORS apropiadamente
- Implementar rate limiting

### 3. Variables de Entorno
- Configurar `apiUrl` de producción
- Ajustar `autoRefreshInterval` según necesidades
- Configurar logging y monitoreo

## 🔌 Integración con Backend

El frontend está preparado para conectarse con un backend NestJS:

### Endpoints Esperados
```typescript
// Autenticación
POST /auth/login
POST /auth/logout

// Pedidos
GET /orders/pending
GET /orders/completed
PATCH /orders/:id/ready
GET /orders/:id/whatsapp-link
```

### Estructura de Respuesta
```typescript
interface Pedido {
  id: string;
  clienteNombre: string;
  archivos: Archivo[];
  estado: 'pendiente' | 'procesando' | 'listo' | 'completado';
  fechaCreacion: Date;
  fechaCompletado?: Date;
  comprobantePago?: string;
  clienteTelefono?: string;
  observaciones?: string;
}
```

## 🐛 Troubleshooting

### Problemas Comunes

**Error de compilación:**
```bash
npm install --force
rm -rf node_modules package-lock.json
npm install
```

**Error de Material Design:**
```bash
npm install @angular/material @angular/cdk
```

**Problemas de routing:**
- Verificar que `base href="/"` esté configurado
- Comprobar configuración del servidor web

## 📈 Roadmap

- [ ] **Paginación** en tablas de pedidos
- [ ] **Exportación** a CSV/Excel
- [ ] **Notificaciones push** en tiempo real
- [ ] **Dashboard** con métricas y gráficos
- [ ] **Modo offline** con Service Worker
- [ ] **Tema oscuro** toggle
- [ ] **Internacionalización** (i18n)
- [ ] **PWA** con instalación offline

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación técnica

---

**Desarrollado con ❤️ para Fotocopiadora BackOffice**
