
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
              <q-input
                v-model.number="sessionTime"
                type="number"
                outlined
                dense
                class="custom-input"
                :loading="credentialsLoading"
                @update:model-value="handleSessionTimeChange"
                :min="1"
                :max="720"
              />
              <span class="input-hint">hrs</span>
            </div>
          </div>

          <div class="form-actions">
            <BotonEnviar
              label="Guardar Configuración"
              :loading="credentialsLoading"
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
          <p class="confirmation-text">Guardar Seguridad</p>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-buttons">
          <BotonCerrar label="Cancelar" @click="handleCloseConfirmation" />
          <BotonEnviar
            label="Aceptar"
            :loading="credentialsLoading"
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
const credentialsLoading = ref(false)

// State
const confirmationModalRef = ref(null)

// Form Values - Credentials
const forcePasswordChange = ref(false)
const sessionTime = ref(48)

// Parameters data
const credentialsParameters = ref([])

// Load data on mount
onMounted(async () => {
  await loadCredentialsParameters()
})

// Carga parámetros SECURITY para credenciales  
async function loadCredentialsParameters() {
  credentialsLoading.value = true
  try {
    const securityResponse = await getData('/parameters/filterParameters?category=SECURITY')
    const securityData = securityResponse?.data || securityResponse?.msg || []
    credentialsParameters.value = securityData
    
    // Busca parámetros de credenciales
    const forcePasswordParam = securityData.find(param => param.name === 'CONTRASEÑA TEMPORAL INICIAL')
    const sessionTimeParam = securityData.find(param => param.name === 'TIEMPO DE SESION')
    
    if (forcePasswordParam) {
      forcePasswordChange.value = forcePasswordParam.value
    }
    
    if (sessionTimeParam) {
      sessionTime.value = Number(sessionTimeParam.value)
    }
  } catch (error) {
    notifications.error('Error al cargar los parámetros')
  } finally {
    credentialsLoading.value = false
  }
}

function handleSessionTimeChange(value) {
  sessionTime.value = value
}

function handleForcePasswordChange(value) {
  forcePasswordChange.value = value
}

function handleOpenConfirmation() {
  confirmationModalRef.value?.openDialog()
}

function handleCloseConfirmation() {
  confirmationModalRef.value?.closeDialog()
}

async function handleSaveConfiguration() {
  credentialsLoading.value = true
  
  try {
    // Guarda parámetros de credenciales
    const forcePasswordParam = credentialsParameters.value.find(param => param.name === 'CONTRASEÑA TEMPORAL INICIAL')
    const sessionTimeParam = credentialsParameters.value.find(param => param.name === 'TIEMPO DE SESION')
    
    const promises = []
    
    // Actualiza si existe y cambió
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
      if (forcePasswordParam) forcePasswordParam.value = forcePasswordChange.value
      if (sessionTimeParam) sessionTimeParam.value = Number(sessionTime.value)
    }
    
    notifications.success('Configuración guardada exitosamente')
    handleCloseConfirmation()
    await loadCredentialsParameters()
  } catch (error) {
    notifications.error('Error al guardar la configuración')
    await loadCredentialsParameters()
  } finally {
    credentialsLoading.value = false
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
  min-height: 56px

.custom-input
  width: 120px

.input-hint
  font-size: 12px
  color: #666
  white-space: nowrap
  min-width: 30px
  line-height: 1.4

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

  .custom-input
    flex: 1


</style>