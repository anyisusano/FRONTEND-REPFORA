<template>
  <div class="detalle-aprendiz-page">
    <!-- Header con flecha de retroceso -->
    <div class="header">
      <BackButton/>
    </div>

    <!-- Card principal -->
    <div class="main-card">
      <!-- Nombre del aprendiz -->
      <h2 class="aprendiz-nombre">{{ nombreAprendiz }}</h2>

      <!-- Banner verde con número de ficha -->
      <div class="banner-ficha">
        <h3 class="ficha-title">Ficha {{ numeroFicha }}</h3>
      </div>

      <!-- Mostrar instructor asignado si existe -->
      <div v-if="instructorAsignado" class="instructor-asignado">
        <h4 class="instructor-title">Instructor Asignado:</h4>
        <div class="instructor-info">
          <div class="instructor-avatar">
            <span>{{ getInitials(instructorAsignado.nombre) }}</span>
          </div>
          <div class="instructor-datos">
            <p class="instructor-nombre">{{ instructorAsignado.nombre }}</p>
            <p class="instructor-cargo">{{ instructorAsignado.cargo }}</p>
          </div>
        </div>
      </div>

      <!-- Mensaje de selección de contrato -->
      <div class="mensaje-contrato">
        <p>La aprendiz seleccionó <strong>{{ tipoContrato }}</strong></p>
      </div>

      <!-- Tabla usando maintable -->
      <div class="table-section">
        <maintable
          :datos="documentos"
          :columnas="columnasTabla"
          row-key="id"
          :no-data-label="'No hay documentos para mostrar'"
          :initial-rows-per-page="10"
          @visualizar="abrirDocumento"
        >
          <!-- Slot personalizado para la columna Documentos -->
          <template #body-cell-documentos="props">
            <q-td :props="props" class="text-left">
              {{ props.row.nombre }}
            </q-td>
          </template>

          <!-- Slot personalizado para la columna Opciones -->
          <template #body-cell-opciones="props">
            <q-td :props="props" class="text-center">
              <a 
                href="#" 
                class="ver-documentos-link"
                @click.prevent="abrirDocumento(props.row)"
              >
                Ver documentos
              </a>
            </q-td>
          </template>
        </maintable>
      </div>

      <!-- Botones de acción -->
      <div class="buttons-container">
        <q-btn
          label="Rechazar"
          class="boton-rechazar"
          unelevated
          no-caps
          @click="abrirModalRechazo"
        />
        <q-btn
          label="Aceptar"
          class="boton-aceptar"
          unelevated
          no-caps
          @click="abrirModalAceptar"
        />
      </div>
    </div>

    <!-- Modal de Confirmación de Rechazo -->
    <modalComponent ref="modalRechazoRef">
      <template #header>
        <div class="text-h6">Rechazar Documentos</div>
      </template>

      <template #body>
        <div class="q-pa-md">
          <p class="text-body1">¿Está seguro que desea rechazar los documentos de <strong>{{ nombreAprendiz }}</strong>?</p>
          <q-input
            v-model="motivoRechazo"
            type="textarea"
            label="Motivo del rechazo (opcional)"
            outlined
            rows="4"
            class="q-mt-md"
          />
        </div>
      </template>

      <template #footer>
        <BotonCerrar @click="cerrarModalRechazo" />
        <BotonEnviar label="Rechazar" @click="confirmarRechazo" />
      </template>
    </modalComponent>

    <!-- Modal de Confirmación de Aceptación -->
    <modalComponent ref="modalAceptarRef">
      <template #header>
        <div class="text-h6">Aceptar Documentos</div>
      </template>

      <template #body>
        <div class="q-pa-md">
          <p class="text-body1">¿Está seguro que desea aceptar los documentos de <strong>{{ nombreAprendiz }}</strong>?</p>
          <p class="text-caption text-grey-7 q-mt-md">Esta acción confirmará que todos los documentos están correctos.</p>
        </div>
      </template>

      <template #footer>
        <BotonCerrar @click="cerrarModalAceptar" />
        <BotonEnviar label="Aceptar" @click="confirmarAceptacion" />
      </template>
    </modalComponent>

    <!-- Modal para Asignar Instructores (Paso 1) - Actualizado -->
    <modalComponent ref="modalAsignarInstructoresRef" width="600px">
      <template #header>
        <div class="modal-header-custom">
          <h3 class="modal-title">Asignar Instructores</h3>
        </div>
      </template>

      <template #body>
        <div class="modal-body-custom">
          <!-- Área de conocimiento -->
          <div class="form-group">
            <label class="form-label">Área de conocimiento</label>
            <q-select
              v-model="areaConocimiento"
              :options="areasConocimiento"
              outlined
              placeholder="Seleccione área"
              class="custom-select-modal"
              @update:model-value="cargarInstructoresPorArea"
            />
          </div>

          <!-- Instructor de Seguimiento -->
          <div class="form-group">
            <label class="form-label">Instructor de Seguimiento</label>
            <q-select
              v-model="instructorSeguimiento"
              :options="instructoresDisponibles"
              option-label="nombre"
              option-value="id"
              outlined
              placeholder="Seleccione instructor"
              :disable="!areaConocimiento"
              class="custom-select-modal"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    {{ !areaConocimiento ? 'Primero seleccione un área' : 'No hay instructores disponibles' }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Línea divisoria -->
          <div class="divider-line"></div>

          <!-- Información del aprendiz -->
          <div class="aprendiz-info-section">
            <div class="aprendiz-info-header">
              <strong>La aprendiz</strong>
            </div>
            <div class="aprendiz-details">
              <div class="detail-item">
                <span class="detail-label">Documental:</span>
                <span class="detail-value">Completo</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Contratos fija:</span>
                <span class="detail-value">Aprobado</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Certificación:</span>
                <span class="detail-value">En proceso</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Registro en:</span>
                <span class="detail-value">Sistema</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-custom-simple">
          <q-btn
            label="Asignar"
            class="boton-asignar-modal"
            unelevated
            no-caps
            @click="confirmarAsignacionInstructor"
          />
        </div>
      </template>
    </modalComponent>

    <!-- Modal de Confirmación de Asignación - Actualizado -->
    <modalComponent ref="modalConfirmacionAsignacionRef" width="600px">
      <template #header>
        <div class="modal-header-simple">
          <h3 class="modal-title-center">{{ nombreAprendiz }}</h3>
        </div>
      </template>

      <template #body>
        <div class="modal-confirmacion-body">
          <!-- Área de conocimiento seleccionada -->
          <div class="confirmacion-section">
            <label class="confirmacion-label">Área de conocimiento</label>
            <div class="confirmacion-value">
              <div class="selected-area-chip">
                {{ areaConocimiento }}
              </div>
            </div>
          </div>

          <!-- Instructor seleccionado -->
          <div class="confirmacion-section">
            <label class="confirmacion-label">Instructor de Seguimiento</label>
            <div class="instructor-confirmacion">
              <div class="instructor-avatar-confirm">
                {{ getInitials(instructorSeguimiento?.nombre) }}
              </div>
              <div class="instructor-datos-confirm">
                <p class="instructor-nombre-confirm">{{ instructorSeguimiento?.nombre }}</p>
                <p class="instructor-cargo-confirm">{{ instructorSeguimiento?.cargo }}</p>
              </div>
            </div>
          </div>

          <!-- Línea divisoria -->
          <div class="divider-line"></div>

          <!-- Información del aprendiz -->
          <div class="aprendiz-info-section">
            <div class="aprendiz-info-header">
              <strong>La aprendiz</strong>
            </div>
            <div class="aprendiz-details">
              <div class="detail-item">
                <span class="detail-label">Documental:</span>
                <span class="detail-value">Completo</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Contratos fija:</span>
                <span class="detail-value">Aprobado</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Certificación:</span>
                <span class="detail-value">En proceso</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Registro en:</span>
                <span class="detail-value">Sistema</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-custom-dual">
          <q-btn
            label="Aceptado"
            class="boton-aceptado-modal"
            unelevated
            no-caps
            @click="finalizarAsignacion"
          />
          <q-btn
            label="Rechazar"
            class="boton-rechazar-modal"
            unelevated
            no-caps
            @click="cerrarModalConfirmacion"
          />
        </div>
      </template>
    </modalComponent>

    <!-- Modal de Instructor Asignado Exitosamente - Actualizado -->
    <modalComponent ref="modalExitoAsignacionRef" width="550px">
      <template #header>
        <div class="modal-header-empresa">
          <h3 class="modal-title-empresa">REFFORA EP</h3>
        </div>
      </template>

      <template #body>
        <div class="modal-exito-body">
          <!-- Nombre del aprendiz -->
          <h2 class="aprendiz-nombre-modal">{{ nombreAprendiz }}</h2>

          <!-- Banner verde con número de ficha -->
          <div class="banner-ficha-modal">
            <h3 class="ficha-title">Ficha {{ numeroFicha }}</h3>
          </div>

          <!-- Instructor asignado -->
          <div class="instructor-asignado-modal">
            <h4 class="instructor-title-modal">Instructor Asignado:</h4>
            <div class="instructor-info-modal">
              <div class="instructor-avatar-modal">
                <span>{{ getInitials(instructorAsignado?.nombre) }}</span>
              </div>
              <div class="instructor-datos-modal">
                <p class="instructor-nombre-modal">{{ instructorAsignado?.nombre }}</p>
                <p class="instructor-cargo-modal">{{ instructorAsignado?.cargo }}</p>
              </div>
            </div>
          </div>

          <!-- Línea divisoria -->
          <div class="divider-line-modal"></div>

          <!-- Mensaje de contrato -->
          <div class="mensaje-contrato-modal">
            <p>La aprendiz seleccionó <strong>{{ tipoContrato }}</strong></p>
          </div>

          <!-- Tabla pequeña de documentos -->
          <div class="tabla-documentos-modal">
            <table class="simple-table-modal">
              <thead>
                <tr>
                  <th class="text-left">Documentos</th>
                  <th class="text-center">Opciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-left">Contrato firmado por todas las partes</td>
                  <td class="text-center">
                    <a href="#" class="ver-documentos-link-modal" @click.prevent="abrirDocumentoDesdeModal">Ver documentos</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <p class="postfoneidos-text">Postfoneídos de atributos AB</p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-custom-center">
          <BotonCerrar label="Cerrar" @click="cerrarModalExito" />
        </div>
      </template>
    </modalComponent>

    <!-- Modal para Ver Documento -->
    <modalComponent ref="modalDocumentoRef" width="800px">
      <template #header>
        <div class="text-h6">{{ documentoSeleccionado?.nombre }}</div>
      </template>

      <template #body>
        <div class="q-pa-md text-center">
          <q-icon name="description" size="100px" color="grey-5" />
          <p class="text-body1 q-mt-md">Vista previa del documento</p>
          <p class="text-caption text-grey-7">En producción aquí se mostraría el PDF o imagen del documento</p>
        </div>
      </template>

      <template #footer>
        <BotonCerrar label="Cerrar" @click="cerrarModalDocumento" />
      </template>
    </modalComponent>

    <!-- Botón flotante de notificaciones -->
    <q-btn
      fab
      icon="notifications"
      color="green"
      class="fab-notificaciones"
      @click="$router.push('/notificaciones')"
    >
      <q-badge color="red" floating>3</q-badge>
    </q-btn>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import modalComponent from '@/components/modals/modalComponent.vue'
import maintable from '@/components/tables/maintable.vue'
import BotonCerrar from '@/components/BotonCerrar.vue'
import BotonEnviar from '@/components/BotonEnviar.vue'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

// Referencias de modales
const modalRechazoRef = ref(null)
const modalAceptarRef = ref(null)
const modalDocumentoRef = ref(null)
const modalAsignarInstructoresRef = ref(null)
const modalConfirmacionAsignacionRef = ref(null)
const modalExitoAsignacionRef = ref(null)

// Estados
const motivoRechazo = ref('')
const documentoSeleccionado = ref(null)
const areaConocimiento = ref(null)
const instructorSeguimiento = ref(null)
const instructorAsignado = ref(null)

// Datos del aprendiz desde la ruta
const numeroFicha = computed(() => route.params.ficha || '2926076')
const nombreAprendiz = computed(() => route.query.nombre || 'Alejandra Ruiz Torres')
const tipoContrato = ref('Contrato de Aprendizaje')

// Áreas de conocimiento
const areasConocimiento = ref([
  'Diseño y Metrología',
  'Economía, Finanzas y Telecomunicaciones',
  'Salud y Actividad Física',
  'Gestión Industrial'
])

// Instructores disponibles
const todosLosInstructores = ref([
  { 
    id: 1, 
    nombre: 'Sylvia Lopez', 
    especialidad: 'Diseño y Metrología',
    cargo: 'Instructor de Seguimiento',
    area: 'Diseño y Metrología'
  },
  { 
    id: 2, 
    nombre: 'Juan Carlos García', 
    especialidad: 'Economía y Finanzas',
    cargo: 'Instructor de Seguimiento',
    area: 'Economía, Finanzas y Telecomunicaciones'
  },
  { 
    id: 3, 
    nombre: 'María Fernández', 
    especialidad: 'Salud y Deporte',
    cargo: 'Instructora de Seguimiento',
    area: 'Salud y Actividad Física'
  },
  { 
    id: 4, 
    nombre: 'Pedro Ramírez', 
    especialidad: 'Gestión de Proyectos',
    cargo: 'Instructor de Seguimiento',
    area: 'Gestión Industrial'
  }
])

const instructoresDisponibles = ref([])

// Columnas para la tabla
const columnasTabla = [
  {
    name: 'documentos',
    required: true,
    label: 'Documentos',
    align: 'left',
    field: row => row.nombre,
    sortable: true
  },
  {
    name: 'opciones',
    required: true,
    label: 'Opciones',
    align: 'center',
    field: row => row.nombre
  }
]

// Documentos del aprendiz
const documentos = ref([
  { 
    id: 1, 
    nombre: 'Contrato firmado por todas las partes',
    url: '/docs/contrato.pdf'
  },
  { 
    id: 2, 
    nombre: 'Certificación de afiliación ARL',
    url: '/docs/arl.pdf'
  },
  { 
    id: 3, 
    nombre: 'Registro en planilla',
    url: '/docs/planilla.pdf'
  }
])

// Funciones
function goBack() {
  router.back()
}

function getInitials(nombre) {
  if (!nombre) return ''
  const parts = nombre.split(' ')
  return parts.length >= 2 
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : nombre.substring(0, 2).toUpperCase()
}

function cargarInstructoresPorArea() {
  if (areaConocimiento.value) {
    // Sin usar filter - el backend debe filtrar los instructores disponibles
    const filtered = []
    let index = 0
    while (index < todosLosInstructores.value.length) {
      const instructor = todosLosInstructores.value[index]
      if (instructor && instructor.area === areaConocimiento.value) {
        filtered.push(instructor)
      }
      index++
    }
    instructoresDisponibles.value = filtered
  } else {
    instructoresDisponibles.value = []
  }
  instructorSeguimiento.value = null
}

function abrirDocumentoDesdeModal() {
  const documento = documentos.value[0] // Contrato firmado
  abrirDocumento(documento)
}

function cerrarModalConfirmacion() {
  modalConfirmacionAsignacionRef.value?.closeDialog()
}

// Modales de Rechazo
function abrirModalRechazo() {
  motivoRechazo.value = ''
  modalRechazoRef.value?.openDialog()
}

function cerrarModalRechazo() {
  modalRechazoRef.value?.closeDialog()
}

// Modales de Aceptación
function abrirModalAceptar() {
  modalAceptarRef.value?.openDialog()
}

function cerrarModalAceptar() {
  modalAceptarRef.value?.closeDialog()
}

async function confirmarAceptacion() {
  try {    
    cerrarModalAceptar()
    
    // Abrir modal de asignación de instructores
    setTimeout(() => {
      abrirModalAsignarInstructores()
    }, 300)
  } catch (error) {    $q.notify({
      type: 'negative',
      message: 'Error al aceptar documentos',
      position: 'top'
    })
  }
}

// Modales de Asignación de Instructores
function abrirModalAsignarInstructores() {
  areaConocimiento.value = null
  instructorSeguimiento.value = null
  instructoresDisponibles.value = []
  modalAsignarInstructoresRef.value?.openDialog()
}

function cerrarModalAsignarInstructores() {
  modalAsignarInstructoresRef.value?.closeDialog()
}

function confirmarAsignacionInstructor() {
  if (!areaConocimiento.value || !instructorSeguimiento.value) {
    $q.notify({
      type: 'warning',
      message: 'Debe seleccionar un área y un instructor',
      position: 'top'
    })
    return
  }
  
  cerrarModalAsignarInstructores()
  
  // Abrir modal de confirmación
  setTimeout(() => {
    modalConfirmacionAsignacionRef.value?.openDialog()
  }, 300)
}

function finalizarAsignacion() {
  instructorAsignado.value = {
    nombre: instructorSeguimiento.value.nombre,
    cargo: instructorSeguimiento.value.cargo
  }
  
  modalConfirmacionAsignacionRef.value?.closeDialog()
  
  $q.notify({
    type: 'positive',
    message: 'Instructor asignado correctamente',
    position: 'top'
  })
  
  // Mostrar modal de éxito
  setTimeout(() => {
    modalExitoAsignacionRef.value?.openDialog()
  }, 300)
}

function cerrarModalExito() {
  modalExitoAsignacionRef.value?.closeDialog()
}

// Modal de Documento
function abrirDocumento(documento) {
  documentoSeleccionado.value = documento
  modalDocumentoRef.value?.openDialog()
}

function cerrarModalDocumento() {
  modalDocumentoRef.value?.closeDialog()
}

// Rechazo de documentos
async function confirmarRechazo() {
  try {    
    $q.notify({
      type: 'negative',
      message: 'Documentos rechazados correctamente',
      position: 'top'
    })
    
    cerrarModalRechazo()
    
    setTimeout(() => {
      goBack()
    }, 1000)
  } catch (error) {    $q.notify({
      type: 'negative',
      message: 'Error al rechazar documentos',
      position: 'top'
    })
  }
}
</script>

<style scoped>
.detalle-aprendiz-page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding: 15px 20px;
  position: relative;
}

