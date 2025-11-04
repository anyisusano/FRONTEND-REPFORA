<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">BUSCAR FICHA</h1>
    </div>

    <div class="container">
      <div class="row justify-center">
        <div class="col-12 col-md-8">
          <q-select
            v-model="selectedFiche"
            :options="filteredFiches"
            use-input
            input-debounce="300"
            placeholder="Número de Ficha"
            outlined
            class="search-select"
            @filter="handleFilterFiches"
            @update:model-value="handleSelectFiche"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="grey-6" size="20px" />
            </template>

            <template v-slot:append>
              <q-icon name="expand_more" color="grey-6" />
            </template>
            
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <div v-if="!selectedFiche && showSuggestions && suggestedFiches.length > 0" class="suggestions-container q-mt-md">
            <div
              v-for="fiche in suggestedFiches"
              :key="fiche"
              class="fiche-item"
              @click="selectFiche(fiche)"
            >
              Ficha {{ fiche }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()

// State
const selectedFiche = ref(null)
const showSuggestions = ref(false)
const filteredFiches = ref([
  '2926076',
  '2926065',
  '2926034',
  '2589667'
])

// All available fiches
const allFiches = [
  '2926076',
  '2926065',
  '2926034',
  '2589667'
]

// Suggested fiches
const suggestedFiches = computed(() => {
  return allFiches
})

// Event Handlers
function handleFilterFiches(val, update) {
  if (val === '') {
    update(() => {
      filteredFiches.value = allFiches
      showSuggestions.value = false
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    // Sin usar filter - el backend debe filtrar las fichas
    const filtered = []
    let index = 0
    while (index < allFiches.value.length) {
      const fiche = allFiches.value[index]
      if (fiche && fiche.toLowerCase().indexOf(needle) > -1) {
        filtered.push(fiche)
      }
      index++
    }
    filteredFiches.value = filtered
    showSuggestions.value = filteredFiches.value.length > 0
  })
}

function handleSelectFiche(fiche) {
  if (fiche) {
    router.push(`/app/admin/documentos/${fiche}`)
  }
}

function selectFiche(fiche) {
  selectedFiche.value = fiche
  handleSelectFiche(fiche)
}
</script>

<style lang="sass" scoped>
.container
  max-width: 800px
  margin: 0 auto

.search-select
  width: 100%

.suggestions-container
  background: white
  border-radius: 8px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  padding: 10px
  max-height: 300px
  overflow-y: auto

.fiche-item
  padding: 12px 16px
  cursor: pointer
  border-radius: 4px
  transition: background-color 0.2s ease

.fiche-item:hover
  background-color: #f5f5f5
</style>
