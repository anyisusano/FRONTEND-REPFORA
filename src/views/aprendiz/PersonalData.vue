<template>
  <div class="page-content">
    <BackButton />
    <div class="datos-container">
      <div class="datos-card">
        <div class="datos-header">
          <h1 class="datos-title">Mis Datos Personales</h1>
          <div class="editar-datos-link" @click="abrirModalEdicion">
            <q-icon name="edit" size="20px" class="icon-editar" />
            <span class="editar-texto">Editar Datos</span>
          </div>
        </div>

        <div class="datos-content">
          <!-- Información Personal -->
          <div class="datos-info-card">
            <div class="card-header">
              <q-icon name="person" size="24px" color="var(--color-primary)" />
              <h3 class="card-title">Información Personal</h3>
            </div>
            <div class="datos-list">
              <div class="datos-item">
                <div class="datos-item-label">
                  <q-icon name="badge" size="18px" class="item-icon" />
                  <span>Nombre Completo</span>
                </div>
                <div class="datos-item-value">{{ usuario?.firstName || '-' }} {{ usuario?.lastName || '' }}</div>
              </div>
              <div class="datos-item">
                <div class="datos-item-label">
                  <q-icon name="credit_card" size="18px" class="item-icon" />
                  <span>Documento</span>
                </div>
                <div class="datos-item-value">{{ usuario?.documentNumber || '-' }}</div>
              </div>
              <div class="datos-item">
                <div class="datos-item-label">
                  <q-icon name="email" size="18px" class="item-icon" />
                  <span>Correo Personal</span>
                </div>
                <div class="datos-item-value">{{ usuario?.email?.personal || '-' }}</div>
              </div>
              <div class="datos-item">
                <div class="datos-item-label">
                  <q-icon name="business" size="18px" class="item-icon" />
                  <span>Correo Institucional</span>
                </div>
                <div class="datos-item-value">{{ usuario?.email?.institutional || '-' }}</div>
              </div>
            </div>
          </div>

          <!-- Información Académica y Contacto -->
          <div class="datos-info-card">
            <div class="card-header">
              <q-icon name="school" size="24px" color="var(--color-primary)" />
              <h3 class="card-title">Información Académica</h3>
            </div>
            <div class="datos-list">
              <div class="datos-item">
                <div class="datos-item-label">
                  <q-icon name="phone" size="18px" class="item-icon" />
                  <span>Teléfono</span>
                </div>
                <div class="datos-item-value">{{ usuario?.phone || '-' }}</div>
              </div>
              <div class="datos-item">
                <div class="datos-item-label">
                  <q-icon name="description" size="18px" class="item-icon" />
                  <span>Ficha</span>
                </div>
                <div class="datos-item-value ficha-badge">{{ getFichaNumber(usuario) || '-' }}</div>
              </div>
              <div class="datos-item programa-item">
                <div class="datos-item-label">
                  <q-icon name="book" size="18px" class="item-icon" />
                  <span>Programa</span>
                </div>
                <q-tooltip 
                  v-if="getProgramName(usuario) && getProgramName(usuario).length > 50"
                  max-width="400px"
                  anchor="top middle"
                  self="bottom middle"
                >
                  <div style="padding: 8px; word-wrap: break-word;">
                    {{ getProgramName(usuario) }}
                  </div>
                </q-tooltip>
                <div 
                  :class="getProgramName(usuario) && getProgramName(usuario).length > 50 ? 'datos-item-value programa-text' : 'datos-item-value'"
                  style="cursor: help;"
                >
                  {{ getProgramName(usuario) || '-' }}
                </div>
              </div>
            </div>
          </div>

          <div class="datos-instructores">
            <div class="datos-label instructores-title">Instructores Asignados</div>
            <div class="instructor-card">
              <div class="instructor-circle"></div>
              <div class="instructor-nombre"></div>
            </div>
            <div class="instructor-card">
              <div class="instructor-circle"></div>
              <div class="instructor-nombre"></div>
            </div>
            <boton-enviar label="Contactar" unelevated @click="abrirModalContactar" />
          </div>
        </div>
      </div>

      <modal-component ref="modalEdicion" width="1200px" max-width="98vw">
        <template #header>
          <div class="modal-header-edit">
            <q-icon name="edit" size="32px" color="white" class="q-mr-sm" />
            <div class="text-h5 text-bold" style="color: white">Editar Mis Datos</div>
          </div>
        </template>

        <template #body>
          <div v-if="datosEdicion.nombre" class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md section-title">Información Personal</div>
              <div class="data-grid">
                <div class="data-row">
                  <div class="text-weight-bold">Nombre:</div>
                  <q-input v-model="datosEdicion.nombre" outlined dense readonly class="input-readonly" />
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Documento:</div>
                  <q-input v-model="datosEdicion.documento" outlined dense readonly class="input-readonly" />
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Correo Personal:</div>
                  <q-input 
                    v-model="datosEdicion.correo" 
                    outlined 
                    dense 
                    class="input-editable" 
                    type="email"
                    :rules="[emailRule]"
                  />
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Correo Institucional:</div>
                  <q-input v-model="datosEdicion.correoInstitucional" outlined dense readonly class="input-readonly" />
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md section-title">Información de Contacto</div>
              <div class="data-grid">
                <div class="data-row">
                  <div class="text-weight-bold">Teléfono: *</div>
                  <q-input 
                    v-model="datosEdicion.telefono" 
                    outlined 
                    dense 
                    class="input-editable"
                    :rules="[requiredRule, phoneRule]"
                  />
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Número de ficha:</div>
                  <q-input v-model="datosEdicion.ficha" outlined dense readonly class="input-readonly" />
                  <div class="text-caption text-grey-6 q-mt-xs">
                    La ficha no se puede modificar desde esta sección
                  </div>
                </div>
                <div class="data-row">
                  <div class="text-weight-bold">Programa:</div>
                  <q-input v-model="datosEdicion.programa" outlined dense readonly class="input-readonly" />
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #footer>
          <boton-cerrar @click="cancelarEdicion" />
          <boton-enviar @click="mostrarModalConfirmacion" />
        </template>
      </modal-component>

      <modal-component ref="modalConfirmacion" width="600px" max-width="95vw">
        <template #header>
          <div class="text-h6" style="color: white">Confirmar Cambios</div>
        </template>

        <template #body>
          <div style="padding: 16px;">
            <p style="margin-bottom: 16px; font-size: 1.1rem;">
              ¿Estás seguro de hacer cambios en tu cuenta?
            </p>
            
            <div class="changes-summary" v-if="cambiosRealizados.length > 0">
              <div class="text-subtitle2 q-mb-sm text-bold">Cambios a realizar:</div>
              <div class="change-item" v-for="cambio in cambiosRealizados" :key="cambio.campo">
                <strong>{{ cambio.campo }}:</strong>
                <span class="old-value">{{ cambio.anterior }}</span> →
                <span class="new-value">{{ cambio.nuevo }}</span>
              </div>
            </div>
            <p v-else class="text-italic text-grey-7">No se detectaron cambios.</p>
          </div>
        </template>

        <template #footer>
          <boton-cerrar @click="cancelarConfirmacion" />
          <boton-enviar label="Confirmar y Guardar" @click="confirmarCambios" :loading="isUpdating" />
        </template>
      </modal-component>

      <!-- Modal de contacto -->
      <modal-component ref="modalContacto" width="800px" max-width="95vw">
        <template #header>
          <div class="text-h6" style="color: white">Contacto Instructor</div>
        </template>

        <template #body>
          <div class="tabla-contenedor">
            <table class="tabla-instructores">
              <thead>
                <tr>
                  <th>Nombre:</th>
                  <th>Teléfono:</th>
                  <th>Correo:</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(instructor, index) in instructores" :key="index">
                  <td>{{ instructor.nombre }}</td>
                  <td>{{ instructor.telefono }}</td>
                  <td>
                    <a :href="'mailto:' + instructor.correo" class="correo-link">
                      {{ instructor.correo }}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <template #footer>
          <boton-cerrar @click="cerrarModalContacto" />
        </template>
      </modal-component>

      <q-footer reveal class="bg-grey-5 text-black footer-custom">
        <q-toolbar>
          <q-toolbar-title class="text-center">
            <div class="footer-text">
              REPFORA - Sena 2025 © Todos los derechos reservados
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import { useNotifications } from 'src/composables/useNotifications'
import { useFormValidation } from 'src/composables/useFormValidation'
import { putData, getData, apiClient } from 'src/services/apiClient'
import modalComponent from 'src/components/modals/modalComponent.vue'
import BotonCerrar from 'src/components/BotonCerrar.vue'
import BotonEnviar from 'src/components/BotonEnviar.vue'
import BackButton from 'src/components/BackButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const notifications = useNotifications()
const { requiredRule, emailRule, phoneRule } = useFormValidation()

