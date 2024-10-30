import { createApp } from 'vue'
import '@/shared/global.css'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import Button from "primevue/button";
import Card from "primevue/card";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Password from "primevue/password";
import Carousel from "primevue/carousel";
import ProgressBar from "primevue/progressbar";
import ProgressSpinner from "primevue/progressspinner";
import Divider from 'primevue/divider';
import Image from "primevue/image";
import Skeleton from "primevue/skeleton";

import {MotionPlugin} from "@vueuse/motion";
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Textarea from "primevue/textarea";
import Dialog from "primevue/dialog";
import ScrollPanel from "primevue/scrollpanel";

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
app.use(MotionPlugin);
app.use(ToastService);

app.component("Button", Button)
app.component("Card", Card)

app.component("Toast", Toast);
app.component("InputText", InputText)
app.component("InputNumber", InputNumber)
app.component("Password", Password)
app.component('Textarea', Textarea)
app.component("InputGroup", InputGroup)
app.component("InputGroupAddon", InputGroupAddon)

app.component("FloatLabel", FloatLabel)

app.component("Carousel",Carousel)
app.component("ProgressSpinner",ProgressSpinner)
app.component("ProgressBar",ProgressBar)
app.component("Divider",Divider)
app.component("Image", Image)
app.component("Skeleton", Skeleton)
app.component("Dialog", Dialog)
app.component("ScrollPanel", ScrollPanel)

app.mount('#app')
