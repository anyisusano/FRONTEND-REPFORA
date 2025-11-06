<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">SEGURIDAD</h1>
    </div>

    <div class="container">
      <q-card class="section-card q-mb-lg">
        <div class="section-header">
          <div class="header-title">Credenciales y Acceso</div>
        </div>
        
        <q-card-section class="section-content">
          <div class="form-row">
            <label class="form-label">Contraseña temporal inicial</label>
            <div class="form-input-group">
              <q-input
                v-model="temporalPasswordType"
                outlined
                dense
                class="custom-input"
                :loading="credentialsLoading"
                @update:model-value="handleTemporalPasswordChange"
                placeholder="DOCUMENTO_IDENTIDAD"
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Forzar cambio al iniciar sesión</label>
            <div class="form-input-group">
              <q-checkbox
                v-model="forcePasswordChange"
                color="green"
                :disable="credentialsLoading"
                @update:model-value="handleForcePasswordChange"
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Tiempo de sesión</label>
            <div class="form-input-group">
              <q-select
                v-model="sessionTime"
                :options="sessionTimeOptions"
                outlined
                dense
                class="custom-select"
                :loading="credentialsLoading"
                @update:model-value="handleSessionTimeChange"
              />
              <span class="input-hint">hrs</span>
            </div>
          </div>

          <div class="form-actions">
            <BotonEnviar
              label="Guardar Configuración"
              :loading="credentialsLoading || loading"
              @click="handleOpenConfirmation('credentials')"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- AI Validations Section -->
      <q-card class="section-card">
        <div class="section-header">
          <div class="header-title">Validaciones IA</div>
        </div>
        
        <q-card-section class="section-content">
          <div class="form-row">
            <label class="form-label">Validación de firmas</label>
            <div class="form-input-group">
              <q-checkbox
                v-model="signatureValidation"
                color="green"
                :disable="validationsLoading"
                @update:model-value="handleSignatureValidationChange"
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Validación de firmas, docs firmados</label>
            <div class="form-input-group">
              <q-checkbox
                v-model="signedDocsValidation"
                color="green"
                :disable="validationsLoading"
                @update:model-value="handleSignedDocsValidationChange"
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Validación formato PDF para carga de instructor y aprendiz</label>
            <div class="form-input-group">
              <q-checkbox
                v-model="pdfFormatValidation"
                color="green"
                :disable="validationsLoading"
                @update:model-value="handlePdfFormatValidationChange"
              />
            </div>
          </div>

          <div class="form-actions">
            <BotonEnviar
              label="Guardar Configuración"
              :loading="validationsLoading || loading"
              @click="handleOpenConfirmation('validations')"
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
          <div class="text-h6">¿Estás seguro que quieres guardar los cambios?</div>
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
          <p class="confirmation-text">Guardar Seguridad</p>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-buttons">
          <BotonCerrar label="Cancelar" @click="handleCloseConfirmation" />
          <BotonEnviar
            label="Aceptar"
            :loading="loading"
            @click="handleSaveConfiguration"
          />
        </div>
      </template>
    </modalComponent>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNotifications } from '../../../composables/useNotifications'
import { getData, putData } from '../../../services/apiClient'
import BackButton from '../../../components/BackButton.vue'
import BotonCerrar from '../../../components/BotonCerrar.vue'
import BotonEnviar from '../../../components/BotonEnviar.vue'
import modalComponent from '../../../components/modals/modalComponent.vue'

// Composables
const notifications = useNotifications()
const loading = ref(false)
const credentialsLoading = ref(false)
const validationsLoading = ref(false)

// State
const confirmationModalRef = ref(null)
const currentSection = ref('')

// Form Values - Credentials
const forcePasswordChange = ref(false)
const sessionTime = ref(48)
const temporalPasswordType = ref('DOCUMENTO_IDENTIDAD')

// Form Values - AI Validations
const signatureValidation = ref(true)
const signedDocsValidation = ref(true)
const pdfFormatValidation = ref(true)

// Parameters data
const credentialsParameters = ref([])
const validationsParameters = ref([])
const securityParametersForValidations = ref([])

// Options - Tiempo de sesión en horas
const sessionTimeOptions = [1, 2, 4, 6, 8, 12, 24, 48, 72]

