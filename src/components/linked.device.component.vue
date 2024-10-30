<script>
import severitiesList from "@/shared/severitiesList.js";
import severitiesColours from "@/shared/severitiesColours.js";
import severitiesColoursNames from "@/shared/severitiesColoursNames.js";
import getDeviceInfo from "@/services/get.device.info.service.js";
import linkDevice from "@/services/link.device.service.js";
import unlinkDevice from "@/services/unlink.device.service.js";
import getFormattedDate from "@/shared/getFormattedDate.js";
import internalCodes from "@/shared/internalCodes.js";
export default {
  name: "linked.device.component.vue",
  props: {
    property: {
      type: Object,
      required: true,
    },
    userData: {
      required: true,
    },
    propertyHasDevice: {
      type: Boolean,
      required: true,
    }
  },
  emits: ["linked", "unlinked"],
  data() {
    return {
      processing: false,
      deviceDataLoaded: false,
      deviceLinkerVisible: false,
      deviceUnlinkerVisible: false,
      selectedMessage: false,
      iotDeviceData: false,
      props: {
        deviceId: "",
        devicePassword: ""
      }
    }
  },
  methods: {
    getFormattedDate,
    showToast(severity, summary, detail) {
      this.$toast.add({severity, summary, detail, life: 5000});
      this.processing = false;
      return 0;
    },
    getSeverityColor(severity) {
      return severitiesColours[severity];
    },
    getSeverityString(severity) {
      return severitiesColoursNames[severity];
    },
    async getDeviceIotData(){
      this.processing = true;
      this.deviceDataLoaded = false;
      this.iotDeviceData = await getDeviceInfo(this.userData, this.property.deviceId);
      this.showToast(severitiesList.success, 'Datos del dispositivo cargados', 'Los datos del dispositivo se han cargado correctamente');
      this.deviceDataLoaded = true;
    },
    async linkDevice() {
      this.deviceLinkerVisible = false;
      this.processing = true;
      if (!this.props.deviceId && !this.props.devicePassword)
        return this.showToast(severitiesList.error, 'Error al vincular', 'Por favor, ingrese el ID y la contraseña del dispositivo');
      if (!this.props.deviceId)
        return this.showToast(severitiesList.error, 'Error al vincular', 'Por favor, ingrese el ID del dispositivo');
      if (!this.props.devicePassword)
        return this.showToast(severitiesList.error, 'Error al vincular', 'Por favor, ingrese la contraseña del dispositivo');
      try {
        let response = await linkDevice(this.userData, this.property.id, this.props.deviceId, this.props.devicePassword);
        if (response){
          this.$emit('linked', response);
          return this.showToast(severitiesList.success, 'Dispositivo vinculado', 'El dispositivo se ha vinculado correctamente');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.internalCode) {
          if (error.response.data.internalCode === internalCodes.invalidToken)
            return this.showToast(severitiesList.error, 'Error al vincular', 'No se ha podido autenticar al usuario');
          else if (error.response.data.internalCode === internalCodes.invalidPassword)
            return this.showToast(severitiesList.error, 'Error al vincular', 'La contraseña del dispositivo es incorrecta');
          else if (error.response.data.internalCode === internalCodes.deviceNotFound)
            return this.showToast(severitiesList.error, 'Error al vincular', 'No se ha encontrado el dispositivo');
          else if (error.response.data.internalCode === internalCodes.invalidPropertyId)
            return this.showToast(severitiesList.error, 'Error al vincular', 'No se ha encontrado la propiedad');
          else if (error.response.status === 409)
            return this.showToast(severitiesList.error, 'Error al vincular', 'El dispositivo ya está vinculado a otra propiedad del usuario');
          else if (error.response.data)
            return this.showToast(severitiesList.error, 'Error al vincular', 'Ha ocurrido un error inesperado: ' + error.response.data.message);
          else
            return this.showToast(severitiesList.error, 'Error al vincular', 'Ha ocurrido un error inesperado: ' + error.toString());
        } else {
          return this.showToast(severitiesList.error, 'Error al vincular', 'No se ha podido conectar con el servidor');
        }
      }
    },
    async unlinkDevice() {
      this.deviceUnlinkerVisible = false;
      this.processing = true;
      if (!this.iotDeviceData || !this.deviceDataLoaded)
        return this.showToast(severitiesList.error, 'Error al desvincular', 'No se han cargado los datos del dispositivo vinculado aún');
      try {
        let response = await unlinkDevice(this.userData, this.property.id, this.iotDeviceData.deviceId, this.iotDeviceData.password);
        if (response) {
          this.$emit('unlinked');
          return this.showToast(severitiesList.success, 'Dispositivo desvinculado', 'El dispositivo se ha desvinculado correctamente');
        }
      } catch (e) {
        if (e.response) {
          if (e.response.status === 401)
            return this.showToast(severitiesList.error, 'Error al desvincular', 'No se ha podido autenticar al usuario');
          else if (e.response.status === 404)
            return this.showToast(severitiesList.error, 'Error al desvincular', 'No se ha encontrado el dispositivo, o la propiedad');
          else if (e.response.status === 409)
            return this.showToast(severitiesList.error, 'Error al desvincular', 'El dispositivo ya no esta vinculado a esta propiedad. Por favor, actualice la aplicación');
          else if (e.response.data)
            return this.showToast(severitiesList.error, 'Error al desvincular', 'Ha ocurrido un error inesperado: ' + e.response.data.message);
          else
            return this.showToast(severitiesList.error, 'Error al desvincular', 'Ha ocurrido un error inesperado: ' + e.toString());
        } else
          return this.showToast(severitiesList.error, 'Error al desvincular', 'No se ha podido conectar con el servidor');
      }
    }
  },
  created() {
    if (this.property.deviceId) {
      this.getDeviceIotData();
    }
  },
  watch: {
    propertyHasDevice: {
      handler() {
        if (this.property.deviceId) {
          this.getDeviceIotData();
        }
      },
      deep: true
    }
  }
}
</script>

