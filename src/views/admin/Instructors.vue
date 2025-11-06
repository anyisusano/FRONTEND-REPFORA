
<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md instructors-title">INSTRUCTORES</h1>
    </div>

    <!-- Stats Cards -->
    <div class="stats-container">
      <div class="stats-grid">
        <StatsCard
          v-for="(stat, index) in stats"
          :key="index"
          :title="stat.title"
          :value="stat.value"
          class="stat-card"
        />
      </div>
    </div>

    <div class="container">
      <!-- Search and Filters -->
      <div class="row items-center q-mb-md q-gutter-y-sm">
        <div class="col-12 col-sm-12 col-md-4">
          <q-input
            v-model="searchTerm"
            dense
            outlined
            placeholder="Buscar instructor..."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <q-select
            v-model="statusFilter"
            :options="statusOptions"
            label="Estado"
            outlined
            dense
            clearable
            emit-value
            map-options
            option-label="label"
            option-value="value"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <q-select
            v-model="programFilter"
            :options="programOptions"
            label="Programa"
            outlined
            dense
            clearable
            emit-value
            map-options
            option-label="label"
            option-value="value"
          />
        </div>
      </div>

      <!-- Table -->
      <maintable
        :datos="filteredItems"
        :columnas="columns"
        row-key="_id"
        no-data-label="No hay instructores registrados"
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

        <template #body-cell-acciones="props">
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
          </q-td>
        </template>
      </maintable>
    </div>

    <!-- Modal de Detalles -->
    <modalComponent
      ref="detailsModalRef"
      class="details-modal"
    >
      <template #header>
        <div class="text-h6 text-center text-md-left modal-header">Perfil de Instructor</div>
      </template>

      <template #body>
        <div v-if="selectedInstructor" class="modal-content-wrapper">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md section-title">Información Personal</div>
              <div class="data-grid">
                <div class="data-row">
                  <div class="text-weight-bold">Nombre:</div>
                  <div class="data-value">{{ selectedInstructor.name || '-' }}</div>
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Documento:</div>
                  <div class="data-value">{{ selectedInstructor.numdocument || '-' }}</div>
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Email:</div>
                  <div class="data-value text-break">{{ selectedInstructor.email || '-' }}</div>
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Teléfono:</div>
                  <div class="data-value">{{ selectedInstructor.phone || '-' }}</div>
                </div>
              </div>

              <div class="text-h6 q-mb-md q-mt-lg section-title">Estado</div>
              <div class="data-grid">
                <div class="data-row">
                  <div class="text-weight-bold">Estado:</div>
                  <div class="data-value">
                    <q-badge :color="getStatusColor(selectedInstructor.status)">
                      {{ getStatusLabel(selectedInstructor.status) }}
                    </q-badge>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md section-title">Información Académica</div>
              <div class="data-grid">
                <div class="data-row">
                  <div class="text-weight-bold">Programa:</div>
                  <div class="data-value">{{ selectedInstructor.thematicarea || '-' }}</div>
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Aprendices Asignados:</div>
                  <div class="data-value">{{ selectedInstructor.apprentices?.length || 0 }}</div>
                </div>
              </div>

              <div class="text-h6 q-mb-md q-mt-lg section-title">Horas de Trabajo</div>
              <div class="data-grid">
                <div class="data-row">
                  <div class="text-weight-bold">Horas Acumuladas:</div>
                  <div class="data-value hours-highlight">{{ Math.round(selectedInstructor.hourswork || 0) }}</div>
                </div>
              </div>

              <div class="text-h6 q-mb-md q-mt-lg section-title">Pagar Horas</div>
              <q-input
                v-model.number="hoursToPay"
                outlined
                dense
                type="number"
                label="Cantidad de horas"
                :placeholder="getHoursPlaceholder(selectedInstructor.hourswork)"
                :disable="(selectedInstructor.hourswork || 0) <= 0"
                :min="0"
                :max="Math.round(selectedInstructor.hourswork || 0)"
                class="q-mb-md"
                :rules="getHoursRules(selectedInstructor.hourswork)"
              />
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-wrapper">
          <div class="row q-gutter-sm justify-center justify-md-end">
            <div class="col-12 col-sm-auto">
              <BotonCerrar 
                label="Cancelar" 
                @click="handleCloseDetails" 
                class="full-width-sm-auto"
              />
            </div>
            <div class="col-12 col-sm-auto">
              <BotonEnviar
                label="Confirmar Pago"
                @click="handleOpenConfirmation"
                :disable="!isHoursToPayValid"
                class="full-width-sm-auto"
              />
            </div>
          </div>
        </div>
      </template>
    </modalComponent>

    <!-- Modal de Confirmación -->
    <modalComponent
      ref="confirmationModalRef"
      class="confirmation-modal"
    >
      <template #header>
        <div class="text-h6 text-center text-md-left modal-header">Confirmación de Pago</div>
      </template>

      <template #body>
        <div class="q-pa-md confirmation-body">
          <p class="confirmation-text">
            ¿Estás seguro de pagar <strong>{{ hoursToPay }} horas</strong> al instructor
            <strong>{{ selectedInstructor?.name }}</strong>?
          </p>
          <p class="confirmation-text">
            Quedarían <strong>{{ getRemainingHours(selectedInstructor?.hourswork, hoursToPay) }} horas</strong> pendientes por pagar.
          </p>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-wrapper">
          <div class="row q-gutter-sm justify-center justify-md-end">
            <div class="col-12 col-sm-auto">
              <BotonCerrar 
                label="Cancelar" 
                @click="handleCloseConfirmation" 
                class="full-width-sm-auto"
              />
            </div>
            <div class="col-12 col-sm-auto">
              <BotonEnviar
                label="Confirmar"
                @click="handleConfirmPayment"
                :loading="isProcessingPayment"
                class="full-width-sm-auto"
              />
            </div>
          </div>
        </div>
      </template>
    </modalComponent>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getData } from '../../services/apiClient'