const usuario = computed(() => authStore.user)
const isUpdating = ref(false)

const modalEdicion = ref(null)
const modalConfirmacion = ref(null)
const modalContacto = ref(null)

const datosEdicion = ref({
  nombre: '',
  documento: '',
  correo: '',
  correoInstitucional: '',
  programa: '',
  ficha: '',
  telefono: '',
})

const datosOriginales = ref({})
const cambiosRealizados = ref([])

const instructores = ref([
  { nombre: 'Cargando...', telefono: '-', correo: '-' }
])

function getFichaNumber(user) {
  if (user?.fichaNumber) {
    return user.fichaNumber
  }
  
  if (user?.ficha || user?.fiche) {
    return user.ficha || user.fiche
  }
  
  if (user?.recordNumber && Array.isArray(user.recordNumber) && user.recordNumber.length > 0) {
    // Reemplazar find con while loop
    let activeFiche = null
    let idx = 0
    while (idx < user.recordNumber.length && !activeFiche) {
      if (user.recordNumber[idx] && user.recordNumber[idx].status === 0) {
        activeFiche = user.recordNumber[idx]
      }
      idx++
    }
    if (!activeFiche && user.recordNumber.length > 0) {
      activeFiche = user.recordNumber[0]
    }
    
    if (activeFiche?.fiche && typeof activeFiche.fiche === 'object' && activeFiche.fiche.number) {
      return activeFiche.fiche.number
    }
    
    if (activeFiche?.fiche) {
      return 'Ficha asignada'
    }
  }
  
  return ''
}

