<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">DOCUMENTOS</h1>
    </div>

    <div class="container">
      <!-- Search and Filters -->
      <div class="row items-center q-mb-md q-gutter-y-sm">
        <div class="col-12 col-md-6">
          <q-input
            v-model="searchTerm"
            dense
            outlined
            placeholder="Buscar documento..."
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
        no-data-label="No hay documentos registrados"
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
        <div class="text-h6">Detalles del Documento</div>
      </template>

      <template #body>
        <div v-if="selectedDocument" class="row q-col-gutter-lg">
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
import { useApiData } from '../../composables/useApiData'
import BackButton from '../../components/BackButton.vue'
import BotonCerrar from '../../components/BotonCerrar.vue'
import maintable from '../../components/tables/maintable.vue'
import modalComponent from '../../components/modals/modalComponent.vue'

// Composables
const notifications = useNotifications()

// Usar composable para datos
const { 
  data: documents, 
  isLoading, 
  fetchData: fetchDocuments 
} = useApiData('/documents/list', {
  showEmptyInfo: true,
  emptyMessage: 'No hay documentos registrados',
  errorMessage: 'Error al cargar documentos'
})

// State
const selectedDocument = ref(null)

// Modals
const detailsModalRef = ref(null)

// Table Filtering
// Filtrado debe hacerse en el backend - usar queryParams en fetchDocuments
const searchTerm = ref('')
// Los datos vienen filtrados del backend
const filteredItems = documents

// Status Filter
const statusFilter = ref(null)
const statusOptions = [
  { label: 'Todos los estados', value: null },
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' }
]

// Table Columns
const columns = [
  { name: 'name', align: 'left', label: 'Nombre', field: 'name', sortable: true },
  { name: 'type', align: 'left', label: 'Tipo', field: 'type', sortable: true },
  { name: 'description', align: 'left', label: 'Descripción', field: 'description', sortable: true },
  { name: 'status', align: 'center', label: 'Estado', field: 'status', sortable: true },
  { name: 'acciones', align: 'center', label: 'Acciones', field: 'acciones' }
]

// Event Handlers
function handleViewDetails(document) {
  selectedDocument.value = document
  detailsModalRef.value?.openDialog()
}

// Lifecycle
onMounted(() => {
  fetchDocuments()
})
</script>

<style lang="sass" scoped>
.container
  max-width: 1400px
  margin: 0 auto
</style>
