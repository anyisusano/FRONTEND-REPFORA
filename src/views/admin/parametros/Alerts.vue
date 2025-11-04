<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">ALERTS</h1>
    </div>

    <div class="container">
      <!-- Fiche Expiration Alerts Section -->
      <div class="section-title q-mb-md">
        <h2 class="text-h6">Fiche Expiration Alerts</h2>
      </div>

      <q-card class="section-card q-mb-lg">
        <div class="section-header">
          <div class="header-title">Fiche Configuration</div>
        </div>

        <q-card-section class="section-content">
          <div class="config-row">
            <div class="config-label-group">
              <div class="config-label">New fiches (post November 2024)</div>
              <div class="config-sublabel">Time limit without registering productive stage</div>
            </div>
            <div class="config-input-group">
              <q-select
                v-model="formData.newRecordsTime"
                :options="monthOptions"
                outlined
                dense
                class="custom-select"
              />
              <span class="input-hint">Month</span>
            </div>
          </div>

          <div class="config-row">
            <div class="config-label-group">
              <div class="config-label">Old fiches (pre November 2024)</div>
              <div class="config-sublabel">Time limit without registering productive stage</div>
            </div>
            <div class="config-input-group">
              <q-select
                v-model="formData.oldRecordsTime"
                :options="yearOptions"
                outlined
                dense
                class="custom-select"
              />
              <span class="input-hint">Year</span>
            </div>
          </div>

          <div class="form-actions">
            <BotonEnviar
              label="Save Configuration"
              @click="handleOpenConfirmation(SECTION_TYPES.FICHE)"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Escalated Alerts Section -->
      <q-card class="section-card q-mb-lg">
        <div class="section-header">
          <div class="header-title">Escalated Alerts</div>
        </div>

        <q-card-section class="section-content">
          <!-- Yellow Alert -->
          <div class="alert-box alert-yellow q-mb-md">
            <div class="alert-content">
              <div class="alert-label-group">
                <div class="alert-title">Yellow</div>
                <div class="alert-subtitle">First preventive notification</div>
              </div>
              <div class="alert-input-group">
                <q-select
                  v-model="formData.yellowAlertDays"
                  :options="daysOptions"
                  outlined
                  dense
                  class="alert-select"
                />
                <span class="alert-hint">days before expiration</span>
              </div>
            </div>
          </div>

          <!-- Orange Alert -->
          <div class="alert-box alert-orange q-mb-md">
            <div class="alert-content">
              <div class="alert-label-group">
                <div class="alert-title">Orange</div>
                <div class="alert-subtitle">Urgent attention notification</div>
              </div>
              <div class="alert-input-group">
                <q-select
                  v-model="formData.orangeAlertDays"
                  :options="daysOptions"
                  outlined
                  dense
                  class="alert-select"
                />
                <span class="alert-hint">days before expiration</span>
              </div>
            </div>
          </div>

          <!-- Red Alert -->
          <div class="alert-box alert-red q-mb-md">
            <div class="alert-content">
              <div class="alert-label-group">
                <div class="alert-title">Red</div>
                <div class="alert-subtitle">Immediate critical notification</div>
              </div>
              <div class="alert-input-group">
                <q-select
                  v-model="formData.redAlertDays"
                  :options="daysOptions"
                  outlined
                  dense
                  class="alert-select"
                />
                <span class="alert-hint">days before expiration</span>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <BotonEnviar
              label="Save Configuration"
              @click="handleOpenConfirmation(SECTION_TYPES.ESCALATED)"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Process Alerts Section -->
      <div class="section-title q-mb-md q-mt-lg">
        <h2 class="text-h6">Process Alerts</h2>
      </div>

      <q-card class="section-card">
        <div class="section-header">
          <div class="header-title">Alert Configuration</div>
        </div>

        <q-card-section class="section-content">
          <!-- Pending Log Alert -->
          <div class="process-row q-mb-md">
            <div class="process-label-group">
              <div class="process-label">Pending logbook alert</div>
              <div class="process-sublabel">Notify when a logbook is about to expire</div>
            </div>
            <div class="process-input-group">
              <q-select
                v-model="formData.pendingLogAlert"
                :options="daysOptions"
                outlined
                dense
                class="process-select"
              />
              <span class="process-hint">days before</span>
              <q-toggle
                v-model="formData.pendingLogAlertEnabled"
                color="green"
              />
            </div>
          </div>

          <!-- Pending Follow-up Alert -->
          <div class="process-row q-mb-md">
            <div class="process-label-group">
              <div class="process-label">Pending follow-up alert</div>
              <div class="process-sublabel">Notify when a follow-up is about to expire</div>
            </div>
            <div class="process-input-group">
              <q-select
                v-model="formData.pendingFollowUpAlert"
                :options="daysOptions"
                outlined
                dense
                class="process-select"
              />
              <span class="process-hint">days before</span>
              <q-toggle
                v-model="formData.pendingFollowUpAlertEnabled"
                color="green"
              />
            </div>
          </div>

          <!-- Critical Follow-up Alert -->
          <div class="process-row q-mb-md">
            <div class="process-label-group">
              <div class="process-label">Critical last follow-up alert</div>
              <div class="process-sublabel">Critical notification for the last scheduled follow-up</div>
            </div>
            <div class="process-input-group">
              <q-select
                v-model="formData.criticalFollowUpAlert"
                :options="daysOptions"
                outlined
                dense
                class="process-select"
              />
              <span class="process-hint">days before</span>
              <q-toggle
                v-model="formData.criticalFollowUpAlertEnabled"
                color="green"
              />
            </div>
          </div>

          <!-- Instructor Review Time -->
          <div class="process-row q-mb-md">
            <div class="process-label-group">
              <div class="process-label">Instructor review time</div>
              <div class="process-sublabel">Time limit and alert for instructor reviews</div>
            </div>
            <div class="process-input-group">
              <q-select
                v-model="formData.instructorReviewTime"
                :options="daysOptions"
                outlined
                dense
                class="process-select"
              />
              <span class="process-hint">days before</span>
              <q-toggle
                v-model="formData.instructorReviewTimeEnabled"
                color="green"
              />
            </div>
          </div>

          <div class="form-actions">
            <BotonEnviar
              label="Save Configuration"
              @click="handleOpenConfirmation(SECTION_TYPES.PROCESS)"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Confirmation Modal -->
    <modalComponent
      ref="confirmationModalRef"
      width="500px"
      max-width="90vw"
    >
      <template #header>
        <div class="modal-header-content">
          <div class="text-h6">Are you sure you want to save the changes?</div>
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
          <BotonCerrar label="Cancel" @click="handleCloseConfirmation" />
          <BotonEnviar
            label="Accept"
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
  ALERTA_FICHAS_NUEVAS_MESES: 'ALERTA_FICHAS_NUEVAS_MESES',
  VENCIMIENTO_FICHAS_ANTIGUAS: 'VENCIMIENTO_FICHAS_ANTIGUAS',
  DIAS_ALERTA_AMARILLA: 'DIAS_ALERTA_AMARILLA',
  DIAS_ALERTA_NARANJA: 'DIAS_ALERTA_NARANJA',
  DIAS_ALERTA_ROJA_CRITICA: 'DIAS_ALERTA_ROJA_CRITICA',
  DIAS_ALERTA_BITACORA_PENDIENTE: 'DIAS_ALERTA_BITACORA_PENDIENTE',
  DIAS_ALERTA_SEGUIMIENTO_PENDIENTE: 'DIAS_ALERTA_SEGUIMIENTO_PENDIENTE',
  DIAS_ALERTA_CRITICA_ULTIMO_SEGUIMIENTO: 'DIAS_ALERTA_CRITICA_ULTIMO_SEGUIMIENTO',
  DIAS_ALERTA_REVISION_INSTRUCTOR: 'DIAS_ALERTA_REVISION_INSTRUCTOR'
}

