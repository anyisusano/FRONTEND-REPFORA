<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">Buscar Ficha</h1>
    </div>

    <div class="container">
      <div class="row justify-center">
        <div class="col-12 col-md-8">
          <q-select
            ref="selectRef"
            v-model="selectedFiche"
            :options="fiches"
            outlined
            dense
            use-input
            input-debounce="500"
            option-label="number"
            option-value="_id"
            emit-value
            map-options
            label="Seleccionar ficha"
            clearable
            :loading="isLoading"
            @filter="handleFilterFiches"
            @popup-show="handlePopupShow"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Busca la ficha que necesites 
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useApiData } from '../../composables/useApiData'
import { useNotifications } from '../../composables/useNotifications'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()
const notifications = useNotifications()

const selectedFiche = ref(null)
const selectRef = ref(null)
const searchTerm = ref('')

// Usar composable para datos con endpoint dinámico
const { 
  data: fiches, 
  isLoading, 
  fetchData: fetchFiches 
} = useApiData('/fiches/listFiche', {
  extractData: (response) => response?.msg || [],
  showEmptyInfo: false,
  errorMessage: 'Error al cargar las fichas'
})

async function handleFilterFiches(val, update) {
  searchTerm.value = val || ''
  
  if (!val) {
    update(() => {
      fiches.value = []
    })
    return
  }

  update(async () => {
    await fetchFiches(`?number=${val}`)
  })
}

function handlePopupShow () {
  if (!searchTerm.value && selectRef.value && typeof selectRef.value.hidePopup === 'function') {
    selectRef.value.hidePopup()
  }
}


watch(selectedFiche, (newValue) => {
  if (newValue) {
    // Buscar usando while
    let selectedFicheObj = null
    let i = 0
    while (i < fiches.value.length) {
      const f = fiches.value[i]
      if (f._id === newValue || f.number === newValue) {
        selectedFicheObj = f
        break
      }
      i++
    }
    if (selectedFicheObj) {
      router.push(`/app/admin/aprendices/${selectedFicheObj._id}`)
    }
  }
})


onMounted(() => {
  fetchFiches()
})
</script>

<style lang="sass" scoped>
.container
  max-width: 800px
  margin: 0 auto
</style>