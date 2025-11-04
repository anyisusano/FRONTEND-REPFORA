<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">PARÁMETROS</h1>
    </div>

    <div class="container">
      <div class="cards-grid">
        <MenuCard
          v-for="card in parameterCards"
          :key="card.route"
          :title="card.title"
          :subtitle="card.subtitle"
          :img-src="card.imgSrc"
          :route="card.route"
          :color="card.color"
          :text-color="card.textColor"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackButton from '../../components/BackButton.vue'
import MenuCard from '../../components/cards/MenuCard.vue'

// State
const parameterCards = ref([
  {
    title: 'HORAS INSTRUCTORES',
    subtitle: 'Consulta, Registro y Visualización de horas',
    imgSrc: '/src/assets/Horas_Instructor.jpg',
    route: '/app/admin/horasintructores',
    color: 'var(--color-primary)',
    textColor: 'white'
  },
  {
    title: 'PROCESO FORMATIVO',
    subtitle: 'Consulta y Visualización',
    imgSrc: '/src/assets/Proceso_Formativo.jpg',
    route: '/app/admin/procesoformativo',
    color: 'var(--color-primary)',
    textColor: 'white'
  },
  {
    title: 'ALERTAS',
    subtitle: 'Consulta Alertas',
    imgSrc: '/src/assets/Alertas.jpg',
    route: '/app/admin/alertas',
    color: 'var(--color-primary)',
    textColor: 'white'
  },
  {
    title: 'ALMACENAMIENTO',
    subtitle: 'Consulta y Visualización de Almacenamiento',
    imgSrc: '/src/assets/Almacenamiento.jpg',
    route: '/app/admin/almacenamiento',
    color: 'var(--color-primary)',
    textColor: 'white'
  },
  {
    title: 'SEGURIDAD',
    subtitle: 'Consulta y Visualización de Seguridad',
    imgSrc: '/src/assets/Seguridad.jpg',
    route: '/app/admin/seguridad',
    color: 'var(--color-primary)',
    textColor: 'white'
  },
  {
    title: 'CORREOS',
    subtitle: 'Consulta y Envío de Correos',
    imgSrc: '/src/assets/SubirDocumentos_negro.jpg',
    route: '/app/admin/correos',
    color: 'var(--color-primary)',
    textColor: 'white'
  },
  {
    title: 'PLANTILLAS',
    subtitle: 'Consulta de Plantillas',
    imgSrc: '/src/assets/Plantillas_Negro.jpg',
    route: '/app/admin/plantillas',
    color: 'var(--color-primary)',
    textColor: 'white'
  }
])
</script>

<style lang="sass" scoped>
.container
  max-width: 1400px
  margin: 0 auto
  display: flex
  justify-content: center
  align-items: flex-start
  width: 100%
  margin-top: 20px

.cards-grid
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
  gap: 24px
  width: 100%
  padding: 0
  justify-items: center
  align-items: stretch

@media (max-width: 1200px)
  .cards-grid
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))
    gap: 20px

@media (max-width: 768px)
  .cards-grid
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))
    gap: 16px

@media (max-width: 640px)
  .cards-grid
    grid-template-columns: 1fr
    gap: 12px
    max-width: 500px

@media (min-width: 1600px)
  .cards-grid
    grid-template-columns: repeat(4, 1fr)
    max-width: 1600px

:deep(.menu-card)
  height: 100%
  min-height: 200px
  transition: transform 0.2s ease, box-shadow 0.2s ease

:deep(.menu-card):hover
  transform: translateY(-2px)
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
</style>