import { useNotifications } from '../../composables/useNotifications'
import { useTableFiltering } from '../../composables/useTableFiltering'
import { STATUS } from '../../constants'
import BackButton from '../../components/BackButton.vue'
import StatsCard from '../../components/cards/StatsCard.vue'
import BotonCerrar from '../../components/BotonCerrar.vue'
import BotonEnviar from '../../components/BotonEnviar.vue'
import maintable from '../../components/tables/maintable.vue'
import modalComponent from '../../components/modals/modalComponent.vue'

// Composables
const notifications = useNotifications()

// State
const isLoading = ref(false)
const error = ref(null)
const isProcessingPayment = ref(false)
const instructors = ref([])
const apprentices = ref([])
const stats = ref([
  { title: 'TOTAL INSTRUCTORES', value: 0 },
  { title: 'INSTRUCTORES ACTIVOS', value: 0 },
  { title: 'APRENDICES ASIGNADOS', value: 0 },
  { title: 'CONTRATO TERMINADO', value: 0 }
])
const selectedInstructor = ref(null)
const hoursToPay = ref(0)

// Modals
const detailsModalRef = ref(null)
const confirmationModalRef = ref(null)

// Filters
const statusFilter = ref(null)
const programFilter = ref(null)
const statusOptions = ref([
  { label: 'Todos los estados', value: null },
  { label: 'Activo', value: STATUS.ACTIVE },
  { label: 'Inactivo', value: STATUS.INACTIVE }
])
const programOptions = ref([{ label: 'Todos los programas', value: null }])

// Table Filtering
const { searchTerm, filteredItems: baseFilteredItems } = useTableFiltering(
  instructors,
  ['name', 'numdocument', 'email', 'thematicarea']
)

// Computed filtered items with custom filters
const filteredItems = computed(() => {
  let result = []
  // Copiar baseFilteredItems manualmente
  let i = 0
  while (i < baseFilteredItems.value.length) {
    result.push(baseFilteredItems.value[i])
    i++
  }

  if (statusFilter.value !== null && statusFilter.value !== undefined) {
    const filtered = []
    i = 0
    while (i < result.length) {
      if (result[i].status === statusFilter.value) {
        filtered.push(result[i])
      }
      i++
    }
    result = filtered
  }

  if (programFilter.value) {
    const filtered = []
    i = 0
    while (i < result.length) {
      if (result[i].thematicarea === programFilter.value) {
        filtered.push(result[i])
      }
      i++
    }
    result = filtered
  }

  return result
})

