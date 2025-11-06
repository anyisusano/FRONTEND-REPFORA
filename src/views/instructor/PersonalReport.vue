<template>
  <div class="informe-container q-pa-lg">
    <BackButton />
    <div class="card-wrapper">
      <q-card class="card-datos q-pa-xl q-mt-lg">
        <!-- Título -->
        <div class="titulo-instructor text-center text-h5 text-bold q-mb-md">
          INSTRUCTOR 
        </div>

 
        <div class="info-instructor row">
          <div class="datos-personales">
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <div><strong>Nombre:</strong></div>
                <div>{{ instructor.name || '-' }}</div>
              </div>
              <div class="col-6">
                <div><strong>Correo Institucional:</strong></div>
                <div>{{ instructor.email || '-' }}</div>
              </div>
              <div class="col-6 q-mt-md">
                <div><strong>Documento:</strong></div>
                <div>{{ instructor.numdocument || '-' }}</div>
              </div>
              <div class="col-6 q-mt-md">
                <div><strong>Teléfono:</strong></div>
                <div>{{ instructor.phone || '-' }}</div>
              </div>
              <div class="col-6 q-mt-md">
                <div><strong>Correo Personal:</strong></div>
                <div>{{ instructor.emailpersonal || '-' }}</div>
              </div>
              <div class="col-6 q-mt-md">
                <div><strong>Conocimientos:</strong></div>
                <div>{{ instructor.knowledge || '-' }}</div>
              </div>
              <div class="col-12 q-mt-md">
                <div><strong>Área Temática:</strong></div>
                <div>{{ instructor.thematicarea || '-' }}</div>
              </div>
              <div class="col-6 q-mt-md">
                <div><strong>Tipo de Vinculación:</strong></div>
                <div>{{ instructor.bindingtype || '-' }}</div>
              </div>
            </div>


            <div v-if="fichas.length > 0" class="fichas-section q-mt-lg">
              <div class="text-h6 q-mb-md"><strong>Fichas Asociadas:</strong></div>
              <div class="fichas-list">
                <div v-for="ficha in fichas" :key="ficha._id" class="ficha-item">
                  <q-chip color="primary" text-color="white" icon="school">
                    {{ ficha.number }}
                  </q-chip>
                  <div class="ficha-programa">{{ ficha.program?.name || 'Programa no especificado' }}</div>
                </div>
              </div>
            </div>
          </div>

        
          <div class="horas-container">
            <q-btn 
              class="horas-box text-center" 
              :to="{ path: '/app/instructor/vistaHoras' }"
              aria-label="Ver horas acumuladas por pagar"
            >
              <div class="text-grey-7">Horas acumuladas por pagar:</div>
              <div class="text-h2 text-bold q-mt-sm">{{ instructor.hourswork || 0 }}</div>
            </q-btn>
          </div>
        </div>

      
        <div class="estado-section text-center q-mt-xl">
          <div class="q-mb-md"><strong>Estado:</strong></div>
          <div class="row justify-center q-gutter-md">
            <BotonEnviar
              label="Activo"
              unelevated
              class="btn-estado"
              :class="{ activo: instructor.status === 0 }"
              @click="cambiarEstado(0)"
            />
            <BotonCerrar
              label="Inactivo"
              unelevated
              class="btn-estado gris"
              :class="{ inactivo: instructor.status === 1 }"
              @click="cambiarEstado(1)"
            />
            <BotonCerrar
              label="Contrato Terminado"
              unelevated
              class="btn-estado gris"
              :class="{ terminado: instructor.status === 2 }"
              @click="cambiarEstado(2)"
            />
          </div>
        </div>
      </q-card>
    </div>

   
    <ModalComponent ref="modalAlert" width="450px">
      <template #header>
        <div class="text-h6">{{ modalHeader }}</div>
      </template>
      <template #body>
        <div style="font-size: 1.1rem;">{{ modalBody }}</div>
      </template>
      <template #footer>
        <BotonEnviar label="Entendido" @click="cerrarModal()" />
      </template>
    </ModalComponent>

 
    <q-inner-loading :showing="isLoading" color="primary" />
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import { useNotifications } from 'src/composables/useNotifications'
import { getData, putData } from 'src/services/apiClient'
import ModalComponent from 'src/components/modals/modalComponent.vue'
import BotonEnviar from 'src/components/BotonEnviar.vue'
import BotonCerrar from 'src/components/BotonCerrar.vue'
import BackButton from 'src/components/BackButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const notifications = useNotifications()

