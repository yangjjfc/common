const install = function (Vue) {
    Vue.directive('focus', {
        bind (el, binding, vnode) {
            setTimeout(() => {
                el.querySelector('.el-input__inner').focus();
            }, 0);
        }
    });
};

if (window.Vue) {
    Vue.use(install); // eslint-disable-line
}
export default {
    install
};