/* Header */
.header {
  margin-bottom: 20px;
}

/* Card principal */
.main-card {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: 25px 30px 30px;
}

/* Nombre del aprendiz */
.aprendiz-nombre {
  font-size: 20px;
  font-weight: 700;
  color: #000;
  text-align: center;
  margin: 0 0 20px 0;
}

/* Banner verde */
.banner-ficha {
  background: var(--gradient-primary-dark);
  padding: 14px 18px;
  text-align: center;
  border-radius: 10px;
  margin-bottom: 20px;
}

.ficha-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0;
}

/* Instructor Asignado */
.instructor-asignado {
  background-color: #E8F5E9;
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.instructor-title {
  font-size: 15px;
  font-weight: 700;
  color: #000;
  margin: 0 0 12px 0;
}

.instructor-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.instructor-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: white;
}

.instructor-datos {
  flex: 1;
}

.instructor-nombre {
  font-size: 15px;
  font-weight: 600;
  color: #000;
  margin: 0 0 4px 0;
}

.instructor-cargo {
  font-size: 13px;
  color: #666;
  margin: 0;
}

/* Mensaje de contrato */
.mensaje-contrato {
  background-color: #F8F9FA;
  padding: 12px 18px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid var(--color-border-primary);
}

.mensaje-contrato p {
  margin: 0;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.mensaje-contrato strong {
  color: #000;
  font-weight: 600;
}

/* Sección de tabla */
.table-section {
  margin-bottom: 25px;
}

/* Link de ver documentos */
.ver-documentos-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 13px;
  transition: color 0.2s;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.ver-documentos-link:hover {
  color: var(--color-primary-hover-dark);
  text-decoration: underline;
  background-color: #f0f8e8;
}

/* Botones de acción */
.buttons-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
}

