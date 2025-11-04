# 📋 REQUERIMIENTOS BACKEND - REGISTROS DE ETAPA PRODUCTIVA

## ✅ Cambios Realizados en el Frontend

### Componentes Actualizados:
1. **`src/views/aprendiz/RegistroEP.vue`** ⭐ (MOVIDO desde MisRegistros.vue) - Vista principal del aprendiz para crear y gestionar sus registros EP
2. **`src/views/admin/RegistrosEP.vue`** - Vista del admin para supervisar y validar registros EP
3. **`src/views/Inicio.vue`** - Agregada nueva card "Registros EP" para admin

### ⚠️ IMPORTANTE:
El archivo **MisRegistros.vue** ya NO se usa. Ahora todo se hace desde **RegistroEP.vue** que está en la ruta `/app/aprendiz/registroep`

### Modelo de Datos Actualizado:

```javascript
{
  _id: String,
  registration_number: String,
  apprentice_id: ObjectId (ref: Apprentice),
  modality_id: ObjectId (ref: Modality),
  company_id: ObjectId (ref: Company),
  scheduled_start_date: Date,
  total_requested_hours: Number,
  working_days: Number (1-7),
  daily_hours: Number (1-24),
  registration_status: Number (0=Pendiente, 1=Rechazado, 2=En Revisión, 3=Aprobado),
  admin_observations: Array [{
    descripcion: String,
    escrito_por: String,
    fecha: Number (timestamp)
  }],
  apprentice_observations: Array [{
    descripcion: String,
    escrito_por: String,
    fecha: Number (timestamp)
  }],
  uploaded_documents: String (Google Drive folder ID),
  validation_date: Date,
  registration_date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚨 RUTAS CRÍTICAS QUE FALTAN EN EL BACKEND

### 1. **Listar SOLO los registros del aprendiz autenticado**

```
GET /registrations/myRegistrations
```

**¿Por qué es necesaria?**
- `MisRegistros.vue` (aprendiz) necesita ver SOLO sus propios registros
- Actualmente `/listRegistrations` lista TODOS los registros (admin)
- Debe filtrar automáticamente por el `apprentice_id` del usuario autenticado

**Implementación sugerida:**
```javascript
// Backend: obtener el ID del usuario autenticado del token/sesión
const apprenticeId = req.user._id; // o req.user.id
const registrations = await Registration.find({ apprentice_id: apprenticeId })
  .populate('modality_id')
  .populate('company_id')
  .sort({ createdAt: -1 });

