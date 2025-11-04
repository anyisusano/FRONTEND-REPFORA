# Guía de Refactorización - Código Limpio y Consistente

## Cambios Realizados

### 1. Servicios y Stores
- ✅ `authStore.js`: Refactorizado con naming consistente (camelCase), `let` → `const`
- ✅ `apiClient.js`: Centralizado manejo de errores, DRY aplicado
- ✅ `useNotifications.js`: Extraídas constantes, eliminados números mágicos
- ✅ `useColombia.js`: Naming consistente (camelCase en inglés), manteniendo compatibilidad con español

### 2. Constantes Compartidas
- ✅ Creado `constants/index.js` con:
  - Timeouts de notificaciones
  - Estados (ACTIVE/INACTIVE)
  - Límites de validación
  - Límites de archivos
  - Extensiones permitidas

### 3. Estructura de Vistas CRUD
Todas las vistas CRUD deben seguir esta estructura:

```vue
<template>
  <div class="q-pa-md">
    <!-- Tabla -->
    <q-table class="my-sticky-header-table" flat bordered 
      :rows="rows" :columns="columns" row-key="_id">
      
      <!-- Columnas personalizadas -->
      <template v-slot:body-cell-opciones="props">
        <q-td :props="props">
          <q-btn label="📝" color="primary" @click="handleEdit(props.row)" />
        </q-td>
      </template>
      
      <template v-slot:body-cell-activar="props">
        <q-td :props="props">
          <q-btn :color="props.row.activate ? 'green' : 'red'" 
                 @click="handleToggleStatus(props.row)">
            {{ props.row.activate ? '✅' : '❌' }}
          </q-btn>
        </q-td>
      </template>
    </q-table>
    
    <!-- Diálogo de edición -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="q-pa-lg shadow-2" style="width: 100%; max-width: 400px">
        <!-- Formulario -->
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
// 1. IMPORTS
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { getData, putData } from '../services/apiClient'
import { useNotifications } from '../composables/useNotifications'

// 2. CONSTANTS
const $q = useQuasar()
const notifications = useNotifications()

// 3. STATE
const rows = ref([])
const itemBeingEdited = ref({})
const showDialog = ref(false)
const formRef = ref(null)

// 4. COLUMNS
const columns = [/* ... */]

// 5. FUNCTIONS (Max 20-30 líneas cada una)
async function fetchData() {
  try {
    const response = await getData('/endpoint')
    if (response && response.data) {
      rows.value = response.data.map(item => ({
        ...item,
        activate: true
      }))
      notifications.success('Datos cargados correctamente')
    }
  } catch (error) {
    notifications.error('Error al cargar los datos')
  }
}

function handleEdit(item) {
  itemBeingEdited.value = { ...item }
  showDialog.value = true
}

function handleToggleStatus(item) {
  item.activate = !item.activate
  notifications.success(
    `Item ${item.activate ? 'activado' : 'desactivado'}`
  )
}

async function handleSave() {
  const isValid = await formRef.value.validate()
  if (!isValid) return
  
  try {
    await putData(`/endpoint/${itemBeingEdited.value._id}`, itemBeingEdited.value)
    notifications.success('Item actualizado correctamente')
    showDialog.value = false
    await fetchData()
  } catch (error) {
    notifications.error('Error al actualizar el item')
  }
}

// 6. LIFECYCLE
onMounted(() => {
  fetchData()
})
</script>

<style lang="sass">
.my-sticky-header-table
  height: 410px
  /* Estilos consistentes */
</style>
```

## Nomenclatura

### Variables y Funciones: camelCase
- ✅ `getUserData`, `isActive`, `totalAmount`
- ❌ `get_user_data`, `is_active`, `total_amount`

### Clases: PascalCase
- ✅ `UserService`, `ProductController`
- ❌ `userService`, `product_controller`

### Constantes: UPPER_SNAKE_CASE
- ✅ `MAX_RETRY_ATTEMPTS`, `API_BASE_URL`
- ❌ `maxRetryAttempts`, `apiBaseUrl`

### Nombres Descriptivos en Inglés
- ✅ `fetchCompanies`, `handleEdit`, `isLoading`
- ❌ `cargarEmpresas`, `editar`, `cargando`

## Principios Aplicados

1. **Single Responsibility**: Cada función hace una sola cosa
2. **DRY**: Eliminado código duplicado
3. **Magic Numbers**: Todas las constantes extraídas
4. **Naming**: Consistente y descriptivo
5. **Error Handling**: Uniforme en todas las vistas
6. **API Calls**: Mismo patrón en todas las vistas

## Próximos Pasos

1. Refactorizar todas las vistas CRUD siguiendo esta estructura
2. Crear composables reutilizables para lógica común
3. Estandarizar componentes (Botones, Tablas, Modales)
4. Actualizar documentación

