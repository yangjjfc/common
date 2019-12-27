y<template>
    <ul class="fileList list-inline">
        <li v-if="list.length == 0">
            <img :src= "defaultImg" :width="width" :height="height">
        </li>
        <li v-for="(item,index) in list" :key="index">
            <a class="boxer" :href="item.fullUrl" v-boxer="item.fullUrl">
                <i class="masterCert" v-if="isMaster">主图</i>
                <img :src="item.url" :width="width" :height="height">
            </a>
            <p class="text-center" v-if="showChoose">
                <input type="radio" v-model="checked" :value="item.url"/>
            </p>
        </li>
    </ul>
</template>
<script>
import { Tools, Environment } from 'ycloud-ui'; // 文件格式
import defaultImg from '@/assets/images/noimage.png';
export default {
    name: 'filePreview',
    data () {
        return {
            defaultImg,
            checked: '',
            width: '',
            height: '',
            list: []
        };
    },
    props: {
        isMaster: {
            type: Boolean
        },
        showChoose: {
            type: Boolean
        },
        files: {
            type: [Array, String]
        },
        size: {
            type: [String, Object],
            default: ''
        },
        defaultImage: {
            type: String
        }
    },
    created () {
        this.init();
        if (typeof this.size === typeof '') {
            switch (this.size) {
            case 'small':
                this.width = 60;
                break;
            case 'mini':
                this.width = 32;
                break;
            default:
                this.width = 100;
                break;
            }
            this.height = this.width;
        } else if (typeof this.size === typeof {}) {
            if (this.size.hasOwnProperty('width')) {
                this.width = this.size.width;
                this.height = this.size.width;
                if (this.size.hasOwnProperty('height')) {
                    this.height = this.size.height;
                }
            }
        }
        this.defaultImage && (this.defaultImg = this.defaultImage);
    },
    watch: {
        checked () {
            this.$emit('change', this.checked);
        },
        files (val, oldVal) {
            this.init();
        }
    },
    methods: {
        init () {
            let src;
            if (typeof this.files === 'string') {
                let splitKey = this.files.indexOf(',') !== -1 ? ',' : this.files.indexOf(';') !== -1 ? ';' : ':';
                src = this.files.split(splitKey);
            } else if (this.files instanceof Array) {
                src = this.files;
            } else {
                console.error('图片格式不正确');
            }
            this.list = [];
            src = src.filter(item => item.trim() !== '');
            src.length && src.forEach(item => {
                this.list.push(this._formatFile(item.trim()));
            });
        },
        // 格式化文件
        _formatFile (item, uid) {
            let thumbnail = Tools.formatFile(item);
            return {
                uid: (uid || parseInt(Math.random() * 1000000000)),
                url: thumbnail, // 缩略图地址
                fullUrl: Environment.IMAGE_DOWNLOAD + item,
                reUrl: item // 原地址
            };
        }

    }
};
</script>
<style lang="scss" scoped>
    .fileList {
        li {
            float: left;
            margin-right: 5px;
            position: relative;
            .masterCert {
                position: absolute;
                background-color: rgba(255, 0, 0, .8);
                color: #fff;
                font-style: normal;
                padding: 0px 5px;
                line-height: 18px;
            }
        }
    }
</style>
