#  Snippets de Código - Formularios de Empresa

Este archivo contiene los bloques de código HTML/Template que puedes copiar y pegar en otras vistas para mantener el mismo estilo.

---

## 1️ MODAL DE CREAR/EDITAR EMPRESA (Formulario de dos columnas)

```vue
<template>
  <modalComponent ref="modalRef" v-model="showModal" width="900px" max-width="98vw">
    <template #header>
      <div class="text-h6">Título del Modal</div>
    </template>

    <template #body>
      <div class="row q-col-gutter-lg q-pa-md">
        <!-- ==================== COLUMNA IZQUIERDA ==================== -->
        <div class="col-12 col-md-6">
          <!-- Datos de la empresa -->
          <div class="text-h6 q-mb-md section-title">Datos de la empresa</div>
          <q-input
            outlined
            v-model="formData.company_nit"
            label="Numero NIT"
            class="q-mb-md"
            :rules="[
              val => !!val || 'El NIT es requerido',
              val => val.length >= 8 || 'El NIT debe tener al menos 8 dígitos',
              val => val.length <= 20 || 'El NIT no puede tener más de 20 dígitos',
              val => !val.includes(' ') || 'El NIT no debe contener espacios'
            ]"
          />
          <q-input
            outlined
            v-model="formData.name"
            label="Razon social"
            class="q-mb-md"
            :rules="[
              val => !!val || 'La razón social es requerida',
              val => val.length >= 3 || 'La razón social debe tener al menos 3 caracteres',
              val => val.length <= 100 || 'La razón social no debe exceder 100 caracteres',
              val => /^[a-zA-ZÀ-ÿ0-9\s.]+$/.test(val) || 'La razón social solo debe contener letras, números, espacios y puntos'
            ]"
          />
          
          <!-- Dirección -->
          <div class="text-h6 q-mb-md q-mt-lg section-title">Dirección</div>
          <q-select
            outlined
            v-model="selectedDepartamento"
            :options="departamentos"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            label="Departamento"
            class="q-mb-md"
            :rules="[
              val => !!val || 'El departamento es requerido'
            ]"
          />
          <q-select
            outlined
            v-model="selectedCiudad"
            :options="ciudadesDisponibles"
            label="Ciudad"
            :disable="!selectedDepartamento"
            :rules="[
              val => !!val || 'La ciudad es requerida'
            ]"
            :hint="!selectedDepartamento ? 'Primero selecciona un departamento' : ''"
          />
        </div>

        <!-- ==================== COLUMNA DERECHA ==================== -->
        <div class="col-12 col-md-6">
          <!-- Contacto de la empresa -->
          <div class="text-h6 q-mb-md section-title">Contacto de la empresa</div>
          <q-input
            outlined
            v-model="formData.legal_representative_name"
            label="Jefe inmediato"
            class="q-mb-md"
            :rules="[
              val => !!val || 'El nombre del representante es requerido',
              val => val.length >= 3 || 'El nombre debe tener al menos 3 caracteres',
              val => val.length <= 50 || 'El nombre no debe exceder 50 caracteres',
              val => /^[a-zA-ZÀ-ÿ\s]+$/.test(val) || 'El nombre solo debe contener letras y espacios'
            ]"
          />
          <q-input
            outlined
            v-model="formData.legal_representative_position"
            label="Cargo"
            class="q-mb-md"
            :rules="[
              val => !!val || 'El cargo es requerido',
              val => val.length >= 3 || 'El cargo debe tener al menos 3 caracteres',
              val => val.length <= 50 || 'El cargo no debe exceder 50 caracteres',
              val => /^[a-zA-ZÀ-ÿ\s-]+$/.test(val) || 'El cargo solo debe contener letras, espacios y guiones'
            ]"
          />
          
          <!-- Datos de contacto -->
          <div class="text-h6 q-mb-md q-mt-lg section-title">Datos de contacto</div>
          <q-input
            outlined
            v-model="formData.legal_representative_phone"
            label="Telefono de jefe inmediato"
            class="q-mb-md"
            :rules="[
              val => !!val || 'El teléfono es requerido',
              val => val.length === 10 || 'El teléfono debe tener exactamente 10 dígitos',
              val => /^\d+$/.test(val) || 'El teléfono solo debe contener números',
              val => /^[3]/.test(val) || 'El teléfono debe comenzar con 3'
            ]"
          />
          <q-input
            outlined
            v-model="formData.legal_representative_email"
            label="Email de jefe inmediato"
            type="email"
            :rules="[
              val => !!val || 'El email es requerido',
              val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Email inválido',
              val => val.length <= 100 || 'El email no debe exceder 100 caracteres',
              val => !val.includes(' ') || 'El email no debe contener espacios'
            ]"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <ModalButton
        type="cancel"
        label="Cancelar"
        @click="modalRef?.closeDialog()"
      />
      <ModalButton
        type="confirm"
        label="Guardar"
        @click="saveData"
        :loading="saving"
      />
    </template>
  </modalComponent>
</template>
```

---

## 2️ MODAL DE VER DETALLES DE EMPRESA (Solo lectura)

