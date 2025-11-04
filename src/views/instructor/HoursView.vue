<template>
  <div class="page-content">
    <BackButton />

    <div class="reporte-resultado">
      <h1 class="titulo">Resumen de horas</h1>

      <!-- Tabla de resumen -->
      <MainTable
        :datos="datos"
        :columnas="columnas"
        @visualizar="onVisualizar"
        @descargar="onDescargar"
        @eliminar="onEliminar"
      />

      <!-- Totales -->
      <div class="resumen-totales">
        <div class="card-total">
          <span>Total ejecutado :</span>
          <strong>{{ totalEjecutado }}h</strong>
        </div>
        <div class="card-total">
          <span>Disponibles :</span>
          <strong>{{ horasDisponibles }}h</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MainTable from 'src/components/tables/MainTable.vue'
import BackButton from 'src/components/BackButton.vue'
// import axios from 'axios'

// Capturar parámetros 
const route = useRoute()
const filtros = ref({
  instructor: route.query.instructor || null,
  anio: route.query.anio || null
})

// Columnas de la tabla
const columnas = [
  { name: 'actividad', label: 'Actividad', field: 'actividad', align: 'center' },
  { name: 'asignadas', label: 'Horas Asignadas', field: 'asignadas', align: 'center' },
  { name: 'ejecutadas', label: 'Horas Ejecutadas', field: 'ejecutadas', align: 'center' },
  { name: 'pendientes', label: 'Horas Pendientes', field: 'pendientes', align: 'center' }
]

// Datos simulados 
const datos = ref([
  { actividad: 'Bitácoras', asignadas: '2H', ejecutadas: '10H', pendientes: '5H' },
  { actividad: 'Seguimientos', asignadas: '2H', ejecutadas: '10H', pendientes: '5H' },
  { actividad: 'Seguimientos extraordinarios', asignadas: '2H', ejecutadas: '10H', pendientes: '5H' },
  { actividad: 'Certificación', asignadas: '2H', ejecutadas: '10H', pendientes: '5H' }
])

// Totales
const totalEjecutado = ref(80)
const horasDisponibles = ref(100)

// Simulación de carga 
const obtenerDatos = async () => {
  try {
    // const response = await axios.get('/api/instructor/horas', { params: filtros.value })
    // datos.value = response.data.detalle
    // totalEjecutado.value = response.data.totalEjecutado
    // horasDisponibles.value = response.data.horasDisponibles
  } catch (error) {
    // TODO: Manejar error
  }
}


onMounted(() => {
  obtenerDatos()
})

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

.resumen-totales {
  display: flex;
  justify-content: center;
  gap: 10rem;
  margin-top: 2rem;

}

.card-total {
  background: #f5f5f5;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 1.1rem;
}

.card-total span {
  color: #555;
  margin-right: 0.5rem;
}

</style>