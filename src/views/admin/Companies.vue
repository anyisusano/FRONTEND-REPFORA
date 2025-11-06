<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">EMPRESAS</h1>
    </div>
    
    <div class="container">
      <div class="row items-center q-mb-md q-gutter-y-sm">
        <div class="col-12 col-md-4">
          <q-input
            v-model="searchTerm"
            dense
            outlined
            placeholder="Buscar empresa..."
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
          <div class="row q-gutter-sm justify-end no-wrap companies-actions">
            <BotonIngresar
              class="companies-actions__btn"
              label="Carga Masiva"
              @click="handleOpenUploadDialog"
              icon="upload_file"
            />
            <BotonIngresar
              class="companies-actions__btn companies-actions__btn--primary"
              label="+ Nueva Empresa"
              @click="handleOpenCreateDialog"
            />
          </div>
        </div>
      </div>

      <maintable
        :datos="filteredItems"
        :columnas="columns"
        row-key="_id"
        no-data-label="No hay empresas registradas"
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
        <div class="text-h6">Detalles de Empresa</div>
      </template>
      <template #body>
        <div v-if="selectedItem" class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <div class="text-h6 q-mb-md section-title">Datos de la empresa</div>
            <div class="data-grid">
              <div class="data-row">
                <div class="text-weight-bold">Número NIT:</div>
                <div class="data-value">{{ selectedItem.companyNit || selectedItem.company_nit || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Razón social:</div>
                <div class="data-value">{{ selectedItem.name || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Dirección:</div>
                <div class="data-value">{{ selectedItem.location || '-' }}</div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-h6 q-mb-md section-title">Contacto de la empresa</div>
            <div class="data-grid">
              <div class="data-row">
                <div class="text-weight-bold">Representante Legal:</div>
                <div class="data-value">{{ selectedItem.legalRepresentativeName || selectedItem.legal_representative_name || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Cargo:</div>
                <div class="data-value">{{ selectedItem.legalRepresentativePosition || selectedItem.legal_representative_position || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Teléfono:</div>
                <div class="data-value">{{ selectedItem.legalRepresentativePhone || selectedItem.legal_representative_phone || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Email:</div>
                <div class="data-value">{{ selectedItem.legalRepresentativeEmail || selectedItem.legal_representative_email || '-' }}</div>
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
          {{ isEditing ? 'Editar Empresa' : 'Nueva Empresa' }}
        </div>
      </template>
      <template #body>
        <q-form ref="formRef" @submit.prevent="handleSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md section-title">Datos de la empresa</div>
              <q-input
                filled
                v-model="itemBeingEdited.company_nit"
                label="Número NIT *"
                :rules="[validation.requiredRule, validation.nitRule]"
                :disable="isEditing"
                :hint="isEditing ? 'El NIT no se puede editar' : ''"
              />
              <q-input
                filled
                v-model="itemBeingEdited.name"
                label="Razón Social *"
                :rules="[
                  validation.requiredRule,
                  validation.minLengthRule(VALIDATION_RULES.MIN_NAME_LENGTH),
                  validation.maxLengthRule(VALIDATION_RULES.MAX_NAME_LENGTH),
                  validation.alphanumericRule
                ]"
                :disable="isEditing"
                :hint="isEditing ? 'La razón social no se puede editar' : ''"
              />
              <div class="text-h6 q-mb-md q-mt-lg section-title">Dirección</div>
              <q-select
                filled
                v-model="selectedDepartment"
                :options="departamentos"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                label="Departamento *"
                :rules="[validation.requiredRule]"
              />
              <q-select
                filled
                v-model="selectedCity"
                :options="availableCities"
                label="Ciudad *"
                :disable="!selectedDepartment"
                :rules="[validation.requiredRule]"
                :hint="!selectedDepartment ? 'Primero selecciona un departamento' : ''"
              />
            </div>
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md section-title">Contacto de la empresa</div>
              <q-input
                filled
                v-model="itemBeingEdited.legal_representative_name"
                label="Jefe Inmediato *"
                :rules="[
                  validation.requiredRule,
                  validation.minLengthRule(VALIDATION_RULES.MIN_NAME_LENGTH),
                  validation.maxLengthRule(50),
                  validation.lettersOnlyRule
                ]"
              />
              <q-input
                filled
                v-model="itemBeingEdited.legal_representative_position"
                label="Cargo *"
                :rules="[
                  validation.requiredRule,
                  validation.minLengthRule(VALIDATION_RULES.MIN_NAME_LENGTH),
                  validation.maxLengthRule(50)
                ]"
              />
              <div class="text-h6 q-mb-md q-mt-lg section-title">Datos de contacto</div>
              <q-input
                filled
                v-model="itemBeingEdited.legal_representative_phone"
                label="Teléfono de Jefe Inmediato *"
                type="tel"
                :rules="[validation.requiredRule, validation.phoneRule, validation.noSpacesRule]"
              />
              <q-input
                filled
                v-model="itemBeingEdited.legal_representative_email"
                label="Email de Jefe Inmediato *"
                type="email"
                :rules="[
                  validation.requiredRule,
                  validation.emailRule,
                  validation.maxLengthRule(VALIDATION_RULES.MAX_EMAIL_LENGTH),
                  validation.noSpacesRule
                ]"
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
        <div class="text-h6">Carga Masiva de Empresas</div>
      </template>
      <template #body>
          <div class="q-mb-md">
            <p class="text-body1 q-mb-sm">
              Sube un archivo Excel (.xlsx) o CSV (.csv) con la información de las empresas.
            </p>
            <p class="text-caption text-grey-7">
              El archivo debe contener las siguientes columnas: NIT, Razón Social, Ubicación,
              Nombre Representante, Cargo, Teléfono, Email
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
          label="Cargar Empresas"
          @click="handleMassiveUpload"
          :loading="isSaving"
          :disable="!uploadFile"
        />
      </template>
    </modalComponent>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { apiClient } from '../../services/apiClient'
import { useNotifications } from '../../composables/useNotifications'
import { useFormValidation } from '../../composables/useFormValidation'
import { useFileUpload } from '../../composables/useFileUpload'
import { useApiMutations } from '../../composables/useApiMutations'
import { useColombia } from '../../composables/useColombia'
import { STATUS, STATUS_LABELS, STATUS_OPTIONS, VALIDATION_RULES, FILE_SIZE_LIMITS } from '../../constants/index'
import BackButton from '../../components/BackButton.vue'
import BotonIngresar from '../../components/BotonIngresar.vue'
import BotonEnviar from '../../components/BotonEnviar.vue'
import BotonCerrar from '../../components/BotonCerrar.vue'
import maintable from '../../components/tables/maintable.vue'
import modalComponent from '../../components/modals/modalComponent.vue'

const notifications = useNotifications()
const validation = useFormValidation()
const fileUpload = useFileUpload()

const { departamentos, getCiudadesByDepartamento } = useColombia()

// Usar apiClient directamente para obtener la lista de empresas
const companies = ref([])
const isLoading = ref(false)

async function fetchCompanies(queryParams = {}) {
  try {
    isLoading.value = true
    companies.value = []

    // Construir URL con query params si existen
    let url = '/companies/listCompanies'
    if (Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams()
      const keys = Object.keys(queryParams)
      let keyIndex = 0
      while (keyIndex < keys.length) {
        const key = keys[keyIndex]
        if (queryParams[key] !== undefined && queryParams[key] !== null && queryParams[key] !== '') {
          params.append(key, queryParams[key])
        }
        keyIndex++
      }
      url = `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`
    }

    const response = await apiClient.get(url)
    const payload = response?.data

    // Extraer el primer array válido de la respuesta (soporta msg anidado)
    function findFirstArray(obj, depth = 0) {
      if (!obj || typeof obj !== 'object' || depth > 4) return null
      if (Array.isArray(obj)) return obj
      const keys = Object.keys(obj)
      let i = 0
      while (i < keys.length) {
        const k = keys[i]
        const val = obj[k]
        if (Array.isArray(val)) return val
        if (val && typeof val === 'object') {
          const nested = findFirstArray(val, depth + 1)
          if (nested) return nested
        }
        i++
      }
      return null
    }

    let list = []
    // Intentar propiedades directas
    if (payload && Array.isArray(payload)) list = payload
    else if (payload?.msg && Array.isArray(payload.msg)) list = payload.msg
    else if (payload?.companies && Array.isArray(payload.companies)) list = payload.companies
    else if (payload?.data && Array.isArray(payload.data)) list = payload.data
    else {
      // Buscar arrays anidados en payload o payload.msg
      list = findFirstArray(payload?.msg) || findFirstArray(payload) || []
    }
    console.debug('[Companies] extracted list length:', list.length)

    companies.value = list
    if (companies.value.length === 0) {
      // Mostrar info si no hay empresas
      notifications.info('No hay empresas registradas')
    }
    return companies.value
  } catch (error) {
    const msg = error.response?.data?.msg || error.response?.data?.message || error?.message || 'Error al cargar empresas'
    notifications.error(msg)
    companies.value = []
    throw error
  } finally {
    isLoading.value = false
  }
}

const { 
  isSaving,
  create: createCompany,
  update: updateCompany,
  toggleStatus
} = useApiMutations('/companies', {
  createSuccessMessage: 'Empresa creada exitosamente',
  updateSuccessMessage: 'Empresa actualizada exitosamente',
  errorMessage: 'Error en la operación'
})

// Ajustar endpoints según la colección Postman
const createCompanyWithEndpoint = async (data, callback) => {
  await createCompany(data, '/companies/saveCompanies')
  if (callback) callback()
}

const updateCompanyWithEndpoint = async (id, data, callback) => {
  await updateCompany(id, data, `/companies/updateCompanies/${id}`)
  if (callback) callback()
}

const selectedItem = ref(null)
const isEditing = ref(false)
const formRef = ref(null)
const uploadFile = ref(null)

const detailsModalRef = ref(null)
const editModalRef = ref(null)
const uploadModalRef = ref(null)

const selectedDepartment = ref('')
const selectedCity = ref('')

const itemBeingEdited = ref({
  _id: '',
  company_nit: '',
  name: '',
  location: '',
  legal_representative_name: '',
  legal_representative_position: '',
  legal_representative_email: '',
  legal_representative_phone: '',
  status: STATUS.INACTIVE
})

// Filtrado debe hacerse en el backend - usar queryParams en fetchCompanies
const searchTerm = ref('')
const statusFilter = ref('all')

// Los datos vienen filtrados del backend
const filteredItems = companies

const columns = [
  { name: 'companyNit', label: 'NIT', field: 'companyNit', sortable: true, align: 'left' },
  { name: 'name', label: 'Nombre', field: 'name', sortable: true, align: 'left' },
  { name: 'legalRepresentativeEmail', label: 'Email', field: 'legalRepresentativeEmail', sortable: true, align: 'left' },
  { name: 'legalRepresentativePhone', label: 'Teléfono', field: 'legalRepresentativePhone', sortable: true, align: 'left' },
  { name: 'status', label: 'Estado', field: 'status', sortable: true, align: 'center' },
  { name: 'opciones', label: 'Opciones', align: 'center' },
  { name: 'activar', label: 'Activar/Desactivar', align: 'center' }
]

/**
 * Obtiene las ciudades disponibles según el departamento seleccionado
 * El backend debe devolver las ciudades en el formato correcto
 */
const availableCities = computed(() => {
  if (!selectedDepartment.value) return []
  // El backend debe devolver ciudades con formato {label, value}
  const cities = getCiudadesByDepartamento(selectedDepartment.value)
  // Sin usar map - el backend debe devolver el formato correcto
  const result = []
  let index = 0
  while (index < cities.length) {
    const city = cities[index]
    result.push({
      label: city,
      value: city
    })
    index++
  }
  return result
})

// ==================== FUNCIONES DE UI ====================

/**
 * Obtiene la etiqueta del estado
 * @param {number} status - Estado de la empresa (0=activo, 1=inactivo)
 * @returns {string} Etiqueta del estado
 */
function getStatusLabel(status) {
  return status === STATUS.ACTIVE ? STATUS_LABELS.ACTIVE : STATUS_LABELS.INACTIVE
}

/**
 * Obtiene el color del badge según el estado
 * @param {number} status - Estado de la empresa (0=activo, 1=inactivo)
 * @returns {string} Color del badge ('positive' o 'negative')
 */
function getStatusColor(status) {
  return status === STATUS.ACTIVE ? 'positive' : 'negative'
}

// ==================== MANEJADORES DE MODALES ====================

/**
 * Abre el modal de detalles de la empresa
 * @param {Object} company - Objeto empresa a mostrar
 */
function handleViewDetails(company) {
  selectedItem.value = company
  detailsModalRef.value?.openDialog()
}

/**
 * Abre el modal de edición con los datos de la empresa
 * @param {Object} company - Objeto empresa a editar
 */
function handleEdit(company) {
  isEditing.value = true
  // Mapear datos del backend (camelCase) a formato del formulario (snake_case)
  itemBeingEdited.value = {
    _id: company._id || company.id || '',
    company_nit: company.companyNit || company.company_nit || '',
    name: company.name || '',
    location: company.location || '',
    legal_representative_name: company.legalRepresentativeName || company.legal_representative_name || '',
    legal_representative_position: company.legalRepresentativePosition || company.legal_representative_position || '',
    legal_representative_email: company.legalRepresentativeEmail || company.legal_representative_email || '',
    legal_representative_phone: company.legalRepresentativePhone || company.legal_representative_phone || '',
    status: company.status !== undefined ? company.status : STATUS.INACTIVE
  }
  
  if (company.location && company.location.includes(',')) {
    // El backend debe devolver location separado en city y department
    const locationParts = company.location.split(',')
    const city = locationParts[0] ? locationParts[0].trim() : ''
    const dept = locationParts[1] ? locationParts[1].trim() : ''
    selectedDepartment.value = dept
    selectedCity.value = city
  }
  
  editModalRef.value?.openDialog()
}

/**
 * Abre el modal para crear una nueva empresa
 */
function handleOpenCreateDialog() {
  isEditing.value = false
  selectedDepartment.value = ''
  selectedCity.value = ''
  itemBeingEdited.value = {
    _id: '',
    company_nit: '',
    name: '',
    location: '',
    legal_representative_name: '',
    legal_representative_position: '',
    legal_representative_email: '',
    legal_representative_phone: '',
    status: STATUS.INACTIVE
  }
  editModalRef.value?.openDialog()
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
  
  if (selectedDepartment.value && selectedCity.value) {
    itemBeingEdited.value.location = `${selectedCity.value}, ${selectedDepartment.value}`
  }
  
  // El backend espera camelCase según la colección Postman
  const companyData = {
    companyNit: itemBeingEdited.value.company_nit,
    name: itemBeingEdited.value.name,
    location: itemBeingEdited.value.location,
    legalRepresentativePhone: itemBeingEdited.value.legal_representative_phone,
    legalRepresentativeName: itemBeingEdited.value.legal_representative_name,
    legalRepresentativeEmail: itemBeingEdited.value.legal_representative_email,
    legalRepresentativePosition: itemBeingEdited.value.legal_representative_position
  }
  
  if (isEditing.value) {
    // Usar apiClient directamente para actualizar
    try {
      isSaving.value = true
      const res = await apiClient.put(`/companies/updateCompanies/${itemBeingEdited.value._id}`, companyData)
      notifications.success('Empresa actualizada exitosamente')
      editModalRef.value?.closeDialog()
      if (formRef.value) formRef.value.resetValidation()
      await fetchCompanies()
    } catch (error) {
      const msg = error.response?.data?.msg || error.response?.data?.message || error?.message || 'Error al actualizar empresa'
      notifications.error(msg)
    } finally {
      isSaving.value = false
    }
  } else {
    // Usar apiClient directamente para crear
    try {
      isSaving.value = true
      const res = await apiClient.post('/companies/saveCompanies', companyData)
      notifications.success('Empresa creada exitosamente')
      editModalRef.value?.closeDialog()
      if (formRef.value) formRef.value.resetValidation()
      await fetchCompanies()
    } catch (error) {
      const msg = error.response?.data?.msg || error.response?.data?.message || error?.message || 'Error al crear empresa'
      notifications.error(msg)
    } finally {
      isSaving.value = false
    }
  }
}

// ==================== MANEJADORES DE ESTADO ====================

/**
 * Activa o desactiva una empresa
 * @param {Object} company - Objeto empresa a activar/desactivar
 */
async function handleToggleStatus(company) {
  const isActive = company.status === STATUS.ACTIVE
  const action = isActive ? 'inactiveCompanies' : 'activeCompanies'
  const successMessage = `Empresa ${isActive ? 'desactivada' : 'activada'} exitosamente`
  
  await toggleStatus(
    company._id,
    action,
    successMessage,
    fetchCompanies
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
 * Procesa la carga masiva de empresas desde archivo Excel/CSV
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
    
    // Usar apiClient (axios) para enviar FormData y aprovechar interceptores (x-token)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 minutos

      const response = await apiClient.post('/companies/loadMassiveCompanie', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const data = response?.data || {}

      const count = data?.count || data?.data?.count || data?.companiesCreated || data?.total || 0
      let message = data?.message || data?.msg || 'Carga masiva exitosa'

      if (count > 0 && !message.includes(count.toString())) {
        message = `${message}. ${count} empresa${count !== 1 ? 's' : ''} importada${count !== 1 ? 's' : ''}.`
      }

      notifications.success(message)
      uploadFile.value = null
      uploadModalRef.value?.closeDialog()
      await fetchCompanies()
    } catch (error) {
      // Propagar al catch general abajo manejando como antes
      throw error
    }
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

// ==================== WATCHERS ====================

/**
 * Actualiza el campo location cuando se selecciona departamento y ciudad
 */
watch([selectedDepartment, selectedCity], ([dept, city]) => {
  if (dept && city) {
    const locationValue = `${city}, ${dept}`
    itemBeingEdited.value.location = locationValue
  }
})

// ==================== LIFECYCLE HOOKS ====================

/**
 * Carga las empresas al montar el componente
 */
onMounted(() => {
  fetchCompanies()
})
</script>

<style lang="sass" scoped>
.container
  max-width: 1400px
  margin: 0 auto

.companies-actions
  display: flex
  gap: 12px
  align-items: center
  justify-content: flex-end

.companies-actions__btn
  /* Hacer que ambos botones ocupen el mismo espacio (igual ancho) */
  flex: 1 1 0
  min-width: 120px
  max-width: 420px
  max-height: 48px
  display: flex
  align-items: center
  justify-content: center

.companies-actions__btn--primary
  /* dar más presencia al botón + Nueva Empresa (misma apariencia que el otro) */
  .boton-ingresar
    padding: 10px 18px

/* Ajustes del botón base dentro del contenedor para mantener altura y tamaño uniforme */
.companies-actions__btn .boton-ingresar
  height: 44px
  display: inline-flex
  align-items: center
  justify-content: center
  padding: 8px 16px
  font-size: 15px
  box-sizing: border-box

/* Ajuste del icono dentro del botón */
.companies-actions__btn .q-icon
  font-size: 20px
  margin-right: 8px

/* Responsive: en pantallas pequeñas apilar botones y usar ancho completo */
@media (max-width: 1024px)
  .companies-actions__btn .boton-ingresar
    height: 42px
    font-size: 14px
    padding: 7px 14px
  .companies-actions__btn .q-icon
    font-size: 18px

@media (max-width: 600px)
  .companies-actions
    flex-direction: column-reverse
    align-items: stretch
    width: 100%

  .companies-actions__btn
    flex: none
    width: 100%
    max-width: none
    display: block

  .companies-actions__btn .boton-ingresar
    width: 100%
    box-sizing: border-box
    padding: 10px 12px
    height: 44px
    font-size: 14px
  .companies-actions__btn .q-icon
    margin-right: 10px
    font-size: 18px

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