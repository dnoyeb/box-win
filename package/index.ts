import BoxWin from "./components/BoxWin.vue";
import boxWin from "./components/boxWin";
import type { App } from 'vue'

// 按需引入
export { BoxWin, boxWin };

export default {
    install(app: App) {
        app.component('BoxWin', BoxWin);
    },
};