.boton-rechazar {
  background-color: #ABABAB;
  color: #333;
  border-radius: 10px;
  padding: 9px 30px;
  font-size: 14px;
  font-weight: 600;
  text-transform: none;
  transition: background-color 0.2s ease;
  min-width: 120px;
}

.boton-rechazar:hover {
  background-color: #999999;
}

.boton-aceptar {
  background-color: var(--color-primary);
  color: white;
  border-radius: 10px;
  padding: 9px 30px;
  font-size: 14px;
  font-weight: 600;
  text-transform: none;
  transition: background-color 0.2s ease;
  min-width: 120px;
}

.boton-aceptar:hover {
  background-color: var(--color-primary-hover-dark);
}

/* ========== ESTILOS ACTUALIZADOS PARA MODALES ========== */

/* Estilos base para headers de modales */
:deep(.q-dialog__inner > .q-card) {
  max-width: 600px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

:deep(.q-card__section--vert) {
  padding: 0;
}

/* Headers de modales estandarizados */
:deep(.q-dialog .q-card > .q-card__section:first-child) {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover-dark) 100%);
  padding: 20px 24px;
  border-radius: 12px 12px 0 0;
}

:deep(.q-dialog .text-h6) {
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

/* Modal Header Simple */
.modal-header-custom {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover-dark) 100%);
  padding: 20px 24px;
  border-radius: 12px 12px 0 0;
  border-bottom: none;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0;
  text-align: center;
  width: 100%;
}