// Load data on mount
onMounted(async () => {
  await loadAllParameters()
})

// Carga parámetros de credenciales y validaciones
async function loadAllParameters() {
  loading.value = true
  try {
    await Promise.all([loadCredentialsParameters(), loadValidationsParameters()])
  } catch (error) {
    notifications.error('Error al cargar los parámetros')
  } finally {
    loading.value = false
  }
}

// Carga parámetros SECURITY para credenciales  
async function loadCredentialsParameters() {
  credentialsLoading.value = true
  try {
    const securityResponse = await getData('/parameters/filterParameters?category=SECURITY')
    const securityData = securityResponse?.data || securityResponse?.msg || []
    credentialsParameters.value = securityData
    
    // Busca parámetros de credenciales
    const temporalPasswordParam = securityData.find(param => param.name === 'CONTRASENA_TEMPORAL_INICIAL')
    const forcePasswordParam = securityData.find(param => param.name === 'FORZAR_CAMBIO_CONTRASENA')
    const sessionTimeParam = securityData.find(param => param.name === 'TIEMPO_SESION')
    
    if (temporalPasswordParam) {
      temporalPasswordType.value = temporalPasswordParam.value
    }
    
    if (forcePasswordParam) {
      forcePasswordChange.value = forcePasswordParam.value
    }
    
    if (sessionTimeParam) {
      sessionTime.value = Number(sessionTimeParam.value)
    }
  } catch (error) {
    throw error
  } finally {
    credentialsLoading.value = false
  }
}

// Carga parámetros SECURITY y FILES para validaciones 
async function loadValidationsParameters() {
  validationsLoading.value = true
  try {
    // Carga parámetros SECURITY
    const securityResponse = await getData('/parameters/filterParameters?category=SECURITY')
    const securityData = securityResponse?.data || securityResponse?.msg || []
    securityParametersForValidations.value = securityData
    
    // Carga parámetros FILES
    const filesResponse = await getData('/parameters/filterParameters?category=FILES')
    const filesData = filesResponse?.data || filesResponse?.msg || []
    validationsParameters.value = filesData
    
    // Busca parámetros de validación IA
    const signatureParam = securityData.find(param => param.name === 'VERIFICACION_FIRMAS_IA_HABILITADA')
    const signedDocsParam = securityData.find(param => param.name === 'VERIFICACION_DOCS_FIRMADOS_HABILITADA')
    
    // Busca parámetros de archivos
    const pdfFormatParam = filesData.find(param => param.name === 'VALIDACION_FORMATO_PDF_HABILITADA')
    
    if (signatureParam) signatureValidation.value = signatureParam.value
    if (signedDocsParam) signedDocsValidation.value = signedDocsParam.value  
    if (pdfFormatParam) pdfFormatValidation.value = pdfFormatParam.value
  } catch (error) {
    throw error
  } finally {
    validationsLoading.value = false
  }
}

function handleSessionTimeChange(value) {
  sessionTime.value = value
}

function handleForcePasswordChange(value) {
  forcePasswordChange.value = value
}

function handleSignatureValidationChange(value) {
  signatureValidation.value = value
}

function handleSignedDocsValidationChange(value) {
  signedDocsValidation.value = value
}

function handlePdfFormatValidationChange(value) {
  pdfFormatValidation.value = value
}

function handleTemporalPasswordChange(value) {
  temporalPasswordType.value = value
}

function handleOpenConfirmation(section) {
  currentSection.value = section
  confirmationModalRef.value?.openDialog()
}

function handleCloseConfirmation() {
  confirmationModalRef.value?.closeDialog()
}

