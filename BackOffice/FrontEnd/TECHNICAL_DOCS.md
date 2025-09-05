# Documentación Técnica - Fotocopiadora BackOffice

## 📋 Índice

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Estructura de Datos](#estructura-de-datos)
3. [Servicios y Lógica de Negocio](#servicios-y-lógica-de-negocio)
4. [Interceptores HTTP](#interceptores-http)
5. [Guards de Autenticación](#guards-de-autenticación)
6. [Componentes y Templates](#componentes-y-templates)
7. [Rutas y Navegación](#rutas-y-navegación)
8. [Estado y Reactividad](#estado-y-reactividad)
9. [Testing](#testing)
10. [Deployment](#deployment)

## 🏗️ Arquitectura del Sistema

### Principios de Diseño

- **Separación de Responsabilidades**: Cada módulo tiene una responsabilidad específica
- **Inyección de Dependencias**: Uso extensivo de DI para testing y mantenibilidad
- **Componentes Standalone**: Arquitectura moderna de Angular 17+
- **Lazy Loading**: Carga diferida de módulos para optimizar performance
- **Interceptores**: Manejo centralizado de HTTP requests y respuestas

### Estructura de Módulos

```
src/app/
├── core/                    # Funcionalidades centrales
│   ├── guards/             # Protección de rutas
│   ├── interceptors/       # Interceptores HTTP
│   ├── models/             # Interfaces y tipos
│   └── services/           # Servicios singleton
├── features/               # Módulos de funcionalidad
│   ├── auth/              # Autenticación
│   └── pedidos/           # Gestión de pedidos
├── layouts/                # Layouts de la aplicación
└── shared/                 # Componentes reutilizables
```

## 📊 Estructura de Datos

### Modelo de Pedido

```typescript
interface Pedido {
  id: string;                    // Identificador único
  clienteNombre: string;         // Nombre del cliente
  archivos: Archivo[];           // Lista de archivos
  estado: EstadoPedido;          // Estado actual del pedido
  fechaCreacion: Date;           // Fecha de creación
  fechaCompletado?: Date;        // Fecha de completado (opcional)
  comprobantePago?: string;      // URL del comprobante (opcional)
  telefonoCliente?: string;      // Teléfono del cliente (opcional)
  observaciones?: string;        // Observaciones adicionales (opcional)
}

type EstadoPedido = 'pendiente' | 'procesando' | 'listo' | 'completado';
```

### Modelo de Archivo

```typescript
interface Archivo {
  nombre: string;                // Nombre del archivo
  url: string;                   // URL de Google Drive
  tamaño: number;                // Tamaño en bytes
  tipo: string;                  // MIME type del archivo
}
```

## 🔧 Servicios y Lógica de Negocio

### AuthService

**Responsabilidades:**
- Gestión de autenticación
- Almacenamiento de tokens JWT
- Control de estado de autenticación
- Logout automático

**Métodos Principales:**
```typescript
class AuthService {
  login(credentials: LoginCredentials): Observable<AuthResponse>
  logout(): void
  isAuthenticated(): boolean
  getToken(): string | null
  getCurrentUser(): User | null
}
```

**Estado:**
- `isAuthenticated$`: Observable del estado de autenticación
- `isLoading`: Signal para indicadores de loading

### PedidosService

**Responsabilidades:**
- CRUD de pedidos
- Filtrado y búsqueda
- Gestión de estados
- Integración con WhatsApp

**Métodos Principales:**
```typescript
class PedidosService {
  getPedidosPendientes(): Observable<Pedido[]>
  getPedidosCompletados(): Observable<Pedido[]>
  marcarComoListo(id: string): Observable<void>
  getWhatsAppLink(id: string): Observable<WhatsAppLinkResponse>
  refreshPedidos(): Observable<Pedido[]>
}
```

**Mock Data:**
- Datos simulados para desarrollo
- Simulación de delays de red
- Estados de pedidos predefinidos

## 🌐 Interceptores HTTP

### AuthInterceptor

**Propósito:** Agregar token JWT a todas las requests
**Implementación:** Función standalone con `inject()`

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }
  
  return next(req);
};
```

### ErrorInterceptor

**Propósito:** Manejo global de errores HTTP
**Funcionalidades:**
- Manejo de errores 401 (logout automático)
- Notificaciones de error para el usuario
- Logging de errores para debugging

### LoadingInterceptor

**Propósito:** Gestión automática de estados de loading
**Características:**
- Exclusión de requests de refresh automático
- Integración con LoadingService
- Manejo de loading global

## 🛡️ Guards de Autenticación

### AuthGuard

**Propósito:** Proteger rutas privadas
**Lógica:** Verificar estado de autenticación

```typescript
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

### NoAuthGuard

**Propósito:** Redirigir usuarios autenticados desde login
**Lógica:** Verificar si ya está autenticado

## 🎨 Componentes y Templates

### LoginComponent

**Características:**
- Formulario reactivo con validaciones
- Credenciales pre-cargadas para demo
- Manejo de estados de loading
- Redirección automática post-login

**Validaciones:**
- Username: requerido, mínimo 3 caracteres
- Password: requerido, mínimo 4 caracteres

### PedidosPendientesComponent

**Funcionalidades:**
- Tabla responsiva con Material Design
- Filtros en tiempo real
- Auto-refresh cada 30 segundos
- Acciones de pedido (marcar listo, WhatsApp)

**Filtros Disponibles:**
- Búsqueda por cliente o ID
- Filtro por estado
- Filtro por fecha

### PedidosListosComponent

**Funcionalidades:**
- Historial de pedidos completados
- Filtros por rango de fechas
- Exportación de datos (preparado)
- Visualización de comprobantes

## 🧭 Rutas y Navegación

### Configuración de Rutas

```typescript
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component'),
    canActivate: [noAuthGuard]
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component'),
    canActivate: [authGuard],
    children: [
      {
        path: 'pedidos/pendientes',
        loadComponent: () => import('./features/pedidos/pedidos-pendientes/pedidos-pendientes.component')
      },
      {
        path: 'pedidos/listos',
        loadComponent: () => import('./features/pedidos/pedidos-listos/pedidos-listos.component')
      }
    ]
  }
];
```

### Lazy Loading

- **Auth Module**: Carga solo cuando se accede a `/login`
- **Pedidos Module**: Carga solo cuando se accede a `/pedidos/*`
- **Layout Module**: Carga solo cuando se accede a rutas protegidas

## ⚡ Estado y Reactividad

### Signals de Angular

**Uso en Servicios:**
```typescript
export class LoadingService {
  public readonly isLoading = signal(false);
  public readonly loadingMessage = signal('Cargando...');
}
```

**Uso en Componentes:**
```typescript
export class PedidosPendientesComponent {
  isLoading = false;
  
  ngOnInit(): void {
    this.loadingService.isLoading.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }
}
```

### Observables

**Streams de Datos:**
- Autenticación: `BehaviorSubject<boolean>`
- Pedidos: `Observable<Pedido[]>`
- Loading: `Observable<boolean>`

## 🧪 Testing

### Configuración

- **Framework:** Karma + Jasmine
- **Coverage:** Instanbul
- **Browser:** Chrome Headless

### Estructura de Tests

```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── auth.service.spec.ts
│   │   │   └── pedidos.service.spec.ts
│   │   └── guards/
│   │       ├── auth.guard.spec.ts
│   │       └── no-auth.guard.spec.ts
│   └── features/
│       ├── auth/
│       │   └── login/
│       │       └── login.component.spec.ts
│       └── pedidos/
│           ├── pedidos-pendientes/
│           │   └── pedidos-pendientes.component.spec.ts
│           └── pedidos-listos/
│               └── pedidos-listos.component.spec.ts
```

### Ejemplos de Tests

**Service Test:**
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should authenticate with valid credentials', () => {
    const credentials = { username: 'admin', password: 'demo' };
    
    service.login(credentials).subscribe(response => {
      expect(response.token).toBeTruthy();
      expect(response.user.username).toBe('admin');
    });
  });
});
```

**Component Test:**
```typescript
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate required fields', () => {
    const form = component.loginForm;
    expect(form.valid).toBeFalsy();
    
    form.patchValue({ username: 'admin', password: 'demo' });
    expect(form.valid).toBeTruthy();
  });
});
```

## 🚀 Deployment

### Build de Producción

```bash
# Build optimizado
npm run build

