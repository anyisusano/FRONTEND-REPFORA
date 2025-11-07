

<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">ALERTAS</h1>
    </div>

    <div class="container">
      <q-card class="section-card q-mb-lg">
        <div class="section-header">
          <div class="header-title">Configuración de Fichas</div>
        </div>

        <q-card-section class="section-content">
          <div class="config-row">
            <div class="config-label-group">
              <div class="config-label">Fichas nuevas (posterior a noviembre 2024)</div>
              <div class="config-sublabel">Tiempo límite sin registrar etapa productiva</div>
            </div>
            <div class="config-input-group">
              <q-input
                v-model="formData.newRecordsTime"
                type="number"
                outlined
                dense
                class="custom-select"
              />
              <span class="input-hint">Mes</span>
            </div>
          </div>

          <div class="config-row">
            <div class="config-label-group">
              <div class="config-label">Fichas antiguas (anterior a noviembre 2024)</div>
              <div class="config-sublabel">Tiempo límite sin registrar etapa productiva</div>
            </div>
            <div class="config-input-group">
              <q-input
                v-model="formData.oldRecordsTime"
                type="number"
                outlined
                dense
                class="custom-select"
              />
              <span class="input-hint">Año</span>
            </div>
          </div>

          <div class="config-row">
            <div class="config-label-group">
              <div class="config-label">Máximo de registros por aprendiz/ficha</div>
              <div class="config-sublabel">Número máximo de registros permitidos por aprendiz en una ficha</div>
            </div>
            <div class="config-input-group">
              <q-input
                v-model="formData.maxRecordsPerApprentice"
                type="number"
                outlined
                dense
                class="custom-select"
                min="1"
              />
              <span class="input-hint">Registros</span>
            </div>
          </div>

          <div class="config-row">
            <div class="config-label-group">
              <div class="config-label">Horas mensuales instructores</div>
              <div class="config-sublabel">Límite de horas mensuales asignables por instructor</div>
            </div>
            <div class="config-input-group">
              <q-input
                v-model="formData.monthlyInstructorHours"
                type="number"
                outlined
                dense
                class="custom-select"
                min="0"
              />
              <span class="input-hint">Horas</span>
            </div>
          </div>

          <div class="form-actions">
            <BotonEnviar
              label="Guardar Configuración"
              @click="handleOpenConfirmation(SECTION_TYPES.FICHE)"
            />
          </div>
        </q-card-section>
      </q-card>

      <q-card class="section-card q-mb-lg">
        <div class="section-header">
          <div class="header-title">Alertas Escalonadas</div>
        </div>

        <q-card-section class="section-content">
          <div class="alert-box alert-yellow q-mb-md">
            <div class="alert-content">
              <div class="alert-label-group">
                <div class="alert-title">Amarilla</div>
                <div class="alert-subtitle">Primera notificación preventiva</div>
              </div>
              <div class="alert-input-group">
                <q-select
                  v-model="formData.yellowAlertDays"
                  :options="daysOptions"
                  outlined
                  dense
                  class="alert-select"
                />
                <span class="alert-hint">días antes del vencimiento</span>
              </div>
            </div>
          </div>

          <div class="alert-box alert-orange q-mb-md">
            <div class="alert-content">
              <div class="alert-label-group">
                <div class="alert-title">Naranja</div>
                <div class="alert-subtitle">Notificación de atención urgente</div>
              </div>
              <div class="alert-input-group">
                <q-select
                  v-model="formData.orangeAlertDays"
                  :options="daysOptions"
                  outlined
                  dense
                  class="alert-select"
                />
                <span class="alert-hint">días antes del vencimiento</span>
              </div>
            </div>
          </div>

          <div class="alert-box alert-red q-mb-md">
            <div class="alert-content">
              <div class="alert-label-group">
                <div class="alert-title">Roja</div>
                <div class="alert-subtitle">Notificación crítica inmediata</div>
              </div>
              <div class="alert-input-group">
                <q-select
                  v-model="formData.redAlertDays"
                  :options="daysOptions"
                  outlined
                  dense
                  class="alert-select"
                />
                <span class="alert-hint">días antes del vencimiento</span>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <BotonEnviar
              label="Guardar Configuración"
              @click="handleOpenConfirmation(SECTION_TYPES.ESCALATED)"
            />
          </div>
        </q-card-section>
      </q-card>

    </div>

    <modalComponent
      ref="confirmationModalRef"
      width="500px"
      max-width="90vw"
    >
      <template #header>
        <div class="modal-header-content">
          <div class="text-h6">¿Está seguro de que desea guardar los cambios?</div>
          <q-btn
            flat
            round
            dense
            icon="close"
            color="red"
            @click="handleCloseConfirmation"
          />
        </div>
      </template>

      <template #body>
        <div class="modal-body-content">
          <p class="confirmation-text">
            {{ getSectionLabel() }}
          </p>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-buttons">
          <BotonCerrar label="Cancelar" @click="handleCloseConfirmation" />
          <BotonEnviar
            label="Aceptar"
            @click="handleSaveConfiguration"
            :loading="isSaving"
          />
        </div>
      </template>
    </modalComponent>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getData, putData } from '../../../services/apiClient'
