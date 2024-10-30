<script>
import linkedDevice from "@/components/linked.device.component.vue";
export default {
  components: {
    linkedDevice,
  },
  name: "property view",
  emits: ["profile", "linked", "unlinked"],
  methods: {
    linked(data){
      this.$emit('linked', data);
    },
    unlinked(){
      this.$emit('unlinked');
    }
  },
  props:{
    property: {
      type: Object,
      required: true,
    },
    userData: {
      required: true,
    },
    propertyHasDevice: {
      required: true,
      type: Boolean
    }
  }
}
</script>

<template>
  <div v-if="property" class="margin-1 max-width-for-children-30 flex-col center">
    <div class="flex-col border-radius-2 relative">
      <img :src="property.cardimage" height="290" style="object-fit: cover">
      <i class="pi pi-chevron-left back-button always-white font-16" @click="$emit('profile')"/>
    </div>
    <div class="margin-05">
      <div class="ellipsis flex-row gap-05">
        <h1 class="ellipsis">{{property.district}}</h1>
        <h1> · </h1>
        <h1 class="ellipsis green" v-if="property.available">Activo</h1>
        <h1 class="ellipsis red" v-else>Inactivo</h1>
      </div>
      <div class="flex-row space-between">
        <h4 class="ellipsis gray">{{property.location}}</h4>
        <h3 class="ellipsis gray">S/. {{property.price.toFixed(2)}}</h3>
      </div>
      <div class="flex-row space-between">
        <h4 class="gray">Actualmente libre</h4>
      </div>
    </div>
    <linkedDevice :property="property" :userData="userData"
                  :propertyHasDevice="propertyHasDevice"
                  @linked="linked" @unlinked="unlinked"/>
  </div>
</template>

<style scoped>
.back-button{
  position: absolute;
  top: 1.4rem;
  left: 1.5rem;
}
</style>