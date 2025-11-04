<template>
  <div class="seguimientos-page">
    <!-- Botón de regreso -->
    <div class="back-button-container">
      <BackButton/>
    </div>

    <!-- Contenedor principal -->
    <div class="seguimientos-container">
      <h1 class="page-title">SEGUIMIENTOS</h1>

      <!-- Filtros -->
      <div class="filtros-section">
        <q-input
          v-model="filtroAprendiz"
          outlined
          dense
          placeholder="Buscar Aprendiz"
          class="filtro-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="grey-6" />
          </template>
        </q-input>

        <q-input
          v-model="filtroFicha"
          outlined
          dense
          placeholder="Buscar Ficha"
          class="filtro-input"
        />

        <q-input
          v-model="filtroPrograma"
          outlined
          dense
          placeholder="Buscar Programa"
          class="filtro-input"
        />

        <q-input
          v-model="filtroEstado"
          outlined
          dense
          placeholder="Buscar Estado"
          class="filtro-input"
        />

        <div class="action-buttons">
          <q-btn
            label="Registrar Seguimiento"
            icon="add"
            class="btn-registrar"
            unelevated
            @click="registrarSeguimiento"
          />
          <q-btn
            label="Plantillas"
            icon="description"
            class="btn-plantillas"
            unelevated
            @click="verPlantillas"
          />
        </div>
      </div>

      <!-- Tabla de seguimientos -->
      <maintable
        :datos="seguimientosFiltrados"
        :columnas="columnas"
        row-key="id"
        no-data-label="No hay seguimientos registrados"
        :rows-per-page-options="[10, 20, 50]"
        :initial-rows-per-page="10"
        @eliminar="eliminarSeguimiento"
        @visualizar="visualizarSeguimiento"
        @descargar="descargarSeguimiento"
      >
        <!-- Columna personalizada para Aprendiz/Documento -->
        <template #body-cell-aprendiz="props">
          <q-td :props="props">
            <div class="aprendiz-cell">
              <div class="aprendiz-nombre">{{ props.row.aprendiz }}</div>
              <div class="aprendiz-documento">{{ props.row.documento }}</div>
            </div>
          </q-td>
        </template>

        <!-- Columna personalizada para Ficha/Programa -->
        <template #body-cell-ficha="props">
          <q-td :props="props">
            <div class="ficha-cell">
              <div class="ficha-numero">{{ props.row.ficha }}</div>
              <div class="ficha-programa">{{ props.row.programa }}</div>
            </div>
          </q-td>
        </template>

        <!-- Columna Estado con validación visual -->
        <template #body-cell-estado="props">
          <q-td :props="props" class="text-center">
            <div class="estado-cell">
              <q-icon 
                :name="props.row.estado === 'Validado' ? 'check' : 'close'"
                :color="props.row.estado === 'Validado' ? 'green' : 'red'"
                size="sm"
              />
              <span class="estado-text">{{ props.row.estado }}</span>
            </div>
          </q-td>
        </template>

        <!-- Columna Alertas con badge -->
        <template #body-cell-alertas="props">
          <q-td :props="props" class="text-center">
            <q-badge
              :color="getAlertColor(props.row.alertas)"
              :label="props.row.alertas"
              class="alerta-badge"
            />
          </q-td>
        </template>
      </maintable>
    </div>

    <!-- Modal Nuevo Seguimiento -->
    <modalComponent 
      ref="modalNuevo" 
      v-model="showModalNuevo"
      width="600px"
      max-width="95vw"
    >
      <template #header>
        <div class="modal-header-custom">
          <q-icon name="add_circle" size="sm" class="q-mr-sm" />
          <span>Nuevo Seguimiento</span>
        </div>
      </template>

      <template #body>
        <div class="modal-body-content">
          <!-- Buscar Documento -->
          <div class="form-group">
            <label class="form-label">
              <q-icon name="description" size="sm" class="q-mr-xs" />
              Buscar Documento
            </label>
            <q-input
              v-model="nuevoSeguimiento.documento"
              outlined
              dense
              placeholder="Ingrese documento"
              class="form-input"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <!-- Tipo Seguimiento -->
          <div class="form-group">
            <label class="form-label">
              <q-icon name="article" size="sm" class="q-mr-xs" />
              Tipo Seguimiento
            </label>
            <q-select
              v-model="nuevoSeguimiento.tipoSeguimiento"
              :options="['Obligatorio', 'Extraordinario']"
              outlined
              dense
              placeholder="Seleccione"
              class="form-input"
            />
          </div>

          <!-- Número Seguimiento -->
          <div class="form-group">
            <label class="form-label">
              <q-icon name="tag" size="sm" class="q-mr-xs" />
              Número Seguimiento
            </label>
            <div class="checkbox-group">
              <q-checkbox 
                v-model="nuevoSeguimiento.numeroSeguimiento.uno" 
                label="1"
                color="green"
              />
              <q-checkbox 
                v-model="nuevoSeguimiento.numeroSeguimiento.dos" 
                label="2"
                color="green"
              />
              <q-checkbox 
                v-model="nuevoSeguimiento.numeroSeguimiento.tres" 
                label="3"
                color="green"
              />
            </div>
          </div>

          <!-- Motivo de Solicitud -->
          <div class="form-group">
            <label class="form-label">
              <q-icon name="edit_note" size="sm" class="q-mr-xs" />
              Motivo de Solicitud
            </label>
            <q-input
              v-model="nuevoSeguimiento.motivoSolicitud"
              outlined
              type="textarea"
              rows="3"
              placeholder="Este campo solo debe ser usado al seleccionar seguimiento Extraordinario. Al no ser así que sea seleccionado este campo quedará bloqueado automáticamente y no permitirá ingresar información"
              class="form-input"
              :disable="nuevoSeguimiento.tipoSeguimiento !== 'Extraordinario'"
              :bg-color="nuevoSeguimiento.tipoSeguimiento !== 'Extraordinario' ? 'grey-3' : 'white'"
            />
            <small v-if="nuevoSeguimiento.tipoSeguimiento !== 'Extraordinario'" class="text-grey-6 q-mt-xs block">
              * Este campo solo está disponible para seguimientos de tipo "Extraordinario"
            </small>
          </div>

          <!-- Archivo PDF -->
          <div class="form-group">
            <label class="form-label">
              <q-icon name="picture_as_pdf" size="sm" class="q-mr-xs" />
              Archivo PDF (Máximo 2MB)
            </label>
            <div class="file-upload-area" @click="seleccionarArchivo">
              <q-icon name="folder" size="lg" color="grey-6" />
              <div class="file-upload-text">
                <div v-if="!nuevoSeguimiento.archivoPDF">
                  Arrastra tu archivo aquí o has click para seleccionar
                </div>
                <div v-else class="file-selected">
                  {{ nuevoSeguimiento.archivoPDF.name }}
                </div>
                <small class="text-grey-6">Formatos: PDF - Máximo 2MB</small>
              </div>
              <input 
                type="file" 
                id="file-input" 
                accept="application/pdf"
                style="display: none"
                @change="onFileSelected"
              />
            </div>
            <q-btn
              label="Seleccionar Archivo"
              color="grey-6"
              outline
              class="q-mt-sm full-width"
              @click="seleccionarArchivo"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-buttons">
          <BotonCerrar @click="cancelarNuevo" />
          <BotonEnviar label="Guardar" @click="guardarNuevo" />
        </div>
      </template>
    </modalComponent>

    <!-- Modal Plantillas Seguimientos -->
    <modalComponent 
      ref="modalPlantillas" 
      v-model="showModalPlantillas"
      width="500px"
      max-width="95vw"
    >
      <template #header>
        <div class="modal-header-custom">
          <span>Plantillas<br/>Seguimientos</span>
        </div>
      </template>

      <template #body>
        <div class="plantillas-list">
          <q-list>
            <q-item 
              v-for="plantilla in plantillas" 
              :key="plantilla.id"
              class="plantilla-item"
            >
              <q-item-section avatar>
                <q-icon :name="plantilla.icon" color="grey-7" size="md" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="plantilla-nombre">{{ plantilla.nombre }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="plantilla-actions">
                  <q-btn 
                    flat 
                    dense 
                    round 
                    icon="visibility" 
                    color="grey-7"
                    size="sm"
                    @click="visualizarPlantilla(plantilla)"
                  >
                    <q-tooltip>Visualizar</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-buttons">
          <BotonCerrar @click="cerrarPlantillas" />
        </div>
      </template>
    </modalComponent>

    <!-- Modal Visualizar Plantilla -->
    <modalComponent 
      ref="modalVisualizarPlantilla" 
      v-model="showModalVisualizarPlantilla"
      width="900px"
      max-width="95vw"
    >
      <template #header>
        <div class="modal-header-custom">
          <q-icon name="visibility" size="sm" class="q-mr-sm" />
          <span>Visualizar Plantilla</span>
        </div>
      </template>

      <template #body>
        <div class="plantilla-viewer">
          <!-- Simulación del PDF con imagen -->
          <div class="pdf-container">
            <div class="pdf-toolbar">
              <q-btn 
                flat 
                dense 
                round 
                icon="download" 
                color="grey-8"
                @click="descargarPlantillaVisualizada"
              >
                <q-tooltip>Descargar</q-tooltip>
              </q-btn>
            </div>
            <div class="pdf-preview">
              <!-- Aquí se cargaría el PDF real -->
              <div class="pdf-placeholder">
                <q-icon name="description" size="64px" color="grey-5" />
                <p class="text-grey-6">Vista previa de la plantilla</p>
                <small class="text-grey-5">Formato de seguimiento de etapa productiva</small>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-buttons">
          <BotonCerrar @click="cerrarVisualizarPlantilla" />
        </div>
      </template>
    </modalComponent>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import maintable from 'src/components/tables/maintable.vue'
import modalComponent from 'src/components/modals/modalComponent.vue'
import BotonCerrar from 'src/components/BotonCerrar.vue'
import BotonEnviar from 'src/components/BotonEnviar.vue'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()
const $q = useQuasar()

// Filtros
const filtroAprendiz = ref('')
const filtroFicha = ref('')
const filtroPrograma = ref('')
const filtroEstado = ref('')

// Datos de ejemplo
const seguimientos = ref([
  {
    id: 1,
    aprendiz: 'Luis Fernando Torres',
    documento: '67235468',
    ficha: '2926078',
    programa: 'Análisis y desarrollo de software',
    modalidad: 'Proyecto Productivo',
    numeroSeguimiento: '2',
    tipoSeguimiento: 'Presencial',
    fechaProgramada: '05/10/2025',
    fechaRealizada: '04/10/2025',
    estado: 'Validado',
    observaciones: 'Ha cumplido con el objetivo',
    alertas: 'Completado'
  },
  {
    id: 2,
    aprendiz: 'Maria Amanda Ortiz',
    documento: '1099155',
    ficha: '3698456',
    programa: 'Hoteleria y turismo',
    modalidad: 'Pasantía',
    numeroSeguimiento: '1',
    tipoSeguimiento: 'Virtual',
    fechaProgramada: '06/10/2025',
    fechaRealizada: '--------',
    estado: 'Pendiente',
    observaciones: '--------',
    alertas: 'Próximo a vencer (1 día)'
  },
  {
    id: 3,
    aprendiz: 'Luis Fernando Torres',
    documento: '67235468',
    ficha: '3086756',
    programa: 'Gestión de servicios agropecuarios',
    modalidad: 'Monitoria',
    numeroSeguimiento: '2',
    tipoSeguimiento: 'Técnico',
    fechaProgramada: '10/10/2025',
    fechaRealizada: '04/10/2025',
    estado: 'Validado',
    observaciones: 'Ha cumplido con el objetivo',
    alertas: 'Completado'
  },
  {
    id: 4,
    aprendiz: 'Gabriela Alejandra Ballesteros',
    documento: '1030733744',
    ficha: '3626456',
    programa: 'Supervisión de ventas',
    modalidad: 'Vínculo Laboral',
    numeroSeguimiento: '1',
    tipoSeguimiento: 'De proyecto',
    fechaProgramada: '06/10/2025',
    fechaRealizada: '05/10/2025',
    estado: 'Rechazado',
    observaciones: 'No ha cumplido con los objetivos',
    alertas: 'En espera de un nuevo seguimiento'
  },
  {
    id: 5,
    aprendiz: 'Luis Miguel Pinto',
    documento: '1091236587',
    ficha: '2965842',
    programa: 'Agroindustria',
    modalidad: 'Contrato Aprendizaje',
    numeroSeguimiento: '1',
    tipoSeguimiento: 'Extraordinario',
    fechaProgramada: '06/01/2025',
    fechaRealizada: '01/01/2025',
    estado: 'Pendiente',
    observaciones: '--------',
    alertas: ''
  }
])

// Columnas de la tabla
const columnas = [
  {
    name: 'aprendiz',
    label: 'Aprendiz/Documento',
    field: 'aprendiz',
    align: 'left',
    sortable: true
  },
  {
    name: 'ficha',
    label: 'Ficha/Programa',
    field: 'ficha',
    align: 'left',
    sortable: true
  },
  {
    name: 'modalidad',
    label: 'Modalidad',
    field: 'modalidad',
    align: 'center',
    sortable: true
  },
  {
    name: 'numeroSeguimiento',
    label: 'Nº Seguimiento',
    field: 'numeroSeguimiento',
    align: 'center',
    sortable: true
  },
  {
    name: 'tipoSeguimiento',
    label: 'Tipo de Seguimiento',
    field: 'tipoSeguimiento',
    align: 'center',
    sortable: true
  },
  {
    name: 'fechaProgramada',
    label: 'Fecha Programada',
    field: 'fechaProgramada',
    align: 'center',
    sortable: true
  },
  {
    name: 'fechaRealizada',
    label: 'Fecha Realizada',
    field: 'fechaRealizada',
    align: 'center',
    sortable: true
  },
  {
    name: 'estado',
    label: 'Estado',
    field: 'estado',
    align: 'center',
    sortable: true
  },
  {
    name: 'observaciones',
    label: 'Observaciones',
    field: 'observaciones',
    align: 'center',
    sortable: true
  },
  {
    name: 'alertas',
    label: 'Alertas',
    field: 'alertas',
    align: 'center',
    sortable: true
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: 'acciones',
    align: 'center'
  }
]

// Filtrado debe hacerse en el backend - usar queryParams
// Los datos vienen filtrados del backend
const seguimientosFiltrados = seguimientos

// Modal de nuevo seguimiento
const showModalNuevo = ref(false)
const nuevoSeguimiento = ref({
  documento: '',
  tipoSeguimiento: '',
  numeroSeguimiento: {
    uno: false,
    dos: false,
    tres: false
  },
  motivoSolicitud: '',
  archivoPDF: null
})

// Modal de plantillas
const showModalPlantillas = ref(false)
const plantillas = ref([
  {
    id: 1,
    nombre: 'Seguimientos plantilla.pdf',
    icon: 'description'
  }
])

// Modal visualizar plantilla
const showModalVisualizarPlantilla = ref(false)

// Funciones
const goBack = () => {
  router.go(-1)
}

const aplicarFiltros = () => {}

const registrarSeguimiento = () => {
  showModalNuevo.value = true
  resetFormulario()
}

const resetFormulario = () => {
  nuevoSeguimiento.value = {
    documento: '',
    tipoSeguimiento: '',
    numeroSeguimiento: {
      uno: false,
      dos: false,
      tres: false
    },
    motivoSolicitud: '',
    archivoPDF: null
  }
}

const seleccionarArchivo = () => {
  document.getElementById('file-input').click()
}

const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf' && file.size <= 2 * 1024 * 1024) {
    nuevoSeguimiento.value.archivoPDF = file
  } else {
    $q.notify({
      type: 'negative',
      message: 'Por favor selecciona un archivo PDF menor a 2MB',
      position: 'top'
    })
  }
}