import { useNotifications } from '../../../composables/useNotifications'
import BackButton from '../../../components/BackButton.vue'
import BotonCerrar from '../../../components/BotonCerrar.vue'
import BotonEnviar from '../../../components/BotonEnviar.vue'
import modalComponent from '../../../components/modals/modalComponent.vue'


const PARAMETER_NAMES = {
  ALERTAS_FICHAS_NUEVAS: 'ALERTAS FICHAS NUEVAS',
  EXPIRACION_FICHAS_ANTIGUAS: 'EXPIRACION FICHAS ANTIGUAS',
  ALERTA_AMARILLA: 'ALERTA AMARILLA',
  ALERTA_NARANJA: 'ALERTA NARANJA',
  ALERTA_ROJA_CRITICA: 'ALERTA ROJA CRITICA',
  HORAS_MENSUALES_INSTRUCTORES: 'HORAS MENSUALES INSTRUCTORES',
  MAXIMO_REGISTROS_POR_APRENDIZ: 'MAXIMO DE REGISTROS POR APRENDIZ/FICHA'
}

const SECTION_TYPES = {
  FICHE: 'fiche',
  ESCALATED: 'escalated'
}


const notifications = useNotifications()

const confirmationModalRef = ref(null)
const currentSection = ref('')
const isSaving = ref(false)
const isLoading = ref(false)
const parameterIds = ref({})

const formData = ref({
  newRecordsTime: null,
  oldRecordsTime: null,
  maxRecordsPerApprentice: null,
  monthlyInstructorHours: null,
  yellowAlertDays: null,
  orangeAlertDays: null,
  redAlertDays: null
})

const daysOptions = ref([1, 2, 3, 4, 5, 7, 10, 15, 20, 30, 45, 60])


