# Mejoras Aplicadas a la Lógica de Parámetros

## ✅ Mejoras Implementadas

### 1. **Composable `useParameters.js` Creado** ✅
- **Ubicación**: `src/composables/useParameters.js`
- **Funcionalidades**:
  - Carga de parámetros por categoría
  - Mapeo automático de parámetros a formData
  - Actualización individual y múltiple de parámetros
  - Manejo centralizado de errores y notificaciones
  - Gestión de IDs de parámetros

### 2. **Constantes Centralizadas** ✅
- **Ubicación**: `src/constants/index.js`
- **Constantes agregadas**:
  - `PARAMETER_CATEGORIES`: Categorías de parámetros (SYSTEM, ACADEMIC, EMAIL)
  - `PARAMETER_NAMES`: Todos los nombres de parámetros del sistema
  - `PARAMETER_SECTION_TYPES`: Tipos de secciones para parámetros

### 3. **Refactorización de `TrainingProcess.vue`** ✅
- **Antes**: 132 líneas de código manual
- **Después**: 90 líneas usando composables
- **Reducción**: ~32% menos código
- **Mejoras**:
  - Usa `useParameters` composable
  - Usa constantes centralizadas
  - Código más limpio y mantenible

---

## 📋 Cómo Aplicar a Otros Archivos

### Para `Alerts.vue`:

```javascript
<script setup>
import { ref, onMounted } from 'vue'
import { useParameters } from '../../../composables/useParameters'
import { PARAMETER_NAMES, PARAMETER_CATEGORIES, PARAMETER_SECTION_TYPES } from '../../../constants'
// ... otros imports

const SECTION_TYPES = PARAMETER_SECTION_TYPES

const {
  parameterIds,
  isSaving,
  fetchParameters,
  mapParametersToFormData,
  updateMultipleParameters
} = useParameters(PARAMETER_CATEGORIES.SYSTEM, {
  emptyMessage: 'No alert parameters were found in the system.',
  successMessage: 'Alert parameters loaded successfully.',
  errorMessage: 'Error loading alert parameters.'
})

const formData = ref({
  newRecordsTime: null,
  oldRecordsTime: null,
  yellowAlertDays: null,
  orangeAlertDays: null,
  redAlertDays: null,
  pendingLogAlert: null,
  pendingLogAlertEnabled: false,
  pendingFollowUpAlert: null,
  pendingFollowUpAlertEnabled: false,
  criticalFollowUpAlert: null,
  criticalFollowUpAlertEnabled: false,
  instructorReviewTime: null,
  instructorReviewTimeEnabled: false
})

// Mapeo con transformación para campos con status
const parameterMapping = {
  [PARAMETER_NAMES.ALERTA_FICHAS_NUEVAS_MESES]: 'newRecordsTime',
  [PARAMETER_NAMES.VENCIMIENTO_FICHAS_ANTIGUAS]: 'oldRecordsTime',
  [PARAMETER_NAMES.DIAS_ALERTA_AMARILLA]: 'yellowAlertDays',
  [PARAMETER_NAMES.DIAS_ALERTA_NARANJA]: 'orangeAlertDays',
  [PARAMETER_NAMES.DIAS_ALERTA_ROJA_CRITICA]: 'redAlertDays',
  [PARAMETER_NAMES.DIAS_ALERTA_BITACORA_PENDIENTE]: {
    value: 'pendingLogAlert',
    status: 'pendingLogAlertEnabled'
  },
  [PARAMETER_NAMES.DIAS_ALERTA_SEGUIMIENTO_PENDIENTE]: {
    value: 'pendingFollowUpAlert',
    status: 'pendingFollowUpAlertEnabled'
  },
  [PARAMETER_NAMES.DIAS_ALERTA_CRITICA_ULTIMO_SEGUIMIENTO]: {
    value: 'criticalFollowUpAlert',
    status: 'criticalFollowUpAlertEnabled'
  },
  [PARAMETER_NAMES.DIAS_ALERTA_REVISION_INSTRUCTOR]: {
    value: 'instructorReviewTime',
    status: 'instructorReviewTimeEnabled'
  }
}

async function loadParameters() {
  await fetchParameters()
  // Mapeo manual para campos con status
  mapParametersToFormData(formData, parameterMapping, (param) => {
    // Para parámetros con status, mapear ambos valores
    if (parameterMapping[param.name]?.value) {
      const mapping = parameterMapping[param.name]
      formData.value[mapping.value] = param.value
      formData.value[mapping.status] = param.status === 1
    }
    return param.value
  })
}

async function handleSaveConfiguration() {
  try {
    const updates = {}
    
    if (currentSection.value === SECTION_TYPES.FICHE) {
      updates[PARAMETER_NAMES.ALERTA_FICHAS_NUEVAS_MESES] = { value: formData.value.newRecordsTime }
      updates[PARAMETER_NAMES.VENCIMIENTO_FICHAS_ANTIGUAS] = { value: formData.value.oldRecordsTime }
    } else if (currentSection.value === SECTION_TYPES.ESCALATED) {
      updates[PARAMETER_NAMES.DIAS_ALERTA_AMARILLA] = { value: formData.value.yellowAlertDays }
      updates[PARAMETER_NAMES.DIAS_ALERTA_NARANJA] = { value: formData.value.orangeAlertDays }
      updates[PARAMETER_NAMES.DIAS_ALERTA_ROJA_CRITICA] = { value: formData.value.redAlertDays }
    } else if (currentSection.value === SECTION_TYPES.PROCESS) {
      updates[PARAMETER_NAMES.DIAS_ALERTA_BITACORA_PENDIENTE] = { 
        value: formData.value.pendingLogAlert, 
        status: formData.value.pendingLogAlertEnabled ? 1 : 0 
      }
      // ... más parámetros
    }

    const updatesArray = Object.keys(updates).map(key => ({
      parameterName: key,
      ...updates[key]
    }))

    const success = await updateMultipleParameters(updatesArray)
    
    if (success) {
      handleCloseConfirmation()
      await loadParameters()
    }
  } catch (error) {
    // El error ya se maneja en updateMultipleParameters
  }
}
</script>
```

