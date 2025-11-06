<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">REGISTROS DE ETAPA PRODUCTIVA</h1>
    </div>
    
    <div class="container">
      <div class="row items-center justify-center q-mb-md q-gutter-md">
        <div class="col-12 col-md-4">
          <q-input
            v-model="searchTerm"
            dense
            outlined
            placeholder="Buscar registro..."
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
            :options="REGISTRATION_STATUS_OPTIONS"
            emit-value
            map-options
            label="Estado"
          />
        </div>
      </div>

      <maintable
        :datos="filteredItems"
        :columnas="columns"
        row-key="_id"
        no-data-label="No hay registros de EP"
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
            {{ props.row.modality_id?.name || props.row.modality_id?.Name || props.row.modality?.name || props.row.modality || 'N/A' }}
          </q-td>
        </template>

        <template #body-cell-apprentice="props">
          <q-td :props="props">
            {{ getApprenticeName(props.row) }}
          </q-td>
        </template>

        <template #body-cell-company="props">
          <q-td :props="props">
            {{ props.row.company_id?.name || props.row.company_id?.Name || props.row.company?.name || props.row.company || 'N/A' }}
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
              flat
              round
              color="primary"
              icon="edit"
              @click="handleEdit(props.row)"
            >
              <q-tooltip>Editar observaciones</q-tooltip>
            </q-btn>
            <q-btn
              v-if="(props.row.registrationStatus || props.row.registration_status) === 3"
              flat
              round
              color="positive"
              icon="check"
              @click="handleValidate(props.row, 0)"
            >
              <q-tooltip>Aprobar registro</q-tooltip>
            </q-btn>
            <q-btn
              v-if="(props.row.registrationStatus || props.row.registration_status) === 3"
              flat
              round
              color="negative"
              icon="close"
              @click="handleValidate(props.row, 1)"
            >
              <q-tooltip>Rechazar registro</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </maintable>
    </div>

    <!-- Modal de Detalles -->
    <modalComponent
      ref="detailsModalRef"
      width="900px"
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
              <div class="text-body1 text-weight-bold">{{ selectedItem.registrationNumber || selectedItem.registration_number || 'N/A' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey-8">Aprendiz</div>
              <div class="text-body1">{{ getApprenticeName(selectedItem) }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey-8">Modalidad</div>
              <div class="text-body1">{{ selectedItem.modality_id?.name || selectedItem.modality_id?.Name || selectedItem.modality?.name || selectedItem.modality || 'N/A' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey-8">Empresa</div>
              <div class="text-body1">{{ selectedItem.company_id?.name || selectedItem.company_id?.Name || selectedItem.company?.name || selectedItem.company || 'N/A' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey-8">Fecha de Inicio</div>
              <div class="text-body1">{{ formatDate(selectedItem.scheduled_start_date || selectedItem.scheduledStartDate) }}</div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-subtitle2 text-grey-8">Total Horas Solicitadas</div>
              <div class="text-body1">{{ (selectedItem.total_requested_hours ?? selectedItem.totalRequestedHours ?? '-') }} horas</div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-subtitle2 text-grey-8">Días Laborales</div>
              <div class="text-body1">{{ selectedItem.working_days ?? selectedItem.workingDays ?? '-' }} días/semana</div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-subtitle2 text-grey-8">Horas Diarias</div>
              <div class="text-body1">{{ selectedItem.daily_hours ?? selectedItem.dailyHours ?? '-' }} horas/día</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey-8">Estado</div>
              <q-badge :color="getStatusColor(selectedItem.registration_status ?? selectedItem.registrationStatus)">
                {{ getStatusLabel(selectedItem.registration_status ?? selectedItem.registrationStatus) }}
              </q-badge>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey-8">Fecha de Registro</div>
              <div class="text-body1">{{ formatDate(selectedItem.registration_date || selectedItem.registrationDate) }}</div>
            </div>
            
            <!-- Observaciones del Aprendiz -->
            <div v-if="selectedItem.apprentice_observations?.length > 0" class="col-12">
              <div class="text-subtitle2 text-grey-8 q-mb-sm">Observaciones del Aprendiz</div>
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
              <div class="text-subtitle2 text-grey-8 q-mb-sm">Observaciones Administrativas</div>
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

    <!-- Modal de Edición (solo observaciones y estado) -->
    <modalComponent
      ref="editModalRef"
      width="700px"
      max-width="98vw"
    >
      <template #header>
        <div class="text-h6">Agregar Observación Administrativa</div>
      </template>
      <template #body>
        <q-form ref="formRef" class="q-pa-md">
          <div class="row q-col-gutter-md">
            <!-- Información del registro (solo lectura) -->
            <div class="col-12">
              <q-banner class="bg-blue-1 text-grey-8">
                <template v-slot:avatar>
                  <q-icon name="info" color="primary" />
                </template>
                <div class="text-body2">
                  <strong>Registro:</strong> {{ itemBeingEdited.registration_number }}<br>
                  <strong>Aprendiz:</strong> {{ getApprenticeName(itemBeingEdited) }}<br>
                  <strong>Modalidad:</strong> {{ itemBeingEdited.modalityName }}<br>
                  <strong>Empresa:</strong> {{ itemBeingEdited.companyName }}
                </div>
              </q-banner>
            </div>

            <!-- Nueva Observación Administrativa -->
            <div class="col-12">
              <q-input
                v-model="itemBeingEdited.admin_observations"
                label="Nueva Observación Administrativa *"
                outlined
                dense
                type="textarea"
                rows="4"
                :rules="[validation.requiredRule]"
                hint="Agrega una observación sobre este registro"
                counter
                maxlength="500"
              />
            </div>
          </div>
        </q-form>
      </template>
      <template #actions>
        <BotonCerrar @click="handleCloseDialog" />
        <BotonEnviar
          @click="handleSubmit"
          :loading="isSaving"
        />
      </template>
    </modalComponent>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { putData } from '../../services/apiClient'
import { useNotifications } from '../../composables/useNotifications'
import { useFormValidation } from '../../composables/useFormValidation'
// useTableFiltering está deprecado - el filtrado debe hacerse en el backend
import { useApiData } from '../../composables/useApiData'
import { useAuthStore } from '../../stores/authStore'
import { REGISTRATION_STATUS, REGISTRATION_STATUS_LABELS, REGISTRATION_STATUS_OPTIONS } from '../../constants/index'
import BackButton from '../../components/BackButton.vue'
import BotonEnviar from '../../components/BotonEnviar.vue'
import BotonCerrar from '../../components/BotonCerrar.vue'
import maintable from '../../components/tables/maintable.vue'
import modalComponent from '../../components/modals/modalComponent.vue'

const $q = useQuasar()
const notifications = useNotifications()
const validation = useFormValidation()
const authStore = useAuthStore()

// Usar composable para manejar los datos de registros
const { 
  data: registros, 
  isLoading, 
  fetchData: fetchRegistrations 
} = useApiData('/registrations/listRegistrations', {
  showEmptyInfo: true,
  emptyMessage: 'No hay registros de EP disponibles.',
  errorMessage: 'Error al cargar los registros'
})

const selectedItem = ref(null)
const isEditing = ref(false)
const isSaving = ref(false)
const formRef = ref(null)
const detailsModalRef = ref(null)
const editModalRef = ref(null)

const itemBeingEdited = ref({ _id: '', registration_number: '', apprentice_id: null, modality_id: '', company_id: '', modalityName: 'N/A', companyName: 'N/A', scheduled_start_date: '', total_requested_hours: 0, working_days: 5, daily_hours: 8, admin_observations: '', registration_status: 0 })

// Filtrado debe hacerse en el backend - usar queryParams en fetchRegistrations
const searchTerm = ref('')
const statusFilter = ref('all')
// Los datos vienen filtrados del backend
const filteredItems = registros

const columns = [
  { name: 'registrationNumber', label: 'Número Registro', field: 'registrationNumber', sortable: true, align: 'left' },
  { name: 'apprentice', label: 'Aprendiz', field: 'apprentice', sortable: true, align: 'left' },
  { name: 'modality', label: 'Modalidad', field: 'modality', sortable: true, align: 'left' },
  { name: 'company', label: 'Empresa', field: 'company', sortable: true, align: 'left' },
  { name: 'scheduledStartDate', label: 'Fecha Inicio', field: 'scheduledStartDate', sortable: true, align: 'center' },
  { name: 'registrationStatus', label: 'Estado', field: 'registrationStatus', sortable: true, align: 'center' },
  { name: 'opciones', label: 'Opciones', align: 'center' }
]

function getStatusLabel(status) { return REGISTRATION_STATUS_LABELS[status] || 'Desconocido' }

function getStatusColor(status) {
  const colors = { [REGISTRATION_STATUS.PENDING]: 'orange', [REGISTRATION_STATUS.REJECTED]: 'negative', [REGISTRATION_STATUS.APPROVED]: 'positive' }
  return colors[status] || 'grey'
}

function getApprenticeName(record) {
  const ap = record.apprentice_id || record.apprenticeId || record.apprentice || null
  if (!ap) return 'N/A'
  const first = ap.firstName || ap.first_name || ap.first || ''
  const last = ap.lastName || ap.last_name || ap.last || ''
  const full = `${first} ${last}`.trim()
  if (full) return full
  // fallback to a single name field
  return ap.name || ap.nombre || 'N/A'
}

function formatDate(date) {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function handleViewDetails(record) { selectedItem.value = record; detailsModalRef.value?.openDialog() }

function handleEdit(record) {
  isEditing.value = true
  itemBeingEdited.value = {
    _id: record._id || '',
    registration_number: record.registration_number || '',
    apprentice_id: record.apprentice_id || null,
    modality_id: record.modality_id?._id || '',
    company_id: record.company_id?._id || '',
    modalityName: record.modality_id?.name || 'N/A',
    companyName: record.company_id?.name || 'N/A',
  scheduled_start_date: record.scheduled_start_date ? (record.scheduled_start_date.split('T')[0]) : (record.scheduledStartDate ? (record.scheduledStartDate.split('T')[0]) : ''),
  total_requested_hours: record.total_requested_hours ?? 0,
  working_days: record.working_days ?? 5,
  daily_hours: record.daily_hours ?? 8,
    admin_observations: '',
  registration_status: record.registration_status ?? 0
  }
  editModalRef.value?.openDialog()
}

function handleCloseDialog() { editModalRef.value?.closeDialog(); if (formRef.value) { formRef.value.resetValidation() } }

async function handleSubmit() {
  const isValid = await formRef.value.validate()
  if (!isValid) { notifications.error('Por favor complete todos los campos correctamente'); return }
  await updateRegistration()
}

async function updateRegistration() {
  try {
    isSaving.value = true
    const updateData = { admin_observations: itemBeingEdited.value.admin_observations }
    await putData(`/registrations/updateRegistration/${itemBeingEdited.value._id}`, updateData)
    notifications.success('Observación agregada exitosamente')
    editModalRef.value?.closeDialog()
    if (formRef.value) { formRef.value.resetValidation() }
    await fetchRegistrations()
  } catch (error) {
    notifications.error(error.response?.data?.message || error.response?.data?.msg || error?.message || 'Error al actualizar el registro')
  } finally { isSaving.value = false }
}

async function handleValidate(record, newStatus) {
  const statusText = newStatus === 0 ? 'aprobar' : 'rechazar'
  const confirmMessage = newStatus === 0 ? '¿Estás seguro de aprobar este registro de etapa productiva?' : '¿Estás seguro de rechazar este registro de etapa productiva?'
  
  if (!$q || !$q.dialog) {
    if (!confirm(confirmMessage)) return
    
    try {
      isLoading.value = true
      const validationData = { registration_status: newStatus, admin_observations: newStatus === 0 ? 'Documentos completos y verificados' : 'Faltan documentos requeridos' }
      await putData(`/registrations/validateRegistration/${record._id}`, validationData)
      notifications.success(`Registro ${statusText === 'aprobar' ? 'aprobado' : 'rechazado'} exitosamente`)
      await fetchRegistrations()
    } catch (error) {
      notifications.error(error.response?.data?.message || error.response?.data?.msg || error?.message || 'Error al validar el registro')
    } finally { isLoading.value = false }
    return
  }
  
  $q.dialog({
    title: `¿Confirmar ${statusText} registro?`,
    message: confirmMessage,
    cancel: { label: 'Cancelar', color: 'negative', flat: true },
    ok: { label: 'Confirmar', color: 'primary' },
    persistent: true
  }).onOk(async () => {
    try {
      isLoading.value = true
      const validationData = { registration_status: newStatus, admin_observations: newStatus === 0 ? 'Documentos completos y verificados' : 'Faltan documentos requeridos' }
      await putData(`/registrations/validateRegistration/${record._id}`, validationData)
      notifications.success(`Registro ${statusText === 'aprobar' ? 'aprobado' : 'rechazado'} exitosamente`)
      await fetchRegistrations()
    } catch (error) {
      notifications.error(error.response?.data?.message || error.response?.data?.msg || error?.message || 'Error al validar el registro')
    } finally { isLoading.value = false }
  })
}

onMounted(async () => { await fetchRegistrations() })
</script>

<style scoped>
.container { max-width: 1600px; margin: 0 auto; }
.q-table__card { box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
</style>
