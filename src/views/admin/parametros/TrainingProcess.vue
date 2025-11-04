<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md title-compact">TRAINING PROCESS</h1>
    </div>

    <div class="container">

      <q-card class="section-card q-mb-lg">
        <div class="section-header">
          <div class="header-title">Logbooks and Follow-ups</div>
        </div>
        
        <q-card-section class="section-content">
          <div class="form-row">
            <label class="form-label">Max logbooks per program</label>
            <div class="form-input-group">
              <q-select
                v-model="formData.maxLogsPerProgram"
                :options="numberOptions"
                outlined
                dense
                class="custom-select"
              />
              <span class="input-hint">Units</span>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Follow-ups - Technical/Technologist</label>
            <div class="form-input-group">
              <q-select
                v-model="formData.followUpsTechnical"
                :options="numberOptions"
                outlined
                dense
                class="custom-select"
              />
              <span class="input-hint">Required</span>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Follow-ups - Operator</label>
            <div class="form-input-group">
              <q-select
                v-model="formData.followUpsOperator"
                :options="numberOptions"
                outlined
                dense
                class="custom-select"
              />
              <span class="input-hint">Required</span>
            </div>
          </div>

          <div class="form-actions">
            <BotonEnviar
              label="Save Configuration"
              @click="handleOpenConfirmation(SECTION_TYPES.LOGS)"
            />
          </div>
        </q-card-section>
      </q-card>

     
      <q-card class="section-card">
        <div class="section-header">
          <div class="header-title">Validations and Limits</div>
        </div>
        
        <q-card-section class="section-content">
          <div class="form-row">
            <label class="form-label">Max apprentice-fiche records</label>
            <div class="form-input-group">
              <q-select
                v-model="formData.maxRecordsPerStudent"
                :options="numberOptions"
                outlined
                dense
                class="custom-select"
              />
              <span class="input-hint">PS Stages</span>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Max logbook review time</label>
            <div class="form-input-group">
              <q-select
                v-model="formData.maxReviewTime"
                :options="daysOptions"
                outlined
                dense
                class="custom-select"
              />
              <span class="input-hint">Business Days</span>
            </div>
          </div>

          <div class="form-actions">
            <BotonEnviar
              label="Save Configuration"
              @click="handleOpenConfirmation(SECTION_TYPES.VALIDATIONS)"
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
            {{ currentSection === SECTION_TYPES.LOGS 
              ? 'Save Logbooks and Follow-ups configuration' 
              : 'Save Validations and Limits configuration' 
            }}
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
import { useParameters } from '../../../composables/useParameters'
import { PARAMETER_NAMES, PARAMETER_CATEGORIES, PARAMETER_SECTION_TYPES } from '../../../constants'
import BackButton from '../../../components/BackButton.vue'
import BotonCerrar from '../../../components/BotonCerrar.vue'
import BotonEnviar from '../../../components/BotonEnviar.vue'
import modalComponent from '../../../components/modals/modalComponent.vue'

// Constants
const SECTION_TYPES = PARAMETER_SECTION_TYPES

// Composables
const {
  parameters,
  parameterIds,
  isLoading,
  isSaving,
  fetchParameters,
  mapParametersToFormData,
  updateMultipleParameters,
  refresh
} = useParameters(PARAMETER_CATEGORIES.ACADEMIC, {
  emptyMessage: 'No academic parameters were found in the system.',
  successMessage: 'Academic parameters loaded successfully.',
  errorMessage: 'Error loading academic parameters.'
})

// State
const confirmationModalRef = ref(null)
const currentSection = ref('')

const formData = ref({
  maxLogsPerProgram: null,
  followUpsTechnical: null,
  followUpsOperator: null,
  maxRecordsPerStudent: null,
  maxReviewTime: null
})

const numberOptions = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
const daysOptions = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

// El backend debe devolver los parámetros directamente en formData
// O devolver un objeto con los valores listos para usar
async function loadParameters() {
  await fetchParameters()
  // El backend debe devolver los datos en el formato que necesita el formulario
  // O usar los parámetros directamente según sus nombres
  // SIN MAPEOS - el backend debe devolver los datos listos
  if (parameters.value && parameters.value.length > 0) {
    // El backend debe devolver un objeto formData o los parámetros con nombres específicos
    // Por ahora, acceder directamente a los parámetros sin mapeo
    let paramIndex = 0
    while (paramIndex < parameters.value.length) {
      const param = parameters.value[paramIndex]
      if (param && param.name) {
        // Acceso directo sin mapeo - el backend debe estructurar los datos correctamente
        if (param.name === PARAMETER_NAMES.MAX_BITACORAS_POR_NIVEL) {
          formData.value.maxLogsPerProgram = param.value
        } else if (param.name === PARAMETER_NAMES.SEGUIMIENTOS_TECNICO_TECNOLOGO) {
          formData.value.followUpsTechnical = param.value
        } else if (param.name === PARAMETER_NAMES.SEGUIMIENTOS_OPERARIO) {
          formData.value.followUpsOperator = param.value
        } else if (param.name === PARAMETER_NAMES.MAX_REGISTROS_APRENDIZ_FICHA) {
          formData.value.maxRecordsPerStudent = param.value
        } else if (param.name === PARAMETER_NAMES.TIEMPO_MAX_REVISION_BITACORAS) {
          formData.value.maxReviewTime = param.value
        }
      }
      paramIndex++
    }
  }
}

