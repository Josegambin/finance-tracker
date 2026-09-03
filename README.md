# Finance Tracker

Una aplicación web completa para el seguimiento de finanzas personales con arquitectura de microservicios, desarrollada con Spring Boot (backend) y React (frontend).

## 🏗️ Arquitectura

```
finance-tracker/
├── backend/                 # API REST con Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/finance_tracker_api/
│   │   │   │   ├── config/        # Configuración de seguridad y beans
│   │   │   │   ├── controller/   # Controladores REST
│   │   │   │   ├── dto/          # Objetos de transferencia de datos
│   │   │   │   ├── entity/       # Entidades JPA
│   │   │   │   ├── exception/    # Manejo de excepciones
│   │   │   │   ├── repository/   # Repositorios JPA
│   │   │   │   ├── security/     # JWT y autenticación
│   │   │   │   ├── service/      # Lógica de negocio
│   │   │   │   └── specification# Criterios de búsqueda dinámica
│   │   │   └── resources/
│   │   │       └── application.yaml
│   │   └── test/
│   └── pom.xml
├── frontend/                # SPA con React + TypeScript
│   ├── src/
│   │   ├── api/            # Clientes API
│   │   ├── assets/         # Recursos estáticos
│   │   ├── components/     # Componentes React
│   │   ├── context/        # Contextos de React
│   │   ├── i18n/           # Configuración i18next
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── styles/         # Estilos globales
│   │   ├── types/          # Definiciones TypeScript
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── docker-compose.yml       # Configuración PostgreSQL
```

## 🚀 Tecnologías

### Backend
- **Java 21** - Última versión LTS
- **Spring Boot 4.1.1** - Framework principal
- **Spring Data JPA** - Persistencia de datos
- **Spring Security** - Seguridad y autenticación
- **JWT (jjwt 0.12.6)** - Tokens de autenticación
- **PostgreSQL** - Base de datos relacional
- **Lombok** - Reducción de código boilerplate
- **Maven** - Gestión de dependencias

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite 8** - Build tool y dev server
- **React Router 7** - Enrutamiento
- **i18next** - Internacionalización
- **Recharts 3** - Gráficos y visualizaciones
- **oxlint** - Linting

### Infraestructura
- **Docker & Docker Compose** - Contenerización
- **PostgreSQL 18** - Base de datos

## ⚡ Quick Start

### Prerrequisitos
- Java 21+
- Node.js 18+
- Docker y Docker Compose
- Maven 3.8+

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd finance-tracker
```

### 2. Iniciar base de datos
```bash
docker-compose up -d
```

### 3. Configurar Backend
```bash
cd backend
./mvnw spring-boot:run
```

El backend estará disponible en `http://localhost:8080`

### 4. Configurar Frontend
```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📋 Funcionalidades

### Autenticación
- Registro de usuarios
- Login con JWT
- Rutas protegidas
- Gestión de sesión

### Dashboard
- Vista general de finanzas
- Balance total
- Ingresos y gastos del mes
- Gráficos de gastos por categoría
- Comparación presupuesto vs gastado
- Transacciones recientes

### Transacciones
- CRUD completo de transacciones
- Filtros por:
  - Fecha (por mes)
  - Tipo (ingreso/gasto)
  - Categoría
  - Búsqueda por descripción
- Exportación a CSV
- Paginación

### Categorías
- Gestión de categorías personalizadas
- Tipos: Ingreso y Gasto
- Asignación a transacciones

### Presupuestos
- Configuración de presupuestos mensuales
- Por categoría
- Seguimiento de gasto vs presupuesto
- Alertas visuales de exceso

## 🔧 Configuración

### Backend (application.yaml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/finance_tracker
    username: finance_user
    password: finance_password
  jpa:
    hibernate:
      ddl-auto: update

server:
  port: 8080

security:
  jwt:
    secret: change-this-secret-key-to-a-long-random-value-123456789
    expiration: 3600000 # 1 hora
```

### Frontend (API URL)
La URL de la API se configura en `src/api/*.ts`:
```typescript
const API_URL = 'http://localhost:8080/api';
```