```vue
<template>
  <modalComponent ref="detailsModalRef" v-model="showDetailsModal" width="1200px" max-width="98vw">
    <template #header>
      <div class="text-h6">Perfil de Empresa</div>
    </template>

    <template #body>
      <div class="q-pa-md">
        <div class="row q-col-gutter-lg">
          <!-- ==================== COLUMNA IZQUIERDA ==================== -->
          <div class="col-12 col-md-6">
            <div class="text-h6 q-mb-md section-title">Información de la empresa</div>
            <div class="data-grid">
              <div class="data-row">
                <div class="text-weight-bold">NIT:</div>
                <div class="data-value">{{ selectedEmpresa?.company_nit || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Razon social:</div>
                <div class="data-value">{{ selectedEmpresa?.name || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Direccion:</div>
                <div class="data-value">{{ selectedEmpresa?.location || '-' }}</div>
              </div>
            </div>
          </div>

          <!-- ==================== COLUMNA DERECHA ==================== -->
          <div class="col-12 col-md-6">
            <div class="text-h6 q-mb-md section-title">Contacto de la empresa</div>
            <div class="data-grid">
              <div class="data-row">
                <div class="text-weight-bold">Jefe inmediato:</div>
                <div class="data-value">{{ selectedEmpresa?.legal_representative_name || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Cargo:</div>
                <div class="data-value">{{ selectedEmpresa?.legal_representative_position || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Telefono:</div>
                <div class="data-value">{{ selectedEmpresa?.legal_representative_phone || '-' }}</div>
              </div>
              <div class="data-row">
                <div class="text-weight-bold">Email:</div>
                <div class="data-value">{{ selectedEmpresa?.legal_representative_email || '-' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <ModalButton
        type="cancel"
        label="Cerrar"
        @click="detailsModalRef?.closeDialog()"
      />
    </template>
  </modalComponent>
</template>
```

---

## 3️ ESTILOS CSS (Agregar en <style scoped>)

```vue
<style scoped>
/* Títulos de sección en verde SENA */
.section-title {
  color: #39a900;
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 20px;
  padding-left: 8px;
  border-left: 4px solid #39a900;
}

/* Grid de datos para mostrar información */
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

.data-value {
  color: #34495e;
  font-size: 0.95rem;
}
</style>
```

---

## 4️ SCRIPT SETUP (Lógica necesaria)

```javascript
import { ref, computed } from 'vue'
import modalComponent from '@/components/modals/modalComponent.vue'
import ModalButton from '@/components/modals/ModalButton.vue'
import { useColombia } from '@/composables/useColombia'

// Composable de Colombia para departamentos y ciudades
const { 
  departamentos, 
  getCiudadesByDepartamento
} = useColombia()

// Estados
const showModal = ref(false)
const modalRef = ref(null)
const saving = ref(false)

// Selectores de ubicación
const selectedDepartamento = ref('')
const selectedCiudad = ref('')
const ciudadesDisponibles = computed(() => {
  if (!selectedDepartamento.value) return []
  return getCiudadesByDepartamento(selectedDepartamento.value)
})

// Datos del formulario
const formData = ref({
  company_nit: '',
  name: '',
  location: '',
  legal_representative_name: '',
  legal_representative_position: '',
  legal_representative_phone: '',
  legal_representative_email: ''
})

// Watcher para sincronizar ubicación
watch([selectedDepartamento, selectedCiudad], ([dept, city]) => {
  if (dept && city) {
    formData.value.location = `${city}, ${dept}`
  }
})

// Funciones
const openModal = () => {
  // Limpiar formulario
  formData.value = {
    company_nit: '',
    name: '',
    location: '',
    legal_representative_name: '',
    legal_representative_position: '',
    legal_representative_phone: '',
    legal_representative_email: ''
  }
  selectedDepartamento.value = ''
  selectedCiudad.value = ''
  
  modalRef.value?.openDialog()
}

const saveData = async () => {
  saving.value = true
  try {
    // Tu lógica de guardado aquí
    await apiClient.post('/companies/saveCompanies', formData.value)
    modalRef.value?.closeDialog()
  } catch (error) {
    console.error(error)
  } finally {
    saving.value = false
  }
}
```

---

## 5️ CHECKLIST DE IMPLEMENTACIÓN

Para usar estos snippets en otra vista:

 **1. Copiar el template del modal** (sección 1️⃣ o 2️⃣)
 **2. Copiar los estilos CSS** (sección 3️⃣)
 **3. Copiar el script setup** (sección 4️⃣)
 **4. Importar componentes necesarios:**
   - `modalComponent.vue`
   - `ModalButton.vue`
   - `useColombia.js` composable

 **5. Ajustar según tus necesidades:**
   - Cambiar nombres de variables
   - Modificar endpoints de API
   - Ajustar validaciones

---

##  NOTAS IMPORTANTES

- **Verde SENA:** `#39a900`
- **Layout responsivo:** Usa `col-12 col-md-6` para 2 columnas en desktop
- **Espaciado:** 
  - `q-mb-md`: margin-bottom medium
  - `q-mt-lg`: margin-top large (para separar secciones)
  - `q-pa-md`: padding medium
- **Modales:**
  - Formularios: `width="900px"`
  - Detalles: `width="1200px"`
  - Siempre usar `max-width="98vw"` para responsive