// Computed for hours validation
const isHoursToPayValid = computed(() => {
  const maxHours = Math.round(selectedInstructor.value?.hourswork || 0)
  return hoursToPay.value > 0 && hoursToPay.value <= maxHours
})

// Table Columns
const columns = [
  { name: 'numdocument', align: 'left', label: 'Cédula', field: 'numdocument', sortable: true },
  { name: 'name', align: 'left', label: 'Nombre', field: 'name', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'thematicarea', align: 'left', label: 'Programa', field: 'thematicarea', sortable: true },
  { name: 'apprentices', align: 'center', label: 'Aprendices', field: row => row.apprentices?.length || 0, sortable: true },
  { name: 'status', align: 'center', label: 'Estado', field: 'status' },
  { name: 'acciones', align: 'center', label: 'Acciones', field: 'acciones' }
]

// Helper Functions
function getStatusLabel(status) {
  return status === STATUS.ACTIVE ? 'Activo' : 'Inactivo'
}

function getStatusColor(status) {
  return status === STATUS.ACTIVE ? 'positive' : 'negative'
}

function getHoursPlaceholder(hourswork) {
  return (hourswork || 0) > 0 ? 'Ingrese cantidad a pagar' : 'Ya pagaste todas las horas'
}

function getHoursRules(hourswork) {
  const maxHours = Math.round(hourswork || 0)
  return [
    val => val >= 0 || 'La cantidad debe ser positiva',
    val => val <= maxHours || 'No puedes pagar más horas de las acumuladas'
  ]
}

function getRemainingHours(hourswork, hoursToPay) {
  return Math.max(0, Math.round(hourswork || 0) - hoursToPay)
}

// API Functions
async function fetchInstructors() {
  isLoading.value = true
  error.value = null

  try {
    const response = await getData('/instructors/listInstructor')
    const msg = response?.msg

    const instructorsArray = Array.isArray(msg)
      ? msg
      : (msg?.instructores || msg?.instructors || msg?.list || [])

    const apprenticesArray = msg?.aprendices || msg?.apprentices || []

    instructors.value = instructorsArray
    apprentices.value = Array.isArray(apprenticesArray) ? apprenticesArray : []

    generateFilterOptions()
    updateStats(instructorsArray, apprenticesArray)
  } catch (err) {
    console.error('Error al cargar instructores:', err)
    const errorMsg = err.response?.data?.msg || err.message || 'Error al cargar instructores'
    error.value = errorMsg
    notifications.error(errorMsg)
  } finally {
    isLoading.value = false
  }
}

function generateFilterOptions() {
  const uniquePrograms = []
  
  let i = 0
  while (i < instructors.value.length) {
    const program = instructors.value[i].thematicarea
    if (program) {
      // Verificar si el programa ya está en uniquePrograms usando while
      let found = false
      let j = 0
      while (j < uniquePrograms.length) {
        if (uniquePrograms[j] === program) {
          found = true
          break
        }
        j++
      }
      if (!found) {
        uniquePrograms.push(program)
      }
    }
    i++
  }

  programOptions.value = [{ label: 'Todos los programas', value: null }]
  for (let i = 0; i < uniquePrograms.length; i++) {
    programOptions.value.push({ label: uniquePrograms[i], value: uniquePrograms[i] })
  }
}

function updateStats(instructorsArray, apprenticesArray) {
  let activeCount = 0
  let terminatedCount = 0

  for (let i = 0; i < instructorsArray.length; i++) {
    if (instructorsArray[i].status === STATUS.ACTIVE) {
      activeCount++
    }
    const bindingtype = (instructorsArray[i].bindingtype || '').toLowerCase()
    // Verificar si contiene 'contrato terminado' usando while
    const searchTerm = 'contrato terminado'
    let found = false
    let j = 0
    while (j <= bindingtype.length - searchTerm.length) {
      let match = true
      let k = 0
      while (k < searchTerm.length) {
        if (bindingtype[j + k] !== searchTerm[k]) {
          match = false
          break
        }
        k++
      }
      if (match) {
        found = true
        break
      }
      j++
    }
    if (found) {
      terminatedCount++
    }
  }

  stats.value = [
    { title: 'TOTAL INSTRUCTORES', value: instructorsArray.length },
    { title: 'INSTRUCTORES ACTIVOS', value: activeCount },
    { title: 'APRENDICES ASIGNADOS', value: apprenticesArray.length },
    { title: 'CONTRATO TERMINADO', value: terminatedCount }
  ]
}