.modal-header-simple {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover-dark) 100%);
  padding: 20px 24px;
  border-radius: 12px 12px 0 0;
}

.modal-title-center {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0;
  text-align: center;
}

/* Modal Header Empresa */
.modal-header-empresa {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover-dark) 100%);
  padding: 20px 24px;
  border-radius: 12px 12px 0 0;
  text-align: center;
  border-bottom: none;
}

.modal-title-empresa {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0;
}

/* Modal Body estandarizado */
.modal-body-custom,
.modal-confirmacion-body,
.modal-exito-body {
  padding: 24px 28px;
  background: white;
}

:deep(.q-dialog .q-card__section:not(:first-child):not(:last-child)) {
  padding: 24px 28px;
}

/* Estilos para inputs y selects en modales */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 8px;
}

/* Select personalizado */
:deep(.custom-select-modal .q-field__control) {
  border-radius: 8px;
  min-height: 48px;
  border: 1px solid #E0E0E0;
  background: white;
  transition: all 0.3s ease;
}

:deep(.custom-select-modal.q-field--focused .q-field__control) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

:deep(.custom-select-modal .q-field__control:hover) {
  border-color: var(--color-primary);
}

:deep(.custom-select-modal .q-field__control:before) {
  border: none;
}

:deep(.custom-select-modal .q-field__native) {
  padding: 12px 16px;
  font-size: 14px;
  color: #2C3E50;
}

