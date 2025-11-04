<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">VISTA DOCUMENTOS</h1>
    </div>

    <div class="container">
      <!-- Fiche Banner -->
      <div class="fiche-banner q-mb-md">
        <h2 class="fiche-title">Ficha {{ ficheNumber }}</h2>
      </div>

      <!-- Filter Button -->
      <div class="row q-mb-md">
        <div class="col-12 text-right">
          <BotonIngresar
            label="Filtrar"
            icon="filter_list"
            @click="handleOpenFilterDialog"
          />
        </div>
      </div>

      <!-- Table -->
      <maintable
        :datos="filteredApprentices"
        :columnas="columns"
        row-key="_id"
        no-data-label="No hay aprendices para mostrar"
        :rows-per-page-options="[8, 10, 20, 50]"
        :initial-rows-per-page="8"
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <span
              class="status-badge"
              :class="props.row.status === 'Completado' ? 'status-complete' : 'status-incomplete'"
            >
              {{ props.row.status }}
            </span>
          </q-td>
        </template>

        <template #body-cell-documentos="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              color="primary"
              label="Ver documentos"
              @click="handleViewDocuments(props.row)"
            />
          </q-td>
        </template>
      </maintable>
    </div>

    <!-- Filter Modal -->
    <modalComponent
      ref="filterModalRef"
      width="500px"
      max-width="90vw"
    >
      <template #header>
        <div class="text-h6">Filtrar Aprendices</div>
      </template>

      <template #body>
        <div class="q-pa-md">
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
            class="q-mb-md"
          />
        </div>
      </template>

      <template #footer>
        <BotonCerrar label="Cancelar" @click="filterModalRef?.closeDialog()" />
        <BotonEnviar
          label="Aplicar Filtros"
          @click="handleApplyFilters"
        />
      </template>
    </modalComponent>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiClient } from '../../services/apiClient'
import { useNotifications } from '../../composables/useNotifications'
// useTableFiltering está deprecado - el filtrado debe hacerse en el backend
import BackButton from '../../components/BackButton.vue'
import BotonIngresar from '../../components/BotonIngresar.vue'
import BotonCerrar from '../../components/BotonCerrar.vue'
import BotonEnviar from '../../components/BotonEnviar.vue'
import maintable from '../../components/tables/maintable.vue'
import modalComponent from '../../components/modals/modalComponent.vue'

const router = useRouter()
const route = useRoute()

// Composables
const notifications = useNotifications()

// State
const isLoading = ref(false)
const apprentices = ref([])
const ficheNumber = ref('')

// Modals
const filterModalRef = ref(null)

// Filters
const statusFilter = ref(null)
const statusOptions = [
  { label: 'Todos los estados', value: null },
  { label: 'Completado', value: 'Completado' },
  { label: 'Incompleto', value: 'Incompleto' }
]

// Filtrado debe hacerse en el backend - usar queryParams
const searchTerm = ref('')
// Los datos vienen filtrados del backend
const baseFilteredItems = apprentices

// Sin usar filter - el backend debe filtrar por status
const filteredApprentices = computed(() => {
  // El backend debe devolver los datos ya filtrados por status
  return baseFilteredItems.value
})

// Table Columns
const columns = [
  { name: 'document', align: 'left', label: 'Documento', field: 'document', sortable: true },
  { name: 'name', align: 'left', label: 'Nombre', field: 'name', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'status', align: 'center', label: 'Estado', field: 'status', sortable: true },
  { name: 'documentos', align: 'center', label: 'Documentos', field: 'documentos' }
]

// API Functions
async function fetchApprentices() {
  isLoading.value = true
  try {
    // TODO: Replace with actual endpoint
    // const response = await apiClient.get(`/documents/list?fiche=${ficheNumber.value}`)
    // apprentices.value = response.data || []
    
    // Placeholder
    apprentices.value = []
  } catch (error) {    const errorMsg = error.response?.data?.message 
      || error.response?.data?.msg 
      || error.message 
      || 'Error al cargar los aprendices'
    notifications.error(errorMsg)
    apprentices.value = []
  } finally {
    isLoading.value = false
  }
}

// Event Handlers
function handleOpenFilterDialog() {
  filterModalRef.value?.openDialog()
}

function handleApplyFilters() {
  filterModalRef.value?.closeDialog()
  // Filters are applied automatically via computed property
}

function handleViewDocuments(apprentice) {
  router.push(`/app/admin/documentos/${ficheNumber.value}/aprendiz/${apprentice._id}`)
}

// Lifecycle
onMounted(() => {
  ficheNumber.value = route.params.ficha || route.query.ficha || ''
  if (ficheNumber.value) {
    fetchApprentices()
  } else {
    notifications.warning('No se encontró el número de ficha en la URL')
  }
})
</script>

<style lang="sass" scoped>
.container
  max-width: 1400px
  margin: 0 auto

.fiche-banner
  background: var(--color-secondary)
  color: white
  padding: 20px
  border-radius: 8px
  text-align: center

.fiche-title
  margin: 0
  font-size: 24px
  font-weight: 600
  color: white

.status-badge
  padding: 4px 12px
  border-radius: 12px
  font-size: 13px
  font-weight: 600

.status-complete
  background-color: #e8f5e9
  color: #2e7d32

.status-incomplete
  background-color: #fff3e0
  color: #e65100
</style>
