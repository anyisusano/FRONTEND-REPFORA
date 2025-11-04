cardNovedades 

<template>
  <div class="urgent-section q-pa-md">


    <div v-if="loading" class="text-center q-pa-md">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-md">Cargando...</div>
    </div>

    <div v-else-if="novedades.length" class="q-pa-sm">
      <div v-for="(novedad, idx) in novedades" :key="novedad._id || idx" class="novedad-item q-mb-md">
        <div class="novedad-content">
          <div class="text-h6">{{ novedad.tpnew || 'Novedad' }}</div>
          <div class="text-subtitle1">{{ novedad.name || '-' }}</div>
          <div class="text-caption">Ficha: {{ novedad.fiche?.number || novedad.code || '-' }}</div>
        </div>
        <div class="text-right text-caption text-grey-7 q-mt-xs">
          {{ tiempoTranscurrido(novedad) }}
        </div>
      </div>
    </div>

    <!-- Reemplazar con mensaje de error del backend -->
    <div class="  text-center">
          {{ errorMessage }}
        </div>
  </div>
      
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  novedades: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    required: true
  }
})

defineEmits(['mostrar-tabla'])

function tiempoTranscurrido(novedad) {
  if (!novedad) return '-'
  
  // El backend usa createdAt o datesofia
  const fecha = novedad.createdAt || novedad.datesofia || novedad.date || ''
  
  if (!fecha) return '-'
  
  try {
    const dias = getDays(fecha)
    if (dias < 0) return `Faltan ${Math.abs(dias)} días`
    if (dias === 0) return 'Hoy'
    if (dias === 1) return 'Hace 1 día'
    return `Hace ${dias} días`
  } catch (e) {
    return '-'
  }
}

function getDays(fecha) {
  const fechaNovedad = new Date(fecha)
  const hoy = new Date()
  
  // Establecer las horas a medianoche para ambas fechas
  fechaNovedad.setHours(0, 0, 0, 0)
  hoy.setHours(0, 0, 0, 0)
  
  // Convertir a UTC para evitar problemas con zona horaria
  const utcNovedad = Date.UTC(fechaNovedad.getFullYear(), fechaNovedad.getMonth(), fechaNovedad.getDate())
  const utcHoy = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  
  // Calcular la diferencia en días
  return Math.floor((utcHoy - utcNovedad) / (1000 * 60 * 60 * 24))
}

</script>

<style scoped>
.urgent-section {
  background: #FFF3E0;
  border-radius: 8px;
}

.button-wide {
  width: 400px;
  max-width: 90%;
}

.novedad-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.novedad-content {
  padding: 8px 0;
}

.text-h6 {
  font-weight: 600;
  margin-bottom: 4px;
}

.text-subtitle1 {
  color: #666;
  margin-bottom: 2px;
}

.error-item {
  border-left: 4px solid #C10015;
}

.text-negative {
  color: #C10015;
  font-weight: 500;
}

/* Responsive - Tablets */
@media (max-width: 1024px) {
  .urgent-section {
    padding: 16px;
  }
  
  .novedad-item {
    padding: 14px;
  }
  
  .button-wide {
    width: 100%;
    max-width: 100%;
  }
}

/* Responsive - Móviles grandes */
@media (max-width: 768px) {
  .urgent-section {
    padding: 12px;
    border-radius: 6px;
  }
  
  .novedad-item {
    padding: 12px;
    border-radius: 6px;
  }
  
  .novedad-content {
    padding: 6px 0;
  }
  
  .text-h6 {
    font-size: clamp(0.95rem, 2vw, 1.1rem);
  }
  
  .text-subtitle1 {
    font-size: clamp(0.85rem, 1.8vw, 0.95rem);
  }
}

/* Responsive - Móviles medianos */
@media (max-width: 480px) {
  .urgent-section {
    padding: 10px;
  }
  
  .novedad-item {
    padding: 10px;
    margin-bottom: 12px;
  }
  
  .text-h6 {
    font-size: clamp(0.9rem, 2.5vw, 1rem);
    margin-bottom: 3px;
  }
  
  .text-subtitle1 {
    font-size: clamp(0.8rem, 2.2vw, 0.9rem);
    margin-bottom: 2px;
  }
  
  .text-caption {
    font-size: clamp(0.7rem, 2vw, 0.8rem);
  }
}

/* Responsive - Móviles pequeños */
@media (max-width: 360px) {
  .urgent-section {
    padding: 8px;
  }
  
  .novedad-item {
    padding: 8px;
  }
  
  .text-h6 {
    font-size: clamp(0.85rem, 3vw, 0.95rem);
  }
}

/* Responsive - Pantallas muy pequeñas (300px) */
@media (max-width: 300px) {
  .urgent-section {
    padding: 6px;
    border-radius: 4px;
  }
  
  .novedad-item {
    padding: 6px;
    margin-bottom: 10px;
    border-radius: 4px;
  }
  
  .novedad-content {
    padding: 4px 0;
  }
  
  .text-h6 {
    font-size: clamp(0.8rem, 3.5vw, 0.9rem);
    margin-bottom: 2px;
    line-height: 1.2;
  }
  
  .text-subtitle1 {
    font-size: clamp(0.75rem, 3.2vw, 0.85rem);
    margin-bottom: 2px;
    line-height: 1.3;
  }
  
  .text-caption {
    font-size: clamp(0.65rem, 3vw, 0.75rem);
  }
}
</style>