res.json({
  msg: registrations
});
```

**Respuesta esperada:**
```json
{
  "msg": [
    {
      "_id": "...",
      "registration_number": "REG-001",
      "apprentice_id": { ... },
      "modality_id": { "_id": "...", "name": "CONTRATO DE APRENDIZAJE" },
      "company_id": { "_id": "...", "name": "Empresa ABC" },
      "scheduled_start_date": "2025-11-15T00:00:00.000Z",
      "total_requested_hours": 864,
      "working_days": 5,
      "daily_hours": 8,
      "registration_status": 0,
      "admin_observations": [],
      "apprentice_observations": [
        {
          "descripcion": "Solicitud inicial",
          "escrito_por": "APRENDIZ",
          "fecha": 1762043877212
        }
      ],
      "uploaded_documents": "",
      "registration_date": "2025-11-02T00:37:57.224Z"
    }
  ]
}
```

---

## 📝 RUTAS EXISTENTES - AJUSTES NECESARIOS

### 2. **Listar TODOS los registros (Admin)**

```
GET /registrations/listRegistrations
```

**Estado:** ✅ Existe

**Ajustes necesarios:**
- Verificar que hace `.populate('apprentice_id')` para mostrar los datos del aprendiz
- Verificar que hace `.populate('modality_id')` 
- Verificar que hace `.populate('company_id')`

**Respuesta actual:** ✅ Correcta (según tu ejemplo)

---

### 3. **Crear nuevo registro (Aprendiz)**

```
POST /registrations/saveRegistration
```

**Estado:** ✅ Existe

**Body esperado:**
```json
{
  "modality_id": "68d4a43ea3d837b79a47523a",
  "company_id": "68e2ce2caf5b6c3d172f393c",
  "scheduled_start_date": "2025-11-15",
  "total_requested_hours": 864,
  "working_days": 5,
  "daily_hours": 8,
  "apprentice_observations": "Solicitud de registro",
  "uploaded_documents": []
}
```

**Ajustes necesarios:**
- El campo `apprentice_observations` debe convertirse en un array de objetos:
```javascript
apprentice_observations: [{
  descripcion: req.body.apprentice_observations,
  escrito_por: "APRENDIZ",
  fecha: Date.now()
}]
```
- El `registration_number` debe generarse automáticamente (ej: `REG-${nextNumber}`)
- El `apprentice_id` debe tomarse del usuario autenticado: `req.user._id`
- El `registration_status` debe inicializarse en `0` (Pendiente)

---

### 4. **Actualizar registro**

```
PUT /registrations/updateRegistration/:id
```

**Estado:** ✅ Existe

**Dos casos de uso:**

#### **Caso 1: Aprendiz actualiza su registro**
```json
{
  "modality_id": "68d4a43ea3d837b79a47523a",
  "company_id": "68e2ce2caf5b6c3d172f393c",
  "scheduled_start_date": "2025-11-15",
  "total_requested_hours": 900,
  "working_days": 6,
  "daily_hours": 8,
  "apprentice_observations": "Actualización de horarios"
}
```

**Lógica sugerida:**
```javascript
// Solo agregar nueva observación al array, no reemplazar
if (req.body.apprentice_observations) {
  registration.apprentice_observations.push({
    descripcion: req.body.apprentice_observations,
    escrito_por: "APRENDIZ",
    fecha: Date.now()
  });
}
```

#### **Caso 2: Admin agrega observación**
```json
{
  "admin_observations": "Revisar documentos adjuntos"
}
```

**Lógica sugerida:**
```javascript
// Solo agregar nueva observación al array, no reemplazar
if (req.body.admin_observations) {
  registration.admin_observations.push({
    descripcion: req.body.admin_observations,
    escrito_por: "ADMIN", // o req.user.role
    fecha: Date.now()
  });
}
```

---

### 5. **Validar registro (Aprobar/Rechazar)**

```
PUT /registrations/validateRegistration/:id
```

**Estado:** ✅ Existe

**Body esperado:**
```json
{
  "registration_status": 3,
  "admin_observations": "Documentos completos y verificados"
}
```

**Valores de `registration_status`:**
- `0` = Pendiente Validación
- `1` = Rechazado
- `2` = En Revisión (opcional)
- `3` = Aprobado

**Ajustes necesarios:**
- El campo `admin_observations` debe agregarse al array, no reemplazar:
```javascript
registration.admin_observations.push({
  descripcion: req.body.admin_observations,
  escrito_por: "ADMIN",
  fecha: Date.now()
});
registration.registration_status = req.body.registration_status;
registration.validation_date = new Date();
```

---

## 🔒 PERMISOS Y SEGURIDAD

### Restricciones por Rol:

| Ruta | Aprendiz | Admin |
|------|----------|-------|
| `GET /registrations/myRegistrations` | ✅ Solo ve los suyos | ❌ |
| `GET /registrations/listRegistrations` | ❌ | ✅ Ve todos |
| `POST /registrations/saveRegistration` | ✅ | ❌ |
| `PUT /registrations/updateRegistration/:id` | ✅ Solo si `registration_status === 0 o 1` | ✅ Solo `admin_observations` |
| `PUT /registrations/validateRegistration/:id` | ❌ | ✅ |

### Validaciones Backend:

1. **Al crear registro:**
   - Verificar que el aprendiz no tenga un registro activo pendiente
   - `total_requested_hours > 0`
   - `working_days` entre 1 y 7
   - `daily_hours` entre 1 y 24
   - `modality_id` y `company_id` existen y están activos

2. **Al actualizar (aprendiz):**
   - Solo puede editar si `registration_status === 0` (Pendiente) o `registration_status === 1` (Rechazado)
   - No puede editar si `registration_status === 3` (Aprobado)

3. **Al validar (admin):**
   - Solo admin puede cambiar `registration_status`
   - Una vez aprobado (status=3), no se puede revertir sin crear nueva observación

---

## 📊 ESTADO ACTUAL VS ESPERADO

| Campo | Frontend Anterior | Backend Actual | Ajuste Necesario |
|-------|-------------------|----------------|------------------|
| `apprentice_id` | ❌ No existía | ✅ Existe (puede ser null) | Debe rellenarse automáticamente |
| `modality_id` | `modality` (objeto) | `modality_id` (ObjectId) | ✅ Coincide |
| `company_id` | `company` (objeto) | `company_id` (ObjectId) | ✅ Coincide |
| `startDate` / `endDate` | ✅ Existía | ❌ No existe | Cambiado a `scheduled_start_date` |
| `scheduled_start_date` | ❌ No existía | ✅ Existe | ✅ Agregado |
| `total_requested_hours` | ❌ No existía | ✅ Existe | ✅ Agregado |
| `working_days` | ❌ No existía | ✅ Existe | ✅ Agregado |
| `daily_hours` | ❌ No existía | ✅ Existe | ✅ Agregado |
| `status` | 0/1 (boolean) | `registration_status` (0/1/2/3) | ✅ Actualizado |
| `observations` | String simple | `admin_observations` (Array) | ✅ Cambiado a array |
| `apprenticeNotes` | String simple | `apprentice_observations` (Array) | ✅ Cambiado a array |
| `registration_number` | ❌ No existía | ✅ Existe | ✅ Agregado |

---

## 🎯 RESUMEN DE ACCIONES REQUERIDAS

### ✅ Lo que YA está en el backend:
1. `POST /registrations/saveRegistration` - Crear registro
2. `PUT /registrations/updateRegistration/:id` - Actualizar registro
3. `PUT /registrations/validateRegistration/:id` - Aprobar/Rechazar
4. `GET /registrations/listRegistrations` - Listar todos (admin)

### 🚨 Lo que FALTA crear:
1. **`GET /registrations/myRegistrations`** - Listar solo registros del aprendiz autenticado

### 🔧 Ajustes necesarios en rutas existentes:
1. **`/saveRegistration`**: Convertir `apprentice_observations` de string a array
2. **`/updateRegistration`**: Manejar `apprentice_observations` y `admin_observations` como arrays (agregar, no reemplazar)
3. **`/validateRegistration`**: Agregar observación al array y actualizar `validation_date`
4. **`/listRegistrations`**: Verificar que hace populate de `apprentice_id`, `modality_id`, `company_id`

---

## 🧪 PRUEBAS RECOMENDADAS

### Flujo completo:

1. **Aprendiz crea registro:**
   ```
   POST /registrations/saveRegistration
   → Status: 0 (Pendiente)
   ```

2. **Aprendiz lista sus registros:**
   ```
   GET /registrations/myRegistrations
   → Ve solo los suyos
   ```

3. **Aprendiz edita registro pendiente:**
   ```
   PUT /registrations/updateRegistration/:id
   → Agrega observación al array
   ```

4. **Admin lista todos los registros:**
   ```
   GET /registrations/listRegistrations
   → Ve todos con datos poblados
   ```

5. **Admin agrega observación:**
   ```
   PUT /registrations/updateRegistration/:id
   → Agrega a admin_observations
   ```

6. **Admin aprueba registro:**
   ```
   PUT /registrations/validateRegistration/:id
   → Status: 3 (Aprobado)
   ```

7. **Aprendiz intenta editar registro aprobado:**
   ```
   PUT /registrations/updateRegistration/:id
   → Debe fallar (status=3 no es editable)
   ```

---

## 📞 CONTACTO

Si hay dudas sobre la implementación o necesitas más detalles sobre algún endpoint, no dudes en preguntar.

**Archivos actualizados:**
- `src/views/aprendiz/MisRegistros.vue`
- `src/views/admin/RegistrosEP.vue`

**Fecha de actualización:** 2 de noviembre de 2025
