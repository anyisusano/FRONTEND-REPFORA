<template>
  <div class="page-content">
    <BackButton/>
    <div class="reporte-resultado">
    <h1 class="titulo">REPORTE POR EMPRESA</h1>

    <!--Cards-->
    <div class="cards-container">
      <StatsCard v-for="(card, index) in cards" :key="index" :title="card.title" :value="card.value"
        :color="card.color" />
    </div>

    <!--Tabla de resultados -->
    <MainTable :datos="datos" :columnas="columnas" @visualizar="onVisualizar" @descargar="onDescargar"
      @eliminar="onEliminar" />
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import StatsCard from 'src/components/cards/StatsCard.vue'
import MainTable from 'src/components/tables/MainTable.vue'
import axios from 'axios'
import BackButton from 'src/components/BackButton.vue'

// Capturar parámetros del filtro enviados por el componente anterior
const route = useRoute()
const filtros = ref({
  empresa: route.query.empresa || null,
  tipoContrato: route.query.tipoContrato || null,
  estadoContrato: route.query.estadoContrato || null,
  anio: route.query.anio || null
})

//Estado de las cards (resumen por empresa)
const cards = ref([
  { title: 'TOTAL EMPRESAS', value: 0 },
  { title: 'APRENDICES VINCULADOS', value: 0 },
  { title: 'FICHAS EN PROCESO', value: 0 }
])

//Columnas de la tabla
const columnas = [
  { name: 'empresa', label: 'Empresa', field: 'empresa', align: 'center' },
  { name: 'nit', label: 'NIT', field: 'nit', align: 'left' },
  { name: 'contrato', label: 'Tipo Contrato', field: 'contrato', align: 'left' },
  { name: 'aprendices', label: 'Aprendices', field: 'aprendices', align: 'center' },
  { name: 'fecha', label: 'Fecha Inicio', field: 'fecha', align: 'center' },
  { name: 'fecha', label: 'Fecha Fin', field: 'fecha', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' }
]

const datos = ref([])

//Cargar datos desde backend usando los filtros
const obtenerDatos = async () => {
  try {
    const response = await axios.get('/api/reportes/empresa', {
      params: filtros.value
    })

    // Backend devuelve algo como:
    // {
    //   aprendices: [...],
    //   resumen: { totalAprendices: 45, activos: 30, finalizados: 10 }
    // }

    datos.value = response.data.aprendices || []

    // Actualizar cards
    if (response.data.resumen) {
      cards.value[0].value = response.data.resumen.totalAprendices || 0
      cards.value[1].value = response.data.resumen.activos || 0
      cards.value[2].value = response.data.resumen.finalizados || 0
    }
  } catch (error) {
    // TODO: Manejar error
  }
}

//Cargar datos cuando se monta
onMounted(() => {
  obtenerDatos()
})

//Acciones de la tabla
const onVisualizar = (row) => {
  // TODO: Implementar visualización
}

const onDescargar = (row) => {
  // TODO: Implementar descarga
}

const onEliminar = (row) => {
  // TODO: Implementar eliminación
}
</script>

<style scoped>
.page-content {
  padding: 1rem;
}

.reporte-resultado {
  padding: 2rem;
  min-height: 100vh;
  text-align: center;
}

.titulo {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #333;
}

.cards-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 3rem;
}
</style>