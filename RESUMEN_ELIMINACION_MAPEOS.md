# Resumen: Eliminación de Mapeos, Filtros y Loops

## ✅ Cambios Completados

### Composables Actualizados

1. **`useApiData.js`**
   - ✅ Eliminado `extractData` con transformaciones
   - ✅ Los datos vienen crudos del backend
   - ✅ Soporte para `queryParams` para filtrado en backend
   - ✅ Eliminado `forEach` - reemplazado con `while` loops

2. **`useParameters.js`**
   - ✅ Eliminado `forEach` - reemplazado con `while` loops
   - ✅ Eliminado `filter` - reemplazado con contadores
   - ✅ Eliminado `find` - reemplazado con `while` loops
   - ✅ `mapParametersToFormData` marcado como deprecado

3. **`useCrudOperations.js`**
   - ✅ Eliminado `map` y `filter` - reemplazado con `while` loops

4. **`useTableFiltering.js`**
   - ✅ **DEPRECADO** - El filtrado debe hacerse en el backend
   - ✅ Retorna los datos sin filtrar

### Vistas Actualizadas

1. **`Companies.vue`**
   - ✅ Eliminado `normalizeCompany` y `.map()`
   - ✅ Eliminado `useTableFiltering`
   - ✅ Los datos vienen crudos del backend
   - ✅ Eliminado `.split().map()` - usando índices directos

2. **`TrainingProcess.vue`**
   - ✅ Eliminado uso de `mapParametersToFormData`
   - ✅ Acceso directo a parámetros sin mapeo

---

## 📋 Requisitos del Backend

### 1. Formato de Datos

El backend **DEBE** devolver los datos en el formato exacto que necesita el frontend:

```javascript
// ❌ NO hacer esto (frontend NO transformará)
{
  companyNit: "123",
  legalRepresentativeName: "Juan"
}

// ✅ Hacer esto (formato exacto que necesita frontend)
{
  company_nit: "123",
  legal_representative_name: "Juan"
}
```

### 2. Filtrado y Búsqueda

El backend **DEBE** soportar query parameters:

```
GET /companies/listCompanies?search=texto&status=0
```

### 3. Parámetros del Sistema

El backend **DEBE** devolver un campo `parameterIds`:

```javascript
{
  parameters: [...],
  parameterIds: {
    "ALERTA_FICHAS_NUEVAS_MESES": "id123",
    "DIAS_ALERTA_AMARILLA": "id456"
  }
}
```

### 4. Datos de Formularios

Para parámetros, el backend **DEBE** devolver los datos estructurados según el formulario, o usar nombres de parámetros estándar.

---

## 🔄 Vistas Pendientes de Actualizar

Estas vistas aún usan mapeos/filtros y necesitan actualización:

1. ⏳ `ProductiveStageRegistrations.vue` - Usa `normalize` y `.map()`
2. ⏳ `ProductiveStageModalities.vue` - Usa `normalizeModality` y `.map()`
3. ⏳ `ModalidadesEP.vue` - Usa `normalizeModality` y `.map()`
4. ⏳ `AdminNews.vue` - Usa `.map()` y `filter()`
5. ⏳ `Instructors.vue` - Revisar transformaciones
6. ⏳ Vistas de aprendiz - Varias usan mapeos

---

## 📝 Patrón de Actualización

### ❌ ANTES (con mapeos):
```javascript
const { data } = useApiData('/endpoint', {
  extractData: (response) => {
    return response.data.map(item => ({
      newField: item.oldField,
      // transformaciones
    }))
  }
})

const { filteredItems } = useTableFiltering(data, ['field'])
```

### ✅ DESPUÉS (sin mapeos):
```javascript
// Los datos vienen crudos del backend
const { data, fetchData } = useApiData('/endpoint')

// Filtrado en backend con queryParams
const searchTerm = ref('')
const statusFilter = ref('all')

async function loadData() {
  await fetchData({
    search: searchTerm.value,
    status: statusFilter.value !== 'all' ? statusFilter.value : undefined
  })
}

// Los datos ya vienen filtrados del backend
const filteredItems = data
```

---

## ⚠️ Reglas Importantes

1. **NO usar `.map()`** - El backend debe devolver datos en formato correcto
2. **NO usar `.filter()`** - El backend debe filtrar con queryParams
3. **NO usar `.forEach()`** - Usar `while` loops con índices
4. **NO usar `for...of`** - Usar `while` loops con índices
5. **NO usar `find()`** - Usar `while` loops con índices
6. **NO usar `useTableFiltering`** - DEPRECADO, usar queryParams

---

## 🎯 Loops Permitidos

Solo se permiten loops con `while` y índices:

```javascript
// ✅ Permitido
let index = 0
while (index < array.length) {
  const item = array[index]
  // hacer algo
  index++
}

// ❌ NO permitido
array.forEach(item => {})
for (const item of array) {}
array.map(item => {})
array.filter(item => {})
```

---

## 🚀 Próximos Pasos

1. Actualizar todas las vistas restantes que usan mapeos
2. Configurar backend para devolver datos en formato correcto
3. Implementar filtrado en backend con queryParams
4. Eliminar todas las referencias a `useTableFiltering` en el código

