<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">NOVEDADES</h1>
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

    <div class="text-center q-mb-md">
      <p class="text-body2 text-grey-7">
        Las novedades tienen un plazo máximo de 15 días hábiles para ser resueltas
      </p>
    </div>

    <!-- Vista de Urgentes -->
   <!-- Vista de Urgentes -->
<div v-if="!showTable" class="urgent-cards-container">
  <div class="urgent-title">Novedades Urgentes</div>
  <div class="urgent-cards-grid">
    <CardNovedades
      v-for="news in urgentNews"
      :key="news._id || news.id || Math.random()"
      :novedades="[news]"
      :loading="isLoading"
      :error-message="errorMessage"
      @clear-error="errorMessage = ''"
    />
  </div>
  <div class="text-center q-mt-xl">
    <BotonIngresar
      label="Ver todas las novedades"
      @click="showTable = true"
    />
  </div>
</div>

    <!-- Vista de Tabla -->
    <div v-else class="container">
      <div class="row items-center q-mb-md q-gutter-y-sm">
        <div class="col-12 col-md-8">
          <q-input
            v-model="searchTerm"
            dense
            outlined
            placeholder="Buscar novedad..."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-4 text-right">
          <BotonIngresar
            label="Volver a novedades urgentes"
            @click="showTable = false"
          />
        </div>
      </div>

      <maintable
        :datos="filteredItems"
        :columnas="columns"
        row-key="_id"
        no-data-label="No hay novedades registradas"
        :rows-per-page-options="[10, 20, 50]"
        :initial-rows-per-page="10"
      >
        <template #body-cell-acciones="props">
          <q-td :props="props" class="q-gutter-sm">
            <q-btn
              flat
              round
              color="primary"
              icon="visibility"
              @click="handleViewDetails(props.row._raw || props.row)"
            >
              <q-tooltip>Ver detalles</q-tooltip>
            </q-btn>

            <!-- estado eliminado: solo mostrar botón ojo -->
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
        <div class="text-h6">Detalles de la Novedad</div>
      </template>

      <template #body>
        <div v-if="selectedNews" class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <div class="text-h6 q-mb-md section-title">Información del Aprendiz</div>
            <div class="data-grid">
              <div class="data-row">
                <div class="text-weight-bold">Nombre:</div>
                <div class="data-value">{{ selectedNews.name || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Documento:</div>
                <div class="data-value">{{ selectedNews.tpdocument ? `${selectedNews.tpdocument} ${selectedNews.document || ''}`.trim() : (selectedNews.document || '-') }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Ficha:</div>
                <div class="data-value">{{ selectedNews.fiche?.number || selectedNews.code || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Programa:</div>
                <div class="data-value">{{ selectedNews.fiche?.program?.name || selectedNews.fiche?.program?.code || selectedNews.coordination?.name || '-' }}</div>
              </div>
            </div>

            <div class="text-h6 q-mb-md section-title q-mt-lg">Descripción de la Novedad</div>
            <div class="data-grid">
              <div class="data-row">
                <div class="text-weight-bold">Tipo:</div>
                <div class="data-value">{{ selectedNews.tpnew || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Subtipo:</div>
                <div class="data-value">{{ selectedNews.subtype || selectedNews.typetransfer || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Causa:</div>
                <div class="data-value">{{ selectedNews.cause || selectedNews.description || selectedNews.descripcion || 'Sin descripción' }}</div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="text-h6 q-mb-md section-title">Estado y Seguimiento</div>
            <div class="data-grid">
              <div class="data-row">
                <div class="text-weight-bold">Estado:</div>
                <div class="data-value">{{ selectedNews.state || (selectedNews.status !== undefined ? String(selectedNews.status) : '-') }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Procesado:</div>
                <div class="data-value">{{ selectedNews.processed ? 'Sí' : 'No' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Instructor:</div>
                <div class="data-value">
                  <!-- Cambiado: mostrar fiche.owner.name > owner.name > instructor existente -->
                  <template v-if="selectedNews.fiche?.owner?.name">
                    {{ selectedNews.fiche.owner.name }}
                  </template>
                  <template v-else-if="selectedNews.owner?.name">
                    {{ selectedNews.owner.name }}
                  </template>
                  <template v-else-if="selectedNews.instructor">
                    <template v-if="typeof selectedNews.instructor === 'object'">
                      {{ selectedNews.instructor.name || selectedNews.instructor.Name || selectedNews.instructor._id || '-' }}
                    </template>
                    <template v-else>
                      {{ instructorMap[String(selectedNews.instructor)] || selectedNews.instructor }}
                    </template>
                  </template>
                  <template v-else>-</template>
                </div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Tiempo transcurrido:</div>
                <div class="data-value">{{ getElapsedTime(selectedNews.createdAt || selectedNews.datesofia) }}</div>
              </div>
            </div>

            <div v-if="selectedNews.respuestas?.length" class="text-h6 q-mb-md section-title q-mt-lg">
              Respuestas
            </div>
            <div v-if="selectedNews.respuestas?.length" class="data-grid">
              <div v-for="(respuesta, idx) in selectedNews.respuestas" :key="idx" class="data-row">
                <div class="text-weight-bold">Respuesta {{ idx + 1 }}:</div>
                <div class="data-value">{{ respuesta }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <BotonCerrar @click="detailsModalRef?.closeDialog()" />
      </template>
    </modalComponent>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { apiClient } from '../../services/apiClient'
import { useNotifications } from '../../composables/useNotifications'
import { useApiData } from '../../composables/useApiData'
import BackButton from '../../components/BackButton.vue'
import BotonIngresar from '../../components/BotonIngresar.vue'
import BotonCerrar from '../../components/BotonCerrar.vue'
import maintable from '../../components/tables/maintable.vue'
import modalComponent from '../../components/modals/modalComponent.vue'
import CardNovedades from '../../components/CardNovedades.vue'
import StatsCard from '../../components/cards/StatsCard.vue'

// Composables
const notifications = useNotifications()

// Usar composable para datos de instructores
const { 
  data: rawInstructors, 
  fetchData: fetchInstructors 
} = useApiData('/instructors/listInstructor', {
  showEmptyInfo: false,
  errorMessage: 'Error al cargar instructores'
})

// Mapeo de instructor ID -> nombre (sin usar find/includes)
const instructorMap = ref({})

// Función para construir el mapeo de instructores (sin usar find/includes)
function buildInstructorMap() {
  const map = {}
  if (!Array.isArray(rawInstructors.value) || rawInstructors.value.length === 0) {
    instructorMap.value = map
    return
  }
  
  let index = 0
  while (index < rawInstructors.value.length) {
    const instructor = rawInstructors.value[index]
    if (instructor && instructor._id) {
      const id = instructor._id
      const name = instructor.name || instructor.Name || id
      map[id] = name
    }
    index++
  }
  
  instructorMap.value = map
}

// Watch para actualizar el mapeo cuando cambien los instructores
watch(rawInstructors, (newValue) => {
  buildInstructorMap()
}, { immediate: true, deep: true })

// State
const errorMessage = ref('')
const stats = ref([
  { title: 'TOTAL NOVEDADES ACTIVAS', value: 0 },
  { title: 'EN PROCESO', value: 0 },
  { title: 'RESUELTAS ESTE MES', value: 0 },
  { title: 'CRÍTICAS SIN ATENDER >3 DÍAS', value: 0 }
])
const showTable = ref(false)
const selectedNews = ref(null)

// Filtrado debe hacerse en el backend - usar queryParams en fetchNews
const searchTerm = ref('')
const statusFilter = ref('all')

// Agregado: refs locales para novedades e indicador de carga
const rawNews = ref([])
const isLoading = ref(false)

// Función solicitada (copiada tal cual)
async function fetchNews() {
  try {
    const response = await apiClient.get('/news/listNews')
    if (!response.data?.msg) {
      throw new Error('No hay datos disponibles')
    }
    return response.data.msg
  } catch (error) {
    const errorMsg = error.response?.data?.msg || error.message || 'Error al cargar novedades'
    errorMessage.value = errorMsg
    notifications.error(errorMsg)
    throw error
  }
}

// Los datos vienen crudos del backend sin transformaciones
const newsItems = rawNews

// Debug: Verificar qué datos se están recibiendo
watch(rawNews, (newValue) => {
  if (Array.isArray(newValue) && newValue.length > 0) {
    // Eliminados logs de depuración
  }
}, { immediate: true, deep: true })

// Modals
const detailsModalRef = ref(null)

// Los datos ya vienen filtrados del backend
const filteredItems = computed(() => {
  if (!Array.isArray(newsItems.value)) return []
  const mapped = []
  let idx = 0
  while (idx < newsItems.value.length) {
    const news = newsItems.value[idx]
    if (!news) { idx++; continue }
    const programaValor = news?.fiche?.program?.name || news?.fiche?.program?.code || news?.coordination?.name || '-'
    const fechaVal = news?.createdAt ? new Date(news.createdAt).toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }) : (news?.date ? new Date(news.date).toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }) : '-')

    mapped.push({
      id: news._id,
      fecha: fechaVal,
      aprendiz: news.name || '-',
      documento: ((news.tpdocument || '') + ' ' + (news.document || '')).trim() || '-',
      ficha: news.fiche?.number || '-',
      programa: programaValor,
      tipo: news.tpnew || '-',
      gravedad: news.status === 0 ? 'Alta' : 'Baja',
      estado: news.state ?? (news.status !== undefined ? String(news.status) : '-'),
      // Cambiado: priorizar fiche.owner.name, luego owner.name, luego nameInstructor, luego mapeo por id
      instructor: news.fiche?.owner?.name || news.owner?.name || news.nameInstructor || instructorMap.value[String(news.instructor)] || 'Pendiente',
      prioridad: news.processed ? 'normal' : 'urgente',
      descripcion: news.cause || news.description || news.descripcion || '-',
      respuestas: news.answers || news.respuestas || [],
      imagenes: news.img || news.images || null,
      // conservar original para modal
      _raw: news
    })
    idx++
  }
  return mapped
})

// Computed urgent news - sin usar filter
const urgentNews = computed(() => {
  // El backend debe devolver urgentNews o calcularlo en el servidor
  if (!Array.isArray(newsItems.value) || newsItems.value.length === 0) {
    return []
  }
  
  const result = []
  let index = 0
  let count = 0
  
  while (index < newsItems.value.length && count < 4) {
    const n = newsItems.value[index]
    if (!n) {
      index++
      continue
    }
    
    // Priorizar novedades no procesadas y con estado REGISTRADA
    const isNotProcessed = n.processed === false || n.processed === undefined
    const isRegistered = n.state === 'REGISTRADA' || n.state === 'REGISTRADO'
    
    if (isNotProcessed && isRegistered) {
      result.push(n)
      count++
    }
    
    index++
  }
  
  // Si no hay urgentes, mostrar las primeras 4 no procesadas
  if (result.length === 0 && newsItems.value.length > 0) {
    let idx = 0
    while (idx < newsItems.value.length && idx < 4) {
      if (newsItems.value[idx] && !newsItems.value[idx].processed) {
        result.push(newsItems.value[idx])
      }
      idx++
    }
  }
  
  // Si aún no hay, mostrar las primeras 4
  if (result.length === 0 && newsItems.value.length > 0) {
    let idx = 0
    while (idx < newsItems.value.length && idx < 4) {
      if (newsItems.value[idx]) {
        result.push(newsItems.value[idx])
      }
      idx++
    }
  }
  
  return result
})

// Table Columns - usar las propiedades planas del mapping
const columns = [
  { name: 'fecha', align: 'left', label: 'Fecha', field: row => row?.fecha || '-', sortable: true },
  { name: 'aprendiz', align: 'left', label: 'Aprendiz', field: row => row?.aprendiz || '-' },
  { name: 'documento', align: 'left', label: 'Cédula', field: row => row?.documento || '-' },
  { name: 'ficha', align: 'left', label: 'Ficha', field: row => row?.ficha || '-' },
  { name: 'programa', align: 'left', label: 'Programa', field: row => row?.programa || '-' },
  { name: 'tipo', align: 'left', label: 'Tipo', field: row => row?.tipo || '-' },
  { name: 'gravedad', align: 'center', label: 'Gravedad', field: row => row?.gravedad || '-' },
  { name: 'estado', align: 'center', label: 'Estado', field: row => row?.estado || '-' },
  { 
    name: 'instructor', 
    align: 'left', 
    label: 'Instructor', 
    field: row => {
      // El backend tiene instructor como ID string
      const instructor = row?.instructor
      if (!instructor) return '-'
      
      // Si es objeto, extraer nombre
      if (typeof instructor === 'object' && instructor !== null) {
        return instructor.name || instructor.Name || instructor._id || '-'
      }
      
      // Si es solo ID, buscar en el mapeo
      const instructorId = String(instructor)
      const instructorName = instructorMap.value[instructorId]
      
      // Eliminados logs/advertencias para no imprimir en consola
      // Si no se encuentra en el mapeo, retornar el ID temporalmente
      return instructorName || instructorId
    }
  },
  { name: 'prioridad', align: 'center', label: 'Prioridad', field: row => row?.prioridad || '-' },
  { name: 'acciones', align: 'center', label: 'Acciones', field: 'acciones' }
]

// Helper Functions
function getDays(dateString) {
  const newsDate = new Date(dateString)
  newsDate.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const diff = today - newsDate
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

function getElapsedTime(dateString) {
  if (!dateString) return '-'
  
  // Manejar formato ISO (YYYY-MM-DD) o formato DD/MM/YYYY
  let days = 0
  if (dateString.includes('/')) {
    // Formato DD/MM/YYYY
    const [day, month, year] = dateString.split('/')
    const formattedDate = `${month}/${day}/${year}`
    days = getDays(formattedDate)
  } else {
    // Formato ISO o similar
    days = getDays(dateString)
  }
  
  if (days < 0) return `Faltan ${Math.abs(days)} días`
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Hace 1 día'
  return `Hace ${days} días`
}

// El backend debe devolver stats directamente
function updateStats(newsArray) {
  // El backend debe calcular y devolver estas estadísticas
  // Por ahora, calcular sin usar filter
  if (!Array.isArray(newsArray) || newsArray.length === 0) {
    stats.value = [
      { title: 'TOTAL NOVEDADES ACTIVAS', value: 0 },
      { title: 'EN PROCESO', value: 0 },
      { title: 'RESUELTAS ESTE MES', value: 0 },
      { title: 'CRÍTICAS SIN ATENDER >3 DÍAS', value: 0 }
    ]
    return
  }
  
  let totalActive = newsArray.length
  let inProcess = 0
  let resolved = 0
  let critical = 0
  
  let index = 0
  while (index < newsArray.length) {
    const n = newsArray[index]
    if (!n) {
      index++
      continue
    }
    
    // Compatibilidad con ambos formatos
    const status = n.status || n.estado || n.state || ''
    const isProcessed = n.processed !== undefined ? n.processed : (n.resolved || n.resuelto || false)
    const createdAt = n.createdAt || n.date || n.fecha || ''
    
    if (status === 'APROBADA' || status === 'APPROVED' || status === 'EN PROCESO' || status === 'IN PROCESS') {
      inProcess++
    }
    if (isProcessed) {
      resolved++
    }
    if (!isProcessed && createdAt) {
      const days = getDays(createdAt)
      if (days > 3) {
        critical++
      }
    }
    index++
  }
  
  stats.value = [
    { title: 'TOTAL NOVEDADES ACTIVAS', value: totalActive },
    { title: 'EN PROCESO', value: inProcess },
    { title: 'RESUELTAS ESTE MES', value: resolved },
    { title: 'CRÍTICAS SIN ATENDER >3 DÍAS', value: critical }
  ]
}

// DEPRECADO: El backend debe devolver los datos en el formato correcto
function processNewsForTable(newsArray) {
  // Esta función está deprecada - el backend debe devolver los datos listos
  newsItems.value = newsArray
}

// Event Handlers
function handleViewDetails(news) {
  // news puede ser el objeto mapeado o la novedad cruda; preferir la cruda si viene
  selectedNews.value = news?._raw ? news._raw : news
  detailsModalRef.value?.openDialog()
}

// Watch para actualizar stats cuando cambien los datos
watch(newsItems, (newValue) => {
  if (newValue && Array.isArray(newValue)) {
    updateStats(newValue)
  }
}, { immediate: true })

// Lifecycle
onMounted(async () => {
  isLoading.value = true
  try {
    const data = await fetchNews()
    rawNews.value = Array.isArray(data) ? data : []
  } catch (e) {
    // error manejado dentro de fetchNews
    rawNews.value = []
  } finally {
    isLoading.value = false
  }
  fetchInstructors()
})
</script>
Styles Adminnews

<style lang="sass" scoped>
.container
  max-width: 1400px
  margin: 0 auto

.stats-container
  padding: 20px
  width: 100%
  margin-bottom: 40px
  border-radius: 8px

.stats-grid
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))
  gap: 30px
  justify-items: center
  align-items: stretch
  padding: 10px 0

.stat-card
  width: 100%
  height: 100%
  min-height: 120px
  transition: transform 0.2s ease
  margin-bottom: 10px

.stat-card:hover
  transform: translateY(-5px)

.urgent-title
  font-size: 2.0rem
  font-weight: 700
  text-align: center
  margin-bottom: 32px
  color: black
  letter-spacing: 1px
  text-transform: uppercase

.urgent-cards-grid
  display: grid
  grid-template-columns: repeat(4, 1fr)
  grid-auto-flow: row
  gap: 28px
  width: 100%
  padding: 20px 0


.urgent-cards-container 
  margin-top: 48px;
  padding: 32px 24px;
  background-color: #fafafa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;


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


@media (max-width: 900px)
  .urgent-cards-grid
    grid-template-columns: repeat(2, 1fr)
    gap: 20px

@media (max-width: 768px)
  .stats-grid
    gap: 24px
  
  .urgent-cards-grid
    grid-template-columns: 1fr
    gap: 20px
  
  .urgent-cards-container
    padding: 24px 18px

@media (max-width: 480px)
  .stats-grid
    gap: 20px
  
  .urgent-cards-grid
    gap: 18px
  
  .urgent-cards-container
    padding: 20px 14px

@media (max-width: 300px)
  .stats-grid
    gap: 16px
  
  .urgent-cards-grid
    gap: 16px
  
  .urgent-cards-container
    padding: 16px 12px
</style>