const cancelarNuevo = () => {
  showModalNuevo.value = false
  resetFormulario()
}

const guardarNuevo = () => {
  // Validaciones
  if (!nuevoSeguimiento.value.documento) {
    $q.notify({
      type: 'negative',
      message: 'Por favor ingrese el documento',
      position: 'top'
    })
    return
  }

  if (!nuevoSeguimiento.value.tipoSeguimiento) {
    $q.notify({
      type: 'negative',
      message: 'Por favor seleccione el tipo de seguimiento',
      position: 'top'
    })
    return
  }

  if (nuevoSeguimiento.value.tipoSeguimiento === 'Extraordinario' && !nuevoSeguimiento.value.motivoSolicitud) {
    $q.notify({
      type: 'negative',
      message: 'Por favor ingrese el motivo de solicitud',
      position: 'top'
    })
    return
  }

  if (!nuevoSeguimiento.value.archivoPDF) {
    $q.notify({
      type: 'negative',
      message: 'Por favor seleccione un archivo PDF',
      position: 'top'
    })
    return
  }  showModalNuevo.value = false
  
  // Mostrar alerta de éxito
  $q.notify({
    type: 'positive',
    message: '¡Proceso realizado exitosamente!',
    caption: 'Su solicitud se ha completado de forma satisfactoria. Ahora puede continuar con el siguiente paso o cerrar esta ventana.',
    position: 'top',
    timeout: 5000,
    html: true,
    classes: 'success-notification',
    actions: [
      {
        label: 'Cerrar',
        color: 'white',
        handler: () => { }
      }
    ]
  })
}

