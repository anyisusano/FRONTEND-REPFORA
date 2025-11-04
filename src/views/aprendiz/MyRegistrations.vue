<template>
  <div class="q-pa-md">
    <BackButton to="/app/aprendiz/inicio" />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">MIS REGISTROS DE ETAPA PRODUCTIVA</h1>
    </div>
    
    <div class="container">
      <!-- Botón para nuevo registro -->
      <div class="row q-mb-md">
        <div class="col-12 text-right">
          <BotonIngresar
            label="+ Nuevo Registro EP"
            @click="handleOpenCreateDialog"
            style="height: 36px; padding: 8px 16px;"
            icon="add_circle"
          />
        </div>
      </div>

      <!-- Tabla de mis registros -->
      <maintable
        :datos="registros"
        :columnas="columns"
        row-key="_id"
        no-data-label="No tienes registros de EP. ¡Crea tu primer registro!"
        :rows-per-page-options="[10, 20, 50]"
        :initial-rows-per-page="10"
      >
                <template #body-cell-registrationStatus="props">
                    <q-td :props="props">
                        <q-badge :color="getStatusColor(props.row.registrationStatus || props.row.registration_status)">
                            {{ getStatusLabel(props.row.registrationStatus || props.row.registration_status) }}
                        </q-badge>
                    </q-td>
                </template>

        <template #body-cell-modality="props">
          <q-td :props="props">
            {{ props.row.modality_id?.name || 'N/A' }}
          </q-td>
        </template>

        <template #body-cell-company="props">
          <q-td :props="props">
            {{ props.row.company_id?.name || 'N/A' }}
          </q-td>
        </template>

                <template #body-cell-scheduledStartDate="props">
                    <q-td :props="props">
                        {{ formatDate(props.row.scheduledStartDate || props.row.scheduled_start_date) }}
                    </q-td>
                </template>

        <template #body-cell-opciones="props">
          <q-td :props="props" class="text-center">
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
              v-if="canEdit(props.row)"
              flat
              round
              color="warning"
              icon="edit"
              @click="handleEdit(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </maintable>
    </div>

    <!-- Modal de Detalles -->
    <modalComponent
      ref="detailsModalRef"
      width="800px"
      max-width="98vw"
    >
      <template #header>
        <div class="text-h6">Detalles del Registro EP</div>
      </template>
      <template #body>
        <div v-if="selectedItem" class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-subtitle2 text-grey-8">Número de Registro</div>
              <div class="text-body1 text-weight-bold">{{ selectedItem.registration_number || 'N/A' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey-8">Modalidad</div>
              <div class="text-body1">{{ selectedItem.modality_id?.name || 'N/A' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey-8">Empresa</div>
              <div class="text-body1">{{ selectedItem.company_id?.name || 'N/A' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey-8">Fecha de Inicio</div>
                            <div class="text-body1">{{ formatDate(selectedItem.scheduledStartDate || selectedItem.scheduled_start_date) }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey-8">Estado</div>
              <div>
                <q-badge :color="getStatusColor(selectedItem.registrationStatus || selectedItem.registration_status)">
                  {{ getStatusLabel(selectedItem.registrationStatus || selectedItem.registration_status) }}
                </q-badge>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-subtitle2 text-grey-8">Total Horas Solicitadas</div>
              <div class="text-body1">{{ selectedItem.totalRequestedHours || selectedItem.total_requested_hours || 0 }} horas</div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-subtitle2 text-grey-8">Días Laborales</div>
              <div class="text-body1">{{ selectedItem.working_days }} días/semana</div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-subtitle2 text-grey-8">Horas Diarias</div>
              <div class="text-body1">{{ selectedItem.daily_hours }} horas/día</div>
            </div>
            <div class="col-12">
              <div class="text-subtitle2 text-grey-8">Fecha de Registro</div>
              <div class="text-body1">{{ formatDate(selectedItem.registration_date) }}</div>
            </div>
            
            <!-- Observaciones del Aprendiz -->
            <div v-if="selectedItem.apprentice_observations?.length > 0" class="col-12">
              <div class="text-subtitle2 text-grey-8 q-mb-sm">Mis Observaciones</div>
              <q-timeline color="primary">
                <q-timeline-entry
                  v-for="(obs, index) in selectedItem.apprentice_observations"
                  :key="index"
                  :title="formatDate(obs.fecha)"
                  :subtitle="obs.escrito_por"
                >
                  <div>{{ obs.descripcion }}</div>
                </q-timeline-entry>
              </q-timeline>
            </div>
            
            <!-- Observaciones del Admin -->
            <div v-if="selectedItem.admin_observations?.length > 0" class="col-12">
              <div class="text-subtitle2 text-grey-8 q-mb-sm">Observaciones del Administrador</div>
              <q-timeline color="secondary">
                <q-timeline-entry
                  v-for="(obs, index) in selectedItem.admin_observations"
                  :key="index"
                  :title="formatDate(obs.fecha)"
                  :subtitle="obs.escrito_por"
                >
                  <div>{{ obs.descripcion }}</div>
                </q-timeline-entry>
              </q-timeline>
            </div>
          </div>
        </div>
      </template>
      <template #actions>
        <BotonCerrar @click="detailsModalRef?.closeDialog()" />
      </template>
    </modalComponent>

    <!-- Modal de Creación/Edición -->
    <modalComponent
      ref="editModalRef"
      width="900px"
      max-width="98vw"
    >
      <template #header>
        <div class="text-h6">{{ isEditing ? 'Editar' : 'Nuevo' }} Registro de Etapa Productiva</div>
      </template>
      <template #body>
        <q-form ref="formRef" class="q-pa-md">
          <div class="row q-col-gutter-md">
            <!-- Número de Registro (solo en edición) -->
            <div v-if="isEditing" class="col-12">
              <q-input
                v-model="itemBeingEdited.registration_number"
                label="Número de Registro"
                outlined
                dense
                readonly
                hint="Número de registro asignado"
              />
            </div>

            <!-- Información del aprendiz (solo lectura) -->
            <div class="col-12">
              <q-banner class="bg-blue-1">
                <template v-slot:avatar>
                  <q-icon name="account_circle" color="primary" />
                </template>
                <div class="text-body2">
                  <strong>Registrando para:</strong> {{ apprenticeName }}
                </div>
              </q-banner>
            </div>

            <!-- Seleccionar Modalidad -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="itemBeingEdited.modality_id"
                :options="modalityOptions"
                option-value="_id"
                option-label="name"
                emit-value
                map-options
                label="Modalidad EP *"
                outlined
                dense
                :rules="[validation.requiredRule]"
                hint="Selecciona la modalidad de tu etapa productiva"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay modalidades disponibles
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Seleccionar Empresa -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="itemBeingEdited.company_id"
                :options="companyOptions"
                option-value="_id"
                option-label="name"
                emit-value
                map-options
                label="Empresa *"
                outlined
                dense
                :rules="[validation.requiredRule]"
                hint="Empresa donde realizarás la EP"
                use-input
                input-debounce="300"
                @filter="filterCompanies"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay empresas disponibles
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Fecha de Inicio Programada -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="itemBeingEdited.scheduled_start_date"
                label="Fecha de Inicio Programada *"
                outlined
                dense
                type="date"
                :rules="[validation.requiredRule]"
                hint="Fecha en que inicias la etapa productiva"
              />
            </div>

            <!-- Total Horas Solicitadas -->
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="itemBeingEdited.total_requested_hours"
                label="Total Horas Solicitadas *"
                outlined
                dense
                type="number"
                :rules="[validation.requiredRule, (val) => val > 0 || 'Debe ser mayor a 0']"
                hint="Total de horas de la etapa productiva"
              />
            </div>

            <!-- Días Laborales por Semana -->
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="itemBeingEdited.working_days"
                label="Días Laborales por Semana *"
                outlined
                dense
                type="number"
                :rules="[validation.requiredRule, (val) => (val >= 1 && val <= 7) || 'Debe estar entre 1 y 7']"
                hint="Número de días que trabajarás por semana"
              />
            </div>

            <!-- Horas Diarias -->
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="itemBeingEdited.daily_hours"
                label="Horas Diarias *"
                outlined
                dense
                type="number"
                :rules="[validation.requiredRule, (val) => (val >= 1 && val <= 24) || 'Debe estar entre 1 y 24']"
                hint="Horas que trabajarás por día"
              />
            </div>

            <!-- Observaciones del Aprendiz -->
            <div class="col-12">
              <q-input
                v-model="itemBeingEdited.apprentice_observations"
                label="Observaciones (opcional)"
                outlined
                dense
                type="textarea"
                rows="3"
                hint="Puedes agregar comentarios o detalles adicionales"
                counter
                maxlength="500"
              />
            </div>

            <!-- Advertencia si está editando -->
            <div v-if="isEditing" class="col-12">
              <q-banner class="bg-orange-1">
                <template v-slot:avatar>
                  <q-icon name="warning" color="orange" />
                </template>
                <div class="text-body2">
                  Solo puedes editar registros que aún no han sido validados por el administrador.
                </div>
              </q-banner>
            </div>
          </div>
        </q-form>
      </template>
      <template #actions>
        <BotonCerrar @click="handleCloseDialog" />
        <BotonEnviar
          :label="isEditing ? 'Actualizar' : 'Registrar'"
          @click="handleSubmit"
          :loading="isSaving"
        />
      </template>
    </modalComponent>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { apiClient } from '../../services/apiClient'
import { useNotifications } from '../../composables/useNotifications'
import { useFormValidation } from '../../composables/useFormValidation'
import { useApiData } from '../../composables/useApiData'
import { useApiMutations } from '../../composables/useApiMutations'
import { useAuthStore } from '../../stores/authStore'
import { STATUS, STATUS_LABELS, STATUS_OPTIONS } from '../../constants/index'
import BackButton from '../../components/BackButton.vue'
import BotonIngresar from '../../components/BotonIngresar.vue'
import BotonEnviar from '../../components/BotonEnviar.vue'
import BotonCerrar from '../../components/BotonCerrar.vue'
import maintable from '../../components/tables/maintable.vue'
import modalComponent from '../../components/modals/modalComponent.vue'

const notifications = useNotifications()
const validation = useFormValidation()
const authStore = useAuthStore()

// Usar composables para datos y mutaciones
const { 
  data: registros, 
  isLoading, 
  fetchData: fetchRegistrations 
} = useApiData('/registrations/myRegistrations', {
  extractData: (response) => {
    const payload = response?.data
    if (payload?.registrations && Array.isArray(payload.registrations)) return payload.registrations
    if (payload?.msg && Array.isArray(payload.msg)) return payload.msg
    if (payload?.data && Array.isArray(payload.data)) return payload.data
    if (Array.isArray(payload)) return payload
    return []
  },
  showEmptyInfo: true,
  emptyMessage: 'No tienes registros de EP. ¡Crea tu primer registro!',
  errorMessage: 'Error al cargar tus registros'
})

const { 
  isSaving,
  create: createRegistration,
  update: updateRegistrationMutation
} = useApiMutations('/registrations', {
  createSuccessMessage: 'Registro creado exitosamente',
  updateSuccessMessage: 'Registro actualizado exitosamente',
  errorMessage: 'Error en la operación'
})

const selectedItem = ref(null)
const isEditing = ref(false)
const formRef = ref(null)

const detailsModalRef = ref(null)
const editModalRef = ref(null)

const modalityOptions = ref([])
const companyOptions = ref([])
const allCompanies = ref([])

const itemBeingEdited = ref({
  _id: '',
  registration_number: '',
  modality_id: '',
  company_id: '',
  scheduled_start_date: '',
  total_requested_hours: 0,
  working_days: 5,
  daily_hours: 8,
  apprentice_observations: ''
})

// ==================== COMPUTED ====================

const apprenticeName = computed(() => {
  const user = authStore.user
  return user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Aprendiz'
})

// ==================== COLUMNS ====================

const columns = [
  { name: 'registrationNumber', label: 'Número Registro', field: 'registrationNumber', sortable: true, align: 'left' },
  { name: 'modality', label: 'Modalidad', field: 'modality', sortable: true, align: 'left' },
  { name: 'company', label: 'Empresa', field: 'company', sortable: true, align: 'left' },
  { name: 'scheduledStartDate', label: 'Fecha Inicio', field: 'scheduledStartDate', sortable: true, align: 'center' },
  { name: 'totalRequestedHours', label: 'Horas Totales', field: 'totalRequestedHours', sortable: true, align: 'center' },
  { name: 'registrationStatus', label: 'Estado', field: 'registrationStatus', sortable: true, align: 'center' },
  { name: 'opciones', label: 'Opciones', align: 'center' }
]

// ==================== FUNCIONES DE DATOS ====================

// ==================== FUNCIONES DE UI ====================

function getStatusLabel(status) {
  // 0 = Pendiente, 1 = Rechazado, 2 = En Revisión, 3 = Aprobado
  const labels = {
    0: 'Pendiente Validación',
    1: 'Rechazado',
    2: 'En Revisión',
    3: 'Aprobado'
  }
  return labels[status] || 'Desconocido'
}

function getStatusColor(status) {
  // 0 = Pendiente, 1 = Rechazado, 2 = En Revisión, 3 = Aprobado
  const colors = {
    0: 'orange',
    1: 'negative',
    2: 'info',
    3: 'positive'
  }
  return colors[status] || 'grey'
}

function canEdit(record) {
  // Solo se puede editar si está pendiente (0) o rechazado (1)
  return record.registration_status === 0 || record.registration_status === 1
}

function formatDate(date) {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// ==================== MANEJADORES DE MODALES ====================

function handleViewDetails(record) {
  selectedItem.value = record
  detailsModalRef.value?.openDialog()
}

function handleEdit(record) {
  if (!canEdit(record)) {
    notifications.warning('No puedes editar un registro ya aprobado o en revisión')
    return
  }
  
  isEditing.value = true
  itemBeingEdited.value = {
    _id: record._id || '',
    registration_number: record.registration_number || '',
    modality_id: record.modality_id?._id || '',
    company_id: record.company_id?._id || '',
    scheduled_start_date: record.scheduled_start_date ? record.scheduled_start_date.split('T')[0] : '',
  total_requested_hours: record.total_requested_hours ?? 0,
  working_days: record.working_days ?? 5,
  daily_hours: record.daily_hours ?? 8,
    apprentice_observations: record.apprentice_observations?.[record.apprentice_observations.length - 1]?.descripcion || ''
  }
  
  editModalRef.value?.openDialog()
}

function handleOpenCreateDialog() {
  isEditing.value = false
  itemBeingEdited.value = {
    _id: '',
    registration_number: '',
    modality_id: '',
    company_id: '',
    scheduled_start_date: '',
    total_requested_hours: 0,
    working_days: 5,
    daily_hours: 8,
    apprentice_observations: ''
  }
  editModalRef.value?.openDialog()
}

function handleCloseDialog() {
  editModalRef.value?.closeDialog()
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

// ==================== MANEJADORES DE FORMULARIO ====================

async function handleSubmit() {
  const isValid = await formRef.value.validate()
  if (!isValid) {
    notifications.error('Por favor complete todos los campos correctamente')
    return
  }
  
  const recordData = {
    modality_id: itemBeingEdited.value.modality_id,
    company_id: itemBeingEdited.value.company_id,
    scheduled_start_date: itemBeingEdited.value.scheduled_start_date,
    total_requested_hours: itemBeingEdited.value.total_requested_hours,
    working_days: itemBeingEdited.value.working_days,
    daily_hours: itemBeingEdited.value.daily_hours,
    apprentice_observations: itemBeingEdited.value.apprentice_observations,
    uploaded_documents: []
  }
  
  if (isEditing.value) {
    await updateRegistrationMutation(
      itemBeingEdited.value._id,
      recordData,
      () => {
        editModalRef.value?.closeDialog()
        if (formRef.value) {
          formRef.value.resetValidation()
        }
        fetchRegistrations()
      },
      'updateRegistration'
    )
  } else {
    await createRegistration(
      recordData,
      () => {
        notifications.success('Registro de EP creado exitosamente. Pendiente de validación administrativa.')
        editModalRef.value?.closeDialog()
        if (formRef.value) {
          formRef.value.resetValidation()
        }
        fetchRegistrations()
      },
      'saveRegistration'
    )
  }
}

// ==================== FUNCIONES AUXILIARES ====================

async function loadModalities() {
  try {
    const response = await apiClient.get('/modalities/listModalities')
    const payload = response?.data
    
    if (payload?.modalities && Array.isArray(payload.modalities)) {
      // Sin usar filter - el backend debe devolver solo modalidades activas
      modalityOptions.value = payload.modalities || []
    } else if (payload?.data && Array.isArray(payload.data)) {
      // Sin usar filter - el backend debe devolver solo modalidades activas
      modalityOptions.value = payload.data || []
    } else if (Array.isArray(payload)) {
      // Sin usar filter - el backend debe devolver solo modalidades activas
      modalityOptions.value = payload || []
    }
  } catch (error) {  }
}

async function loadCompanies() {
  try {
    const response = await apiClient.get('/companies/listCompanies')
    const payload = response?.data
    
    let data = []
    if (payload?.companies && Array.isArray(payload.companies)) {
      data = payload.companies
    } else if (payload?.data && Array.isArray(payload.data)) {
      data = payload.data
    } else if (Array.isArray(payload)) {
      data = payload
    }
    
    // Filtrar usando while
    allCompanies.value = []
    let i = 0
    while (i < data.length) {
      if (data[i].status === STATUS.ACTIVE) {
        allCompanies.value.push(data[i])
      }
      i++
    }
    // Copiar usando while
    companyOptions.value = []
    i = 0
    while (i < allCompanies.value.length) {
      companyOptions.value.push(allCompanies.value[i])
      i++
    }
  } catch (error) {  }
}

function filterCompanies(val, update) {
  update(() => {
    if (val === '') {
      companyOptions.value = allCompanies.value
    } else {
      const needle = val.toLowerCase()
      // Sin usar filter/includes - el backend debe filtrar
      const filtered = []
      let index = 0
      while (index < allCompanies.value.length) {
        const c = allCompanies.value[index]
        if (c && c.name) {
          // Sin usar includes - buscar substring manualmente
          const nameLower = c.name.toLowerCase()
          let nameIndex = 0
          let found = false
          while (nameIndex <= nameLower.length - needle.length && !found) {
            let matchIndex = 0
            let matches = true
            while (matchIndex < needle.length && matches) {
              if (nameLower[nameIndex + matchIndex] !== needle[matchIndex]) {
                matches = false
              }
              matchIndex++
            }
            if (matches) found = true
            nameIndex++
          }
          if (found) {
            filtered.push(c)
          }
        }
        index++
      }
      companyOptions.value = filtered
    }
  })
}

// ==================== LIFECYCLE ====================

onMounted(async () => {
  await Promise.all([
    fetchRegistrations(),
    loadModalities(),
    loadCompanies()
  ])
})
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
}

.q-table__card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