function getProgramName(user) {
  if (user?.programName) {
    return user.programName
  }
  
  if (user?.programa) {
    return typeof user.programa === 'string' 
      ? user.programa 
      : user.programa?.name || ''
  }
  
  if (user?.recordNumber && Array.isArray(user.recordNumber) && user.recordNumber.length > 0) {
    // Reemplazar find con while loop
    let activeFiche = null
    let idx = 0
    while (idx < user.recordNumber.length && !activeFiche) {
      if (user.recordNumber[idx] && user.recordNumber[idx].status === 0) {
        activeFiche = user.recordNumber[idx]
      }
      idx++
    }
    if (!activeFiche && user.recordNumber.length > 0) {
      activeFiche = user.recordNumber[0]
    }
    
    if (activeFiche?.fiche && typeof activeFiche.fiche === 'object') {
      if (activeFiche.fiche.program?.name) {
        return activeFiche.fiche.program.name
      }
      
      if (activeFiche.fiche.program) {
        return 'Programa asociado'
      }
    }
  }
  
  return ''
}

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

function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        // Convertir cada carácter usando while
        (() => {
          const chars = jwtBase64.split('')
          const encoded = []
          let i = 0
          while (i < chars.length) {
            const hex = ('00' + chars[i].charCodeAt(0).toString(16)).slice(-2)
            encoded.push('%' + hex)
            i++
          }
          return encoded.join('')
        })()
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error al decodificar JWT:', error)
    return null
  }
}

function abrirModalEdicion() {
  datosEdicion.value = {
    nombre: `${usuario.value?.firstName || ''} ${usuario.value?.lastName || ''}`.trim(),
    documento: usuario.value?.documentNumber || '',
    correo: usuario.value?.email?.personal || '',
    correoInstitucional: usuario.value?.email?.institutional || '',
    programa: getProgramName(usuario.value),
    ficha: getFichaNumber(usuario.value),
    telefono: usuario.value?.phone || ''
  }

  datosOriginales.value = { ...datosEdicion.value }
  modalEdicion.value.openDialog()
}

function cancelarEdicion() {
  modalEdicion.value.closeDialog()
  datosEdicion.value = {}
  datosOriginales.value = {}
}

function mostrarModalConfirmacion() {
  cambiosRealizados.value = []

  if (datosEdicion.value.correo !== datosOriginales.value.correo) {
    cambiosRealizados.value.push({
      campo: 'Correo personal',
      anterior: datosOriginales.value.correo || '(vacío)',
      nuevo: datosEdicion.value.correo
    })
  }

  if (datosEdicion.value.telefono !== datosOriginales.value.telefono) {
    cambiosRealizados.value.push({
      campo: 'Teléfono',
      anterior: datosOriginales.value.telefono || '(vacío)',
      nuevo: datosEdicion.value.telefono
    })
  }

  if (cambiosRealizados.value.length === 0) {
    notifications.info('No se han realizado cambios.')
    return
  }

  modalEdicion.value.closeDialog()
  modalConfirmacion.value.openDialog()
}

