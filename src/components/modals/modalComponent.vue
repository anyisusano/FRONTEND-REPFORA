<template>
  <q-dialog v-model="isOpen">
    <q-card :style="cardStyle">
    <q-card-section style="background-color: var(--color-primary); color: white;">
        <slot name="header">
            <div class="text-h6">Título por defecto</div>
        </slot>
    </q-card-section>
        
      <q-card-section>
        <slot name="body">
          <!-- Contenido por defecto si no se proporciona ningún slot -->
          <p>Contenido del diálogo por defecto, esto no se va a ver en el modal si colocan contenido</p>
        </slot>
      </q-card-section>

      <q-card-actions align="right">
        <slot name="footer">
        
        </slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineExpose, watch, defineEmits, computed } from 'vue';

const props = defineProps({
  width: {
    type: String,
    default: '400px'
  },
  maxWidth: {
    type: String,
    default: '95vw'
  }
})

const isOpen = ref(false);

const emit = defineEmits(['accept', 'update:modelValue']);

const cardStyle = computed(() => ({
  minWidth: props.width,
  maxWidth: props.maxWidth
}))

const openDialog = () => {
  isOpen.value = true;
};

const closeDialog = () => {
  isOpen.value = false;
};

const acceptDialog = () => {
  isOpen.value = false;
  emit('accept');
};

// Emitir cambios de estado para sincronización externa
watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal);
});

defineExpose({
  openDialog,
  closeDialog,
});
</script>

<style scoped>
/* Responsive para el modal */
@media (max-width: 768px) {
  :deep(.q-dialog) {
    margin: 8px;
  }
  
  :deep(.q-card) {
    max-width: 95vw !important;
    min-width: auto !important;
  }
}

@media (max-width: 480px) {
  :deep(.q-dialog) {
    margin: 4px;
  }
  
  :deep(.q-card) {
    max-width: 98vw !important;
    border-radius: 12px;
  }
  
  :deep(.q-card-section) {
    padding: 12px;
  }
  
  :deep(.q-card-actions) {
    padding: 8px 12px;
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 300px) {
  :deep(.q-dialog) {
    margin: 2px;
  }
  
  :deep(.q-card) {
    max-width: 99vw !important;
    border-radius: 8px;
  }
  
  :deep(.q-card-section) {
    padding: 8px;
  }
  
  :deep(.q-card-actions) {
    padding: 6px 8px;
    flex-direction: column;
    gap: 6px;
  }
  
  :deep(.q-card-actions .q-btn) {
    width: 100%;
    margin: 0;
  }
  
  :deep(.text-h6) {
    font-size: clamp(0.9rem, 4vw, 1rem) !important;
  }
}
</style>