## 🧪 Testing

### Backend
```bash
cd backend
./mvnw test
```

### Frontend
```bash
cd frontend
npm run lint
```

## 📦 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login de usuario

### Dashboard
- `GET /api/dashboard?month=2026-09` - Obtener dashboard
- `GET /api/dashboard/expenses-by-category?month=2026-09` - Gastos por categoría

### Transacciones
- `GET /apitransactions?page=0&size=5&sort=date,desc` - Listar transacciones
- `POST /api/transactions` - Crear transacción
- `DELETE /api/transactions/{id}` - Eliminar transacción
- `GET /api/transactions/export/csv` - Exportar a CSV

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría
- `DELETE /api/categories/{id}` - Eliminar categoría

### Presupuestos
- `GET /api/budgets?month=2026-09` - Listar presupuestos
- `POST /api/budgets` - Crear presupuesto
- `DELETE /api/budgets/{id}` - Eliminar presupuesto

## 🔐 Seguridad

- Autenticación basada en JWT
- Contraseñas hasheadas (implementar BCrypt)
- Rutas protegidas en backend y frontend
- CORS configurado para desarrollo

## 🚧 Mejoras Implementadas

### Seguridad (Crítico) ✅
- [x] Implementar hasheo de contraseñas con BCrypt
- [x] Cambiar clave JWT secreta a variable de entorno
- [x] Implementar refresh tokens
- [ ] Añadir rate limiting en endpoints de autenticación
- [x] Validar y sanitizar todos los inputs
- [ ] Implementar CSRF protection

### Backend ✅
- [x] Migrar de `ddl-auto: update` a Flyway para migraciones
- [x] Implementar logging estructurado
- [x] Añadir métricas con Spring Boot Actuator
- [ ] Implementar cache con Redis
- [ ] Añadir tests unitarios y de integración
- [x] Implementar paginación en todos los endpoints
- [x] Añadir validación de datos más robusta
- [x] Implementar manejo de excepciones global
- [x] Añadir OpenAPI/Swagger documentation

### Frontend ✅
- [x] Implementar gestión de errores global
- [x] Añadir loading states optimizados
- [x] Implementar debounce en búsquedas
- [x] Añadir skeleton screens
- [ ] Implementar PWA para offline
- [ ] Añadir tests con React Testing Library
- [ ] Optimizar bundle size
- [ ] Implementar manejo de estado con Redux/Zustand
- [ ] Añadir tooltips y ayudas contextuales

### Funcionalidad
- [ ] Añadir metas financieras
- [ ] Implementar alertas de presupuesto
- [ ] Añadir recurring transactions
- [ ] Implementar importación de CSV
- [ ] Añadir multi-currency
- [ ] Implementar reportes PDF
- [ ] Añadir gráficos de tendencias
- [ ] Implementar split transactions
- [ ] Añadir tags/etiquetas

### UX/UI ✅
- [x] Añadir dark mode
- [ ] Implementar responsive design mejorado
- [x] Añadir animaciones y transiciones
- [ ] Mejorar accesibilidad (WCAG)
- [x] Añadir notificaciones toast
- [x] Implementar confirm dialogs
- [ ] Añadir keyboard shortcuts

### DevOps ✅
- [ ] Configurar CI/CD pipeline
- [x] Añadir Docker para backend y frontend
- [ ] Implementar monitoring (Prometheus + Grafana)
- [x] Configurar logging centralizado
- [x] Añadir health checks
- [ ] Implementar backup strategy

### Code Quality
- [ ] Configurar SonarQube
- [ ] Añadir pre-commit hooks
- [ ] Implementar code coverage mínimo
- [ ] Añadir ESLint configuración estricta
- [ ] Configurar Prettier para formato
- [ ] Añadir Husky para git hooks

## 📝 Reglas de Desarrollo

Ver `DEVELOPMENT_RULES.md` para las reglas específicas de desarrollo.

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autores

- José Gamín - Desarrollador principal

## 📞 Soporte

Para soporte, abre un issue en el repositorio o contacta a jose.gamin@example.com.