/* Textarea en modales */
:deep(.q-dialog .q-field--outlined .q-field__control) {
  border-radius: 8px;
  border: 1px solid #E0E0E0;
  transition: all 0.3s ease;
}

:deep(.q-dialog .q-field--outlined.q-field--focused .q-field__control) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

:deep(.q-dialog .q-field--outlined .q-field__control:before) {
  border: none;
}

/* Línea divisoria */
.divider-line,
.divider-line-modal {
  height: 1px;
  background: linear-gradient(90deg, transparent, #E0E0E0 20%, #E0E0E0 80%, transparent);
  margin: 20px 0;
}

/* Sección de información del aprendiz */
.aprendiz-info-section {
  background: linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%);
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid var(--color-primary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.aprendiz-info-header {
  margin-bottom: 12px;
}

.aprendiz-info-header strong {
  font-size: 14px;
  color: #2C3E50;
  font-weight: 600;
}

.aprendiz-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #F0F0F0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 13px;
  color: #7F8C8D;
}

.detail-value {
  font-size: 13px;
  color: #2C3E50;
  font-weight: 500;
}

/* Confirmación - Chip de área */
.selected-area-chip {
  background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%);
  color: var(--color-primary);
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  border: 1px solid var(--color-border-primary);
  display: inline-block;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.1);
}