function cancelarConfirmacion() {
  modalConfirmacion.value.closeDialog()
  modalEdicion.value.openDialog()
}


async function confirmarCambios() {
  isUpdating.value = true
  try {
    const userId = authStore.user?._id || authStore.user?.id || authStore.user?.uid

    if (!userId) {
      notifications.error('No se pudo identificar al usuario para actualizar.')
      return
    }

    const payload = {}
    const hasPhoneChange = datosEdicion.value.telefono !== datosOriginales.value.telefono
    const hasEmailChange = datosEdicion.value.correo !== datosOriginales.value.correo
    
    if (hasPhoneChange) {
      payload.phone = datosEdicion.value.telefono
    }
    
    if (hasEmailChange) {
      payload.email = datosEdicion.value.correo
    }

    if (Object.keys(payload).length === 0) {
      notifications.warning('No hay cambios para guardar')
      return
    }

    await putData(`/apprentices/updatePartApprentice/${userId}`, payload)
    
    const usuarioActualizado = {
      ...usuario.value,
      phone: hasPhoneChange ? payload.phone : usuario.value.phone,
      email: {
        ...usuario.value.email,
        personal: hasEmailChange ? payload.email : usuario.value.email?.personal
      }
    }
    
    authStore.setUser(usuarioActualizado)
    
    modalConfirmacion.value.closeDialog()
    datosEdicion.value = {}
    datosOriginales.value = {}
    cambiosRealizados.value = []

    notifications.success('¡Tus datos han sido guardados permanentemente!')
  } catch (error) {
    console.error('Error al actualizar datos en el backend:', error)
    const errorMsg = error.response?.data?.msg || 
                     error.response?.data?.message || 
                     error.message || 
                     'No se pudo guardar la información. Inténtalo de nuevo.'
    notifications.error(errorMsg)
  } finally {
    isUpdating.value = false
  }
}

function abrirModalContactar() {
  modalContacto.value.openDialog()
}

function cerrarModalContacto() {
  modalContacto.value.closeDialog()
}