async function handleSaveConfiguration() {
  // Activa loading por sección
  if (currentSection.value === 'credentials') {
    credentialsLoading.value = true
  } else if (currentSection.value === 'validations') {
    validationsLoading.value = true
  }
  
  try {
    if (currentSection.value === 'credentials') {
      // Guarda parámetros de credenciales
      const temporalPasswordParam = credentialsParameters.value.find(param => param.name === 'CONTRASENA_TEMPORAL_INICIAL')
      const forcePasswordParam = credentialsParameters.value.find(param => param.name === 'FORZAR_CAMBIO_CONTRASENA')
      const sessionTimeParam = credentialsParameters.value.find(param => param.name === 'TIEMPO_SESION')
      
      const promises = []
      
      // Actualiza si existe y cambió
      if (temporalPasswordParam && temporalPasswordParam.value !== temporalPasswordType.value) {
        promises.push(
          putData(`/parameters/updateParameter/${temporalPasswordParam._id}`, { value: temporalPasswordType.value })
        )
      }
      
      if (forcePasswordParam && forcePasswordParam.value !== forcePasswordChange.value) {
        promises.push(
          putData(`/parameters/updateParameter/${forcePasswordParam._id}`, { value: forcePasswordChange.value })
        )
      }
      
      if (sessionTimeParam && Number(sessionTimeParam.value) !== Number(sessionTime.value)) {
        promises.push(
          putData(`/parameters/updateParameter/${sessionTimeParam._id}`, { value: Number(sessionTime.value) })
        )
      }
      
      // Ejecuta actualizaciones
      if (promises.length > 0) {
        await Promise.all(promises)
        
        // Actualiza valores locales
        if (temporalPasswordParam) temporalPasswordParam.value = temporalPasswordType.value
        if (forcePasswordParam) forcePasswordParam.value = forcePasswordChange.value
        if (sessionTimeParam) sessionTimeParam.value = Number(sessionTime.value)
      }
      
    } else if (currentSection.value === 'validations') {
      // Guarda parámetros de validaciones
      const signatureParam = securityParametersForValidations.value.find(param => param.name === 'VERIFICACION_FIRMAS_IA_HABILITADA')
      const signedDocsParam = securityParametersForValidations.value.find(param => param.name === 'VERIFICACION_DOCS_FIRMADOS_HABILITADA')
      const pdfFormatParam = validationsParameters.value.find(param => param.name === 'VALIDACION_FORMATO_PDF_HABILITADA')
      
      const promises = []
      
      // Actualiza si cambió
      if (signatureParam && signatureParam.value !== signatureValidation.value) {
        promises.push(
          putData(`/parameters/updateParameter/${signatureParam._id}`, { value: signatureValidation.value })
        )
      }
      
      if (signedDocsParam && signedDocsParam.value !== signedDocsValidation.value) {
        promises.push(
          putData(`/parameters/updateParameter/${signedDocsParam._id}`, { value: signedDocsValidation.value })
        )
      }
      
      if (pdfFormatParam && pdfFormatParam.value !== pdfFormatValidation.value) {
        promises.push(
          putData(`/parameters/updateParameter/${pdfFormatParam._id}`, { value: pdfFormatValidation.value })
        )
      }
      
      // Ejecuta actualizaciones
      if (promises.length > 0) {
        await Promise.all(promises)
        
        // Actualiza valores locales
        if (signatureParam) signatureParam.value = signatureValidation.value
        if (signedDocsParam) signedDocsParam.value = signedDocsValidation.value
        if (pdfFormatParam) pdfFormatParam.value = pdfFormatValidation.value
      }
    }
    
    notifications.success('Configuración guardada exitosamente')
    handleCloseConfirmation()
    
    // Recarga parámetros por sección
    if (currentSection.value === 'credentials') {
      await loadCredentialsParameters()
    } else if (currentSection.value === 'validations') {
      await loadValidationsParameters()
    }
  } catch (error) {
    notifications.error('Error al guardar la configuración')
    
    // Recarga en caso de error
    if (currentSection.value === 'credentials') {
      await loadCredentialsParameters()
    } else if (currentSection.value === 'validations') {
      await loadValidationsParameters()
    }
  } finally {
    // Desactiva loading por sección
    if (currentSection.value === 'credentials') {
      credentialsLoading.value = false
    } else if (currentSection.value === 'validations') {
      validationsLoading.value = false
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  max-width: 1200px
  margin: 0 auto

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

.custom-input
  width: 300px

.readonly-value
  font-size: 14px
  color: #333
  font-weight: 500
  text-align: right
  min-width: 150px

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

  .custom-input
    width: 100%

  .readonly-value
    width: 100%
    text-align: left
</style>