/* Instructor confirmación */
.instructor-confirmacion {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 14px;
  background: linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%);
  border-radius: 8px;
  border: 1px solid #E0E0E0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.instructor-confirmacion:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.instructor-avatar-confirm {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover-dark) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: white;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.instructor-datos-confirm {
  flex: 1;
}

.instructor-nombre-confirm {
  font-size: 15px;
  font-weight: 600;
  color: #2C3E50;
  margin: 0 0 4px 0;
}

.instructor-cargo-confirm {
  font-size: 13px;
  color: #7F8C8D;
  margin: 0;
}

/* Footers de modales estandarizados */
.modal-footer-custom-simple,
.modal-footer-custom-dual,
.modal-footer-custom-center {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 20px 24px;
  background: #F8F9FA;
  border-radius: 0 0 12px 12px;
  border-top: 1px solid #E0E0E0;
}

:deep(.q-dialog .q-card__section:last-child) {
  background: #F8F9FA;
  border-radius: 0 0 12px 12px;
  padding: 20px 24px;
}

/* Botones de modales estandarizados */
.boton-asignar-modal,
.boton-aceptado-modal {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover-dark) 100%);
  color: white;
  border-radius: 8px;
  padding: 10px 32px;
  font-size: 14px;
  font-weight: 600;
  text-transform: none;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.boton-asignar-modal:hover,
