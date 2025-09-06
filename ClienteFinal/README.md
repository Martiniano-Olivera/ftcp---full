# MiKiosco - Sistema de Impresión Universitario

Una aplicación Angular 18 moderna para la gestión de pedidos de impresión en kioscos universitarios, con lazy loading por feature, Standalone Components y diseño mobile-first.

## 🚀 Características

- **Lazy Loading por Feature**: Carga bajo demanda de módulos para mejor rendimiento
- **Standalone Components**: Componentes independientes sin dependencias de módulos
- **Diseño Mobile-First**: Interfaz optimizada para dispositivos móviles y de escritorio
- **Wizard de Pedidos**: Proceso paso a paso para crear pedidos de impresión
- **Simulación de Pago**: Flujo completo de pago con confirmación
- **Drag & Drop**: Subida de archivos intuitiva
- **Estado Global**: Gestión centralizada del estado del pedido

## 🏗️ Arquitectura

```
src/app/
├── core/                    # Funcionalidades core de la aplicación
│   ├── components/         # Componentes compartidos del core
│   │   └── toolbar/       # Barra de navegación principal
│   ├── services/          # Servicios singleton
│   │   └── pedido.service.ts
│   └── models/            # Interfaces y tipos
│       └── pedido.model.ts
├── features/               # Módulos de funcionalidad
│   ├── landing/           # Página de inicio
│   ├── pedido/            # Gestión de pedidos
│   │   ├── pedido-wizard.component.ts
│   │   ├── pedido-archivos.component.ts
│   │   ├── pedido-opciones.component.ts
│   │   └── pedido-resumen.component.ts
│   └── pago/              # Proceso de pago
│       ├── pago.component.ts
│       └── pago-exito.component.ts
└── shared/                 # Componentes reutilizables
    └── components/
        ├── file-upload/    # Componente de subida de archivos
        └── summary-card/   # Tarjeta de resumen del pedido
```

## 🛠️ Tecnologías

- **Angular 18**: Framework principal con Standalone Components
- **TypeScript**: Tipado estático para mejor desarrollo
- **CSS3**: Estilos modernos con gradientes y animaciones
- **Responsive Design**: Diseño adaptativo para todos los dispositivos

## 📱 Funcionalidades

### 1. Landing Page

- Pantalla de bienvenida con características destacadas
- Botón CTA para comenzar pedido
- Diseño atractivo y moderno

### 2. Wizard de Pedidos

- **Paso 1**: Selección de archivos con drag & drop
- **Paso 2**: Configuración de opciones de impresión
- **Paso 3**: Resumen y confirmación del pedido

### 3. Sistema de Pago

- Múltiples métodos de pago
- Simulación de procesamiento
- Confirmación de éxito

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js 18+
- npm 9+

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd ProyectoFotocopiadora

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Construir para producción
npm run build
```

### Configurar `environment.ts`

El archivo `src/environments/environment.ts` define `apiUrl`. En desarrollo apunta por defecto a `http://localhost:3000`, ajusta este valor si tu backend corre en otra URL.

### Comandos Disponibles

- `npm start`: Ejecuta la aplicación en modo desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run test`: Ejecuta las pruebas unitarias
- `npm run watch`: Construye en modo watch

## 🎨 Diseño y UX

### Principios de Diseño

- **Mobile-First**: Diseño optimizado para dispositivos móviles
- **Accesibilidad**: Contraste adecuado y navegación por teclado
- **Feedback Visual**: Animaciones y transiciones suaves
- **Consistencia**: Patrones de diseño uniformes

### Paleta de Colores

- **Primario**: #667eea (Azul)
- **Secundario**: #764ba2 (Púrpura)
- **Éxito**: #27ae60 (Verde)
- **Texto**: #2c3e50 (Azul oscuro)
- **Muted**: #7f8c8d (Gris)

## 📋 Flujo de Usuario

1. **Inicio**: Usuario llega a la landing page
2. **Crear Pedido**: Navega al wizard de pedidos
3. **Subir Archivos**: Arrastra o selecciona archivos
4. **Configurar Opciones**: Elige tipo, cantidad, color, etc.
5. **Revisar**: Ve resumen del pedido
6. **Pagar**: Completa el proceso de pago
7. **Confirmación**: Recibe confirmación de éxito

## 📬 Enviar pedido

En la sección "Nuevo Pedido" completa tu nombre, teléfono y selecciona uno o más PDFs. El botón **Enviar** sube los archivos al backend y crea un pedido. Si todo sale bien verás el mensaje "¡Pedido enviado!".

## 🔧 Configuración

### Variables de Entorno

La aplicación está configurada para desarrollo local por defecto.

### Personalización

- Colores y estilos en `src/styles.scss`
- Configuración de rutas en `src/app/app.routes.ts`
- Servicios en `src/app/core/services/`

## 🧪 Pruebas

```bash
# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas con coverage
npm run test -- --code-coverage
```

## 📦 Estructura de Build

```
dist/
├── index.html
├── main.js
├── polyfills.js
└── assets/
    └── favicon.ico
```

## 🌐 Despliegue

### Producción

```bash
npm run build
```

### Servidor Local

```bash
npm install -g http-server
cd dist
http-server -p 8080
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:

- 📧 Email: soporte@mikiosco.edu
- 📞 Teléfono: Extensión 1234

## 🔮 Roadmap

- [ ] Integración con APIs de pago reales
- [ ] Sistema de notificaciones push
- [ ] Dashboard de administración
- [ ] Historial de pedidos
- [ ] Sistema de usuarios y autenticación
- [ ] Integración con impresoras físicas
- [ ] Reportes y analytics

---

**Desarrollado con ❤️ para la comunidad universitaria**
