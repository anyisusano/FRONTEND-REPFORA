<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">SEGURIDAD</h1>
    </div>

    <div class="container">
      <!-- Credentials and Access Section -->
      <q-card class="section-card q-mb-lg">
        <div class="section-header">
          <div class="header-title">Credenciales y Acceso</div>
        </div>
        
        <q-card-section class="section-content">
          <div class="config-row">
            <div class="config-left">
              <span class="config-label">Contraseña temporal inicial</span>
            </div>
            <div class="config-right">
              <span class="config-value">Documento</span>
            </div>
          </div>

          <div class="config-row">
            <div class="config-left">
              <span class="config-label">Forzar cambio al iniciar sesión</span>
            </div>
            <div class="config-right">
              <span class="config-value"></span>
            </div>
          </div>

          <div class="config-row">
            <div class="config-left">
              <span class="config-label">Tiempo de sesión</span>
            </div>
            <div class="config-right">
              <div class="time-container">
                <span class="time-value">30</span>
                <span class="time-unit">min</span>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- AI Validations Section -->
      <q-card class="section-card">
        <div class="section-header">
          <div class="header-title">Validaciones IA</div>
        </div>
        
        <q-card-section class="section-content">
          <div class="validation-row-main q-mb-md">
            <div class="validation-left">
              <span class="config-label">Validación de firmas</span>
            </div>
          </div>

          <div class="validation-row q-mb-md">
            <div class="validation-left">
              <span class="config-label">Validación de firmas, docs firmados</span>
            </div>
          </div>

          <div class="validation-row q-mb-md">
            <div class="validation-left">
              <span class="config-label">Validación formato PDF para carga de instructor y aprendiz</span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackButton from '../../../components/BackButton.vue'

// State
const signatureValidation = ref(true)
</script>

<style lang="sass" scoped>
.container
  max-width: 1200px
  margin: 0 auto

.section-card
  border-radius: 12px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  overflow: hidden
  background: white

.section-header
  background: var(--color-secondary)
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
  padding: 15px 0
  margin-bottom: 15px
  border-bottom: 1px solid #e0e0e0

.config-row:last-child
  border-bottom: none
  margin-bottom: 0

.config-left
  flex: 1

.config-right
  flex-shrink: 0

.config-label
  font-size: 14px
  font-weight: 600
  color: #000
  margin: 0

.config-value
  font-size: 14px
  color: #666
  font-weight: 500

.time-container
  display: flex
  align-items: center
  gap: 5px

.time-value
  font-size: 16px
  font-weight: 600
  color: #000

.time-unit
  font-size: 14px
  color: #666

.validation-row-main,
.validation-row
  padding: 15px
  background: #f9f9f9
  border-radius: 8px
  margin-bottom: 10px

.validation-row-main
  background: #e8f5e9

.validation-left
  flex: 1

@media (max-width: 768px)
  .config-row
    flex-direction: column
    align-items: flex-start
    gap: 10px

  .config-right
    align-self: flex-end
</style>
