<script>
import login from "@/services/login.service.js";
import {HttpStatusCode} from "axios";
import severitiesList from "@/shared/severitiesList.js";
export default {
  name: "login view",
  data() {
    return {
      username: localStorage.getItem("username") || "",
      password: localStorage.getItem("password") || "",
      requesting: false
    }
  },
  methods: {
    showToast(message, severity = severitiesList.warn) {
      this.$toast.add({severity: severity, summary: message, life: 3000, styleClass: "margin-left-4"});
      return 0;
    },
    async login() {
      if (!this.username && !this.password)
        return this.showToast("Por favor, ingrese su nombre de usuario y contraseña")
      if (!this.username)
        return this.showToast("Por favor, ingrese su nombre de usuario")
      if(!this.password)
        return this.showToast("Por favor, ingrese su contraseña")
      try {
        this.requesting = true
        const response = await login(this.username, this.password)
        if (response) {
          localStorage.setItem("userData", JSON.stringify(response))
          this.$emit("login", response)
          this.requesting = false
        }
        this.requesting = false
      } catch (error) {
        this.requesting = false
        if(error.response){
          if(error.response.status === HttpStatusCode.Unauthorized)
            return this.showToast("Usuario o contraseña incorrectos")
          else
            return this.showToast("Ha ocurrido un error inesperado: " + error.toString(), severitiesList.error)
        }
        else
          return this.showToast("No se pudo establecer comunicación con el servidor", severitiesList.error)
      }
    }
  },
  watch: {
    username: function (val) {
      localStorage.setItem("username", val)
    },
    password: function (val) {
      localStorage.setItem("password", val)
    }
  }
}
</script>

<template>
  <div class="flex-col center max-height max-width max-width-for-children-16">
    <img src="/Login.png" alt="RentState Logo" style="width: 40%"/>
    <h2 class="margin-top-2">Inicio de Sesión</h2>
    <div class="margin-width-2 margin-height-1 flex-col gap-05">
      <InputText placeholder="Usuario" v-model="username"/>
      <Password placeholder="Contraseña" v-model="password" toggleMask :feedback="false"/>
    </div>

    <Button :disabled="!username.length || !password.length || requesting" @click="login">Iniciar Sesión</Button>

    <div class="margin-top-4">
      <p>¿No tienes una cuenta?</p>
      <a href="https://rentstate.antarticdonkeys.com/">Créala en nuestra página web</a>
    </div>
  </div>
</template>

<style scoped>

</style>