<script>
import { RouterLink, RouterView } from 'vue-router'
export default {
  components : {
    RouterLink,
    RouterView
  },
  name: "App",
  data() {
    return {
      userData: JSON.parse(localStorage.getItem("userData") || false),
      selectedProperty: false,
      propertyHasDevice: false
    }
  },
  beforeMount() {
    if (!this.userData) {
      this.$router.push({ name: "login" })
    } else {
      this.$router.push({ name: "profile" })
    }
  },
  methods: {
    login(userData) {
      this.userData = userData
      this.$router.push({ name: "profile" })
    },
    logout(){
      this.$router.push({ name: "login" })
      localStorage.removeItem("userData")
      localStorage.removeItem("properties")
      this.userData = false
    },
    selectProperty(property) {
      this.selectedProperty = property;
      this.propertyHasDevice = property.deviceId? true : false;
      this.$router.push({ name: "property" })
    },
    deviceLinked(data){
      this.selectedProperty.deviceId = data.deviceId;
      this.selectedProperty.devicePassword = data.devicePassword;
      this.selectedProperty.enabled = data.enabled;
      this.propertyHasDevice = true;
    },
    deviceUnlinked(){
      this.selectedProperty.deviceId = false;
      this.selectedProperty.devicePassword = false;
      this.selectedProperty.enabled = false;
      this.propertyHasDevice = false;
    }
  }
}
</script>

<template>
  <Toast/>
  <header v-if="userData" @click="login(userData)">
    <img src="/Logo.png" alt="RentState Logo"/>
  </header>
  <main>
    <RouterView @login="login" @logout="logout"
                @selectProperty="selectProperty"
                @profile="login(userData)"
                @linked="deviceLinked"
                @unlinked="deviceUnlinked"
                :property="selectedProperty"
                :propertyHasDevice="propertyHasDevice"
                :userData="userData"/>
  </main>
</template>

<style>
  header {
    display: flex;
    justify-content: center;
    background-color: var(--rentstate-color);
    color: white;
    width: 100%;
    height: var(--header-height);
  }

  main {
    height: calc(100vh - var(--header-height));
    width: 100%;
  }


</style>
