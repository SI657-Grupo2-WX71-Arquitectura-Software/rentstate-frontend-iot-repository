<script>
import properties from "@/services/properties.service";
import severitiesList from "@/shared/severitiesList.js";
export default {
  name: "properties.selector.component.vue",
  props:{
    userData: Array
  },
  emits: ["selectProperty"],
  data(){
    return{
      properties: localStorage.getItem("properties")?JSON.parse(localStorage.getItem("properties")):[],
      loaded: false,
      invalidDialogVisible: false,
    }
  },
  methods: {
    showToast(message, severity = severitiesList.warn) {
      this.$toast.add({severity: severity, summary: message, life: 5000, styleClass: "margin-left-4"});
      return 0;
    },
    selectedProperty(property){
      if(!property.rented)
        this.$emit("selectProperty", property)
      else
        this.invalidDialogVisible = true
    }
  },
  async created() {
    if(!this.userData)
      return this.$router.push({ name: "login" })
    try{
      this.properties = await properties(this.userData);
      localStorage.setItem("properties", JSON.stringify(this.properties))
    }catch (e) {
      console.error(e);
      this.showToast("No se pudo obtener la información de las propiedades", severitiesList.error)
    }
    this.loaded = true
  }
}
</script>

<template>
  <div>
    <div v-if="!loaded" class="h-scroll-container">
      <Card class="scroll-h-item" v-for="i in 3">
        <template v-slot:content>
          <div class="flex-col gap-05">
            <Skeleton class="mb-2"></Skeleton>
            <Skeleton width="10rem" class="mb-2"></Skeleton>
            <Skeleton width="5rem" class="mb-2"></Skeleton>
            <Skeleton height="2rem" class="mb-2"></Skeleton>
            <Skeleton width="10rem" height="4rem"></Skeleton>
          </div>
        </template>
      </Card>
    </div>
    <p v-else-if="properties.length === 0 && loaded">
      No hay propiedades registradas
    </p>
    <div v-else class="h-scroll-container">
      <Card class="scroll-h-item" v-for="property in properties" :key="property.id" @click="selectedProperty(property)">
        <template v-slot:header>
          <div class="flex-col">
            <!-- The style class makes this look black and white -->
            <img :src="property.cardimage" height="200"
                 :style="property.rented?'filter: grayscale(100%); object-fit: cover;' : 'object-fit: cover;'">
          </div>
        </template>
        <template v-slot:title>
          <div class="ellipsis flex-row gap-05" v-if="!property.rented">
            <p class="ellipsis">{{property.district}}</p>
            <p> · </p>
            <p class="ellipsis green" v-if="property.available">Activo</p>
            <p class="ellipsis red" v-else>Inactivo</p>
          </div>
          <div class="ellipsis flex-row gap-05 gray" v-else>
            <p class="ellipsis">{{property.district}}</p>
            <p> · </p>
            <p class="ellipsis" v-if="property.available">Alquilado</p>
          </div>
        </template>
        <template v-slot:subtitle>
          <div class="flex-col">
            <h5 class="ellipsis gray">{{property.location}}</h5>
            <h3 class="ellipsis gray">S/. {{property.price.toFixed(2)}}</h3>
          </div>
        </template>
        <template v-slot:footer>
          <div class="flex-row space-between" v-if="!property.rented">
            <h4 class="gray">Actualmente libre</h4>
            <h4 class="text-button text-width-5">Ver más</h4>
          </div>
          <div class="flex-row space-between" v-else>
            <h4 class="gray">Actualmente alquilado</h4>
            <h4 class="gray">No disponible</h4>
          </div>
        </template>
      </Card>
    </div>
  </div>
  <Dialog v-model:visible="invalidDialogVisible" modal :style="{ width: '22rem'}">
    <template v-slot:header>
      <div/>
    </template>
    <div class="center">
      <img src="/warning.svg" alt="warning" height="80" width="80">
    </div>
    <h3 class="center">Este departamento está alquilado</h3>
    <small class="m-0 justify">
      No puedes supervisar la seguridad de un departamento alquilado, ya que los dispositivos de
      seguridad verifican si hay movimiento dentro del  departamento. Saber si hay movimiento en
      un departamento alquilado puede atentar contra la privacidad de tus inquilinos, por ello,
      no se puede verificar la seguridad de un departamento alquilado
    </small>
  </Dialog>
</template>

<style scoped>
.property-img{

}
</style>