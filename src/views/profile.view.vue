<script>
import propertiesSelector from "@/components/properties.selector.component.vue";
export default {
  emits: ["selectProperty"],
  name: "profile view",
  components: {
    propertiesSelector
  },
  methods:{
    selectProperty(property){
      this.$emit("selectProperty", property)
    }
  },
  props:{
    userData: Object
  }
}
</script>

<template>
  <div v-if="userData" class="flex-col center margin-2">
    <img :src="userData.photoUrl?userData.photoUrl:'/Login.png'"
         alt="user profile image" class="main-user-picture"
         :style="userData.photoUrl?'':'padding: 30px;'">
    <div class="margin-height-1">
      <h2>Bienvenido, {{userData.name}} {{userData.lastName}}</h2>
      <p>Aquí están sus propiedades:</p>
    </div>
    <propertiesSelector :userData="userData" @selectProperty="selectProperty"/>
    <Button @click="$emit('logout')" class="margin-top-1">Cerrar Sesión</Button>
  </div>
</template>

<style>
.main-user-picture{
  width: 240px;
  height: 240px;
  border-radius: 50%;
  object-fit: scale-down;
  background-color: aliceblue;
}
</style>