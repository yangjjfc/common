<template>
    <div ref="imgUpload">
        <el-upload ref="upload" :action="action" :headers="headers" :file-list="fileList" :list-type="type" :on-success="success" :show-file-list="show" class="upload-excel" :on-error="errors" :before-upload="beforeUpload" :limit="2" :multiple="multiple" :drag="drag" :class="classx" :auto-upload="false" :on-change="onChange" :on-exceed="exceed" >
            <slot name='imgs'></slot>
            <el-input placeholder="文件名" class="w300 mgr5" v-model="fileName" size="small" :readonly="true"></el-input>
            <el-button type="primary" slot="trigger" size="small" class="btn-selcet mgr5" >浏览...</el-button>
            <el-button size="small" type="primary" @click="submitUpload" :disabled="disBtn">导入excel</el-button>
            <slot></slot>
        </el-upload>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    data () {
        return {
            disBtn: true,
            fileList: [],
            fileName: '',
            action: '/gateway/upload', // 上传地址
            multiple: false, // 支持多张上传
            imgUrls: [],
            headers: {}, // 添加请求头{}
            drag: false // 是否支持拖拽上传
        };
    },
    props: {
        readonly: {
            type: [Boolean, String]
        },
        files: { // 图片地址
            type: [String, Array],
            required: false
        },
        classx: { // 自定义class
            type: String
        },
        type: { // 显示类型
            type: String,
            default: 'text'
        },
        show: { // 是否显示上传图片 默认显示
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean
        }
    },
    mounted () {
        if (this.token) {
            this.headers.jtoken = this.token;
        } else {
            this.$notify.error({
                title: '错误',
                message: '无法获取token'
            });
        }
    },
    computed: {
        ...mapGetters([
            'token'
        ])
    },
    methods: {
        submitUpload () { 
            this.$refs.upload.submit();
        }, 
        exceed (file, fileList) {
            console.log('超出数量');
        }, 
        onChange (file, fileList) {
            this.$refs.upload.clearFiles();
            file.status === 'ready' && (this.$emit('init')); // 初始化数据
            if (!this.getFileType(file.name)) {
                this.$notify.error({
                    title: '错误',
                    message: '请上传excel文件'
                });
                this.fileName = '';
                return false;
            }   
            this.$refs.upload.uploadFiles = [file];
            this.fileName = file.name;
            this.disBtn = false;
        },
        // 上传前
        beforeUpload (file) {
            // 文件类型
            if (!this.getFileType(file.name)) {
                this.$notify.error({
                    title: '错误',
                    message: '请上传excel文件'
                });
                this.$refs.upload.clearFiles();
                this.fileName = '';
                return false;
            }
            this.$emit('update:loading', true);
        },
        getFileType (names) {
            let name = (names.split('.').reverse()[0] || '').toLowerCase();
            let fileType = ['xlsx', 'xls']; 
            return fileType.includes(name); 
        },
        // 上传失败错误
        errors () {
            this.$notify.error({
                title: '错误',
                message: '文件上传失败。'
            });
        },
        //  上传成功
        success (response, file, fileList) {
            let files = JSON.parse(response).data;
            this.$refs.upload.clearFiles();
            this.$emit('upload', files);
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.btn-selcet{
    background:#fff;
    color:#000;
    border-color:#8eb0b1;
}
.upload-excel{
    display: flex;
}
.w300{
    width: 300px;
    align-items: baseline;
}
.mgr5{
    margin-right: 5px;
}
</style>
