<template>
  <div class="page-content">
    <BackButton/>

    <div class="reporte-container">
    <!--Título principal -->
    <div class="titulo-principal">
      <h1>REPORTE POR AÑO</h1>
    </div>

    <!--Tarjeta del reporte -->
    <div class="reporte-card">
      <!-- Encabezado verde -->
      <div class="reporte-header">
        <span>Reporte por Año</span>
      </div>

      <!--Contenido -->
      <div class="reporte-body">
        <div class="form-grid">
          <!-- Año Académico -->
          <div class="form-item">
            <label for="anio">Año Académico</label>
            <q-select v-model="anioSeleccionado" :options="anios" outlined placeholder="Seleccionar año" color="green"
              dense />
          </div>

          <!--Estado de Fichas -->
          <div class="form-item">
            <label for="estado">Estado de Fichas</label>
            <q-select v-model="estadoSeleccionado" :options="estados" option-label="nombre" option-value="id" outlined
              placeholder="Seleccionar estado" color="green" dense emit-value map-options />
          </div>

          <!--Tipo de Programa -->
          <div class="form-item full-width">
            <label for="programa">Tipo de Programa</label>
            <q-select v-model="programaSeleccionado" :options="programas" option-label="nombre" option-value="id"
              outlined placeholder="Seleccionar programa" color="green" dense emit-value map-options />
          </div>
        </div>

        <!--Botones -->
        <div class="botones">
          <BotonCerrar label="Limpiar" @click="limpiarCampos" />
          <BotonEnviar label="Ver Reporte" :to="{
            path: '/app/admin/vistareporteporaño',
            query: { anio: anioSeleccionado }
          }" />

        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import BotonEnviar from 'src/components/BotonEnviar.vue'
import BotonCerrar from 'src/components/BotonCerrar.vue'
import BackButton from 'src/components/BackButton.vue'

//Variables reactivas
const anioSeleccionado = ref(null)
const estadoSeleccionado = ref(null)
const programaSeleccionado = ref(null)

//Listas dinámicas
const anios = ref([])
const estados = ref([])
const programas = ref([])

//Función para obtener años desde el backend
const obtenerAnios = async () => {
  try {
    // Ejemplo: reemplaza con tu endpoint real
    // const response = await axios.get('/api/anios')
    // anios.value = response.data
    anios.value = ['2022', '2023', '2024', '2025'] // temporal
  } catch (error) {  }
}

//Función para obtener estados de fichas desde el backend
const obtenerEstados = async () => {
  try {
    // const response = await axios.get('/api/estados-fichas')
    // estados.value = response.data
    estados.value = [
      { id: 1, nombre: 'Activas' },
      { id: 2, nombre: 'Finalizadas' },
      { id: 3, nombre: 'En pausa' },
      { id: 4, nombre: 'Canceladas' }
    ]
  } catch (error) {  }
}

//Función para obtener programas desde el backend
const obtenerProgramas = async () => {
  try {
    // const response = await axios.get('/api/programas')
    // programas.value = response.data
    programas.value = [
      { id: 1, nombre: 'Técnico' },
      { id: 2, nombre: 'Tecnólogo' },
      { id: 3, nombre: 'Especialización' }
    ]
  } catch (error) {  }
}

//Función para limpiar los campos
const limpiarCampos = () => {
  anioSeleccionado.value = null
  estadoSeleccionado.value = null
  programaSeleccionado.value = null
}

//Cargar datos del backend al montar el componente
onMounted(() => {
  obtenerAnios()
  obtenerEstados()
  obtenerProgramas()
})
</script>

<style scoped>
.page-content {
  padding: 1rem;
}

.reporte-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
}

.titulo-principal h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #000;
  text-align: center;
  margin-bottom: 1.5rem;
}

.reporte-card {
  width: 100%;
  max-width: 800px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.reporte-header {
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
  text-align: center;
  padding: 0.8rem 0;
  font-size: 1.1rem;
}

.reporte-body {
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.8rem;
  margin-bottom: 2rem;
}

.form-item label {
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
}

.botones {
  display: flex;
  justify-content: center;
  gap: 2rem;
}
</style>