// Event Handlers
function handleViewDetails(instructor) {
  selectedInstructor.value = instructor
  hoursToPay.value = 0
  detailsModalRef.value?.openDialog()
}

function handleCloseDetails() {
  detailsModalRef.value?.closeDialog()
  hoursToPay.value = 0
}

function handleOpenConfirmation() {
  const maxHours = Math.round(selectedInstructor.value?.hourswork || 0)
  
  if (hoursToPay.value > 0 && hoursToPay.value <= maxHours) {
    confirmationModalRef.value?.openDialog()
  } else {
    notifications.error('Por favor ingresa una cantidad válida de horas a pagar')
  }
}

function handleCloseConfirmation() {
  confirmationModalRef.value?.closeDialog()
}

async function handleConfirmPayment() {
  if (!selectedInstructor.value || hoursToPay.value <= 0) {
    notifications.error('Por favor verifica la cantidad de horas a pagar')
    return
  }

  isProcessingPayment.value = true

  try {
    const remainingHours = getRemainingHours(selectedInstructor.value.hourswork, hoursToPay.value)

    // TODO: Uncomment when backend endpoint is ready
    // await apiClient.put(`/instructors/updateInstructor/${selectedInstructor.value._id}`, {
    //   hourswork: remainingHours
    // })

    selectedInstructor.value.hourswork = remainingHours

    // Buscar índice usando while
    let instructorIndex = -1
    let idx = 0
    while (idx < instructors.value.length) {
      if (instructors.value[idx]._id === selectedInstructor.value._id) {
        instructorIndex = idx
        break
      }
      idx++
    }

    if (instructorIndex !== -1) {
      instructors.value[instructorIndex] = {
        ...instructors.value[instructorIndex],
        hourswork: remainingHours
      }
    }

    notifications.success(`Pago exitoso! Se pagaron ${hoursToPay.value} horas`)

    handleCloseConfirmation()
    setTimeout(() => handleCloseDetails(), 300)
  } catch (err) {
    console.error('Error al procesar el pago:', err)
    const errorMsg = err.response?.data?.msg || err.response?.data?.message || 'Error al procesar el pago'
    notifications.error(errorMsg)
  } finally {
    isProcessingPayment.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchInstructors()
})
</script>

<style lang="sass" scoped>
.container
  max-width: 1400px
  margin: 0 auto

// Title style
.instructors-title
  font-size: 3.5rem

@media (max-width: 500px)
  .instructors-title
    font-size: 2.5rem

// Stats Container
.stats-container
  padding: 20px 50px
  width: 100%
  margin-bottom: 40px
  border-radius: 8px

@media (max-width: 768px)
  .stats-container
    padding: 15px 20px
    margin-bottom: 30px

@media (max-width: 480px)
  .stats-container
    padding: 10px 15px
    margin-bottom: 20px

// Stats Grid
.stats-grid
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))
  gap: 20px
  justify-items: center
  align-items: stretch

@media (max-width: 600px)
  .stats-grid
    grid-template-columns: 1fr
    gap: 15px

@media (min-width: 601px) and (max-width: 900px)
  .stats-grid
    grid-template-columns: repeat(2, 1fr)
    gap: 18px

.stat-card
  width: 100%
  height: 100%
  min-height: 120px
  transition: transform 0.2s ease

.stat-card:hover
  transform: translateY(-5px)


.modal-content-wrapper
  padding: 20px
  // ELIMINADO: max-height y overflow-y para quitar el scroll completamente

@media (max-width: 768px)
  .modal-content-wrapper
    padding: 15px

@media (max-width: 480px)
  .modal-content-wrapper
    padding: 10px

.modal-footer-wrapper
  padding: 20px
  border-top: 1px solid #e0e0e0

@media (max-width: 768px)
  .modal-footer-wrapper
    padding: 15px

@media (max-width: 480px)
  .modal-footer-wrapper
    padding: 10px

.modal-header
  font-size: 1.25rem

@media (max-width: 768px)
  .modal-header
    font-size: 1.1rem

@media (max-width: 480px)
  .modal-header
    font-size: 1rem

