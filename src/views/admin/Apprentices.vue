<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">APRENDICES</h1>
    </div>
    
    <div class="container">
      <div class="row items-center q-mb-md q-gutter-y-sm">
        <div class="col-12 col-md-4">
          <q-input
            v-model="searchTerm"
            dense
            outlined
            placeholder="Buscar aprendiz..."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-4">
          <q-select
            outlined
            dense
            v-model="statusFilter"
            :options="STATUS_OPTIONS"
            emit-value
            map-options
            label="Estado"
          />
        </div>
        <div class="col-12 col-md-4 text-right">
          <div class="row q-gutter-sm justify-end no-wrap">
            <BotonIngresar
              label="Carga Masiva"
              @click="handleOpenUploadDialog"
              icon="upload_file"
              style="height: 36px;"
            />
            <BotonIngresar
              label="+ Nuevo Aprendiz"
              @click="handleOpenCreateDialog"
              style="height: 36px; padding: 8px 6px; justify-content: flex-start;"
            />
          </div>
        </div>
      </div>

      <maintable
        :datos="filteredItems"
        :columnas="columns"
        row-key="_id"
        no-data-label="No hay aprendices registrados"
        :rows-per-page-options="[10, 20, 50]"
        :initial-rows-per-page="10"
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="getStatusColor(props.row.status)">
              {{ getStatusLabel(props.row.status) }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-opciones="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              color="primary"
              icon="visibility"
              @click="handleViewDetails(props.row)"
            >
              <q-tooltip>Ver detalles</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="handleEdit(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template #body-cell-activar="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              :color="props.row.status === STATUS.ACTIVE ? 'positive' : 'negative'"
              :icon="props.row.status === STATUS.ACTIVE ? 'check' : 'close'"
              @click="handleToggleStatus(props.row)"
            >
              <q-tooltip>{{ props.row.status === STATUS.ACTIVE ? 'Desactivar' : 'Activar' }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </maintable>
    </div>

    <modalComponent
      ref="detailsModalRef"
      width="1200px"
      max-width="98vw"
    >
      <template #header>
        <div class="text-h6">Detalles del Aprendiz</div>
      </template>
      <template #body>
        <div v-if="selectedItem" class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <div class="text-h6 q-mb-md section-title">Datos Personales</div>
            <div class="data-grid">
              <div class="data-row">
                <div class="text-weight-bold">Tipo de Documento:</div>
                <div class="data-value">{{ selectedItem.documentType || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Número de Documento:</div>
                <div class="data-value">{{ selectedItem.documentNumber || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Nombres:</div>
                <div class="data-value">{{ selectedItem.firstName || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Apellidos:</div>
                <div class="data-value">{{ selectedItem.lastName || '-' }}</div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-h6 q-mb-md section-title">Datos de Contacto</div>
            <div class="data-grid">
              <div class="data-row">
                <div class="text-weight-bold">Teléfono:</div>
                <div class="data-value">{{ selectedItem.phone || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Email Personal:</div>
                <div class="data-value">{{ getPersonalEmail(selectedItem) || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Email Institucional:</div>
                <div class="data-value">{{ getInstitutionalEmail(selectedItem) || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Ficha:</div>
                <div class="data-value">{{ getRecordNumber(selectedItem) || '-' }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <BotonCerrar @click="detailsModalRef?.closeDialog()" />
      </template>
    </modalComponent>

    <modalComponent
      ref="editModalRef"
      width="900px"
      max-width="98vw"
    >
      <template #header>
        <div class="text-h6">
          {{ isEditing ? 'Editar Aprendiz' : 'Nuevo Aprendiz' }}
        </div>
      </template>
      <template #body>
        <q-form ref="formRef" @submit.prevent="handleSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md section-title">Datos de Identificación</div>
              <q-select
                filled
                v-model="itemBeingEdited.documentType"
                :options="DOCUMENT_TYPE_OPTIONS"
                label="Tipo de Documento *"
                :rules="[validation.requiredRule]"
                :disable="isEditing"
                :hint="isEditing ? 'El tipo de documento no se puede editar' : ''"
                emit-value
                map-options
              />
              <q-input
                filled
                v-model="itemBeingEdited.documentNumber"
                label="Número de Documento *"
                :rules="[
                  validation.requiredRule,
                  validation.numericRule,
                  validation.minLengthRule(7),
                  validation.maxLengthRule(20),
                  validation.noSpacesRule
                ]"
                :disable="isEditing"
                :hint="isEditing ? 'El número de documento no se puede editar' : ''"
              />
              <div class="text-h6 q-mb-md q-mt-lg section-title">Nombres</div>
              <q-input
                filled
                v-model="itemBeingEdited.firstName"
                label="Nombres *"
                :rules="[
                  validation.requiredRule,
                  validation.minLengthRule(VALIDATION_RULES.MIN_NAME_LENGTH),
                  validation.maxLengthRule(VALIDATION_RULES.MAX_NAME_LENGTH),
                  validation.lettersOnlyRule
                ]"
              />
              <q-input
                filled
                v-model="itemBeingEdited.lastName"
                label="Apellidos *"
                :rules="[
                  validation.requiredRule,
                  validation.minLengthRule(VALIDATION_RULES.MIN_NAME_LENGTH),
                  validation.maxLengthRule(VALIDATION_RULES.MAX_NAME_LENGTH),
                  validation.lettersOnlyRule
                ]"
              />
            </div>
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md section-title">Datos de Contacto</div>
              <q-input
                filled
                v-model="itemBeingEdited.phone"
                label="Teléfono *"
                type="tel"
                :rules="[validation.requiredRule, validation.phoneRule, validation.noSpacesRule]"
              />
              <q-input
                filled
                v-model="itemBeingEdited.emailPersonal"
                label="Email Personal *"
                type="email"
                :rules="[
                  validation.requiredRule,
                  validation.emailRule,
                  validation.maxLengthRule(VALIDATION_RULES.MAX_EMAIL_LENGTH),
                  validation.noSpacesRule
                ]"
              />
              <div class="text-h6 q-mb-md q-mt-lg section-title">Email Institucional</div>
              <q-input
                filled
                v-model="itemBeingEdited.emailInstitutional"
                label="Email Institucional *"
                type="email"
                :rules="[
                  validation.requiredRule,
                  validation.emailRule,
                  validation.maxLengthRule(VALIDATION_RULES.MAX_EMAIL_LENGTH),
                  validation.noSpacesRule
                ]"
                hint="Debe terminar en @sena.edu.co"
              />
            </div>
          </div>
        </q-form>
      </template>
      <template #footer>
        <BotonCerrar label="Cancelar" @click="editModalRef?.closeDialog()" />
        <BotonEnviar label="Guardar" @click="handleSubmit" :loading="isSaving" />
      </template>
    </modalComponent>

    <modalComponent
      ref="uploadModalRef"
      width="600px"
      max-width="95vw"
    >
      <template #header>
        <div class="text-h6">Carga Masiva de Aprendices</div>
      </template>
      <template #body>
          <div class="q-mb-md">
            <p class="text-body1 q-mb-sm">
              Sube un archivo Excel (.xlsx) o CSV (.csv) con la información de los aprendices.
            </p>
            <p class="text-caption text-grey-7">
              El archivo debe contener las siguientes columnas: documentNumber, documentType, firstName, lastName,
              email.personal, email.institutional, phone, recordNumber
            </p>
          </div>
          <q-file
            v-model="uploadFile"
            outlined
            label="Seleccionar archivo"
            accept=".xlsx,.xls,.csv"
            :max-file-size="FILE_SIZE_LIMITS.MAX_UPLOAD_SIZE"
            @rejected="fileUpload.handleFileRejected"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
            <template v-slot:hint>
              Formatos permitidos: Excel (.xlsx, .xls) o CSV (.csv). Tamaño máximo: {{ FILE_SIZE_LIMITS.MAX_UPLOAD_SIZE_MB }}MB
            </template>
          </q-file>
          <div v-if="uploadFile" class="q-mt-md">
            <q-banner class="bg-green-1 text-green-8" rounded>
              <template v-slot:avatar>
                <q-icon name="check_circle" color="green" />
              </template>
              Archivo seleccionado: {{ uploadFile.name }}
              ({{ fileUpload.formatFileSize(uploadFile.size) }})
            </q-banner>
          </div>
      </template>
      <template #footer>
        <BotonCerrar label="Cancelar" @click="uploadModalRef?.closeDialog()" />
        <BotonEnviar
          label="Cargar Aprendices"
          @click="handleMassiveUpload"
          :loading="isSaving"
          :disable="!uploadFile"
        />
      </template>
    </modalComponent>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiClient } from '../../services/apiClient'
import { useNotifications } from '../../composables/useNotifications'
import { useFormValidation } from '../../composables/useFormValidation'
import { useFileUpload } from '../../composables/useFileUpload'
// useTableFiltering está deprecado - el filtrado debe hacerse en el backend
import { useApiData } from '../../composables/useApiData'
import { useApiMutations } from '../../composables/useApiMutations'
import { STATUS, STATUS_LABELS, STATUS_OPTIONS, VALIDATION_RULES, FILE_SIZE_LIMITS, DOCUMENT_TYPE_OPTIONS } from '../../constants/index'
import BackButton from '../../components/BackButton.vue'
import BotonIngresar from '../../components/BotonIngresar.vue'
import BotonEnviar from '../../components/BotonEnviar.vue'
import BotonCerrar from '../../components/BotonCerrar.vue'
import maintable from '../../components/tables/maintable.vue'
import modalComponent from '../../components/modals/modalComponent.vue'

const notifications = useNotifications()
const validation = useFormValidation()
const fileUpload = useFileUpload()

// Usar composables para datos y mutaciones
const { 
  data: apprentices, 
  isLoading, 
  fetchData: fetchApprentices 
} = useApiData('/apprentices/listApprentice', {
  showEmptyInfo: true,
  emptyMessage: 'No hay aprendices registrados',
  errorMessage: 'Error al cargar aprendices'
})

const { 
  isSaving,
  create: createApprentice,
  update: updateApprentice,
  toggleStatus
} = useApiMutations('/apprentices', {
  createSuccessMessage: 'Aprendiz creado exitosamente',
  updateSuccessMessage: 'Aprendiz actualizado exitosamente',
  errorMessage: 'Error en la operación'
})

const selectedItem = ref(null)
const isEditing = ref(false)
const formRef = ref(null)
const uploadFile = ref(null)

const detailsModalRef = ref(null)
const editModalRef = ref(null)
const uploadModalRef = ref(null)

const itemBeingEdited = ref({
  _id: '',
  documentNumber: '',
  documentType: '',
  firstName: '',
  lastName: '',
  emailPersonal: '',
  emailInstitutional: '',
  phone: '',
  status: STATUS.INACTIVE
})

// ==================== COMPOSABLES ====================

// Filtrado debe hacerse en el backend - usar queryParams en fetchApprentices
const searchTerm = ref('')
const statusFilter = ref('all')
// Los datos vienen filtrados del backend
const filteredItems = apprentices

const columns = [
  { name: 'documentNumber', label: 'Documento', field: 'documentNumber', sortable: true, align: 'left' },
  { name: 'firstName', label: 'Nombres', field: 'firstName', sortable: true, align: 'left' },
  { name: 'lastName', label: 'Apellidos', field: 'lastName', sortable: true, align: 'left' },
  { name: 'phone', label: 'Teléfono', field: 'phone', sortable: true, align: 'left' },
  { name: 'status', label: 'Estado', field: 'status', sortable: true, align: 'center' },
  { name: 'opciones', label: 'Opciones', align: 'center' },
  { name: 'activar', label: 'Activar/Desactivar', align: 'center' }
]

/**
 * Obtiene el email personal del aprendiz
 * @param {Object} apprentice - Objeto aprendiz
 * @returns {string} Email personal o string vacío
 */
function getPersonalEmail(apprentice) {
  if (!apprentice) return ''
  if (typeof apprentice.email === 'object' && apprentice.email?.personal) {
    return apprentice.email.personal
  }
  return ''
}

/**
 * Obtiene el email institucional del aprendiz
 * @param {Object} apprentice - Objeto aprendiz
 * @returns {string} Email institucional o string vacío
 */
function getInstitutionalEmail(apprentice) {
  if (!apprentice) return ''
  if (typeof apprentice.email === 'object' && apprentice.email?.institutional) {
    return apprentice.email.institutional
  }
  return ''
}

/**
 * Obtiene el número de ficha del aprendiz
 * @param {Object} apprentice - Objeto aprendiz
 * @returns {string} Número de ficha o string vacío
 */
function getRecordNumber(apprentice) {
  if (!apprentice) return ''
  if (apprentice.recordNumber && Array.isArray(apprentice.recordNumber) && apprentice.recordNumber.length > 0) {
    return apprentice.recordNumber[0]?.fiche || apprentice.recordNumber[0] || ''
  }
  return ''
}

// ==================== FUNCIONES DE UI ====================

/**
 * Obtiene el color del badge según el estado
 * @param {number} status - Estado del aprendiz (0=activo, 1=inactivo)
 * @returns {string} Color del badge ('positive' o 'negative')
 */
function getStatusLabel(status) {
  return status === STATUS.ACTIVE ? STATUS_LABELS.ACTIVE : STATUS_LABELS.INACTIVE
}

/**
 * Obtiene la etiqueta del estado
 * @param {number} status - Estado del aprendiz (0=activo, 1=inactivo)
 * @returns {string} Etiqueta del estado
 */
function getStatusColor(status) {
  return status === STATUS.ACTIVE ? 'positive' : 'negative'
}

// ==================== MANEJADORES DE MODALES ====================

/**
 * Abre el modal de detalles del aprendiz
 * @param {Object} apprentice - Objeto aprendiz a mostrar
 */
function handleViewDetails(apprentice) {
  selectedItem.value = apprentice
  detailsModalRef.value?.openDialog()
}

/**
 * Abre el modal de edición con los datos del aprendiz
 * @param {Object} apprentice - Objeto aprendiz a editar
 */
function handleEdit(apprentice) {
  isEditing.value = true
  itemBeingEdited.value = {
    _id: apprentice._id || '',
    documentNumber: apprentice.documentNumber || '',
    documentType: apprentice.documentType || '',
    firstName: apprentice.firstName || '',
    lastName: apprentice.lastName || '',
    emailPersonal: getPersonalEmail(apprentice) || '',
    emailInstitutional: getInstitutionalEmail(apprentice) || '',
    phone: apprentice.phone || ''
  }
  
  editModalRef.value?.openDialog()
}

/**
 * Abre el modal para crear un nuevo aprendiz
 */
function handleOpenCreateDialog() {
  isEditing.value = false
  itemBeingEdited.value = {
    _id: '',
    documentNumber: '',
    documentType: '',
    firstName: '',
    lastName: '',
    emailPersonal: '',
    emailInstitutional: '',
    phone: '',
    status: STATUS.INACTIVE
  }
  editModalRef.value?.openDialog()
}

/**
 * Cierra el modal de edición/creación y limpia el formulario
 */
function handleCloseDialog() {
  editModalRef.value?.closeDialog()
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

// ==================== MANEJADORES DE FORMULARIO ====================

/**
 * Maneja el envío del formulario (crear o editar)
 */
async function handleSubmit() {
  const isValid = await formRef.value.validate()
  if (!isValid) {
    notifications.error('Por favor complete todos los campos correctamente')
    return
  }
  
  const apprenticeData = {
    documentNumber: itemBeingEdited.value.documentNumber,
    documentType: itemBeingEdited.value.documentType,
    firstName: itemBeingEdited.value.firstName,
    lastName: itemBeingEdited.value.lastName,
    email: {
      personal: itemBeingEdited.value.emailPersonal,
      institutional: itemBeingEdited.value.emailInstitutional
    },
    phone: itemBeingEdited.value.phone
  }
  
  if (isEditing.value) {
    await updateApprentice(
      itemBeingEdited.value._id,
      apprenticeData,
      () => {
        editModalRef.value?.closeDialog()
        if (formRef.value) {
          formRef.value.resetValidation()
        }
        fetchApprentices()
      },
      'updateEntireApprentice'
    )
  } else {
    await createApprentice(
      apprenticeData,
      () => {
        editModalRef.value?.closeDialog()
        if (formRef.value) {
          formRef.value.resetValidation()
        }
        fetchApprentices()
      },
      'register'
    )
  }
}

// ==================== MANEJADORES DE ESTADO ====================

/**
 * Activa o desactiva un aprendiz
 * @param {Object} apprentice - Objeto aprendiz a activar/desactivar
 */
async function handleToggleStatus(apprentice) {
  const isActive = apprentice.status === STATUS.ACTIVE
  const action = isActive ? 'disableApprentice' : 'activateApprentice'
  const successMessage = `Aprendiz ${isActive ? 'desactivado' : 'activado'} exitosamente`
  
  await toggleStatus(
    apprentice._id,
    action,
    successMessage,
    fetchApprentices
  )
}

// ==================== MANEJADORES DE CARGA MASIVA ====================

/**
 * Abre el modal de carga masiva y resetea el archivo
 */
function handleOpenUploadDialog() {
  uploadFile.value = null
  uploadModalRef.value?.openDialog()
}

/**
 * Cierra el modal de carga masiva y limpia el archivo
 */
function handleCloseUploadDialog() {
  uploadFile.value = null
  uploadModalRef.value?.closeDialog()
}

/**
 * Procesa la carga masiva de aprendices desde archivo Excel/CSV
 */
async function handleMassiveUpload() {
  if (!uploadFile.value) {
    notifications.warning('Por favor selecciona un archivo')
    return
  }
  
  if (!fileUpload.validateFile(uploadFile.value)) {
    return
  }
  
  try {
    isSaving.value = true
    const fileToSend = uploadFile.value
    const formData = new FormData()
    formData.append('file', fileToSend, fileToSend.name)
    
    const auth = JSON.parse(localStorage.getItem('auth') || '{}')
    
    // Crear un AbortController para timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 minutos
    
    const resp = await fetch('https://repfora-ep-backend.onrender.com/api/apprentices/loadMassiveApprentice', {
      method: 'POST',
      headers: {
        'x-token': auth?.token || ''
      },
      body: formData,
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    const data = await resp.json().catch(() => ({}))
    
    if (!resp.ok) {
      throw { response: { status: resp.status, data } }
    }
    
    const count = data?.count || data?.data?.count || data?.apprenticesCreated || data?.total || 0
    let message = data?.message || data?.msg || 'Carga masiva exitosa'
    
    if (count > 0 && !message.includes(count.toString())) {
      message = `${message}. ${count} aprendiz${count !== 1 ? 'es' : ''} importado${count !== 1 ? 's' : ''}.`
    }
    
    notifications.success(message)
    uploadFile.value = null
    uploadModalRef.value?.closeDialog()
    await fetchApprentices()
  } catch (error) {    const status = error?.response?.status
    const payload = error?.response?.data || {}
    let errorMessage = 'Error al cargar el archivo.'
    
    // Errores de red/conexión
    if (error?.name === 'AbortError') {
      errorMessage = 'La solicitud tardó demasiado tiempo. El servidor puede estar procesando muchos datos o está inactivo. Intenta con un archivo más pequeño o espera unos minutos.'
    } else if (error?.message?.includes('Failed to fetch') || error?.message?.includes('ERR_CONNECTION')) {
      errorMessage = 'No se pudo conectar con el servidor. Posibles causas:\n• El servidor está inactivo (Render tarda ~30 segundos en despertar)\n• Problemas de red\n• El servidor está procesando la solicitud\n\nIntenta nuevamente en unos segundos.'
    } else if (status === 400) {
      errorMessage = payload?.msg || payload?.message || payload?.error || 'El archivo contiene datos inválidos. Verifica el formato y los datos.'
    } else if (status === 401) {
      errorMessage = 'No autorizado. Por favor inicia sesión nuevamente.'
    } else if (status === 413) {
      errorMessage = 'El archivo es demasiado grande.'
    } else if (status === 422) {
      errorMessage = payload?.msg || payload?.message || 'Error de validación. Verifica que el archivo tenga todas las columnas requeridas.'
    } else if (status === 500) {
      errorMessage = payload?.msg || payload?.message || payload?.error || 'Error interno del servidor. Por favor contacta al administrador.'
    } else if (payload?.error) {
      errorMessage = payload.error
    } else if (payload?.msg) {
      errorMessage = payload.msg
    } else if (payload?.message) {
      errorMessage = payload.message
    } else if (error?.message) {
      errorMessage = error.message
    }
    
    notifications.error(errorMessage)
  } finally {
    isSaving.value = false
  }
}

// ==================== LIFECYCLE HOOKS ====================

/**
 * Carga los aprendices al montar el componente
 */
onMounted(() => {
  fetchApprentices()
})
</script>

<style lang="sass" scoped>
.container
  max-width: 1400px
  margin: 0 auto

.section-title
  color: var(--color-primary)
  font-weight: 600
  font-size: 1.3rem
  margin-bottom: 20px
  padding-left: 8px
  border-left: 4px solid var(--color-border-primary)

.data-grid
  display: grid
  gap: 16px
  background-color: white
  padding: 20px
  border-radius: 8px
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)

.data-row
  display: grid
  grid-template-columns: 180px 1fr
  gap: 16px
  align-items: center

.text-weight-bold
  color: #2c3e50
  font-size: 0.95rem
  font-weight: 600

.data-value
  color: #34495e
  font-size: 0.95rem
</style>