const SECTION_TYPES = {
  FICHE: 'fiche',
  ESCALATED: 'escalated',
  PROCESS: 'process'
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
  yellowAlertDays: null,
  orangeAlertDays: null,
  redAlertDays: null,
  pendingLogAlert: null,
  pendingLogAlertEnabled: false,
  pendingFollowUpAlert: null,
  pendingFollowUpAlertEnabled: false,
  criticalFollowUpAlert: null,
  criticalFollowUpAlertEnabled: false,
  instructorReviewTime: null,
  instructorReviewTimeEnabled: false
})

const monthOptions = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
const yearOptions = ref([1, 2, 3, 4, 5])
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
    

    // Sin usar forEach - usar while loop
    let paramIndex = 0
    while (paramIndex < data.length) {
      const param = data[paramIndex]
      if (param && param.name && param._id) {
        parameterIds.value[param.name] = param._id
        
        switch (param.name) {
          case PARAMETER_NAMES.ALERTA_FICHAS_NUEVAS_MESES:
            formData.value.newRecordsTime = param.value
            break
          case PARAMETER_NAMES.VENCIMIENTO_FICHAS_ANTIGUAS:
            formData.value.oldRecordsTime = param.value
            break
          case PARAMETER_NAMES.DIAS_ALERTA_AMARILLA:
            formData.value.yellowAlertDays = param.value
            break
          case PARAMETER_NAMES.DIAS_ALERTA_NARANJA:
            formData.value.orangeAlertDays = param.value
            break
          case PARAMETER_NAMES.DIAS_ALERTA_ROJA_CRITICA:
            formData.value.redAlertDays = param.value
            break
          case PARAMETER_NAMES.DIAS_ALERTA_BITACORA_PENDIENTE:
            formData.value.pendingLogAlert = param.value
            formData.value.pendingLogAlertEnabled = param.status === 1
            break
          case PARAMETER_NAMES.DIAS_ALERTA_SEGUIMIENTO_PENDIENTE:
            formData.value.pendingFollowUpAlert = param.value
            formData.value.pendingFollowUpAlertEnabled = param.status === 1
            break
          case PARAMETER_NAMES.DIAS_ALERTA_CRITICA_ULTIMO_SEGUIMIENTO:
            formData.value.criticalFollowUpAlert = param.value
            formData.value.criticalFollowUpAlertEnabled = param.status === 1
            break
          case PARAMETER_NAMES.DIAS_ALERTA_REVISION_INSTRUCTOR:
            formData.value.instructorReviewTime = param.value
            formData.value.instructorReviewTimeEnabled = param.status === 1
            break
        }
      }
      paramIndex++
    }
    
    notifications.success('Alert parameters loaded successfully.')
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.msg 
      || error?.message 
      || 'Error loading alert parameters.'
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
      return 'Do you want to save the Fiche Expiration configuration?'
    case SECTION_TYPES.ESCALATED:
      return 'Do you want to save the Escalated Alerts configuration?'
    case SECTION_TYPES.PROCESS:
      return 'Do you want to save the Process Alerts configuration?'
    default:
      return 'Do you want to save the Alerts configuration?'
  }
}

