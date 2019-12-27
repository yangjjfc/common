<template>
    <div slot="label">
        {{label}}
        <span class="text-badge" v-text="num" ></span>
    </div>
</template>

<script>
export default {
    /* 待审核的数量红色圆点 */
    name: 'textBadge',
    data () {
        return {
        };
    },
    props: {
        label: {
            type: String
        },
        num: [String, Number]
    }
};
</script>

<style scoped>
    .text-badge {
        background-color: red;
        border-radius: 5px;
        padding: 0 3px;
        color: #fff;
    }
</style>