async function fetchParameters() {
  try {
    isLoading.value = true
    const response = await getData('/parameters/filterParameters?category=SYSTEM')
    const data = response?.data?.data || response?.data?.parameters || response?.data || []
    
    if (data.length === 0) {
      notifications.warning('No alert parameters were found in the system.')
      return
    }
    

    let paramIndex = 0
    while (paramIndex < data.length) {
      const param = data[paramIndex]
      if (param && param.name && param._id) {
        parameterIds.value[param.name] = param._id
        
        switch (param.name) {
          case PARAMETER_NAMES.ALERTAS_FICHAS_NUEVAS:
            formData.value.newRecordsTime = param.value
            break
          case PARAMETER_NAMES.EXPIRACION_FICHAS_ANTIGUAS:
            formData.value.oldRecordsTime = param.value
            break
          case PARAMETER_NAMES.MAXIMO_REGISTROS_POR_APRENDIZ:
            formData.value.maxRecordsPerApprentice = param.value
            break
          case PARAMETER_NAMES.HORAS_MENSUALES_INSTRUCTORES:
            formData.value.monthlyInstructorHours = param.value
            break
          case PARAMETER_NAMES.ALERTA_AMARILLA:
            formData.value.yellowAlertDays = param.value
            break
          case PARAMETER_NAMES.ALERTA_NARANJA:
            formData.value.orangeAlertDays = param.value
            break
          case PARAMETER_NAMES.ALERTA_ROJA_CRITICA:
            formData.value.redAlertDays = param.value
            break
        }
      }
      paramIndex++
    }
    
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.msg 
      || error?.message 
      || 'Error al cargar los parámetros de alerta.'
    notifications.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}


function handleOpenConfirmation(section) {
  currentSection.value = section
  confirmationModalRef.value?.openDialog()
}


function handleCloseConfirmation() {
  confirmationModalRef.value?.closeDialog()
}


function getSectionLabel() {
  switch (currentSection.value) {
    case SECTION_TYPES.FICHE:
      return '¿Desea guardar la configuración de Fichas?'
    case SECTION_TYPES.ESCALATED:
      return '¿Desea guardar la configuración de Alertas escaladas?'
  }
}

async function handleSaveConfiguration() {
  try {
    isSaving.value = true
    
    const updates = {}
    if (currentSection.value === SECTION_TYPES.FICHE) {
      updates[PARAMETER_NAMES.ALERTAS_FICHAS_NUEVAS] = { value: formData.value.newRecordsTime }
      updates[PARAMETER_NAMES.EXPIRACION_FICHAS_ANTIGUAS] = { value: formData.value.oldRecordsTime }
      updates[PARAMETER_NAMES.MAXIMO_REGISTROS_POR_APRENDIZ] = { value: formData.value.maxRecordsPerApprentice }
      updates[PARAMETER_NAMES.HORAS_MENSUALES_INSTRUCTORES] = { value: formData.value.monthlyInstructorHours }

    } else if (currentSection.value === SECTION_TYPES.ESCALATED) {
      updates[PARAMETER_NAMES.ALERTA_AMARILLA] = { value: formData.value.yellowAlertDays }
      updates[PARAMETER_NAMES.ALERTA_NARANJA] = { value: formData.value.orangeAlertDays }
      updates[PARAMETER_NAMES.ALERTA_ROJA_CRITICA] = { value: formData.value.redAlertDays }
    }

    // Reemplazar for...in con while loop usando Object.keys
    const paramNames = Object.keys(updates)
    let idx = 0
    while (idx < paramNames.length) {
      const paramName = paramNames[idx]
      const paramId = parameterIds.value[paramName]
      const updateData = updates[paramName]
      
      if (paramId && updateData.value !== null && updateData.value !== undefined) {
        // Validar que el valor sea válido antes de enviar
        const valueToSend = Number(updateData.value)
        
        if (!isNaN(valueToSend) && valueToSend >= 0) {
          await putData(`/parameters/updateParameter/${paramId}`, { value: valueToSend })
        }
      }
      idx++
    }
    
    notifications.success('Configuración guardada exitosamente.')
    handleCloseConfirmation()
    await fetchParameters() 
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.msg 
      || error?.message 
      || 'Error al guardar la configuración.'
    notifications.error(errorMessage)
  } finally {
    isSaving.value = false
  }
}


onMounted(() => {
  fetchParameters()
})
</script>


<style lang="sass" scoped>
.container
  max-width: 1200px
  margin: 0 auto


.section-card
  border-radius: 12px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  overflow: hidden

.section-header
  background: #44b900
  color: white
  padding: 15px 20px
  font-size: 16px
  font-weight: 600
  text-align: center
  border-radius: 10px 10px 0 0
  display: flex
  justify-content: center
  align-items: center

.header-title
  color: white
  font-size: 16px
  font-weight: 600
  text-align: center
  width: 100%
  margin: 0

.section-content
  padding: 25px 20px

.config-row
  display: flex
  align-items: center
  justify-content: space-between
  margin-bottom: 25px
  gap: 20px
  min-height: 60px

.config-label-group
  flex: 1
  display: flex
  flex-direction: column
  justify-content: center

.config-label
  font-size: 14px
  font-weight: 600
  color: #000
  margin-bottom: 5px
  line-height: 1.2

.config-sublabel
  font-size: 12px
  color: #666
  line-height: 1.2

.config-input-group
  display: flex
  align-items: center
  gap: 10px
  flex-shrink: 0
  min-width: 150px

.custom-select
  width: 100px
  min-width: 100px

.input-hint
  font-size: 12px
  color: #666
  white-space: nowrap
  min-width: 50px

.alert-box
  border-radius: 8px
  padding: 15px
  border-left: 6px solid

.alert-yellow
  background-color: #fff9e6
  border-left-color: #ffd700

.alert-orange
  background-color: #fff4e6
  border-left-color: #ff8c00

.alert-red
  background-color: #ffe6e6
  border-left-color: #ff0000

.alert-content
  display: flex
  align-items: center
  justify-content: space-between
  gap: 15px
  min-height: 50px

.alert-label-group
  flex: 1
  display: flex
  flex-direction: column
  justify-content: center

.alert-title
  font-size: 14px
  font-weight: 700
  color: #000
  margin-bottom: 3px
  line-height: 1.2

.alert-subtitle
  font-size: 11px
  color: #666
  line-height: 1.2

.alert-input-group
  display: flex
  align-items: center
  gap: 8px
  flex-shrink: 0
  min-width: 180px

.alert-select
  width: 80px
  min-width: 80px

.alert-hint
  font-size: 11px
  color: #666
  white-space: nowrap
  min-width: 120px

.process-row
  display: flex
  align-items: center
  justify-content: space-between
  padding: 15px
  background: #f9f9f9
  border-radius: 8px
  gap: 15px
  min-height: 60px

.process-label-group
  flex: 1
  display: flex
  flex-direction: column
  justify-content: center

.process-label
  font-size: 14px
  font-weight: 600
  color: #000
  margin-bottom: 3px
  line-height: 1.2

.process-sublabel
  font-size: 11px
  color: #666
  line-height: 1.2

.process-input-group
  display: flex
  align-items: center
  gap: 10px
  flex-shrink: 0
  min-width: 150px

.process-select
  width: 80px
  min-width: 80px

.process-hint
  font-size: 11px
  color: #666
  white-space: nowrap
  min-width: 50px

.form-actions
  display: flex
  justify-content: center
  align-items: center
  margin-top: 30px
  width: 100%

.modal-header-content
  display: flex
  justify-content: space-between
  align-items: center
  width: 100%

.modal-body-content
  padding: 20px
  text-align: center

.confirmation-text
  font-size: 16px
  color: #333
  margin: 0

.modal-footer-buttons
  display: flex
  justify-content: center
  gap: 12px
  width: 100%

@media (max-width: 600px)
  .config-row,
  .alert-content,
  .process-row
    flex-direction: column
    align-items: flex-start
    min-height: auto

  .alert-input-group,
  .process-input-group,
  .config-input-group
    width: 100%
    justify-content: space-between
    margin-top: 10px

@media (max-width: 480px)
  .container
    padding: 0 10px

  .section-content
    padding: 20px 15px

  .config-label,
  .alert-title,
  .process-label
    font-size: 13px

  .config-sublabel,
  .alert-subtitle,
  .process-sublabel
    font-size: 11px

  .custom-select,
  .alert-select,
  .process-select
    width: 100px

  .form-actions
    margin-top: 20px
    display: flex
    justify-content: center
    align-items: center
    width: 100%

  .modal-footer-buttons
    flex-direction: column
    gap: 8px

@media (max-width: 360px)
  .section-content
    padding: 15px 10px

  .config-row,
  .process-row
    gap: 10px
    margin-bottom: 15px

  .alert-box
    padding: 12px

  .config-label,
  .alert-title,
  .process-label
    font-size: 12px

  .config-sublabel,
  .alert-subtitle,
  .process-sublabel
    font-size: 10px

  .custom-select,
  .alert-select,
  .process-select
    width: 90px
    min-width: 90px

  .input-hint,
  .alert-hint,
  .process-hint
    font-size: 10px

  h1
    font-size: 2.2rem !important

@media (max-width: 320px)
  .container
    padding: 0 5px

  .section-content
    padding: 12px 8px

  .config-row,
  .process-row
    gap: 8px
    margin-bottom: 12px

  .alert-box
    padding: 10px

  .config-label,
  .alert-title,
  .process-label
    font-size: 11px
    line-height: 1.2

  .config-sublabel,
  .alert-subtitle,
  .process-sublabel
    font-size: 9px
    line-height: 1.2

  .custom-select,
  .alert-select,
  .process-select
    width: 80px
    min-width: 80px

  .input-hint,
  .alert-hint,
  .process-hint
    font-size: 9px

  h1
    font-size: 2rem !important
    margin: 10px 0 !important

  .section-header
    padding: 12px 15px
    font-size: 14px
    display: flex
    justify-content: center
    align-items: center

  .header-title
    font-size: 14px
    text-align: center
    width: 100%
    margin: 0

  .modal-body-content
    padding: 15px

  .confirmation-text
    font-size: 14px

@media (max-width: 300px)
  .container
    padding: 0 3px

  .section-card
    margin-bottom: 15px

  .section-content
    padding: 10px 6px

  .config-row,
  .process-row
    gap: 6px
    margin-bottom: 10px

  .alert-box
    padding: 8px

  .config-label,
  .alert-title,
  .process-label
    font-size: 10px
    line-height: 1.1

  .config-sublabel,
  .alert-subtitle,
  .process-sublabel
    font-size: 8px
    line-height: 1.1

  .custom-select,
  .alert-select,
  .process-select
    width: 70px
    min-width: 70px

  .input-hint,
  .alert-hint,
  .process-hint
    font-size: 8px

  h1
    font-size: 1.8rem !important
    margin: 8px 0 !important

  .section-header
    padding: 10px 12px
    font-size: 13px
    display: flex
    justify-content: center
    align-items: center

  .header-title
    font-size: 13px
    text-align: center
    width: 100%
    margin: 0

  .form-actions
    margin-top: 15px
    display: flex
    justify-content: center
    align-items: center
    width: 100%

  .modal-body-content
    padding: 12px

  .confirmation-text
    font-size: 13px

  .modal-footer-buttons
    gap: 6px
</style>