.boton-aceptado-modal:hover {
  background: linear-gradient(135deg, var(--color-primary-hover-dark) 0%, var(--color-primary) 100%);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
  transform: translateY(-2px);
}

.boton-rechazar-modal {
  background: linear-gradient(135deg, #DC3545 0%, #C82333 100%);
  color: white;
  border-radius: 8px;
  padding: 10px 32px;
  font-size: 14px;
  font-weight: 600;
  text-transform: none;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  transition: all 0.3s ease;
}

.boton-rechazar-modal:hover {
  background: linear-gradient(135deg, #C82333 0%, #DC3545 100%);
  box-shadow: 0 6px 16px rgba(220, 53, 69, 0.4);
  transform: translateY(-2px);
}

/* Estilos para BotonCerrar y BotonEnviar */
:deep(.q-btn.boton-cerrar),
:deep(.q-btn.boton-enviar) {
  border-radius: 8px;
  padding: 10px 32px;
  font-size: 14px;
  font-weight: 600;
  text-transform: none;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:deep(.q-btn.boton-cerrar:hover),
:deep(.q-btn.boton-enviar:hover) {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .main-card {
    padding: 20px 18px 25px;
    max-width: 100%;
  }

  .aprendiz-nombre {
    font-size: 18px;
  }

  .buttons-container {
    flex-direction: column;
    gap: 10px;
  }

  .boton-rechazar,
  .boton-aceptar {
    width: 100%;
  }

  .table-section {
    overflow-x: auto;
  }

  :deep(.tabla-container) {
    min-width: 500px;
  }

  .fab-notificaciones {
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
  }

  /* Modales responsive */
  :deep(.q-dialog__inner > .q-card) {
    max-width: 95%;
  }

  .modal-header-custom,
  .modal-header-simple,
  .modal-header-empresa {
    padding: 18px 20px;
  }

  .modal-body-custom,
  .modal-confirmacion-body,
  .modal-exito-body {
    padding: 20px 24px;
  }
  
  :deep(.q-dialog .q-card__section:not(:first-child):not(:last-child)) {
    padding: 20px 24px;
  }
  
  .aprendiz-details {
    grid-template-columns: 1fr;
  }
  
  .modal-footer-custom-simple,
  .modal-footer-custom-dual,
  .modal-footer-custom-center {
    flex-direction: column;
    gap: 10px;
    padding: 18px 20px;
  }
  
  .boton-aceptado-modal,
  .boton-rechazar-modal,
  .boton-asignar-modal {
    width: 100%;
  }

  :deep(.q-btn.boton-cerrar),
  :deep(.q-btn.boton-enviar) {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .detalle-aprendiz-page {
    padding: 10px 12px;
  }

  .main-card {
    padding: 15px 12px 20px;
  }

  .aprendiz-nombre {
    font-size: 16px;
  }

  .banner-ficha {
    padding: 12px 15px;
  }

  .ficha-title {
    font-size: 16px;
  }

  .mensaje-contrato {
    padding: 10px 15px;
    font-size: 13px;
  }

  .ver-documentos-link {
    font-size: 12px;
  }

  :deep(.q-table__bottom) {
    padding: 6px 0;
    min-height: 35px;
  }

  /* Modales responsive móvil */
  .modal-header-custom,
  .modal-header-simple,
  .modal-header-empresa {
    padding: 16px 18px;
  }

  .modal-title,
  .modal-title-center {
    font-size: 16px;
  }

  .modal-title-empresa {
    font-size: 18px;
  }

  .modal-body-custom,
  .modal-confirmacion-body,
  .modal-exito_body {
    padding: 16px 20px;
  }
  
  :deep(.q_dialog .q_card__section:not(:first-child):not(:last-child)) {
    padding: 16px 20px;
  }

  .form-label {
    font-size: 13px;
  }

  :deep(.custom-select-modal .q-field__control) {
    min-height: 44px;
  }

  .confirmacion-label {
    font-size: 13px;
  }

  .instructor-confirmacion {
    padding: 12px;
    gap: 12px;
  }

  .instructor-avatar-confirm {
    width: 45px;
    height: 45px;
    font-size: 16px;
  }

  .instructor-nombre-confirm {
    font-size: 14px;
  }

  .instructor-cargo-confirm {
    font-size: 12px;
  }

  .modal-footer-custom-simple,
  .modal-footer-custom-dual,
  .modal-footer-custom-center {
    padding: 16px 18px;
  }

  :deep(.q-dialog .q-card__section:last-child) {
    padding: 16px 18px;
  }

  .boton-asignar-modal,
  .boton-aceptado-modal,
  .boton-rechazar-modal {
    padding: 10px 24px;
    font-size: 13px;
  }

  :deep(.q-btn.boton-cerrar),
  :deep(.q-btn.boton-enviar) {
    padding: 10px 24px;
    font-size: 13px;
  }
}

/* Scrollbar personalizado para lista de instructores */
.instructores-list::-webkit-scrollbar {
  width: 6px;
}

.instructores-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.instructores-list::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 3px;
}

.instructores-list::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-hover-dark);
}

.content-wrapper[data-v-58904e76] {

    padding-top: 50px;
}
</style>
