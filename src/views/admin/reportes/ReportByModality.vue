<template>
  <div class="page-content">
    <BackButton/>
    <div class="reporte-container">
    <!--Título principal -->
    <div class="titulo-principal">
      <h1>REPORTE POR MODALIDAD</h1>
    </div>

    <!--Tarjeta del reporte -->
    <div class="reporte-card">
      <div class="reporte-header">
        <span>Reporte por Modalidad</span>
      </div>

      <!--Contenido -->
      <div class="reporte-body">
        <div class="form-grid">
          <!-- Año -->
          <div class="form-item">
            <label for="anio">Año</label>
            <q-select v-model="anioSeleccionado" :options="anios" outlined placeholder="Seleccionar año" color="green"
              dense />
          </div>

          <!-- Modalidad -->
          <div class="form-item">
            <label for="modalidad">Modalidad</label>
            <q-select v-model="modalidadSeleccionada" :options="modalidades" option-label="nombre" option-value="id"
              outlined placeholder="Seleccionar modalidad" color="green" dense emit-value map-options />
          </div>

          <!-- Fecha Inicio -->
          <div class="form-item">
            <label for="fechaInicio">Fecha Inicio</label>
            <q-input v-model="fechaInicio" type="date" outlined color="green" dense placeholder="dd/mm/aa" />
          </div>

          <!-- Fecha Fin -->
          <div class="form-item">
            <label for="fechaFin">Fecha Fin</label>
            <q-input v-model="fechaFin" type="date" outlined color="green" dense placeholder="dd/mm/aa" />
          </div>
        </div>

        <!--Botones -->
        <div class="botones">
          <BotonCerrar label="Limpiar" @click="limpiarCampos" />
          <BotonEnviar label="Ver Reporte" :to="{
            path: '/app/admin/vistareportepormodalidad',
            query: {
              anio: anioSeleccionado,
              modalidad: modalidadSeleccionada,
              fechaInicio,
              fechaFin
            }
          }" />

        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BotonEnviar from 'src/components/BotonEnviar.vue'
import BotonCerrar from 'src/components/BotonCerrar.vue'
import axios from 'axios'
import BackButton from 'src/components/BackButton.vue'

//Variables reactivas
const anioSeleccionado = ref(null)
const modalidadSeleccionada = ref(null)
const fechaInicio = ref(null)
const fechaFin = ref(null)

//Listas
const anios = ref([])
const modalidades = ref([])

// Cargar datos del backend (simulado)
const obtenerAnios = async () => {
  try {
    // const response = await axios.get('/api/anios')
    // anios.value = response.data
    anios.value = ['2023', '2024', '2025'] // ejemplo temporal
  } catch (error) {  }
}

const obtenerModalidades = async () => {
  try {
    // const response = await axios.get('/api/modalidades')
    // modalidades.value = response.data
    modalidades.value = [
      { id: 1, nombre: 'Contrato de aprendizaje' },
      { id: 2, nombre: 'Vinculo laboral' },
      { id: 3, nombre: 'Proyecto productivo' },
      { id: 4, nombre: 'Pasantía U.P. Familiar' }
    ]
  } catch (error) {  }
}

const limpiarCampos = () => {
  anioSeleccionado.value = null
  modalidadSeleccionada.value = null
  fechaInicio.value = null
  fechaFin.value = null
}

// Ejecutar al montar
onMounted(() => {
  obtenerAnios()
  obtenerModalidades()
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