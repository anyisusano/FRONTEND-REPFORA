<template>
  <div class="page-content">
    <BackButton/>
    <div class="reporte-container">
    <!--Título principal -->
    <div class="titulo-principal">
      <h1>REPORTE POR EMPRESA</h1>
    </div>

    <!--Tarjeta del reporte -->
    <div class="reporte-card">
      <div class="reporte-header">
        <span>Reporte por Empresa</span>
      </div>

      <!--Contenido -->
      <div class="reporte-body">
        <div class="form-grid">
          <!-- Empresa -->
          <div class="form-item">
            <label for="empresa">Empresa</label>
            <q-select
              v-model="empresaSeleccionada"
              :options="empresas"
              option-label="nombre"
              option-value="id"
              outlined
              placeholder="Seleccionar empresa"
              color="green"
              dense
              emit-value
              map-options
            />
          </div>

          <!--Tipo de Contrato -->
          <div class="form-item">
            <label for="tipoContrato">Tipo de Contrato</label>
            <q-select
              v-model="tipoContratoSeleccionado"
              :options="tiposContrato"
              outlined
              placeholder="Todos los tipos"
              color="green"
              dense
            />
          </div>

          <!-- Estado del Contrato -->
          <div class="form-item">
            <label for="estadoContrato">Estado del Contrato</label>
            <q-select
              v-model="estadoContratoSeleccionado"
              :options="estadosContrato"
              outlined
              placeholder="Todos los estados"
              color="green"
              dense
            />
          </div>

          <!-- Año -->
          <div class="form-item">
            <label for="anio">Año</label>
            <q-select
              v-model="anioSeleccionado"
              :options="anios"
              outlined
              placeholder="Seleccionar año"
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
              path: '/app/admin/vistareporteporempresa',
              query: {
                empresa: empresaSeleccionada,
                tipoContrato: tipoContratoSeleccionado,
                estadoContrato: estadoContratoSeleccionado,
                anio: anioSeleccionado
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

// Variables reactivas
const empresaSeleccionada = ref(null)
const tipoContratoSeleccionado = ref(null)
const estadoContratoSeleccionado = ref(null)
const anioSeleccionado = ref(null)

// Listas
const empresas = ref([])
const tiposContrato = ref([])
const estadosContrato = ref([])
const anios = ref([])

// Cargar datos del backend
const obtenerEmpresas = async () => {
  try {
    // const response = await axios.get('/api/empresas')
    // empresas.value = response.data
    empresas.value = [
      { id: 1, nombre: 'Empresa A S.A.S' },
      { id: 2, nombre: 'Empresa B Ltda' },
      { id: 3, nombre: 'Empresa C & Cía' },
      { id: 4, nombre: 'Corporación XYZ' }
    ] // ejemplo temporal
  } catch (error) {  }
}

const obtenerTiposContrato = async () => {
  try {
    // const response = await axios.get('/api/tiposcontrato')
    // tiposContrato.value = response.data
    tiposContrato.value = [
      'Todos los tipos',
      'Contrato de aprendizaje',
      'Vínculo laboral',
      'Pasantía'
    ] // ejemplo temporal
  } catch (error) {  }
}

const obtenerEstadosContrato = async () => {
  try {
    // const response = await axios.get('/api/estadoscontrato')
    // estadosContrato.value = response.data
    estadosContrato.value = [
      'Todos los estados',
      'Activo',
      'Finalizado',
      'En proceso',
      'Cancelado'
    ] // ejemplo temporal
  } catch (error) {  }
}

const obtenerAnios = async () => {
  try {
    // const response = await axios.get('/api/anios')
    // anios.value = response.data
    anios.value = ['2023', '2024', '2025'] // ejemplo temporal
  } catch (error) {  }
}

const limpiarCampos = () => {
  empresaSeleccionada.value = null
  tipoContratoSeleccionado.value = null
  estadoContratoSeleccionado.value = null
  anioSeleccionado.value = null
}

// Ejecutar al montar
onMounted(() => {
  obtenerEmpresas()
  obtenerTiposContrato()
  obtenerEstadosContrato()
  obtenerAnios()
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