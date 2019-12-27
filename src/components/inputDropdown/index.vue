<template>
  <section class="my-drop-down">
    <el-input v-model.trim="value"  v-bind="formatAttr(config.attr)" clearable @click.native.stop="handleDropdown" @blur="changeValue(value)"></el-input>
    <div class="drop-down-box" v-if="dropShow" @click.stop v-loading="isLoading">
      <ul>
        <slot name="content">
            <template v-if="list.length">
                <li  v-for="(item,index) in list" @click="handeSelect(item)" :key="index">{{item[config.get.normalizer.label]}}</li>
            </template>
            <li v-else-if="!isLoading && !list.length" class="nothing">暂无数据!!</li>
        </slot>
      </ul>
      <el-row class="footer">
        <el-col :span="6">
          <yl-pagination
            class="pagination"
            :total="page.total"
             size="mini"
            :pageSize.sync="page.pageSize"
            :currentPage.sync="page.pageIndex"
            @change="getList"
            layout="prev, next,total"
          ></yl-pagination>
        </el-col>
        <el-col :span="18">
          <div class="right">
            <el-input
              placeholder="关键字搜索"
              v-model.trim="keywords"
              class="w160 input-er"
              size="mini"
              @keyup.enter.native="getList(1)"
              clearable
            ></el-input>
            <el-button type="primary" size="mini" @click="getList(1)">搜索</el-button>
            <el-button size="mini" @click="hideDropdown">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import { emitter } from 'ycloud-ui';
import commonMix from '@/utils/mixins/commonMix';
export default {
    name: 'inputDropdown',
    mixins: [commonMix, emitter],
    data () {
        return {
            isLoading: true,
            value: '', // 输入内容
            list: [],
            dropShow: false,
            keywords: ''
        };
    },
    methods: {
        getList (pageIndex = this.page.pageIndex, pageSize = this.page.pageSize) {
            this.params = { ...this.config.get.params, keywords: this.keywords };
            this.Http(this.config.get.url, {
                params: this.params,
                pageParams: {
                    pageIndex,
                    pageSize
                }
            }).then(res => {
                this.isLoading = false;
                this.page.total = res.data.total;
                this.page.pageIndex = res.data.pageIndex;
                this.page.pageSize = res.data.pageSize;
                this.list = res.data.rows;
                this.$emit('change', this.list.rows);
            });
        },
        handleDropdown () {
            if (!this.show) return;
            this.dropShow = !this.dropShow;
            if (this.dropShow && !this._isgetFirst) {
                // this._isgetFirst = true;
                this.getList();
            }
        },
        // 隐藏
        hideDropdown () {
            this.dropShow = false;
        },
        handeSelect (item) {
            this.value = item[this.config.get.normalizer.label];
            this.$emit('update:no', item[this.config.get.normalizer.id]);
            this.$emit('update:name', this.value);
            this.$nextTick(() => {
                this.dispatch('ElFormItem', 'el.form.change', item[this.config.get.normalizer.label]);
            });
            this.$emit('select', item);
            this.hideDropdown();
        },
        changeValue (item) {
            // fixbug:2019/4/25 暂时不用改方法,input默认都是readonly
            if (!this.config.attr.readonly) {
                this.$emit('update:no', item);
            }
            // this.$emit('update:no', item.item[this.config.get.normalizer.id]);
            // this.$emit('update:name', item.item[this.config.get.normalizer.label]);
            // this.dispatch('ElFormItem', 'el.form.blur', item);
            // this.dispatch('ElFormItem', 'el.form.change', item);
        },
        formatAttr (item) {
            let obj = {};
            for (let key of Object.keys(item)) {
                if (typeof item[key] === 'function') {
                    obj[key] = item[key]();
                } else {
                    obj[key] = item[key];
                }
            }
            return obj;
        }
    },
    props: {
        attr: {
            type: Object,
            default: () => ({})
        },
        config: {
            type: Object
        },
        show: {
            type: Boolean,
            default: true
        },
        no: { // 编号
            type: String
        },
        name: { // 名称
            type: String
        }
    },
    watch: {
        name (val, oldVal) {
            if (val !== oldVal) {
                this.value = val || '';
            }
        }
    },
    created () {
        window.addEventListener('click', this.hideDropdown);
        this.$once('hook:beforeDestroy', () => {  
            window.removeEventListener('click', this.hideDropdown);                                 
        });
        this.value = this.name || '';
    }
};
</script>

<style lang="scss" scoped>
.my-drop-down{
    width:100%;
    position: relative;
    font-size: 12px;
    .drop-down-box{
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        position: absolute;
        width: 100%;
        z-index: 999;
        background: #fff;
        top:33px;
        &>ul{
            height: 300px;
            overflow: auto;
            .nothing{
                font-size: 18px;
                color: rgb(218, 17, 17);
                cursor: context-menu;
            }
            &>li{
                padding:0 16px;
                cursor: pointer;
                &:hover{
                    background-color: #f4f4f4;
                    color: #00a2b3; 
                }
            }
        }
        .footer{
            padding: 0 10px;
            border-top:1px #e4e4e4 solid;
            height: 50px;
            @include flex(flex-start);
           ::v-deep .el-pagination__total{
                margin-left:10px;
            }
             ::v-deep .input-er .el-input__inner{
                border-color: #dcdfe6 !important;
            }
        }
    }
}
</style>
