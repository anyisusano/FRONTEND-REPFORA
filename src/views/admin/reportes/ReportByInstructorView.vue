<template>
  <div class="page-content">
    <BackButton/>
    <div class="reporte-resultado">
    <h1 class="titulo">FICHAS POR INSTRUCTOR</h1>

    <!--Tabla -->
    <MainTable :datos="datos" :columnas="columnas" @visualizar="onVisualizar" @descargar="onDescargar"
      @eliminar="onEliminar" />
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MainTable from 'src/components/tables/MainTable.vue'
import { getData } from '../../../services/apiClient'
import BackButton from 'src/components/BackButton.vue'

//Capturar parámetros del filtro enviados por el componente anterior
const route = useRoute()
const filtros = ref({
  instructor: route.query.instructor || null,
  programa: route.query.programa || null,
  ficha: route.query.ficha || null,
  trimestre: route.query.trimestre || null,
  estadoInstructor: route.query.estadoInstructor || null,
  fechaInicioPrograma: route.query.fechaInicioPrograma || null,
  fechaFinPrograma: route.query.fechaFinPrograma || null,
  jornada: route.query.jornada || null
})

//Columnas de la tabla
const columnas = [
  { name: 'instructor', label: 'Instructor', field: 'instructor', align: 'left' },
  { name: 'cedula', label: 'Cedula', field: 'cedula', align: 'center' },
  { name: 'seguimiento', label: 'tipo Seguimiento', field: 'seguimiento', align: 'left' },
  { name: 'horas', label: 'Total horas', field: 'horas', align: 'center' }
]

const datos = ref([])

//Cargar datos desde backend usando los filtros
const obtenerDatos = async () => {
  try {
    const params = new URLSearchParams()
    if (filtros.value.instructor) params.append('instructor', filtros.value.instructor)
    if (filtros.value.programa) params.append('programa', filtros.value.programa)
    if (filtros.value.ficha) params.append('ficha', filtros.value.ficha)
    if (filtros.value.trimestre) params.append('trimestre', filtros.value.trimestre)
    if (filtros.value.estadoInstructor) params.append('estadoInstructor', filtros.value.estadoInstructor)
    if (filtros.value.fechaInicioPrograma) params.append('fechaInicioPrograma', filtros.value.fechaInicioPrograma)
    if (filtros.value.fechaFinPrograma) params.append('fechaFinPrograma', filtros.value.fechaFinPrograma)
    if (filtros.value.jornada) params.append('jornada', filtros.value.jornada)
    const url = `/reportes/instructor${params.toString() ? `?${params.toString()}` : ''}`
    const response = await getData(url)

    //Backend devuelve algo como:
    // {
    //   fichas: [...]
    // }

    datos.value = response.fichas || []
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
}

.titulo {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
}
</style>