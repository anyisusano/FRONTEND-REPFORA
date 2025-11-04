<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">REPORTES</h1>
    </div>

    <div class="container">
      <div class="reports-grid">
        <MenuCard
          v-for="report in reportCards"
          :key="report.route"
          :title="report.title"
          :subtitle="report.subtitle"
          :img-src="report.imgSrc"
          :route="report.route"
          :color="report.color"
          :text-color="report.textColor"
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
const reportCards = ref([
  {
    title: 'Reporte por Año',
    subtitle: '',
    imgSrc: '/src/assets/Contrato_Aprendizaje.jpg',
    route: '/app/admin/reporteporaño',
    color: 'var(--color-primary)',
    textColor: 'white'
  },
  {
    title: 'Reporte por Modalidad',
    subtitle: '',
    imgSrc: '/src/assets/Modalidad,Contrato_negro.jpg',
    route: '/app/admin/reportepormodalidad',
    color: 'var(--color-primary)',
    textColor: 'white'
  },
  {
    title: 'Horas por Instructor',
    subtitle: '',
    imgSrc: '/src/assets/Horas_Instructor.jpg',
    route: '/app/admin/horasporinstructor',
    color: 'var(--color-primary)',
    textColor: 'white'
  },
  {
    title: 'Reporte por Empresa',
    subtitle: '',
    imgSrc: '/src/assets/SGVA_Negro.jpg',
    route: '/app/admin/reporteporempresa',
    color: 'var(--color-primary)',
    textColor: 'white'
  }
])
</script>

<style lang="sass" scoped>
.container
  max-width: 800px
  margin: 0 auto
  display: flex
  justify-content: center

.reports-grid
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))
  gap: 2rem
  width: 100%
  max-width: 800px
  padding: 20px 0

@media (max-width: 768px)
  .reports-grid
    grid-template-columns: 1fr
    gap: 1.5rem
    padding: 16px 0

@media (max-width: 480px)
  .reports-grid
    gap: 1.25rem
    padding: 12px 0

@media (max-width: 300px)
  .reports-grid
    gap: 1rem
    padding: 10px 0
</style>
