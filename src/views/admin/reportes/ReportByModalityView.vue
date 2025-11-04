<template>
  <div class="page-cotent">
    <BackButton/>
    <div class="reporte-resultado">
    <h1 class="titulo">REPORTE POR MODALIDAD</h1>

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

//Capturar parámetros del filtro enviados por el componente anterior
const route = useRoute()
const filtros = ref({
  anio: route.query.anio || null,
  modalidad: route.query.modalidad || null,
  fechaInicio: route.query.fechaInicio || null,
  fechaFin: route.query.fechaFin || null
})

//Estado de las cards (resumen por modalidad)
const cards = ref([
  { title: 'TOTAL FICHAS', value: 0 },
  { title: 'FICHAS FINALIZADAS', value: 0 },
  { title: 'FICHAS EN PROCESO', value: 0 }
])

//Columnas de la tabla
const columnas = [
  { name: 'ficha', label: 'Ficha', field: 'ficha', align: 'center' },
  { name: 'programa', label: 'Programa de Formacion', field: 'nombre', align: 'center' },
  { name: 'aprendices', label: 'Aprendices', field: 'aprendices', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
]

const datos = ref([])

//Cargar datos desde backend usando los filtros
const obtenerDatos = async () => {
  try {
    const response = await axios.get('/api/reportes/modalidad', {
      params: filtros.value
    })

    //Backend devuelve algo como:
    // {
    //   fichas: [...],
    //   resumen: { presencial: 10, virtual: 8, mixta: 5 }
    // }

    datos.value = response.data.fichas || []

    // Actualizar cards
    if (response.data.resumen) {
      cards.value[0].value = response.data.resumen.presencial || 0
      cards.value[1].value = response.data.resumen.virtual || 0
      cards.value[2].value = response.data.resumen.mixta || 0
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