const isLoading = ref(false)
const instructor = ref({
  _id: '',
  name: '',
  email: '',
  emailpersonal: '',
  numdocument: '',
  tpdocument: '',
  phone: '',
  thematicarea: '',
  bindingtype: '',
  knowledge: '',
  caphour: 0,
  hourswork: 0,
  status: 0
})

const fichas = ref([])


const modalAlert = ref(null)
const modalHeader = ref('')
const modalBody = ref('')
const alertaMostrada = ref(false)


const instructorId = computed(() => {
  const user = authStore.user
  return user?._id || user?.id || user?.uid
})


function extractObjectId(obj) {
  if (!obj) return null
  if (typeof obj === 'string') return obj
  if (obj.$oid) return obj.$oid
  if (obj._id) {
    if (typeof obj._id === 'string') return obj._id
    if (obj._id.$oid) return obj._id.$oid
  }
  return null
}


async function cargarDatosInstructor() {
  if (!instructorId.value) {
    notifications.error('No se pudo identificar al instructor')
    router.push('/login')
    return
  }

  isLoading.value = true
  try {
    const response = await getData(`/instructors/instructorById/${instructorId.value}`)
    
   
    const responseData = response?.msg || response?.data || response
    
    if (responseData && typeof responseData === 'object') {
      
      const instructorData = responseData.instructor || responseData
      
      if (instructorData && typeof instructorData === 'object') {
        instructor.value = {
          _id: extractObjectId(instructorData) || instructorData._id,
          name: instructorData.name || '',
          email: instructorData.email || '',
          emailpersonal: instructorData.emailpersonal || '',
          numdocument: instructorData.numdocument || '',
          tpdocument: instructorData.tpdocument || '',
          phone: instructorData.phone || '',
          thematicarea: instructorData.thematicarea || '',
          bindingtype: instructorData.bindingtype || '',
          knowledge: instructorData.knowledge || '',
          caphour: instructorData.caphour || 0,
          hourswork: instructorData.hourswork || 0,
          status: instructorData.status ?? 0
        }
      }
      
      
      if (responseData.fiches && Array.isArray(responseData.fiches)) {
        fichas.value = responseData.fiches.map(ficha => ({
          _id: extractObjectId(ficha) || ficha._id,
          number: ficha.number || '',
          program: {
            _id: extractObjectId(ficha.program) || ficha.program?._id,
            name: ficha.program?.name || ''
          }
        }))
      }
    } else {
      throw new Error('Datos del instructor no disponibles')
    }
  } catch (error) {
    console.error('Error al cargar datos del instructor:', error)
    
    
    const user = authStore.user
    if (user) {
      instructor.value = {
        _id: extractObjectId(user) || user._id,
        name: user.name || '',
        email: user.email || '',
        emailpersonal: user.emailpersonal || '',
        numdocument: user.numdocument || '',
        tpdocument: user.tpdocument || '',
        phone: user.phone || '',
        thematicarea: user.thematicarea || '',
        bindingtype: user.bindingtype || '',
        knowledge: user.knowledge || '',
        caphour: user.caphour || 0,
        hourswork: user.hourswork || 0,
        status: user.status ?? 0
      }
    } else {
      const errorMsg = error.response?.data?.msg || 
                       error.response?.data?.message || 
                       'No se pudieron cargar los datos del instructor'
      notifications.error(errorMsg)
    }
  } finally {
    isLoading.value = false
  }
}


watch(
  () => instructor.value.hourswork,
  async (horas) => {
    await nextTick()

    if (!alertaMostrada.value) {
      if (horas >= 155 && horas < 160) {
        modalHeader.value = 'Alerta de Horas Acumuladas'
        modalBody.value = `El instructor ${instructor.value.name} ha acumulado ${horas} horas. Está próximo a alcanzar el límite máximo de 160 horas.`
        modalAlert.value?.openDialog()
        alertaMostrada.value = true
      } else if (horas >= 160) {
        modalHeader.value = 'Límite de Horas Alcanzado'
        modalBody.value = `El instructor ${instructor.value.name} ha alcanzado el máximo de 160 horas. No puede continuar acumulando más horas hasta que se gestione el pago o compensación.`
        modalAlert.value?.openDialog()
        alertaMostrada.value = true
      }
    }
  },
  { immediate: true }
)

const cerrarModal = () => {
  modalAlert.value?.closeDialog()
}

