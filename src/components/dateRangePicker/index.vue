<!--
时间区间选择器
-->
<template>
    <el-form-item :label="dateConfigs.label" :required="dateConfigs.required">
        <div class="startTime" v-if="dateConfigs.isNeedStartTime">
            <el-form-item prop="startTime" :rules="dateConfigs.required===true ? rules.startTime : []" style="margin-right: 0;">
                <el-date-picker
                    :type="dateConfigs.type"
                    :placeholder="dateConfigs.startLabel"
                    v-model="form.startTime"
                    :picker-options="pickerBeginDateBefore"
                    :format="dateConfigs.format"
                    :value-format="dateConfigs.valueFormat"
                    :disabled="!dateConfigs.canEdit"
                    :style="{width: dateConfigs.type==='date' ? '125px' : '180px'}"
                ></el-date-picker>
            </el-form-item>
        </div>
        <div class="line" style="width:30px; text-align:center; display: inline-block;">至</div>
        <div :xs="22" :sm="11" :md="7" :lg="5" class="endTime" v-if="dateConfigs.isNeedEndTime">
            <el-form-item prop="endTime" :rules="dateConfigs.required===true ? rules.endTime : []" style="margin-right: 0;">
                <el-date-picker
                    :type="dateConfigs.type"
                    :placeholder="dateConfigs.endLabel"
                    v-model="form.endTime"
                    :picker-options="pickerBeginDateAfter"
                    :format="dateConfigs.format"
                    :value-format="dateConfigs.valueFormat"
                    :disabled="form.longTerm==='1' || !dateConfigs.canEdit"
                    :style="{width: dateConfigs.type==='date' ? '125px' : '180px'}"
                ></el-date-picker>
            </el-form-item>
        </div>
        <div :xs="24" :sm="24" :md="8" :lg="5" class="longTerm" v-if="dateConfigs.isNeedLong">
            <el-form-item label-width="7px" prop="longTerm">
                <el-checkbox v-model="form.longTerm" true-label="1" false-label="0" @change="checkLongTerm(form)" :disabled="!dateConfigs.canEdit">长期</el-checkbox>
            </el-form-item>
        </div>
    </el-form-item>
</template>

<script>
import { emitter } from 'ycloud-ui';
export default {
    mixins: [emitter],
    name: 'dateRangePicker',
    data () {
        // 自定义的验证函数：
        const checkStartTime = (rule, value, callback) => {
            if (!value) {
                return callback(new Error(`请选择${this.dateConfigs.startLabel}`));
            }
            callback();
        };
        const checkEndTime = (rule, value, callback) => {
            if (this.dateConfigs.isNeedLong) {
                if (this.form.longTerm === '0' && !value) {
                    return callback(new Error(`请选择${this.dateConfigs.endLabel}`));
                }
            } else {
                if (!value) {
                    return callback(new Error(`请选择${this.dateConfigs.endLabel}`));
                }
            }            
            callback();
        };
        return {
            dateConfigs: { // 默认参数
                type: 'date',
                label: '时间：',
                startLabel: '开始日期',
                endLabel: '结束日期',
                format: '',
                valueFormat: 'yyyy-MM-dd',
                isNeedStartTime: true,
                isNeedEndTime: true,
                isNeedLong: false,
                required: false, // 是否需要验证必填
                canEdit: true // 是否可以编辑
            },
            form: {
                startTime: '',
                endTime: '',
                longTerm: false
            },
            pickerBeginDateBefore: {},
            pickerBeginDateAfter: {},
            rules: { // 默认的验证规则
                startTime: [{
                    validator: checkStartTime,
                    trigger: ['blur', 'change']
                }],
                endTime: [{
                    validator: checkEndTime,
                    trigger: ['blur', 'change']
                }
                // {  required: true, message: '请选择结束时间', trigger: 'change' }
                ]
            }
        };
    },
    props: {
        formData: Object,
        formRules: Object,
        configs: {
            type: Object,
            default () {
                return {};
            }
        }
    },
    watch: {
        'form.startTime': {
            handler: function (val, oldVal) {
                if (!val) { // 当结束日期清空时给个虚拟 hack
                    val = '14959001200000000000000000000';
                }
                this.pickerBeginDateAfter = {
                    disabledDate (time) {
                        let date = new Date(val).getTime();
                        return date && time.getTime() + 86400000 < date;
                    }
                };
            },
            deep: true
        },
        'form.endTime': {
            handler: function (val, oldVal) {
                this.pickerBeginDateBefore = {
                    disabledDate (time) {
                        let date = new Date(val).getTime();
                        return date && time.getTime() > date;
                    }
                };
            },
            deep: true
        },
        formData: {
            // immediate: true,
            handler (val) {
                this.form = val;
            },
            deep: true
        }        
        /* formRules: {
            immediate: true,
            handler (val) {
                console.log('watch formRules....', val)
                this.rules = val;
            },
            deep: true
        } */
    },
    created () {
        this.dateConfigs = Object.assign(this.dateConfigs, this.configs);
        this.form = Object.assign({}, this.formData);
        this.rules = Object.assign(this.rules, this.formRules);
    },
    mounted () {
        this.$emit('update:formData', this.form);
        this.$emit('update:formRules', this.rules);
    },
    methods: {        
        // 选择“长期”
        checkLongTerm (item) {
            this.$set(this.form, 'endTime', '');
        }
    }
};
</script>

<style scoped>
    .startTime,
    .endTime {
        width: 125px;
        display: inline;
    }
    .longTerm {
        width: 60px;
        display: inline;
    }
</style>