<template>
  <div class="flex">
    <Card>
      <template v-slot:content>
        <h2 class="center margin-bottom-1">Dispositivo vinculado:</h2>
        <div class="center margin-bottom-2">
          <!-- Si la propiedad tiene un dispositivo vinculado -->
          <div v-if="property.deviceId">
            <!-- Si los datos del dispositivo ya cargaron -->
            <div v-if="deviceDataLoaded" class="flex-col center gap-1">
              <div class="center flex-col gap-05 max-width-20">
                <img :src="iotDeviceData.iotDeviceData.image" alt="Device Image"
                     style="width: 16rem; height: 10rem; object-fit: contain"/>
                <div>
                  <h3>{{iotDeviceData.iotDeviceData.name}}</h3>
                  <small>ID: {{iotDeviceData.deviceId}}</small>
                </div>
                <small>{{iotDeviceData.iotDeviceData.description}}</small>
              </div>
              <Button :disabled="processing" @click="deviceUnlinkerVisible = true">Desvincular dispositivo</Button>
            </div>
            <!-- Si los datos del dispositivo aún no cargaron -->
            <div v-else class="center flex-col gap-1">
              <div class="center flex-col gap-05">
                <Skeleton width="16rem" height="10rem"/>
                <Skeleton width="14rem" height="2rem"/>
                <Skeleton width="13rem" height="4rem"/>
              </div>
              <Skeleton width="12rem" height="3rem"/>
            </div>
          </div>
          <!-- Si la propiedad no tiene un dispositivo vinculado -->
          <div v-else class="flex-col center gap-1">
            <p class="center">No hay dispositivos vinculados</p>
            <Button :disabled="processing" @click="deviceLinkerVisible = true">Vincular dispositivo</Button>
          </div>
        </div>

        <h2 class="center">Alertas de Seguridad:</h2>
        <div class="center">
          <!-- Si la propiedad tiene un dispositivo vinculado -->
          <div v-if="property.deviceId" class="flex-col center gap-1">
            <!-- Si los datos del dispositivo ya cargaron -->
            <div v-if="deviceDataLoaded">
              <Card class="margin-1">
                <template v-slot:content>
                  <div class="v-scroll-container flex-col gap-05 max-width">
                    <!-- Si el indice es impar, pinta el fondo de gris claro -->
                    <div v-if="iotDeviceData.messages.length" v-for="(message, index) in iotDeviceData.messages"
                         class="flex-col left" :style="{backgroundColor: index % 2 === 0 ? 'white' : '#f5f5f5'}"
                         @click="selectedMessage = message">
                      <div :class="getSeverityColor(message.severity) + 'ellipsis max-width-18'">
                         {{message.message}}
                      </div>
                      <div/>
                      <small>
                        {{getFormattedDate(message.timestamp)}}
                      </small>
                    </div>
                    <div v-else>
                      <div class="center">
                        <p>No hay eventos de seguridad registrados</p>
                      </div>
                    </div>
                  </div>
                </template>
              </Card>
            </div>
            <!-- Si los datos del dispositivo aún no cargaron -->
            <div v-else class="center flex-col gap-1">
              <Skeleton width="19rem" height="10rem"/>
            </div>
          </div>
          <!-- Si la propiedad no tiene un dispositivo vinculado -->
          <div v-else class="flex-col center gap-1">
            <p class="center">
              Los detalles de los eventos de seguridad se guardan en el dispositivo.
              Como no hay dispositivo vinculado, no se pueden mostrar los eventos de seguridad.
            </p>
          </div>
        </div>
      </template>
    </Card>
  </div>
  <Dialog v-model:visible="deviceLinkerVisible" modal :style="{ width: '24rem' }">
    <template v-slot:header>
      <div/>
    </template>
    <h2 class="center">Vincular un Dispositivo</h2>
    <div class="center flex-col gap-05">
      <InputText placeholder="ID del dispositivo" v-model="props.deviceId"/>
      <InputText placeholder="Contraseña del dispositivo" v-model="props.devicePassword"/>
      <div class="flex-row center gap-05">
        <Button type="button" label="Cancelar" severity="secondary" @click="deviceLinkerVisible = false"></Button>
        <Button type="button" label="Vincular" @click="linkDevice"></Button>
      </div>
    </div>
  </Dialog>
  <Dialog v-model:visible="deviceUnlinkerVisible" modal :style="{ width: '24rem' }">
    <template v-slot:header>
      <div/>
    </template>
    <div class="center flex-col gap-05">
      <h2 class="center">Desvincular un Dispositivo</h2>
      <p>¿Estás seguro que deseas desvincular este dispositivo de esta propiedad?
        Al hacerlo, todos los registros de seguridad podrían perderse</p>
      <div class="flex-row center gap-05 margin-05">
        <Button type="button" label="Cancelar" severity="secondary" @click="deviceLinkerVisible = false"></Button>
        <Button type="button" label="Desvincular" @click="unlinkDevice"></Button>
      </div>
    </div>
  </Dialog>
  <Dialog v-model:visible="selectedMessage" modal :style="{ width: 'min(24rem, calc(100vw - 2rem))' }" >
    <template v-slot:header>
      <div/>
    </template>
    <p>Fecha del Mensaje: {{getFormattedDate(selectedMessage.timestamp)}}</p>
    <div class="flex-row left gap-05">
      <p>Gravedad del mensaje: </p>
      <p :class="getSeverityColor(selectedMessage.severity)">
        {{getSeverityString(selectedMessage.severity)}}
      </p>
    </div>
    <p>
      Contenido del mensaje: {{selectedMessage.message}}
    </p>
  </Dialog>
</template>

<style scoped>
</style>