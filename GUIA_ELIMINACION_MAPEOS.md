# Guía de Eliminación de Mapeos, Filtros y Loops

## ✅ Cambios Realizados

### 1. **Composables Actualizados**

#### `useApiData.js`
- ✅ Eliminado `extractData` con transformaciones
- ✅ Los datos vienen crudos del backend
- ✅ Soporte para queryParams para filtrado en backend
- ✅ Eliminado `forEach` - usando `while` loops

#### `useParameters.js`
- ✅ Eliminado `forEach` - usando `while` loops
- ✅ Eliminado `filter` - usando contadores
- ✅ Eliminado `find` - usando `while` loops
- ✅ `mapParametersToFormData` deprecado - backend debe devolver datos listos

#### `useCrudOperations.js`
- ✅ Eliminado `map` y `filter` - usando `while` loops

#### `useTableFiltering.js`
- ✅ **DEPRECADO** - El filtrado debe hacerse en el backend
- ✅ Retorna los datos sin filtrar

### 2. **Vistas Actualizadas**

#### `Companies.vue`
- ✅ Eliminado `normalizeCompany` y `.map()`
- ✅ Eliminado `useTableFiltering`
- ✅ Los datos vienen crudos del backend
- ✅ Eliminado `.split().map()` - usando índices directos

---

## 📋 Cambios Requeridos en el Backend

### 1. **Formato de Datos**
El backend debe devolver los datos en el formato exacto que necesita el frontend:

```javascript
// ❌ ANTES (frontend transformaba)
{
  companyNit: "123",
  legalRepresentativeName: "Juan"
}

// ✅ AHORA (backend debe devolver)
{
  company_nit: "123",
  legal_representative_name: "Juan"
}
```

### 2. **Filtrado y Búsqueda**
El backend debe soportar query parameters para filtrado:

```
GET /companies/listCompanies?search=texto&status=0
```

### 3. **Parámetros**
El backend debe devolver un campo `parameterIds` con el mapa de IDs:

```javascript
{
  parameters: [...],
  parameterIds: {
    "ALERTA_FICHAS_NUEVAS_MESES": "id123",
    "DIAS_ALERTA_AMARILLA": "id456"
  }
}
```

---

## 🔄 Vistas que Necesitan Actualización

### Prioridad Alta (usan mapeos/filtros)
1. ✅ `Companies.vue` - **COMPLETADO**
2. ⏳ `ProductiveStageRegistrations.vue` - Usa `normalize` y `.map()`
3. ⏳ `ProductiveStageModalities.vue` - Usa `normalizeModality` y `.map()`
4. ⏳ `ModalidadesEP.vue` - Usa `normalizeModality` y `.map()`
5. ⏳ `AdminNews.vue` - Usa `.map()` y `filter()`
6. ⏳ `Instructors.vue` - Puede tener transformaciones
7. ⏳ Vistas de aprendiz - Varias usan mapeos

---

## 📝 Patrón de Actualización

### Antes:
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

### Después:
```javascript
// Los datos vienen crudos del backend
const { data } = useApiData('/endpoint')

// Filtrado en backend con queryParams
const searchTerm = ref('')
const statusFilter = ref('all')

async function loadData() {
  await fetchData({
    search: searchTerm.value,
    status: statusFilter.value !== 'all' ? statusFilter.value : undefined
  })
}

// Los datos ya vienen filtrados
const filteredItems = data
```

---

## ⚠️ Notas Importantes

1. **Backend debe devolver datos listos**: Todo el formato debe venir del backend
2. **Sin transformaciones en frontend**: No usar map, filter, forEach
3. **Filtrado en backend**: Usar queryParams en lugar de useTableFiltering
4. **Loops permitidos**: Solo `while` loops con índices, no `for...of` ni `forEach`

---

## 🚀 Próximos Pasos

1. Actualizar todas las vistas que usan mapeos
2. Configurar backend para devolver datos en formato correcto
3. Implementar filtrado en backend con queryParams
4. Eliminar todas las referencias a `useTableFiltering`

