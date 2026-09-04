# Reglas de Desarrollo - Finance Tracker

Este documento define las reglas y convenciones que deben seguirse durante el desarrollo del proyecto Finance Tracker.

## 🏗️ Arquitectura y Estructura

### Backend (Spring Boot)

#### Estructura de Paquetes
```
finance_tracker_api/
├── config/           # Configuración de beans, seguridad, CORS
├── controller/       # Controladores REST (@RestController)
├── dto/              # Data Transfer Objects (request/response)
├── entity/           # Entidades JPA (@Entity)
├── exception/        # Excepciones personalizadas y handlers
├── repository/       # Interfaces JPA Repository
├── security/         # JWT, filtros, UserDetails
├── service/          # Lógica de negocio (@Service)
└── specification/    # Criterios de búsqueda dinámica
```

#### Convenciones de Nombres
- **Clases**: PascalCase (ej: `TransactionController`)
- **Métodos**: camelCase (ej: `getTransactionsByUser`)
- **Variables**: camelCase (ej: `transactionId`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `JWT_SECRET`)
- **Paquetes**: lowercase con puntos (ej: `finance_tracker_api.controller`)

#### Controllers
- Solo deben manejar HTTP requests/responses
- Delegar lógica de negocio a Services
- Usar anotaciones de validación (`@Valid`, `@Validated`)
- Retornar códigos HTTP apropiados:
  - `200 OK` - GET exitoso
  - `201 CREATED` - POST exitoso
  - `204 NO CONTENT` - DELETE exitoso
  - `400 BAD REQUEST` - Validación fallida
  - `401 UNAUTHORIZED` - No autenticado
  - `403 FORBIDDEN` - Sin permisos
  - `404 NOT FOUND` - Recurso no existe
  - `500 INTERNAL SERVER ERROR` - Error del servidor

#### Services
- Contener toda la lógica de negocio
- Usar `@Transactional` para operaciones que modifican datos
- Lanzar excepciones personalizadas para errores de negocio
- Never retornar entidades directamente, usar DTOs

#### Repositories
- Solo operaciones de acceso a datos
- Usar `@Query` solo para consultas complejas
- Preferir métodos de命名 convención de Spring Data

#### DTOs
- Separar Request DTOs de Response DTOs
- Usar validaciones de Jakarta Bean Validation
- Mantener inmutables con `@Value` de Lombok o constructores

### Frontend (React + TypeScript)

#### Estructura de Directorios
```
src/
├── api/              # Clientes API (authApi, transactionApi, etc.)
├── assets/           # Imágenes, fuentes, iconos
├── components/       # Componentes reutilizables
│   └── charts/       # Componentes de gráficos
├── context/          # Contextos de React (AuthContext, etc.)
├── i18n/             # Configuración y traducciones i18next
├── pages/            # Páginas/Views principales
├── styles/           # Estilos globales CSS
├── types/            # Definiciones TypeScript
├── App.tsx           # Componente principal
└── main.tsx          # Punto de entrada
```

#### Convenciones de Nombres
- **Componentes**: PascalCase (ej: `TransactionForm.tsx`)
- **Archivos de componentes**: PascalCase (ej: `TransactionForm.tsx`)
- **Funciones/Hooks**: camelCase (ej: `useTransactions`)
- **Variables**: camelCase (ej: `transactionList`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `API_BASE_URL`)
- **Types/Interfaces**: PascalCase (ej: `Transaction`, `User`)

#### Componentes
- Usar functional components con hooks
- Separar lógica en custom hooks cuando sea compleja
- Props deben tener TypeScript interfaces
- Mantener componentes pequeños (<200 líneas)
- Usar memo para optimización cuando sea necesario

#### API Calls
- Centralizar en archivos `src/api/*.ts`
- Usar async/await
- Manejar errores apropiadamente
- Incluir headers de autenticación
- Usar tipos TypeScript para requests/responses

#### State Management
- Usar `useState` para estado local simple
- Usar `useContext` para estado global
- Considerar Redux/Zustand para estado complejo (futuro)
- Evitar prop drilling profundo

## 💻 Code Style

### Backend (Java)
- Indentación: 4 espacios
- Longitud máxima de línea: 120 caracteres
- Usar Lombok para reducir boilerplate
- SIEMPRE usar Optional para valores que pueden ser null
- Usar streams y funciones lambda cuando sea apropiado
- Evitar código comentado
- Javadoc obligatorio para métodos públicos

### Frontend (TypeScript/React)
- Indentación: 2 espacios
- Longitud máxima de línea: 100 caracteres
- Usar Prettier para formato automático
- Usar ESLint para linting
- Preferir `const` sobre `let`, evitar `var`
- Usar template literals sobre concatenación
- Arrow functions para callbacks
- Evitar `any`, usar tipos específicos

## 🔒 Seguridad

### Backend
- **NUNCA** commitear credenciales o secrets
- Usar variables de entorno para configuración sensible
- Validar todos los inputs (DTOs con `@Valid`)
- Hashear contraseñas con BCrypt (implementado en `SecurityConfig.passwordEncoder()`)
- Usar HTTPS en producción
- Implementar rate limiting
- Sanitizar datos antes de guardar en BD
- Usar parámetros en queries SQL (JPA lo hace automáticamente)

### Frontend
- Nunca almacenar tokens en localStorage (usar httpOnly cookies)
- Validar datos en frontend (pero no confiar solo en esto)
- Sanitizar inputs antes de mostrar
- Usar CSP headers
- Implementar refrescamiento de tokens
- Manejar errores de autenticación apropiadamente

## 🧪 Testing

