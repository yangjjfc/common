import Vue from 'vue';
import Element from 'element-ui';
import '@riophae/vue-treeselect/dist/vue-treeselect.min.css';
import '@/components/index.js';
import ContentMenu from 'v-contextmenu';
import 'v-contextmenu/dist/index.css';
import YcloudUi, { changeEnvironment } from 'ycloud-ui';
import 'ycloud-ui/lib/theme-chalk/index.css';
import TreeSelect from '@riophae/vue-treeselect';
import auth from '@/utils/directive/auth';
import App from './App.vue';
import router from './router/r-config';
import store from './store/index.js';
import singleSpaVue from 'single-spa-vue';

changeEnvironment(process.env.IMAGE_DOWNLOAD ? {
    IMAGE_DOWNLOAD: process.env.IMAGE_DOWNLOAD
} : { });
// 全局指令
Vue.use(Element);
Vue.use(ContentMenu);
Vue.use(YcloudUi);
Vue.config.productionTip = false; // 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.component('TreeSelect', TreeSelect);
Vue.use(auth);
// 删除标签，提升到全局方法
Vue.prototype.removeNav = closeName => {
    store.commit('REMOVENAV', closeName);
};
// sessionStorage setItem
Vue.prototype.$setItem = (name, $json) => {
    window.sessionStorage.setItem(name, JSON.stringify($json));
};
// sessionStorage getItem
Vue.prototype.$getItem = (name, $json) => {
    let json = window.sessionStorage.getItem(name);
    if (json) {
        return JSON.parse(json);
    }
};

const vueLifecycles = singleSpaVue({
    Vue,
    appOptions: {
        render: (h) => h(App),
        store,
        router
    }
});
export const bootstrap = (props) => {
    // 在这里注册全局模块
    store.registerModule('global', props.store);
    return vueLifecycles.bootstrap(props);
};
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
export default vueLifecycles;