### Para `Emails.vue` y `InstructorHours.vue`:

Estos archivos ya están bien estructurados, pero pueden simplificarse usando `useParameters`:

```javascript
const {
  parameters,
  isLoading,
  fetchParameters,
  updateParameter
} = useParameters(PARAMETER_CATEGORIES.EMAIL) // o ACADEMIC para InstructorHours

// Reemplazar fetchParameters() con:
onMounted(() => {
  fetchParameters()
})

// Reemplazar updateParameter con:
async function updateParameter() {
  await updateParameter(editingParameter.value._id, {
    value: editingValue.value
  })
  await fetchParameters()
}
```

---

## 🎯 Beneficios de las Mejoras

### 1. **Código Reutilizable**
- ✅ Lógica centralizada en un composable
- ✅ No hay duplicación de código
- ✅ Fácil de mantener y actualizar

### 2. **Consistencia**
- ✅ Mismo patrón en todos los archivos
- ✅ Manejo de errores uniforme
- ✅ Notificaciones consistentes

### 3. **Mantenibilidad**
- ✅ Cambios en un solo lugar afectan a todos
- ✅ Constantes centralizadas
- ✅ Fácil de testear

### 4. **Legibilidad**
- ✅ Código más limpio y claro
- ✅ Menos líneas de código
- ✅ Mejor separación de responsabilidades

---

## 📊 Comparación Antes/Después

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Líneas de código (TrainingProcess) | ~132 | ~90 | -32% |
| Duplicación de código | Alta | Baja | ✅ |
| Uso de composables | No | Sí | ✅ |
| Constantes centralizadas | No | Sí | ✅ |
| Mantenibilidad | Media | Alta | ✅ |

---

## 🚀 Próximos Pasos Recomendados

1. **Refactorizar `Alerts.vue`** usando el mismo patrón
2. **Simplificar `Emails.vue`** y `InstructorHours.vue`
3. **Agregar tests** para el composable `useParameters`
4. **Documentar** el composable con más ejemplos

---

## 📝 Notas Importantes

- El composable `useParameters` maneja automáticamente:
  - Extracción de datos del response
  - Mapeo de IDs de parámetros
  - Notificaciones de éxito/error
  - Estados de carga

- Para parámetros con `status`, se requiere un mapeo especial que se puede manejar con la función `transformValue` del composable.

- Las constantes están ahora centralizadas en `constants/index.js`, siguiendo el patrón del resto del proyecto.