async function handleSaveConfiguration() {
  try {
    isSaving.value = true
    
    const updates = {}
    if (currentSection.value === SECTION_TYPES.FICHE) {
      updates[PARAMETER_NAMES.ALERTA_FICHAS_NUEVAS_MESES] = { value: formData.value.newRecordsTime }
      updates[PARAMETER_NAMES.VENCIMIENTO_FICHAS_ANTIGUAS] = { value: formData.value.oldRecordsTime }

    } else if (currentSection.value === SECTION_TYPES.ESCALATED) {
      updates[PARAMETER_NAMES.DIAS_ALERTA_AMARILLA] = { value: formData.value.yellowAlertDays }
      updates[PARAMETER_NAMES.DIAS_ALERTA_NARANJA] = { value: formData.value.orangeAlertDays }
      updates[PARAMETER_NAMES.DIAS_ALERTA_ROJA_CRITICA] = { value: formData.value.redAlertDays }

    } else if (currentSection.value === SECTION_TYPES.PROCESS) {
      updates[PARAMETER_NAMES.DIAS_ALERTA_BITACORA_PENDIENTE] = { 
        value: formData.value.pendingLogAlert, 
        status: formData.value.pendingLogAlertEnabled ? 1 : 0 
      }
      updates[PARAMETER_NAMES.DIAS_ALERTA_SEGUIMIENTO_PENDIENTE] = { 
        value: formData.value.pendingFollowUpAlert, 
        status: formData.value.pendingFollowUpAlertEnabled ? 1 : 0 
      }
      updates[PARAMETER_NAMES.DIAS_ALERTA_CRITICA_ULTIMO_SEGUIMIENTO] = { 
        value: formData.value.criticalFollowUpAlert, 
        status: formData.value.criticalFollowUpAlertEnabled ? 1 : 0 
      }
      updates[PARAMETER_NAMES.DIAS_ALERTA_REVISION_INSTRUCTOR] = { 
        value: formData.value.instructorReviewTime, 
        status: formData.value.instructorReviewTimeEnabled ? 1 : 0 
      }
    }

    // Reemplazar for...in con while loop usando Object.keys
    const paramNames = Object.keys(updates)
    let idx = 0
    while (idx < paramNames.length) {
      const paramName = paramNames[idx]
      const paramId = parameterIds.value[paramName]
      if (paramId) {
        const updateData = updates[paramName]
        await putData(`/parameters/updateParameter/${paramId}`, { value: updateData.value })
        if (updateData.status !== undefined) {
          await putData(`/parameters/updateParameterStatus/${paramId}`, { status: updateData.status })
        }
      }
      idx++
    }
    
    notifications.success('Configuration saved successfully.')
    handleCloseConfirmation()
    await fetchParameters() 
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.msg 
      || error?.message 
      || 'Error saving configuration.'
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

.section-title
  color: #333
  margin-bottom: 10px
  padding-bottom: 10px
  border-bottom: 2px solid #e0e0e0

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

.header-title
  color: white
  font-size: 16px
  font-weight: 600

.section-content
  padding: 25px 20px

.config-row
  display: flex
  align-items: center
  justify-content: space-between
  margin-bottom: 25px
  gap: 20px

.config-label-group
  flex: 1

.config-label
  font-size: 14px
  font-weight: 600
  color: #000
  margin-bottom: 5px

.config-sublabel
  font-size: 12px
  color: #666

.config-input-group
  display: flex
  align-items: center
  gap: 10px

.custom-select
  width: 100px

.input-hint
  font-size: 12px
  color: #666
  white-space: nowrap

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

.alert-label-group
  flex: 1

.alert-title
  font-size: 14px
  font-weight: 700
  color: #000
  margin-bottom: 3px

.alert-subtitle
  font-size: 11px
  color: #666

.alert-input-group
  display: flex
  align-items: center
  gap: 8px

.alert-select
  width: 80px

.alert-hint
  font-size: 11px
  color: #666
  white-space: nowrap

.process-row
  display: flex
  align-items: center
  justify-content: space-between
  padding: 15px
  background: #f9f9f9
  border-radius: 8px
  gap: 15px

.process-label-group
  flex: 1

.process-label
  font-size: 14px
  font-weight: 600
  color: #000
  margin-bottom: 3px

.process-sublabel
  font-size: 11px
  color: #666

.process-input-group
  display: flex
  align-items: center
  gap: 10px

.process-select
  width: 80px

.process-hint
  font-size: 11px
  color: #666
  white-space: nowrap

.form-actions
  display: flex
  justify-content: center
  margin-top: 30px

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

  .alert-input-group,
  .process-input-group
    width: 100%
    justify-content: space-between

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

  .header-title
    font-size: 14px

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

  .header-title
    font-size: 13px

  .form-actions
    margin-top: 15px

  .modal-body-content
    padding: 12px

  .confirmation-text
    font-size: 13px

  .modal-footer-buttons
    gap: 6px
</style>
