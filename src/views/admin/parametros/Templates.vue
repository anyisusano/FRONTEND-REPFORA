<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">PLANTILLAS</h1>
    </div>

    <div class="container">
      <q-card class="templates-card">
        <div class="card-header">
          <q-icon name="description" size="32px" color="grey-7" />
        </div>
        
        <q-separator />
        
        <q-card-section class="templates-list">
          <div
            v-for="template in templates"
            :key="template.id"
            class="template-item"
          >
            <span class="template-name">{{ template.name }}</span>
            <q-icon
              name="circle"
              size="12px"
              :color="template.active ? 'positive' : 'grey-4'"
            />
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
const templates = ref([
  { id: 1, name: 'BITACORA', active: true },
  { id: 2, name: 'SEGUIMIENTO', active: true }
])
</script>

<style lang="sass" scoped>
.container
  max-width: 1200px
  margin: 0 auto
  display: flex
  justify-content: center
  margin-top: 30px

.templates-card
  background: #fff
  border-radius: 14px
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1)
  width: 95%
  max-width: 1200px
  overflow: hidden

.card-header
  background-color: #fff
  padding: 20px 25px
  display: flex
  align-items: center

.templates-list
  padding: 0

.template-item
  display: flex
  justify-content: space-between
  align-items: center
  padding: 18px 25px
  border-bottom: 1px solid #f0f0f0
  transition: background-color 0.2s ease

.template-item:last-child
  border-bottom: none

.template-item:hover
  background-color: #f9f9f9

.template-name
  font-size: 16px
  color: #666
  font-weight: 500
  letter-spacing: 0.5px

@media (max-width: 768px)
  .templates-card
    width: 100%

  .template-item
    padding: 15px 20px

  .template-name
    font-size: 14px
</style>
