<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">ALMACENAMIENTO</h1>
    </div>

    <div class="container">
      <!-- File Limits Card -->
      <q-card class="config-card q-mb-lg">
        <div class="green-header-container">
          <div class="card-header-green">
            <div class="header-title">Límites de Archivos</div>
          </div>
        </div>
        
        <q-card-section class="card-content">
          <div class="limit-row">
            <span class="limit-label">Tamaño máx - Seguimientos</span>
            <div class="limit-input-group">
              <q-select
                v-model="maxSizeFollowUps"
                :options="sizeOptions"
                dense
                outlined
                class="size-select"
                behavior="menu"
                @update:model-value="handleFollowUpsChange"
              />
              <span class="unit-label">MB</span>
            </div>
          </div>
          
          <div class="limit-row">
            <span class="limit-label">Tamaño máx - Certificaciones</span>
            <div class="limit-input-group">
              <q-select
                v-model="maxSizeCertifications"
                :options="sizeOptions"
                dense
                outlined
                class="size-select"
                behavior="menu"
                @update:model-value="handleCertificationsChange"
              />
              <span class="unit-label">MB</span>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Notifications Card -->
      <q-card class="config-card">
        <div class="green-header-container">
          <div class="card-header-green">
            <div class="header-title">Notificaciones</div>
          </div>
        </div>
        
        <q-card-section class="card-content">
          <div class="notification-row">
            <span class="notification-label">Correo emisor</span>
            <span class="notification-value">repfora@sena.edu.co</span>
          </div>
          
          <div class="notification-row">
            <span class="notification-label">Correo base institucional</span>
            <span class="notification-value">@sena.edu.co</span>
          </div>

          <div class="button-container">
            <BotonEnviar
              label="Guardar Configuración"
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
      max-width="95vw"
    >
      <template #header>
        <div class="modal-header-content">
          <q-btn
            flat
            round
            dense
            icon="close"
            color="dark"
            @click="handleCloseConfirmation"
            class="close-btn"
          />
        </div>
      </template>

      <template #body>
        <div class="modal-body-content">
          <p class="modal-question">¿Estás seguro que quieres guardar los cambios?</p>
          <p class="modal-text">Guardar almacenamiento</p>
        </div>
      </template>

      <template #footer>
        <div class="modal-footer-center">
          <BotonCerrar label="Cancelar" @click="handleCloseConfirmation" />
          <BotonEnviar
            label="Aceptar"
            @click="handleSaveConfiguration"
          />
        </div>
      </template>
    </modalComponent>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNotifications } from '../../../composables/useNotifications'
import BackButton from '../../../components/BackButton.vue'
import BotonCerrar from '../../../components/BotonCerrar.vue'
import BotonEnviar from '../../../components/BotonEnviar.vue'
import modalComponent from '../../../components/modals/modalComponent.vue'

// Composables
const notifications = useNotifications()

// State
const confirmationModalRef = ref(null)
const maxSizeFollowUps = ref(10)
const maxSizeCertifications = ref(7)
const sizeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20]

// Event Handlers
function handleFollowUpsChange(value) {
  notifications.success(`Tamaño seguimientos actualizado a ${value} MB`)
}

function handleCertificationsChange(value) {
  notifications.success(`Tamaño certificaciones actualizado a ${value} MB`)
}

function handleOpenConfirmation() {
  confirmationModalRef.value?.openDialog()
}

function handleCloseConfirmation() {
  confirmationModalRef.value?.closeDialog()
}

function handleSaveConfiguration() {
  // TODO: Replace with actual API call
  notifications.success('Configuración guardada exitosamente')
  handleCloseConfirmation()
}
</script>

<style lang="sass" scoped>
.container
  max-width: 1200px
  margin: 0 auto

.config-card
  border-radius: 20px
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15)
  overflow: visible
  background: white

.green-header-container
  padding: 20px 40px 0 40px
  margin-bottom: 10px

.card-header-green
  background-color: var(--color-secondary)
  padding: 18px 30px
  border-radius: 16px
  text-align: center
  box-shadow: 0 2px 8px rgba(92, 185, 23, 0.3)
  margin: 0 auto
  max-width: 100%

.header-title
  color: white
  font-size: 20px
  font-weight: 700
  text-align: center
  letter-spacing: 0.5px
  margin: 0

.card-content
  padding: 20px 50px 40px 50px
  background-color: white
  border-radius: 20px

.limit-row
  display: flex
  justify-content: space-between
  align-items: center
  padding: 20px 0
  width: 100%
  min-height: 60px

.limit-row:first-child
  padding-top: 0

.limit-row:last-child
  padding-bottom: 0

.limit-label
  font-size: 17px
  color: #000000
  font-weight: 600
  flex: 1
  min-width: 250px

.limit-input-group
  display: flex
  align-items: center
  gap: 15px
  flex-shrink: 0

.size-select
  width: 100px

.unit-label
  font-size: 15px
  color: #757575
  font-weight: 500
  min-width: 35px

.notification-row
  display: flex
  justify-content: space-between
  align-items: center
  padding: 20px 0
  width: 100%
  min-height: 60px

.notification-row:first-child
  padding-top: 0

.notification-row:last-child
  padding-bottom: 0

.notification-label
  font-size: 17px
  color: #000000
  font-weight: 600
  flex: 1
  min-width: 250px

.notification-value
  font-size: 16px
  color: #000000
  font-weight: 500
  text-align: right
  flex-shrink: 0

.button-container
  display: flex
  justify-content: center
  margin-top: 30px
  padding-top: 15px

.modal-header-content
  display: flex
  justify-content: flex-end
  align-items: center
  width: 100%
  padding: 10px 10px 0 0

.close-btn
  color: #000000 !important

.modal-body-content
  text-align: center
  padding: 30px 40px
  display: flex
  flex-direction: column
  align-items: center
  gap: 15px

.modal-question
  font-size: 18px
  color: #000000
  margin: 0
  font-weight: 600
  line-height: 1.4

.modal-text
  font-size: 16px
  color: #666
  margin: 0
  font-weight: 500
  line-height: 1.4

.modal-footer-center
  display: flex
  justify-content: center
  gap: 12px
  padding: 0 20px 30px 20px
  width: 100%

@media (max-width: 768px)
  .limit-row,
  .notification-row
    flex-direction: column
    align-items: flex-start
    gap: 15px
    padding: 18px 0

  .limit-input-group
    align-self: flex-end
    width: 100%
    justify-content: flex-end

  .notification-value
    align-self: flex-end
    text-align: right
    width: 100%

  .limit-label,
  .notification-label
    min-width: auto
</style>