### Backend
- Tests unitarios para Services
- Tests de integración para Controllers
- Tests de repositorio para queries complejas
- Cobertura mínima: 70%
- Usar JUnit 5 y Mockito
- Mockear dependencias externas

### Frontend
- Tests de componentes con React Testing Library
- Tests de hooks custom
- Tests de integración para flujos importantes
- Cobertura mínima: 60%
- Usar Jest y React Testing Library

## 📝 Commits

### Convención de Commits
Usar formato: `<tipo>(<alcance>): <descripción>`

**Tipos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (código, no lógica)
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Cambios en build, tools, etc.

**Ejemplos:**
```
feat(auth): añadir refresh token
fix(transaction): corregir filtro por fecha
docs(readme): actualizar instrucciones de instalación
refactor(user): simplificar validación de email
```

### Reglas de Commits
- Commits pequeños y frecuentes
- Mensajes en presente (ej: "añadir" no "añadido")
- En español para este proyecto
- Nunca commitear código que no compila
- Revisar diff antes de commitear

## 🚀 Git Workflow

### Branch Strategy
- `main`: Rama principal, código estable
- `develop`: Rama de desarrollo
- `feature/<nombre>`: Nuevas funcionalidades
- `bugfix/<nombre>`: Correcciones de bugs
- `hotfix/<nombre>`: Correcciones urgentes en producción

### Flujo de Trabajo
1. Crear rama desde `develop`
2. Desarrollar y commitear cambios
3. Push a rama remota
4. Crear Pull Request
5. Code review
6. Merge a `develop`
7. Deploy a staging

### Pull Requests
- Descripción clara de cambios
- Referencias a issues relacionados
- Tests pasando
- Sin conflictos de merge
- Aprobación de al menos 1 reviewer

## 📦 Dependencias

### Backend
- Usar versiones estables (evitar alpha/beta)
- Preferir dependencias mantenidas activamente
- Revisar vulnerabilidades con `mvn dependency-check`
- Actualizar dependencias regularmente
- Documentar razones para dependencias no estándar

### Frontend
- Usar versiones LTS de Node.js
- Preferir librerías populares y mantenidas
- Revisar vulnerabilidades con `npm audit`
- Actualizar dependencias regularmente
- Evitar dependencias pesadas innecesarias

## 🌐 Internacionalización

### Frontend (i18next)
- Todas las cadenas de usuario en archivos de traducción
- Nunca hardcodear texto en componentes
- Usar `useTranslation` hook
- Mantener traducciones organizadas por namespaces
- Soportar español e inglés como mínimo

## 🎨 UI/UX

### Principios
- Mobile-first responsive design
- Accesibilidad WCAG AA
- Estados de carga claros
- Manejo de errores amigable
- Feedback inmediato en acciones
- Consistencia visual

### Componentes
- Reutilizables cuando sea posible
- Props bien documentadas
- Manejo de estados (loading, error, success)
- Accessible (ARIA labels)
- Testeables

## 📊 Base de Datos

### Reglas
- Nunca usar `ddl-auto: update` en producción
- Usar migraciones (Flyway/Liquibase)
- Indexar columnas frecuentemente consultadas
- Evitar N+1 queries
- Usar transacciones apropiadamente
- Validar datos a nivel de BD también

## 🔧 Configuración

### Environment Variables
Backend requerido:
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION`

Frontend requerido:
- `VITE_API_URL`

### Archivos de Configuración
- `application.yaml` para configuración Spring Boot
- `.env` para variables de entorno (no commitear)
- `.env.example` como template

## 🚨 Manejo de Errores

### Backend
- Excepciones personalizadas para errores de negocio
- Global exception handler
- Logging de errores con contexto
- Mensajes de error claros pero no exponer detalles técnicos

### Frontend
- Error boundaries para React
- Manejo global de errores de API
- Mensajes de error amigables al usuario
- Logging de errores en consola (dev) o servicio (prod)

## 📈 Performance

### Backend
- Usar cache cuando sea apropiado
- Optimizar queries JPA
- Usar DTOs para evitar sobrecarga de datos
- Implementar paginación
- Monitorizar tiempos de respuesta

### Frontend
- Code splitting con React.lazy
- Lazy loading de componentes
- Optimizar imágenes
- Minimizar re-renders
- Usar memo y useMemo apropiadamente
- Optimizar bundle size

## 🔍 Code Review

### Checklist
- [ ] Código sigue las convenciones del proyecto
- [ ] Tests incluidos y pasando
- [ ] Sin console.log o código comentado
- [ ] Manejo de errores apropiado
- [ ] Sin hardcoding de valores sensibles
- [ ] Documentación actualizada
- [ ] Performance considerada
- [ ] Seguridad considerada
- [ ] UX/UI apropiada

## 📚 Documentación

### Requerimientos
- Javadoc para métodos públicos (backend)
- Comments para lógica compleja
- README actualizado con cambios mayores
- Changelog para versiones
- Documentación de API (OpenAPI/Swagger)

## 🚫 Prohibido

- Commitear secrets o credenciales
- Code duplicado significativo
- Hardcoding de valores configurables
- Ignorar warnings del compilador/linter
- Commitear código que no compila
- Commitear tests que fallan
- Push directo a main/develop
- Merge sin code review
- Deprecación sin aviso

## ✅ Antes de Commitear

1. Código compila sin errores
2. Tests pasan
3. Linting sin errores
4. No hay archivos innecesarios
5. README actualizado si es necesario
6. Commits descriptivos
7. Diff revisado

---

Estas reglas son vivas y pueden evolucionar. Cualquier sugerencia de mejora es bienvenida.
