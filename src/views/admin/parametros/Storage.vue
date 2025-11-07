Storage


<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">VALIDACIONES</h1>
    </div>

    <div class="container">
      <q-card class="section-card">
        <div class="section-header">
          <div class="header-title">Validaciones de Documentos</div>
        </div>
        
        <q-card-section class="section-content">
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

          <div class="form-actions">
            <BotonEnviar
              label="Guardar Configuración"
              :loading="isSaving"
              @click="handleOpenConfirmation"
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
          <p class="confirmation-text">Guardar Validaciones</p>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-buttons">
          <BotonCerrar label="Cancelar" @click="handleCloseConfirmation" />
          <BotonEnviar
            label="Aceptar"
            :loading="isSaving"
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

// State
const confirmationModalRef = ref(null)

// Validations state
const signedDocsValidation = ref(true)
const validationsLoading = ref(false)
const isSaving = ref(false)
const securityParameters = ref([])
const parameterIds = ref({})

// Load data on mount
onMounted(async () => {
  await loadValidationsParameters()
})

// Load validations parameters
async function loadValidationsParameters() {
  validationsLoading.value = true
  try {
    const response = await getData('/parameters/filterParameters?category=FILES')
    const data = response?.data?.data || response?.data?.parameters || response?.data || []
    
    securityParameters.value = data
    
    // Mapear IDs de parámetros y cargar valores
    let paramIndex = 0
    while (paramIndex < data.length) {
      const param = data[paramIndex]
      
      if (param && param.name && param._id) {
        parameterIds.value[param.name] = param._id
        
        if (param.name === 'VERIFICACION DE DOCUMENTOS FIRMADOS') {
          signedDocsValidation.value = param.value
        }
      }
      paramIndex++
    }
  } catch (error) {
    notifications.error('Error al cargar los parámetros de validación')
  } finally {
    validationsLoading.value = false
  }
}

// Event Handlers
function handleSignedDocsValidationChange(value) {
  signedDocsValidation.value = value
}

function handleOpenConfirmation() {
  confirmationModalRef.value?.openDialog()
}

function handleCloseConfirmation() {
  confirmationModalRef.value?.closeDialog()
}

async function handleSaveConfiguration() {
  try {
    isSaving.value = true
    
    const paramId = parameterIds.value['VERIFICACION DE DOCUMENTOS FIRMADOS']
    
    if (paramId) {
      await putData(`/parameters/updateParameter/${paramId}`, { 
        value: signedDocsValidation.value 
      })
    } else {
      notifications.error('No se encontró el parámetro para actualizar')
      return
    }
    
    notifications.success('Configuración guardada exitosamente')
    handleCloseConfirmation()
    await loadValidationsParameters()
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.msg 
      || error?.message 
      || 'Error al guardar la configuración'
    notifications.error(errorMessage)
  } finally {
    isSaving.value = false
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

.form-row
  display: flex
  align-items: center
  justify-content: space-between
  margin-bottom: 20px
  gap: 15px
  min-height: 56px

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

.form-input-group > *
  align-self: center

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
</style>