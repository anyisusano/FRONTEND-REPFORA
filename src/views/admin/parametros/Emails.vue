<template>
  <div class="q-pa-md">
    <BackButton />
    
    <div class="text-center q-mb-lg">
      <h1 class="text-weight-bold text-black q-my-md" style="font-size: 3rem;">CORREOS</h1>
    </div>

    <div class="container">
      <maintable
        :datos="parameters"
        :columnas="columns"
        row-key="_id"
        no-data-label="No hay parámetros de correo registrados"
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
        <div class="text-h6">Editar Parámetro de Correo</div>
      </template>

      <template #body>
        <div class="q-pa-md">
          <div class="parameter-details q-mb-md">
            <div class="text-h6 q-mb-sm">{{ editingParameter?.name || '-' }}</div>
            <div class="text-caption text-grey-7 q-mb-xs">
              <strong>Tipo:</strong> {{ editingParameter?.type || '-' }}
            </div>
            <div v-if="editingParameter?.description" class="text-body2 text-grey-8 q-mb-md">
              📝 {{ editingParameter.description }}
            </div>
          </div>
          
          <q-input
            v-model="editingValue"
            outlined
            label="Valor"
            :type="editingParameter?.type === 'NUMBER' ? 'number' : 'text'"
            :rules="[
              validation.requiredRule,
              val => {
                if (editingParameter?.type === 'NUMBER') {
                  return !isNaN(val) || 'Debe ser un número válido'
                }
                return true
              }
            ]"
            :hint="editingParameter?.type === 'STRING' ? 'Ingrese valor de texto' : 'Ingrese valor numérico'"
          />
          
          <div v-if="editingParameter?.updatedAt" class="text-caption text-grey-6 q-mt-sm">
            Última actualización: {{ new Date(editingParameter.updatedAt).toLocaleString() }}
          </div>
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
  { 
    name: 'name', 
    align: 'left', 
    label: 'Parameter Name', 
    field: 'name', 
    sortable: true,
    style: 'min-width: 200px'
  },
  { 
    name: 'value', 
    align: 'left', 
    label: 'Current Value', 
    field: 'value', 
    sortable: true,
    style: 'min-width: 180px'
  },
  { 
    name: 'type', 
    align: 'center', 
    label: 'Type', 
    field: 'type', 
    sortable: true 
  },
  { 
    name: 'description', 
    align: 'left', 
    label: 'Description', 
    field: 'description', 
    sortable: true,
    style: 'min-width: 250px'
  },
  { 
    name: 'updatedAt', 
    align: 'center', 
    label: 'Last Updated', 
    field: 'updatedAt',
    sortable: true,
    format: (val) => val ? new Date(val).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) : '-'
  },
  { 
    name: 'options', 
    align: 'center', 
    label: 'Actions', 
    field: 'options' 
  }
]

// Computed
const isEditingValueValid = computed(() => {
  return editingValue.value && editingValue.value.trim() !== ''
})

// API Functions
async function fetchParameters() {
  isLoading.value = true
  try {
    const response = await getData('/parameters/filterParameters?category=EMAIL')
    parameters.value = response?.data || []
    
    // Log para ver todos los datos que llegan
    console.log('📧 EMAIL Parameters Response:', response)
    console.log('📧 Total EMAIL Parameters:', parameters.value.length)
    console.log('📧 Full Data:', JSON.stringify(parameters.value, null, 2))
    
  } catch (error) {
    console.error('Error loading email parameters:', error)
    const errorMsg = error.response?.data?.message 
      || error.response?.data?.msg 
      || error.message 
      || 'Error loading email parameters'
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
    // Si el valor original es un número, convertirlo, sino dejarlo como string
    const valueToSend = isNaN(editingValue.value) 
      ? editingValue.value 
      : Number(editingValue.value)
    
    await putData(`/parameters/updateParameter/${id}`, {
      value: valueToSend
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
  editingValue.value = parameter.value !== undefined && parameter.value !== null 
    ? String(parameter.value) 
    : ''
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
  max-width: 1600px
  margin: 0 auto

.confirmation-text
  font-size: 16px
  margin-bottom: 15px
  line-height: 1.5
  color: #333

.parameter-details
  background: #f5f5f5
  padding: 12px
  border-radius: 8px
  border-left: 4px solid #1976d2

@media (max-width: 900px)
  .container
    padding: 0 10px
</style>