const verPlantillas = () => {
  showModalPlantillas.value = true
}

const cerrarPlantillas = () => {
  showModalPlantillas.value = false
}

const visualizarPlantilla = (plantilla) => {  showModalVisualizarPlantilla.value = true
}

const cerrarVisualizarPlantilla = () => {
  showModalVisualizarPlantilla.value = false
}

const descargarPlantillaVisualizada = () => {}

const eliminarSeguimiento = (row) => {}

const visualizarSeguimiento = (row) => {}

const descargarSeguimiento = (row) => {}

const getAlertColor = (alerta) => {
  // Sin usar includes - buscar substring manualmente
  let index = 0
  let foundCompletado = false
  while (index <= alerta.length - 'Completado'.length && !foundCompletado) {
    let matchIndex = 0
    let matches = true
    while (matchIndex < 'Completado'.length && matches) {
      if (alerta[index + matchIndex] !== 'Completado'[matchIndex]) {
        matches = false
      }
      matchIndex++
    }
    if (matches) foundCompletado = true
    index++
  }
  if (foundCompletado) return 'green'
  
  index = 0
  let foundProximo = false
  while (index <= alerta.length - 'Próximo a vencer'.length && !foundProximo) {
    let matchIndex = 0
    let matches = true
    while (matchIndex < 'Próximo a vencer'.length && matches) {
      if (alerta[index + matchIndex] !== 'Próximo a vencer'[matchIndex]) {
        matches = false
      }
      matchIndex++
    }
    if (matches) foundProximo = true
    index++
  }
  if (foundProximo) return 'red'
  
  index = 0
  let foundEspera = false
  while (index <= alerta.length - 'En espera'.length && !foundEspera) {
    let matchIndex = 0
    let matches = true
    while (matchIndex < 'En espera'.length && matches) {
      if (alerta[index + matchIndex] !== 'En espera'[matchIndex]) {
        matches = false
      }
      matchIndex++
    }
    if (matches) foundEspera = true
    index++
  }
  if (foundEspera) return 'orange'
  return 'grey'
}
</script>

