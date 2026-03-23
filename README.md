# GlobalS1 Modular Frontend CLI

CLI para generar código frontend modular con Clean Architecture.

## Instalacion

```bash
# En el proyecto template
npm install globalsone-modular-fe-cli --save-dev

# O globalmente
npm install -g globalsone-modular-fe-cli
```

## Uso

### Generar Modulo Completo

```bash
# Genera un módulo con page, service, store, hook y tests
mfe generate module user-profile

# Alias
mfe g m user-profile

# Sin tests
mfe g m user-profile --no-tests

# Sin service
mfe g m user-profile --no-service

# Dry run (ver qué se crearía)
mfe g m user-profile --dry-run
```

### Generar Componentes Individuales

```bash
# Service
mfe generate service payment -m checkout
mfe g s payment -m checkout

# Store
mfe generate store cart -m shopping
mfe g st cart -m shopping

# Hook
mfe generate hook use-products -m catalog
mfe g h use-products -m catalog

# Page
mfe generate page dashboard -m admin
mfe g p dashboard -m admin

# Component
mfe generate component product-card -m catalog
mfe g c product-card -m catalog
```

## Estructura Generada

```
src/modules/{module-name}/
├── index.ts                     # Public API
├── pages/
│   └── {module-name}.page.tsx
├── components/
│   └── .gitkeep
├── services/
│   ├── {module-name}.service.ts
│   └── {module-name}.service.test.ts
├── stores/
│   ├── {module-name}.store.ts
│   └── {module-name}.store.test.ts
└── hooks/
    └── use-{module-name}.ts
```

## Comandos

| Comando | Alias | Descripcion |
|---------|-------|-------------|
| `generate module` | `g m` | Genera módulo completo |
| `generate service` | `g s` | Genera service |
| `generate store` | `g st` | Genera store |
| `generate hook` | `g h` | Genera hook |
| `generate page` | `g p` | Genera página |
| `generate component` | `g c` | Genera componente |

## Opciones

| Opcion | Descripcion |
|--------|-------------|
| `--no-service` | No crear service (solo para module) |
| `--no-store` | No crear store (solo para module) |
| `--no-hook` | No crear hook (solo para module) |
| `--no-tests` | No crear tests |
| `--dry-run` | Ver qué se crearía sin crear archivos |
| `-m, --module` | Especificar módulo destino |

## Desarrollo

```bash
# Instalar dependencias
pnpm install

# Compilar
pnpm build

# Desarrollo con watch
pnpm dev

# Link local para testing
npm link
```
