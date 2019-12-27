<!--
 * @Author: yangjj
 * @Date: 2019-08-01 19:51:26
 * @LastEditors  : yangjj
 * @LastEditTime : 2019-12-27 13:10:55
 * @Description: file content
 -->
<template>
  <section class="my-customer">
    <div class="customer-title">
      <el-autocomplete size="small" style="width: 100%" value-key="label" v-model="keywords" :fetch-suggestions="querySearch" :placeholder="placeholder" @select="handleSelect">
      </el-autocomplete>
    </div>
    <div class="customer-body">
      <div class="letter" v-if="letters.length">
        <ul>
          <li v-for="(item, index) in letters" :key="index" @click="selectLetter(item)">
            {{item}}
          </li>
        </ul>
      </div>
      <el-scrollbar class="views" wrap-class="scrollbar-wrapper" ref="views" :style="{height: maxHeight}">
        <ul v-if="views.length">
          <li v-for="(item, index) in views" :key="index">
            <p class="title" v-if="item.head" :ref="item.head">{{item.head}}</p>
            <p :class="{'active': active === item.value}" @click="selectItem(item)" :ref="item.pinyin">
              <slot v-bind:item="item">
                {{item.label}}
              </slot>
            </p>
          </li>
        </ul>
      </el-scrollbar>
    </div>
  </section>
</template>
<script>
import Pinyin from '@/assets/utils/pinyin.js';
export default {
    name: 'selectCustomer',
    data () {
        return {
            letters: [],
            views: [], // 右侧视图
            search: {},
            maxHeight: null,
            active: '',
            keywords: ''
        };
    },
    watch: {
        value (val) {
            this.active = val;
        },
        list () {
            this.init();
        }
    },
    props: {
        placeholder: {
            type: String,
            default: '客户名称/拼音码'
        },
        // 全部**
        title: {
            type: String,
            default: ''
        },
        // 默认是否选中第一个
        isDefaultCheck: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            required: true,
            default () {
                return [];
            }
        },
        value: {
            type: String,
            default: ''
        },
        limitH: {
            type: Number,
            default: 30
        }
    },
    methods: {
        createFilter (queryString) {
            return (item) => item.label.indexOf(queryString) === 0 || (item.pinyin && item.pinyin.indexOf(queryString.toUpperCase()) === 0);
        },
        querySearch (queryString, cb) {
            let restaurants = this.views;
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        compare (val1, val2) {
            // 转换为拼音
            val1 = val1.pinyin;
            val2 = val2.pinyin;

            // 获取较长的拼音的长度
            var length = val1.length > val2.length ? val1.length : val2.length;

            // 依次比较字母的unicode码，相等时返回0，小于时返回-1，大于时返回1
            let i;
            for (i = 0; i < length; i++) {
                let differ = val1.charCodeAt(i) - val2.charCodeAt(i);
                if (differ === 0) {
                    continue;
                } else {
                    if (val1.charAt(i) === '_') {
                        return -1;
                    }
                    return differ;
                }
            }
            if (i === length) {
                return val1.length - val2.length;
            }
        },
        init () {
            let headCodes = [];
            // 转换并排序
            let list = this.list.map(item => {
                item.pinyin = Pinyin.getCamelChars(item.label).toUpperCase();
                return item;
            }).sort(this.compare);
            this.views = list.map(item => {
                let head = item.pinyin.slice(0, 1);
                if (!headCodes.includes(head)) {
                    item.head = head;
                    headCodes.push(head);
                }
                return item;
            });
            if (this.title && this.views.length) {
                this.views.unshift({
                    label: '全部' + this.title,
                    value: ''
                });
            }
            if (this.views.length) {
                if (this.isDefaultCheck) {
                    this.selectItem(this.views[0]);
                    this.value = this.views[0].value;
                }
            }
            this.letters = headCodes.sort();
            this.active = this.value;
        },
        // 选中下拉选择
        handleSelect (item) {
            this.selectLetter(item.pinyin);
            this.selectItem(item);
        },
        // 选中首字母
        selectLetter (key) {
            let el = this.$refs[key][0];
            el = (el || {}).offsetTop;
            let scrollBar = this.$refs.views.$el.querySelector('.scrollbar-wrapper');
            scrollBar.scrollTop = el;
        },
        // 选中node
        selectItem (item) {
            this.active = item.value;
            this.$emit('input', this.active);
            this.$emit('change', item);
        }
    },
    created () {
        this.init();
    },
    mounted () {
        this.$nextTick(() => {
            let $table = (this.$refs.views || {}).$el;
            let clientTop = $table && $table.getBoundingClientRect().top;
            this.maxHeight = window.innerHeight - clientTop - this.limitH;
            this.maxHeight += 'px';
        });
    }
};

</script>

<style lang="scss" scoped>
.my-customer {
  ::v-deep .el-autocomplete-suggestion li {
    font-size: 12px;
  }
  .customer-title {
    width: 100%;
    margin-bottom: 10px;
  }
  .customer-body {
    display: flex;
    position: relative;
    overflow: hidden;
  }
  .letter {
    width: 20px;
    border-top: 1px solid #ccc;
    li {
      height: 20px;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
      border-bottom: 1px solid #ccc;
      border-left: 1px solid #ccc;
      &:hover {
        color: $theam;
      }
    }
  }
  .views {
    background-color: #fff;
    border: 1px solid #ccc;
    //height: calc(100vh - 200px);
    flex-grow: 1;
    ::v-deep .scrollbar-wrapper {
      height: 105%;
    }
    ul {
      padding-bottom: calc(100vh - 200px);
      li p {
        padding: 4px 10px;
        cursor: pointer;
        line-height: 20px;
        //margin-bottom: 5px;
        &:hover {
          color: $theam;
        }
        &.active {
          background-color: #dcefff;
        }
      }
    }
  }
}
</style>
