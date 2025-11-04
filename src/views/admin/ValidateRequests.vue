<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">VALIDAR SOLICITUDES</h1>
    </div>

    <div class="container">
      <!-- Search and Filters -->
      <div class="row items-center q-mb-md q-gutter-y-sm">
        <div class="col-12 col-md-6">
          <q-input
            v-model="searchTerm"
            dense
            outlined
            placeholder="Buscar solicitud..."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
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
      </div>

      <!-- Table -->
      <maintable
        :datos="filteredItems"
        :columnas="columns"
        row-key="_id"
        no-data-label="No hay solicitudes registradas"
        :rows-per-page-options="[10, 20, 50]"
        :initial-rows-per-page="10"
      >
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
      width="1200px"
      max-width="98vw"
    >
      <template #header>
        <div class="text-h6">Detalles de la Solicitud</div>
      </template>

      <template #body>
        <div v-if="selectedRequest" class="row q-col-gutter-lg">
          <!-- Details content here -->
        </div>
      </template>

      <template #footer>
        <BotonCerrar @click="detailsModalRef?.closeDialog()" />
      </template>
    </modalComponent>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { apiClient } from '../../services/apiClient'
import { useNotifications } from '../../composables/useNotifications'
// useTableFiltering está deprecado - el filtrado debe hacerse en el backend
import BackButton from '../../components/BackButton.vue'
import BotonCerrar from '../../components/BotonCerrar.vue'
import maintable from '../../components/tables/maintable.vue'
import modalComponent from '../../components/modals/modalComponent.vue'

// Composables
const notifications = useNotifications()

// State
const isLoading = ref(false)
const requests = ref([])
const selectedRequest = ref(null)

// Modals
const detailsModalRef = ref(null)

// Filtrado debe hacerse en el backend - usar queryParams
const searchTerm = ref('')
// Los datos vienen filtrados del backend
const filteredItems = requests

// Status Filter
const statusFilter = ref(null)
const statusOptions = [
  { label: 'Todos los estados', value: null },
  { label: 'Pendiente', value: 'pending' },
  { label: 'Aprobada', value: 'approved' },
  { label: 'Rechazada', value: 'rejected' }
]

// Table Columns
const columns = [
  { name: 'applicant', align: 'left', label: 'Solicitante', field: 'applicant', sortable: true },
  { name: 'type', align: 'left', label: 'Tipo', field: 'type', sortable: true },
  { name: 'description', align: 'left', label: 'Descripción', field: 'description', sortable: true },
  { name: 'status', align: 'center', label: 'Estado', field: 'status', sortable: true },
  { name: 'date', align: 'center', label: 'Fecha', field: 'date', sortable: true },
  { name: 'acciones', align: 'center', label: 'Acciones', field: 'acciones' }
]

// API Functions
async function fetchRequests() {
  isLoading.value = true
  try {
    // TODO: Replace with actual endpoint
    // const response = await apiClient.get('/requests/list')
    // requests.value = response.data || []
    
    // Placeholder
    requests.value = []
  } catch (error) {    const errorMsg = error.response?.data?.message 
      || error.response?.data?.msg 
      || error.message 
      || 'Error al cargar las solicitudes'
    notifications.error(errorMsg)
    requests.value = []
  } finally {
    isLoading.value = false
  }
}

// Event Handlers
function handleViewDetails(request) {
  selectedRequest.value = request
  detailsModalRef.value?.openDialog()
}

// Lifecycle
onMounted(() => {
  fetchRequests()
})
</script>

<style lang="sass" scoped>
.container
  max-width: 1400px
  margin: 0 auto
</style>
