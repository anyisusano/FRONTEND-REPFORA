<template>
  <div class="page-content">
    <BackButton/>
    <!--Título principal -->

    <div class="reporte-container">
    <div class="titulo-principal">
      <h1>HORAS POR INSTRUCTOR</h1>
    </div>

    <!--Tarjeta del reporte -->
    <div class="reporte-card">
      <div class="reporte-header">
        <span>Horas por Instructor</span>
      </div>

      <!--Contenido -->
      <div class="reporte-body">
        <div class="form-grid">
          <!-- Instructores -->
          <div class="form-item">
            <label for="instructor">Instructores</label>
            <q-select
              v-model="instructorSeleccionado"
              :options="instructores"
              option-label="nombre"
              option-value="id"
              outlined
              placeholder="Seleccionar Instructor"
              color="green"
              dense
              emit-value
              map-options
            />
          </div>

          <!-- Periodo -->
          <div class="form-item">
            <label for="periodo">Periodo</label>
            <q-input
              v-model="periodo"
              type="date"
              outlined
              color="green"
              dense
              placeholder="dd/mm/aa"
            />
          </div>

          <!-- Tipo de seguimiento -->
          <div class="form-item">
            <label for="tipoSeguimiento">Tipo de seguimiento</label>
            <q-select
              v-model="tipoSeguimientoSeleccionado"
              :options="tiposSeguimiento"
              outlined
              placeholder="Seleccionar tipo de seguimiento"
              color="green"
              dense
            />
          </div>
        </div>

        <!--Botones -->
        <div class="botones">
          <BotonCerrar label="Limpiar" @click="limpiarCampos" />
          <BotonEnviar
            label="Ver Reporte"
            :to="{
              path: '/app/admin/vistareporteporinstructor',
              query: {
                instructor: instructorSeleccionado,
                periodo,
                tipoSeguimiento: tipoSeguimientoSeleccionado
              }
            }"
          />
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
const instructorSeleccionado = ref(null)
const periodo = ref(null)
const tipoSeguimientoSeleccionado = ref(null)

//Listas
const instructores = ref([])
const tiposSeguimiento = ref([])

//Cargar datos del backend
const obtenerInstructores = async () => {
  try {
    // const response = await axios.get('/api/instructores')
    // instructores.value = response.data
    instructores.value = [
      { id: 1, nombre: 'Juan Pérez García' },
      { id: 2, nombre: 'María López Rodríguez' },
      { id: 3, nombre: 'Carlos Martínez Díaz' },
      { id: 4, nombre: 'Ana Gómez Sánchez' }
    ] // ejemplo temporal
  } catch (error) {  }
}

const obtenerTiposSeguimiento = async () => {
  try {
    // const response = await axios.get('/api/tiposseguimiento')
    // tiposSeguimiento.value = response.data
    tiposSeguimiento.value = [
      'Instructor Tecnico',
      'Instructor Seguimiento',
      'Instructor Proyecto'
    ] // ejemplo temporal
  } catch (error) {  }
}

const limpiarCampos = () => {
  instructorSeleccionado.value = null
  periodo.value = null
  tipoSeguimientoSeleccionado.value = null
}

// Ejecutar al montar
onMounted(() => {
  obtenerInstructores()
  obtenerTiposSeguimiento()
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
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
}

.form-item.full-width {
  grid-column: 1 / -1;
}

.botones {
  display: flex;
  justify-content: center;
  gap: 2rem;
}
</style>