const cambiarEstado = async (nuevoEstado) => {
  if (!instructor.value._id) {
    notifications.error('No se puede cambiar el estado sin un ID de instructor')
    return
  }

  try {
    instructor.value.status = nuevoEstado
    
    const estados = {
      0: 'Activo',
      1: 'Inactivo',
      2: 'Contrato Terminado'
    }
    
    notifications.success(`Estado cambiado a ${estados[nuevoEstado]}`)
    
   
    
  } catch (error) {
    console.error('Error al cambiar estado:', error)
    notifications.error('No se pudo cambiar el estado')
  }
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    notifications.warning('Debes iniciar sesión para acceder a esta página')
    router.push('/login')
    return
  }

  await cargarDatosInstructor()
})
</script>

<style scoped>
.informe-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 12px !important;
}

.titulo-instructor {
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  padding-bottom: 12px;
  text-align: center;
  word-break: break-word;
}

.datos-container {
  background: #fff;
  min-height: 100vh;
}

.card-datos {
  width: 100%;
  max-width: 1200px;
  min-height: 500px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: white;
  font-size: 1rem;
  color: #333;
}

.card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  position: relative;
}

.datos-personales {
  flex: 1;
  min-width: 0;
  width: 100%;
  line-height: 1.6;
}

.datos-personales strong {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111;
}

.datos-personales div {
  font-size: 1rem;
  word-break: break-word;
}

.info-instructor {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  width: 100%;
}

.fichas-section {
  border-top: 2px solid #e0e0e0;
  padding-top: 1rem;
}

.fichas-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.ficha-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.ficha-programa {
  font-size: 0.9rem;
  color: #555;
  word-break: break-word;
}

.horas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.horas-box {
  width: 100%;
  max-width: 300px;
  height: 160px;
  border-radius: 16px;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-transform: none !important;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.horas-box .text-grey-7 {
  font-size: 1.1rem;
  color: #555;
  text-align: center;
  word-break: break-word;
}

.horas-box .text-h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #000;
  margin-top: 0.3rem;
}

.estado-section {
  font-size: 1.1rem;
  margin-top: 2rem;
  width: 100%;
}

.estado-section strong {
  font-size: 1.2rem;
  color: #222;
}

.btn-estado {
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  padding: 10px 16px;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 200px;
  margin-bottom: 8px;
}

.btn-estado.activo {
  background-color: var(--color-primary);
  color: #fff;
}

.btn-estado.gris {
  background-color: #B1B1B1;
  color: white;
}

.btn-estado.inactivo,
.btn-estado.terminado {
  opacity: 0.8;
}


@media (max-width: 480px) {
  .informe-container {
    padding: 8px !important;
  }
  
  .card-datos {
    padding: 16px;
    border-radius: 12px;
    font-size: 0.9rem;
  }
  
  .titulo-instructor {
    font-size: 1.3rem;
    padding-bottom: 8px;
  }
  
  .datos-personales strong {
    font-size: 1rem;
  }
  
  .datos-personales div {
    font-size: 0.9rem;
  }
  
  .horas-box {
    height: 140px;
    max-width: 260px;
  }
  
  .horas-box .text-grey-7 {
    font-size: 1rem;
  }
  
  .horas-box .text-h2 {
    font-size: 2rem;
  }
  
  .estado-section {
    font-size: 1rem;
    margin-top: 1.5rem;
  }
  
  .estado-section strong {
    font-size: 1.1rem;
  }
  
  .btn-estado {
    font-size: 0.9rem;
    padding: 8px 12px;
    max-width: 180px;
  }
  
  .ficha-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .card-datos {
    padding: 24px;
  }
  
  .titulo-instructor {
    font-size: 1.4rem;
  }
  
  .horas-box {
    height: 150px;
  }
  
  .horas-box .text-h2 {
    font-size: 2.2rem;
  }
}


@media (min-width: 769px) {
  .info-instructor {
    flex-wrap: nowrap;
  }
  
  .datos-personales {
    width: 60%;
  }
  
  .horas-container {
    width: 35%;
  }
}

@media (max-width: 300px) {
  .card-datos {
    padding: 12px;
    border-radius: 10px;
  }
  
  .titulo-instructor {
    font-size: 1.1rem;
  }
  
  .horas-box {
    height: 120px;
    max-width: 220px;
  }
  
  .horas-box .text-grey-7 {
    font-size: 0.9rem;
  }
  
  .horas-box .text-h2 {
    font-size: 1.8rem;
  }
  
  .btn-estado {
    font-size: 0.85rem;
    padding: 6px 10px;
    max-width: 160px;
  }
}
</style>