.section-title
  color: #39a900
  font-weight: 600
  font-size: 1.3rem
  margin-bottom: 20px
  padding-left: 8px
  border-left: 4px solid #39a900

@media (max-width: 768px)
  .section-title
    font-size: 1.2rem
    margin-bottom: 15px

@media (max-width: 480px)
  .section-title
    font-size: 1.1rem !important
    margin-bottom: 12px

.data-grid
  display: grid
  gap: 16px
  background-color: white
  padding: 20px
  border-radius: 8px
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)

@media (max-width: 768px)
  .data-grid
    gap: 12px
    padding: 15px

@media (max-width: 480px)
  .data-grid
    gap: 10px
    padding: 12px

.data-row
  display: grid
  gap: 16px
  align-items: center

// Desktop layout (2 columns)
@media (min-width: 768px)
  .data-row
    grid-template-columns: 180px 1fr

// Mobile layout (1 column)
@media (max-width: 767px)
  .data-row
    grid-template-columns: 1fr
    gap: 8px

  .data-row .text-weight-bold
    margin-bottom: 4px

.text-weight-bold
  color: #2c3e50
  font-size: 2.5rem
  font-weight: 600

@media (max-width: 768px)
  .text-weight-bold
    font-size: 1.8rem

@media (max-width: 480px)
  .text-weight-bold
    font-size: 1.8rem

.data-value
  color: #34495e
  font-size: 0.95rem

@media (max-width: 768px)
  .data-value
    font-size: 0.9rem

@media (max-width: 480px)
  .data-value
    font-size: 0.85rem

.text-break
  word-break: break-all
  word-wrap: break-word

.hours-highlight
  font-size: 1.5rem
  font-weight: bold
  color: #39a900

@media (max-width: 768px)
  .hours-highlight
    font-size: 1.3rem

@media (max-width: 480px)
  .hours-highlight
    font-size: 1.2rem

.confirmation-body
  text-align: center

.confirmation-text
  font-size: 16px
  margin-bottom: 15px
  line-height: 1.5
  color: #333

@media (max-width: 768px)
  .confirmation-text
    font-size: 15px
    margin-bottom: 12px

@media (max-width: 480px)
  .confirmation-text
    font-size: 14px
    margin-bottom: 10px

// Button responsiveness
.full-width-sm-auto
  @media (max-width: 767px)
    width: 100%


:deep(.details-modal)
  .q-dialog
    .q-dialog__inner
      @media (min-width: 1200px)
        .q-card
          width: 1200px !important
          max-width: 90vw !important
      
      @media (min-width: 992px) and (max-width: 1199px)
        .q-card
          width: 95vw !important
          max-width: 1100px !important
      
      @media (min-width: 768px) and (max-width: 991px)
        .q-card
          width: 95vw !important
          max-width: 900px !important
      
      @media (min-width: 481px) and (max-width: 767px)
        .q-card
          width: 95vw !important
          max-width: 700px !important
      
      @media (max-width: 480px)
        .q-card
          width: 98vw !important
          max-width: 98vw !important
          margin: 0 !important

:deep(.confirmation-modal)
  .q-dialog
    .q-dialog__inner
      @media (min-width: 768px)
        .q-card
          width: 600px !important
          max-width: 80vw !important
      
      @media (max-width: 767px)
        .q-card
          width: 95vw !important
          max-width: 95vw !important
          margin: 0 !important
      
      @media (max-width: 480px)
        .q-card
          width: 98vw !important
          max-width: 98vw !important
          margin: 0 !important


:deep(.q-dialog)
  @media (max-width: 767px)
    .q-dialog__inner
      padding: 16px

    .q-card
      margin: 0
      
  @media (max-width: 480px)
    .q-dialog__inner
      padding: 12px

// Filter responsiveness
@media (max-width: 599px)
  .row.items-center.q-mb-md.q-gutter-y-sm
    .col-12
      margin-bottom: 12px

// Table responsiveness
@media (max-width: 768px)
  :deep(.q-table)
    font-size: 0.85rem

    .q-table th,
    .q-table td
      padding: 8px 4px

@media (max-width: 480px)
  :deep(.q-table)
    font-size: 0.8rem

    .q-table th,
    .q-table td
      padding: 6px 3px

</style>