<style scoped>
.seguimientos-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20px;
}

.back-button-container {
  margin-bottom: 15px;
  margin-left: 20px;
}

.seguimientos-container {
  background: white;
  border-radius: 8px;
  padding: 30px;
  margin: 0 auto;
  max-width: 98%;
}

.page-title {
  color: var(--color-primary);
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 25px 0;
  letter-spacing: 1px;
}

.filtros-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 25px;
  align-items: start;
}

.filtro-input {
  width: 100%;
}

:deep(.filtro-input .q-field__control) {
  height: 40px;
  border-radius: 6px;
}

.action-buttons {
  grid-column: 1 / -1;
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

.btn-filtrar,
.btn-registrar,
.btn-plantillas {
  background-color: var(--color-primary);
  color: white;
  border-radius: 6px;
  padding: 8px 20px;
  font-weight: 600;
  text-transform: none;
}

/* Estilos para celdas personalizadas */
.aprendiz-cell {
  text-align: left;
}

.aprendiz-nombre {
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.aprendiz-documento {
  font-size: 12px;
  color: #666;
}

.ficha-cell {
  text-align: left;
}

.ficha-numero {
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.ficha-programa {
  font-size: 12px;
  color: #666;
}

.estado-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.estado-text {
  font-weight: 500;
}

.alerta-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* Estilos del Modal */
.modal-header-custom {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}

.modal-body-content {
  padding: 10px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-input {
  width: 100%;
}

:deep(.form-input .q-field__control) {
  border-radius: 6px;
}

.checkbox-group {
  display: flex;
  gap: 20px;
  padding: 8px 0;
}

.file-upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.file-upload-area:hover {
  border-color: var(--color-border-primary);
  background-color: #f0f8f0;
}

.file-upload-text {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
}

.file-selected {
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: 4px;
}

.modal-footer-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  width: 100%;
}

/* Estilos para notificación de éxito */
:deep(.success-notification) {
  background-color: #f0f9f0 !important;
  border-left: 5px solid var(--color-border-primary) !important;
  color: #333 !important;
  padding: 16px 20px !important;
  min-width: 400px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

:deep(.success-notification .q-notification__message) {
  font-weight: 600 !important;
  font-size: 16px !important;
  color: var(--color-primary) !important;
}

:deep(.success-notification .q-notification__caption) {
  color: #666 !important;
  font-size: 14px !important;
  margin-top: 8px !important;
  line-height: 1.4 !important;
}

:deep(.success-notification .q-notification__actions) {
  color: var(--color-primary) !important;
}

/* Estilos del Modal de Plantillas */
.plantillas-list {
  padding: 10px 0;
}

.plantilla-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 8px;
  transition: background-color 0.2s ease;
}

.plantilla-item:hover {
  background-color: #f9f9f9;
}

.plantilla-item:last-child {
  border-bottom: none;
}

.plantilla-nombre {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.plantilla-actions {
  display: flex;
  gap: 8px;
}

/* Estilos del visor de plantilla */
.plantilla-viewer {
  width: 100%;
}

.pdf-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.pdf-toolbar {
  background-color: #fff;
  padding: 10px 15px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}

.pdf-preview {
  background-color: #fff;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.pdf-placeholder {
  text-align: center;
}

.pdf-placeholder p {
  margin-top: 16px;
  font-size: 16px;
  font-weight: 500;
}

.pdf-placeholder small {
  display: block;
  margin-top: 8px;
  font-size: 13px;
}

/* Responsive */
@media (max-width: 1200px) {
  .filtros-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .seguimientos-container {
    padding: 20px;
  }

  .filtros-section {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 24px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .q-btn {
    width: 100%;
  }
}
</style>