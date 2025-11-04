<template>
  <div class="informe-container q-pa-lg">
    <BackButton />
    <div class="card-wrapper">
      <q-card class="card-datos q-pa-xl q-mt-lg">
        <!-- Título -->
        <div class="titulo-instructor text-center text-h5 text-bold q-mb-md">
          Instructor {{ instructor.nombre?.split(' ')[0] }}
        </div>

        <!-- Datos e información -->
        <div class="info-instructor row">
          <div class="datos-personales">
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <div><strong>Nombre:</strong></div>
                <div>{{ instructor.nombre }}</div>
              </div>
              <div class="col-6">
                <div><strong>Correo:</strong></div>
                <div>{{ instructor.correo }}</div>
              </div>
              <div class="col-6 q-mt-md">
                <div><strong>Documento:</strong></div>
                <div>{{ instructor.documento }}</div>
              </div>
              <div class="col-6 q-mt-md">
                <div><strong>Teléfono:</strong></div>
                <div>{{ instructor.telefono }}</div>
              </div>
            </div>
          </div>

          <!-- Horas acumuladas -->
          <div class="horas-container">
            <q-btn class="horas-box text-center" :to="{ path: '/app/instructor/vistaHoras' }">
              <div class="text-grey-7">Horas acumuladas por pagar:</div>
              <div class="text-h2 text-bold q-mt-sm">{{ instructor.horas }}</div>
            </q-btn>
          </div>
        </div>

        <!-- Estado -->
        <div class="estado-section text-center q-mt-xl">
          <div class="q-mb-md"><strong>Estado:</strong></div>
          <div class="row justify-center q-gutter-md">
            <BotonEnviar
              label="Activo"
              unelevated
              class="btn-estado"
              :class="{ activo: instructor.estado === 'ACTIVO' }"
              @click="cambiarEstado('ACTIVO')"
            />
            <BotonCerrar
              label="Inactivo"
              unelevated
              class="btn-estado gris"
              :class="{ inactivo: instructor.estado === 'INACTIVO' }"
              @click="cambiarEstado('INACTIVO')"
            />
            <BotonCerrar
              label="Contrato Terminado"
              unelevated
              class="btn-estado gris"
              :class="{ terminado: instructor.estado === 'TERMINADO' }"
              @click="cambiarEstado('TERMINADO')"
            />
          </div>
        </div>
      </q-card>
    </div>

    <!-- Modal para alerta de horas -->
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
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import ModalComponent from 'src/components/modals/modalComponent.vue'
import BotonEnviar from 'src/components/BotonEnviar.vue'
import BotonCerrar from 'src/components/BotonCerrar.vue'
import BackButton from 'src/components/BackButton.vue'

const instructor = ref({
  nombre: 'Camilo Garay',
  correo: 'CamiloG@sena.edu.co',
  documento: '11019571165',
  telefono: '3176057248',
  estado: 'ACTIVO',
  horas: 160
})

// Referencias y control del modal
const modalAlert = ref(null)
const modalHeader = ref('')
const modalBody = ref('')
const alertaMostrada = ref(false)

watch(
  () => instructor.value.horas,
  async (horas) => {
    await nextTick() 

    if (!alertaMostrada.value) {
      if (horas >= 155 && horas < 160) {
        modalHeader.value = 'Alerta de Horas Acumuladas'
        modalBody.value = `El instructor ${instructor.value.nombre} ha acumulado ${horas} horas. Está próximo a alcanzar el límite máximo de 160 horas.`
        modalAlert.value?.openDialog()
        alertaMostrada.value = true
      } else if (horas >= 160) {
        modalHeader.value = 'Límite de Horas Alcanzado'
        modalBody.value = `El instructor ${instructor.value.nombre} ha alcanzado el máximo de 160 horas. No puede continuar acumulando más horas hasta que se gestione el pago o compensación.`
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

const cambiarEstado = (nuevoEstado) => {
  instructor.value.estado = nuevoEstado
}
</script>


<style scoped>
.titulo-instructor {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  padding-bottom: 16px;
  text-align: center;
}

.datos-container {
  background: #fff;
  min-height: 100vh;
}

.card-datos {
  width: 100%;
  max-width: 1200px;
  min-height: 500px;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: white;
  font-size: 1.2rem; 
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
  min-width: 300px;
  line-height: 1.8;
}

.datos-personales strong {
  font-size: 1.3rem;
  font-weight: 700;
  color: #111;
}

.datos-personales div {
  font-size: 1.2rem;
}

.info-instructor {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
}

.horas-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.horas-box {
  width: 300px;
  height: 200px;
  border-radius: 20px;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-transform: none !important;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.1);
}

.horas-box .text-grey-7 {
  font-size: 1.4rem;
  color: #555;
}

.horas-box .text-h2 {
  font-size: 4rem;
  font-weight: 800;
  color: #000;
  margin-top: 0.5rem;
}

.estado-section {
  font-size: 1.3rem;
  margin-top: 2.5rem;
}

.estado-section strong {
  font-size: 1.4rem;
  color: #222;
}

.btn-estado {
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 10px;
  padding: 12px 28px;
  transition: all 0.3s ease;
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


@media (max-width: 768px) {
  .card-datos {
    font-size: 1rem;
    padding: 30px;
  }

  .titulo-instructor {
    font-size: 1.6rem;
  }

  .horas-box {
    width: 250px;
    height: 160px;
  }

  .horas-box .text-h2 {
    font-size: 3rem;
  }
}
</style>