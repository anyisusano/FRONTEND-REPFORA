<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">HORAS DE INSTRUCTOR</h1>
    </div>

    <div class="container">
      <maintable
        :datos="parameters"
        :columnas="columns"
        row-key="_id"
        no-data-label="No hay parámetros registrados"
        :rows-per-page-options="[10, 20, 50]"
        :initial-rows-per-page="10"
      >
        <template #body-cell-options="props">
          <q-td :props="props" class="text-center">
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="handleEdit(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </maintable>
    </div>

    <!-- Edit Modal -->
    <modalComponent
      ref="editModalRef"
      width="600px"
      max-width="95vw"
    >
      <template #header>
        <div class="text-h6">Editar Hora de Instructor</div>
      </template>

      <template #body>
        <div class="q-pa-md">
          <div class="text-h6 q-mb-md">{{ editingParameter?.name || '-' }}</div>
          <q-input
            v-model="editingValue"
            outlined
            dense
            label="Hora Base"
            type="number"
            :rules="[
              validation.requiredRule,
              val => val > 0 || 'La hora base debe ser mayor que 0'
            ]"
          />
        </div>
      </template>

      <template #footer>
        <BotonCerrar label="Cancelar" @click="handleCloseEdit" />
        <BotonEnviar
          label="Guardar"
          @click="handleOpenConfirmation"
          :disable="!isEditingValueValid"
        />
      </template>
    </modalComponent>

    <!-- Confirmation Modal -->
    <modalComponent
      ref="confirmationModalRef"
      width="500px"
      max-width="90vw"
    >
      <template #header>
        <div class="text-h6">Confirmar Cambios</div>
      </template>

      <template #body>
        <div class="q-pa-md">
          <p class="confirmation-text">
            ¿Está seguro de que desea guardar los cambios para <strong>{{ editingParameter?.name }}</strong>?
          </p>
          <p class="confirmation-text">
            El nuevo valor será: <strong>{{ editingValue }}</strong>
          </p>
        </div>
      </template>

      <template #footer>
        <BotonCerrar label="Cancelar" @click="handleCloseConfirmation" />
        <BotonEnviar
          label="Guardar"
          @click="handleConfirm"
          :loading="isSaving"
        />
      </template>
    </modalComponent>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getData, putData } from '../../../services/apiClient'
import { useNotifications } from '../../../composables/useNotifications'
import { useFormValidation } from '../../../composables/useFormValidation'
import BackButton from '../../../components/BackButton.vue'
import BotonCerrar from '../../../components/BotonCerrar.vue'
import BotonEnviar from '../../../components/BotonEnviar.vue'
import maintable from '../../../components/tables/maintable.vue'
import modalComponent from '../../../components/modals/modalComponent.vue'

// Composables
const notifications = useNotifications()
const validation = useFormValidation()

// State
const isLoading = ref(false)
const isSaving = ref(false)
const parameters = ref([])
const editingParameter = ref(null)
const editingValue = ref('')

// Modals
const editModalRef = ref(null)
const confirmationModalRef = ref(null)

// Table Columns
const columns = [
  { name: 'name', align: 'center', label: 'Activity', field: 'name', sortable: true },
  { name: 'value', align: 'center', label: 'Base Hour', field: 'value', sortable: true },
  { name: 'description', align: 'center', label: 'Description', field: 'description', sortable: true },
  { name: 'options', align: 'center', label: 'Options', field: 'options' }
]

// Computed
const isEditingValueValid = computed(() => {
  return editingValue.value && editingValue.value > 0
})

// API Functions
async function fetchParameters() {
  isLoading.value = true
  try {
    const response = await getData('/parameters/filterParameters?category=ACADEMIC')
    parameters.value = response?.data || []
    
  } catch (error) {
    console.error('Error loading parameters:', error)
    const errorMsg = error.response?.data?.message 
      || error.response?.data?.msg 
      || error.message 
      || 'Error loading parameters'
    notifications.error(errorMsg)
    parameters.value = []
  } finally {
    isLoading.value = false
  }
}

async function updateParameter() {
  if (!editingParameter.value || !editingValue.value) {
    notifications.error('Please verify the data')
    return
  }

  isSaving.value = true

  try {
    const id = editingParameter.value._id
    await putData(`/parameters/updateParameter/${id}`, {
      value: Number(editingValue.value)
    })

    notifications.success('Parameter updated successfully')
    handleCloseConfirmation()
    setTimeout(() => handleCloseEdit(), 300)
    await fetchParameters()
  } catch (error) {
    console.error('Error updating parameter:', error)
    const errorMsg = error.response?.data?.message 
      || error.response?.data?.msg 
      || error.message 
      || 'Error updating parameter'
    notifications.error(errorMsg)
  } finally {
    isSaving.value = false
  }
}

// Event Handlers
function handleEdit(parameter) {
  editingParameter.value = parameter
  editingValue.value = parameter.value || ''
  editModalRef.value?.openDialog()
}

function handleCloseEdit() {
  editModalRef.value?.closeDialog()
  editingParameter.value = null
  editingValue.value = ''
}

function handleOpenConfirmation() {
  if (isEditingValueValid.value) {
    confirmationModalRef.value?.openDialog()
  } else {
    notifications.error('Please enter a valid value')
  }
}

function handleCloseConfirmation() {
  confirmationModalRef.value?.closeDialog()
}

async function handleConfirm() {
  await updateParameter()
}

// Lifecycle
onMounted(() => {
  fetchParameters()
})
</script>

<style lang="sass" scoped>
.container
  max-width: 1400px
  margin: 0 auto

.confirmation-text
  font-size: 16px
  margin-bottom: 15px
  line-height: 1.5
  color: #333

@media (max-width: 900px)
  .container
    padding: 0 10px
</style>
