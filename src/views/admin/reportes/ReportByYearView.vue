<template>
  <div class="page-content">
    <BackButton/>

    <div class="reporte-resultado">
    <!--Título -->
    <h1 class="titulo">REPORTE POR AÑO</h1>

    <!--Cards de estadísticas -->
    <div class="cards-container">
      <StatsCard v-for="(card, index) in cards" :key="index" :title="card.title" :value="card.value"
        :color="card.color" />
    </div>

    <!--Tabla vacía lista para datos del backend -->
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
import { getData } from '../../../services/apiClient'
import BackButton from 'src/components/BackButton.vue'

// Capturar el año enviado desde el formulario anterior
const route = useRoute()
const filtros = ref({
  anio: route.query.anio || null
})

//Estado de las cards
const cards = ref([
  { title: 'TOTAL DE FICHAS', value: 0 },
  { title: 'TOTAL DE APRENDICES', value: 0 },
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

// Llamada al backend con el año como parámetro
const obtenerDatos = async () => {
  try {
    const url = `/reportes/anio${filtros.value.anio ? `?anio=${filtros.value.anio}` : ''}`
    const response = await getData(url)

    //  Estructura esperada del backend:
    // {
    //   fichas: [...],
    //   resumen: { activas: 15, finalizadas: 10, canceladas: 2 }
    // }

    datos.value = response.fichas || []

    if (response.resumen) {
      cards.value[0].value = response.resumen.activas || 0
      cards.value[1].value = response.resumen.finalizadas || 0
      cards.value[2].value = response.resumen.canceladas || 0
    }
  } catch (error) {
    // TODO: Manejar error
  }
}

//Llamar al cargar el componente
onMounted(() => {
  obtenerDatos()
})

//Eventos de acción de la tabla
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