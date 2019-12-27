<template>
    <section class="yl-select-section">
        <slot></slot>
         <span  class="yl-icon-add" @click="handleAdd" v-if="show" :class="{'icon-input':type=='input'}" v-bind="$attrs">+</span>
    </section>
</template>

<script>
// 主要用于数据字段扩展
export default {
    name: 'extendSelect',
    data () {
        return {
            
        };
    },
    methods: {
        handleAdd () {
            this.$emit('add');
        }
    },
    props: {
        show: {
            type: Boolean,
            default: true
        },
        type: { // 支持2种类型 select,input
            type: String,
            default: 'select'
        }
    }
};
</script>

<style lang="scss" scoped>
.yl-select-section {
  position: relative;
  .yl-icon-add {
    position: absolute;
    right: 26px;
    font-size: 23px;
    color: #e4e7ed;
    top: 2%;
    z-index: 99;
    cursor: pointer;
    &:hover{
        color:#03a8ae;
    }
    &.icon-input{
        right: 12px;
    }
  }
}
</style>