function handleOpenConfirmation(section) {
  currentSection.value = section
  confirmationModalRef.value?.openDialog()
}

function handleCloseConfirmation() {
  confirmationModalRef.value?.closeDialog()
}

async function handleSaveConfiguration() {
  try {
    const updates = currentSection.value === SECTION_TYPES.LOGS ? [
      { parameterName: PARAMETER_NAMES.MAX_BITACORAS_POR_NIVEL, value: formData.value.maxLogsPerProgram },
      { parameterName: PARAMETER_NAMES.SEGUIMIENTOS_TECNICO_TECNOLOGO, value: formData.value.followUpsTechnical },
      { parameterName: PARAMETER_NAMES.SEGUIMIENTOS_OPERARIO, value: formData.value.followUpsOperator }
    ] : [
      { parameterName: PARAMETER_NAMES.MAX_REGISTROS_APRENDIZ_FICHA, value: formData.value.maxRecordsPerStudent },
      { parameterName: PARAMETER_NAMES.TIEMPO_MAX_REVISION_BITACORAS, value: formData.value.maxReviewTime }
    ]
    
    const success = await updateMultipleParameters(updates)
    
    if (success) {
      handleCloseConfirmation()
      await loadParameters()
    }
  } catch (error) {
    // El error ya se maneja en updateMultipleParameters
  }
}

onMounted(() => {
  loadParameters()
})
</script>

<style lang="sass" scoped>
.container
  max-width: 1200px
  margin: 0 auto

.title-compact
  font-size: 3rem
  line-height: 0.9

.section-card
  background: white
  border-radius: 12px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  margin-bottom: 20px
  overflow: hidden

.section-header
  background: #44b900
  color: white
  padding: 15px 20px
  font-size: 16px
  font-weight: 600
  text-align: center

.header-title
  color: white
  font-size: 16px
  font-weight: 600

.section-content
  padding: 25px 20px

.form-row
  display: flex
  align-items: center
  justify-content: space-between
  margin-bottom: 20px
  gap: 15px

.form-label
  font-size: 14px
  font-weight: 500
  color: #333
  flex: 1
  min-width: 200px

.form-input-group
  display: flex
  align-items: center
  gap: 10px
  flex: 0 0 auto

.custom-select
  width: 120px

.input-hint
  font-size: 12px
  color: #666
  white-space: nowrap
  min-width: 80px

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
  .form-row
    flex-direction: column
    align-items: flex-start

  .form-label
    min-width: 100%
    margin-bottom: 10px

  .form-input-group
    width: 100%
    justify-content: space-between

  .custom-select
    flex: 1

// Responsividad para tablets pequeñas
@media (max-width: 480px)
  .container
    padding: 0 10px

  .section-content
    padding: 20px 15px

  .modal-footer-buttons
    flex-direction: column
    gap: 8px

  .custom-select
    min-width: 100px

  .title-compact
    font-size: 2.5rem

// Responsividad para móviles estándar
@media (max-width: 360px)
  .section-content
    padding: 15px 10px

  .form-row
    margin-bottom: 15px

  .form-label
    font-size: 13px

  .input-hint
    font-size: 11px
    min-width: 60px

  .header-title
    font-size: 14px

  .title-compact
    font-size: 2rem

// Responsividad para móviles pequeños
@media (max-width: 320px)
  .container
    padding: 0 5px

  .section-content
    padding: 12px 8px

  .form-row
    margin-bottom: 12px

  .form-label
    font-size: 12px
    line-height: 1.3

  .input-hint
    font-size: 10px
    min-width: 50px

  .section-header
    padding: 12px 15px

  .header-title
    font-size: 13px

  .title-compact
    font-size: 1.8rem

// Responsividad para pantallas ultra pequeñas (300px)
@media (max-width: 300px)
  .q-pa-md
    padding: 8px !important

  .container
    padding: 0 2px

  .section-content
    padding: 10px 6px

  .form-row
    margin-bottom: 10px
    gap: 8px

  .form-label
    font-size: 11px
    line-height: 1.2
    margin-bottom: 8px

  .input-hint
    font-size: 9px
    min-width: 40px

  .custom-select
    min-width: 80px

  .section-header
    padding: 10px 12px

  .header-title
    font-size: 12px

  .form-actions
    margin-top: 20px

  .title-compact
    font-size: 1.5rem

  .modal-body-content
    padding: 15px

  .confirmation-text
    font-size: 14px
</style>