async function cargarDatosCompletos() {
  try {
    if (usuario.value?.recordNumber && Array.isArray(usuario.value.recordNumber) && usuario.value.recordNumber.length > 0) {
      if (usuario.value?.fichaNumber && usuario.value?.programName) {
        return
      }
    }

    const auth = JSON.parse(localStorage.getItem('auth') || '{}')
    const token = authStore.token || auth?.token
    
    if (!token) {
      return
    }

    let apprenticeData = null
    let recordNumber = null

    try {
      const currentToken = authStore.token || auth?.token || token
      
      if (currentToken && apiClient.defaults) {
        apiClient.defaults.headers['x-token'] = currentToken
      }
      
      const decoded = decodeJWT(currentToken || token)
      const apprenticeId = decoded?.uid?._id || decoded?.uid?.id || usuario.value?._id || usuario.value?.id
      
      const urlVariants = []
      
      if (apprenticeId) {
        urlVariants.push(`/apprentices/apprenticeById/${apprenticeId}`)
        urlVariants.push(`/apprentices/apprenticeById/${apprenticeId}/`)
      }
      
      urlVariants.push('/apprentices/apprenticeById/')
      urlVariants.push('/apprentices/apprenticeById')
      
      let response = null
      
      // Sin usar for...of - usar while loop
      let urlIndex = 0
      while (urlIndex < urlVariants.length) {
        const url = urlVariants[urlIndex]
        try {
          response = await getData(url)
          break
        } catch (error) {
          if (error.response?.status !== 404) {
            throw error
          }
          // Sin usar indexOf - verificar si hay más URLs
          if (urlIndex < urlVariants.length - 1) {
            urlIndex++
            continue
          }
          throw error
        }
      }
      
      if (response) {
        const responseData = response?.data || response?.msg || response
        
        if (Array.isArray(responseData) && responseData.length > 0) {
          apprenticeData = responseData[0]
        } else if (responseData && typeof responseData === 'object') {
          apprenticeData = responseData
        }

        if (apprenticeData) {
          recordNumber = apprenticeData.recordNumber || []
        }
      }
    } catch (apiError) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ No se pudo obtener datos de la API, usando token como fallback')
      }
      
      const decoded = decodeJWT(token)
      apprenticeData = decoded?.uid || decoded?.user || null
      
      if (apprenticeData) {
        recordNumber = apprenticeData.recordNumber || []
      }
    }

    if (!apprenticeData) {
      if (usuario.value?.recordNumber) {
        apprenticeData = usuario.value
        recordNumber = usuario.value.recordNumber
      } else {
        return
      }
    }

    if (!recordNumber && usuario.value?.recordNumber) {
      recordNumber = usuario.value.recordNumber
    }
    
    const usuarioActualizado = {
      ...usuario.value,
      ...(apprenticeData || {}),
      recordNumber: recordNumber || usuario.value?.recordNumber || []
    }
    
    if (recordNumber && Array.isArray(recordNumber) && recordNumber.length > 0) {
      // Buscar usando while
      let activeFiche = null
      let i = 0
      while (i < recordNumber.length) {
        if (recordNumber[i].status === 0) {
          activeFiche = recordNumber[i]
          break
        }
        i++
      }
      if (!activeFiche && recordNumber.length > 0) {
        activeFiche = recordNumber[0]
      }
      
      if (activeFiche?.fiche && typeof activeFiche.fiche === 'object' && !Array.isArray(activeFiche.fiche)) {
        if (activeFiche.fiche.number && !usuarioActualizado.fichaNumber) {
          usuarioActualizado.fichaNumber = activeFiche.fiche.number
        }
        
        if (activeFiche.fiche.program) {
          if (typeof activeFiche.fiche.program === 'object' && activeFiche.fiche.program.name) {
            usuarioActualizado.programName = activeFiche.fiche.program.name
          } else if (typeof activeFiche.fiche.program === 'string') {
            usuarioActualizado.programId = activeFiche.fiche.program
          }
        }
        
        usuarioActualizado.ficheId = activeFiche.fiche._id || extractObjectId(activeFiche.fiche)
      } else {
        const ficheId = extractObjectId(activeFiche?.fiche)
        if (ficheId) {
          usuarioActualizado.ficheId = ficheId
        }
      }
    }
    
    authStore.setUser(usuarioActualizado)
  } catch (error) {
    console.error('Error al cargar datos completos del aprendiz:', error)
  }
}

async function cargarInstructores() {
  try {
    instructores.value = [
      { nombre: 'Instructor 1', telefono: '123456789', correo: 'instructor1@example.com' },
      { nombre: 'Instructor 2', telefono: '987654321', correo: 'instructor2@example.com' }
    ]
  } catch (error) {
    console.error('Error al cargar instructores:', error)
    notifications.error('No se pudieron cargar los datos de los instructores')
  }
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    notifications.warning('Debes iniciar sesión para acceder a esta página')
    router.push('/login')
    return
  }

  await cargarDatosCompletos()
  await cargarInstructores()
})
</script>

<style scoped>

.page-content {
  padding: 1rem;
}

.datos-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #ffffff;
}

.datos-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem 1.5rem 1.5rem 1.5rem;
  max-width: 1520px;
  width: 80vw;
  min-width: 320px;
  min-height: 650px;
  margin: 3rem 0;
  margin-top: 1px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 0;
}

.datos-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-bottom: 2.5rem;
  margin-top: 0.5rem;
  min-height: 80px;
  padding-top: 0.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.datos-title {
  color: #111;
  font-size: 3.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  text-align: center;
  letter-spacing: -1px;
  margin-top: 1.5rem;
}

.editar-datos-link {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
  z-index: 10;
}

.editar-datos-link:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.editar-datos-link:active {
  transform: translateY(0);
}

.icon-editar {
  color: grey;
}

.editar-texto {
  color: grey;
  font-weight: 600;
  font-size: 1.08rem;
}