# Build con análisis de bundles
npm run build -- --stats-json
```

### Configuración de Servidor

**Nginx:**
```nginx
server {
    listen 80;
    server_name fotocopiadora.com;
    root /var/www/fotocopiadora-backoffice;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Variables de Entorno

**Production:**
```bash
# .env.production
NODE_ENV=production
API_URL=https://api.fotocopiadora.com/api
WHATSAPP_BASE_URL=https://wa.me/
AUTO_REFRESH_INTERVAL=30000
```

### Monitoreo y Logging

**Logging:**
- Console logs para desarrollo
- Error tracking en producción
- Performance monitoring

**Health Checks:**
- Endpoint `/health` para verificar estado
- Métricas de performance
- Alertas automáticas

## 🔧 Configuración Avanzada

### PWA (Progressive Web App)

**Service Worker:**
```typescript
// ngsw-config.json
{
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": ["/favicon.ico", "/index.html", "/main.js", "/polyfills.js", "/runtime.js", "/styles.js"]
      }
    }
  ]
}
```

### Internacionalización (i18n)

**Configuración:**
```json
// angular.json
{
  "projects": {
    "fotocopiadora-backoffice": {
      "i18n": {
        "sourceLocale": "es",
        "locales": {
          "en": "src/locale/messages.en.xlf"
        }
      }
    }
  }
}
```

### Lazy Loading Avanzado

**Preloading Strategies:**
```typescript
// app.config.ts
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules))
  ]
};
```

## 📚 Recursos Adicionales

### Documentación Oficial
- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [Angular Testing](https://angular.io/guide/testing)

### Herramientas de Desarrollo
- [Angular DevTools](https://angular.io/guide/devtools)
- [Angular Language Service](https://angular.io/guide/language-service)
- [Angular CLI](https://angular.io/cli)

### Mejores Prácticas
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Angular Security](https://angular.io/guide/security)
- [Angular Performance](https://angular.io/guide/performance)

---

**Última actualización:** Enero 2024  
**Versión:** 1.0.0  
**Autor:** Equipo de Desarrollo
