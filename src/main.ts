import { createApp } from "vue";
import App from "./App.vue";
import BoxWin from '../package/index'

const app = createApp(App);
app.use(BoxWin)
app.mount("#app");
