<template>
  <q-page-container style="margin-top: 5px;">
    <div class="center">
      <div class="grid">
        <!-- Cards para ETAPA PRODUCTIVA VIRTUAL/PRESENCIAL -->
        <Card
          v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' || role === 'ETAPA PRODUCTIVA PRESENCIAL'"
          title="SGVA" 
          subtitle="Consulta, Registro y Visualización de empresas" 
          imgSrc="/src/assets/Monitoria.jpg"
          route="admin/empresas" 
          color="var(--color-primary)" 
          textColor="white" />


  

        <Card
          v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' || role === 'ETAPA PRODUCTIVA PRESENCIAL'"
          title="Instructores" 
          subtitle="Consulta Instructores" 
          imgSrc="/src/assets/Pasantia_ONG.jpg"
          route="admin/instructores" 
          color="var(--color-primary)" 
          textColor="white" />
        <Card
          v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' || role === 'ETAPA PRODUCTIVA PRESENCIAL'"
          title="Aprendices y Documentos" 
          subtitle="Consulta y Visualización" 
          imgSrc="/src/assets/pyme.jpg" 
          route="/app/admin/fichas"
          color="var(--color-primary)" 
          textColor="white" />
        <Card
          v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' || role === 'ETAPA PRODUCTIVA PRESENCIAL'"
          title="Parametros" 
          subtitle="Consulta Parametros" 
          imgSrc="/src/assets/Pasantia_ONG.jpg" 
          route="/app/admin/parametros"
          color="var(--color-primary)" 
          textColor="white" />
        <Card
          v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' || role === 'ETAPA PRODUCTIVA PRESENCIAL'"
          title="Reportes" 
          subtitle="Consulta y Visualización de Reportes" 
          imgSrc="/src/assets/pyme.jpg" 
          route="/app/admin/reportes"
          color="var(--color-primary)" 
          textColor="white" />

        <!-- Card para ADMINISTRADOR -->
        <Card 
          v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' || role === 'ETAPA PRODUCTIVA PRESENCIAL' || role === 'ADMINISTRADOR'" 
          title="Novedades Admin"
          subtitle="Consulta y Visualización de Novedades" 
          imgSrc="/src/assets/pyme.jpg" 
          route="admin/novedadesAdmin" 
          color="var(--color-primary)"
          textColor="white" />
        
        <!-- Card para ADMINISTRADOR - Modalidades EP -->
        <Card 
          v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' || role === 'ETAPA PRODUCTIVA PRESENCIAL' || role === 'ADMINISTRADOR'" 
          title="Modalidades EP"
          subtitle="Gestión de Modalidades de Etapa Productiva" 
          imgSrc="/src/assets/pyme.jpg" 
          route="admin/modalidadesEP" 
          color="var(--color-primary)"
          textColor="white" />
        
        <!-- Card para ADMINISTRADOR - Registros EP -->
        <Card 
          v-if="role === 'ETAPA PRODUCTIVA VIRTUAL' || role === 'ETAPA PRODUCTIVA PRESENCIAL' || role === 'ADMINISTRADOR'" 
          title="Registros EP"
          subtitle="Validación de Registros de Etapa Productiva" 
          imgSrc="/src/assets/Contrato_Aprendizaje.jpg" 
          route="admin/registrosEP" 
          color="var(--color-primary)"
          textColor="white" />
        
        <!-- Cards para INSTRUCTOR -->
        <Card 
          v-if="role[0] === 'INSTRUCTOR'" 
          title="Informe Personal" 
          subtitle="Consultar mi informacion y Horas"
          imgSrc="/src/assets/información_personal.jpg" 
          route="instructor/informepersonal" 
          color="var(--color-primary)" 
          textColor="white" />
        <Card 
          v-if="role[0] === 'INSTRUCTOR'" 
          title="Seguimientos" 
          subtitle="Proceso de documentos de seguimiento"
          imgSrc="/src/assets/SubirDocumentos_negro.jpg" 
          route="instructor/seguimientos" 
          color="var(--color-primary)" 
          textColor="white" />
        <Card 
          v-if="role[0] === 'INSTRUCTOR'" 
          title="Bitácoras" 
          subtitle="Procedimiento de subida de documentos de bitácoras"
          imgSrc="/src/assets/Documentos_negro.jpg" 
          route="/vista" 
          color="var(--color-primary)" 
          textColor="white" />
        <Card 
          v-if="role[0] === 'INSTRUCTOR'" 
          title="Lista de Aprendices" 
          subtitle="Consultar mis aprendices asignados"
          imgSrc="/src/assets/Aprendices_negro.jpg" 
          route="/vista" 
          color="var(--color-primary)" 
          textColor="white" />
        <Card 
          v-if="role[0] === 'INSTRUCTOR'" 
          title="Historial" 
          subtitle="Consultar mi actividad en el sitio"
          imgSrc="/src/assets/Historial_negro.jpg" 
          route="/vista" 
          color="var(--color-primary)" 
          textColor="white" />
        <Card 
          v-if="role[0] === 'INSTRUCTOR'" 
          title="Novedades" 
          subtitle="Procesos Disciplinarios"
          imgSrc="/src/assets/Proyecto_Productivo.jpg" 
          route="instructor/novedades" 
          color="var(--color-primary)" 
          textColor="white" />

        <!-- Card para OWNER -->
        <Card 
          v-if="role[0] === 'OWNER'" 
          title="Novedades" 
          subtitle="Procesos Disciplinarios"
          imgSrc="/src/assets/pyme.jpg" 
          route="/vista" 
          color="var(--color-primary)" 
          textColor="white" />
      </div>
    </div>
  </q-page-container>
</template>

<script setup>
import Card from '../components/cards/MenuCard.vue';
import { ref, onMounted } from 'vue'

const role = ref('')
onMounted(() => {
  const Auth = JSON.parse(localStorage.getItem("auth"))
  if (Auth.user) {
    role.value = Auth.user.role
    if(role.value == "INSTRUCTOR OWNER" || role.value == 'INSTRUCTOR'){
      role.value = role.value.split(" ")
    }
  }})
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px;
  justify-items: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 15px;
  box-sizing: border-box;
}

/* Media queries para diferentes tamaños de pantalla */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    padding: 18px;
  }
  .center {
    padding: 18px 15px;
  }
  .header-title[data-v-22686b16] {
    font-size: 2rem;}
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    padding: 16px;
  }
  .center {
    padding: 16px 12px;
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 18px;
    max-width: 400px;
    padding: 14px;
  }
  
  .center {
    padding: 14px 10px;
  }
  .header-title[data-v-22686b16] {
    font-size: 1rem;
    font-weight: bold;
    line-height: 80px;
    color: white;
  }
}

@media (max-width: 480px) {
  .grid {
    gap: 16px;
    padding: 12px;
  }
  
  .center {
    padding: 12px 8px;
  }
}

@media (max-width: 300px) {
  .grid {
    gap: 14px;
    padding: 10px;
  }
  
  .center {
    padding: 10px 6px;
  }
}
</style>