.datos-content {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

@media (min-width: 1200px) {
  .datos-content {
    gap: 2.5rem;
    flex-wrap: nowrap;
  }
}

@media (min-width: 1400px) {
  .datos-content {
    gap: 3rem;
  }
}

.datos-info-card {
  flex: 1 1 350px;
  min-width: 300px;
  max-width: 420px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 1.8rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(57, 169, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

@media (min-width: 1200px) {
  .datos-info-card {
    flex: 1;
    min-width: 280px;
    max-width: none;
  }
}

.datos-info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-border-primary);
}

.card-title {
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.datos-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.datos-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #ffffff;
  border-radius: 10px;
  border-left: 3px solid var(--color-border-primary);
  transition: all 0.2s ease;
}

.datos-item:hover {
  background: #f8f9fa;
  border-left-width: 4px;
  transform: translateX(4px);
}

.datos-item-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-icon {
  color: var(--color-primary);
  opacity: 0.8;
}

.datos-item-value {
  font-size: 1.15rem;
  font-weight: 500;
  color: #2c3e50;
  line-height: 1.5;
  word-break: break-word;
}

.ficha-badge {
  display: inline-block;
  background: var(--gradient-primary-dark);
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 700 !important;
  font-size: 1.1rem !important;
  box-shadow: 0 2px 8px rgba(57, 169, 0, 0.3);
}

.programa-item {
  grid-column: 1 / -1;
}

.programa-text {
  font-size: 1rem !important;
  line-height: 1.6;
  color: #2c3e50;
  max-height: 4.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.tooltip-programa {
  max-width: 400px;
  word-wrap: break-word;
  white-space: normal;
}

.datos-instructores {
  flex: 1 1 300px;
  min-width: 280px;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.2rem;
  margin-left: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 1.8rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(57, 169, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.datos-instructores:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

@media (min-width: 1200px) {
  .datos-instructores {
    flex: 1;
    min-width: 280px;
    max-width: none;
  }
}

.instructores-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid var(--color-border-primary);
  width: 100%;
}

.instructor-card {
  display: flex;
  align-items: center;
  background: #f6f8fa;
  border-radius: 2rem;
  border: 1px solid #D9D9D9;
  padding: 0.4rem 1.2rem 0.4rem 0.4rem;
  margin-bottom: 0.2rem;
  min-width: 180px;
  gap: 0.7rem;
}

.instructor-circle {
  background-color: var(--color-primary);
  color: #fff;
  font-weight: bold;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

.instructor-nombre {
  font-size: 1.1rem;
  color: #222;
  font-weight: 500;
}

.modal-header-edit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.section-title {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 20px;
  padding-left: 8px;
  border-left: 4px solid var(--color-border-primary);
}

.data-grid {
  display: grid;
  gap: 16px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.data-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 16px;
  align-items: center;
}

.text-weight-bold {
  color: #2c3e50;
  font-size: 0.95rem;
  font-weight: 600;
}

.input-readonly {
  opacity: 0.6;
}

.input-readonly .q-field__control {
  background-color: #f5f5f5 !important;
  border-color: #e0e0e0 !important;
}

.input-editable .q-field__control {
  border-color: #1976d2 !important;
  background-color: #fff !important;
}

.input-editable .q-field__control:hover {
  border-color: #1565c0 !important;
}

.changes-summary {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  width: 100%;
  border-left: 4px solid #1976d2;
}

.change-item {
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.old-value {
  color: #d32f2f;
  text-decoration: line-through;
}

.new-value {
  color: #2e7d32;
  font-weight: 600;
}

.tabla-contenedor {
  overflow-x: auto;
  padding: 16px;
}

.tabla-instructores {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.tabla-instructores th {
  font-weight: 700;
  font-size: 1.05rem;
  padding: 8px;
  color: #000;
  background-color: #f0f0f0;
}

.tabla-instructores td {
  font-weight: 600;
  font-size: 1.1rem;
  color: #777;
  padding: 10px 6px;
  border-top: 1px solid #e0e0e0;
}

.correo-link {
  color: #555;
  text-decoration: underline;
  font-weight: 600;
}

.footer-custom {
  margin-top: 24px;
}

.footer-text {
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

@media (max-width: 1200px) {
  .datos-card {
    padding: 2rem 1rem 2rem 1rem;
  }

  .datos-content {
    gap: 1.2rem;
  }
}

@media (max-width: 900px) {
  .datos-content {
    flex-direction: column;
    gap: 2rem;
  }

  .datos-instructores {
    margin-left: 0;
    align-items: stretch;
  }
}

@media (max-width: 600px) {
  .datos-header {
    margin-bottom: 2rem;
  }

  .editar-datos-link {
    position: relative;
    margin-bottom: 8px;
  }

  .datos-title {
    font-size: 2.5rem;
    margin-top: 0.5rem;
  }
}
</style>