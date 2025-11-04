<template>
  <div class="center" style="margin-top: 80px;">
    <div class="grid">
      <Card
        title="Datos Personales"
        subtitle="Visualización de datos y cambios "
          imgSrc="/src/assets/información_personal.jpg"
        route="datospersonales"
        color="var(--color-primary)"
        textColor="white"
      />
      <Card
        title="Bitacoras y Documentos"
        subtitle="Consulta, Registro y Visualización"
         imgSrc="/src/assets/Documentos_negro.jpg"
        route="bitacoras"
        color="var(--color-primary)"
        textColor="white"
      />
      <Card
        title="Etapa Productiva"
        subtitle="Registro de Etapa Productiva"
     imgSrc="/src/assets/Modalidad,Contrato_negro.jpg"
        route="registroep"
        color="var(--color-primary)"
        textColor="white"
      />
      <Card
        title="Proceso de EP"
        subtitle="Visualización del Proceso de EP"
         imgSrc="/src/assets/Avance_negro.jpg"
        route="procesoep"
        color="var(--color-primary)"
        textColor="white"
      />
    </div>
  </div>
</template>

<script setup>
import Card from 'src/components/cards/MenuCard.vue'
</script>


<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  padding: 20px;
  justify-items: center;
  align-items: center;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100vw;
  padding-top: 70px;
  padding-bottom: 50px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 24px;
    max-width: 500px;
    padding: 18px;
  }
  
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 100vw;
    padding-top: 70px;
    padding-bottom: 50px;
    overflow-y: auto;
  }
}

@media (max-width: 480px) {
  .grid {
    gap: 20px;
    padding: 16px;
  }
  
  .center {
    padding-top: 60px;
    padding-bottom: 40px;
  }
}

@media (max-width: 300px) {
  .grid {
    gap: 16px;
    padding: 14px;
  }
  
  .center {
    padding-top: 50px;
    padding-bottom: 30px;
  }
}
</style>