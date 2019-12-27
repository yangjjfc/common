import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user.js';
import permission from './modules/permission.js';

import getters from './getters.js';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const store = new Vuex.Store({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
        paths: ['global.tempNavs', 'global.activeNav', 'global.cachedViews']
    })],
    modules: {
        user,
        permission
    },
    getters
});

export default store;
