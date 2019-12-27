<template>
    <div class="loginpage">
        <div class="header-mumber">
            <h1 class="login-logo"><img src="../layout/img/logo.png" alt="logo"/></h1>
        </div>
        <div class="login">
            <div class="w1000 login-panal">
                <div class="login-form">
                    <el-row class="mgb10">
                        <el-col :span="4">&nbsp;</el-col>
                        <el-col :span="16">
                            <div class="step-container">
                                <el-steps :active="0" finish-status="success">
                                    <el-step title="注册账号"></el-step>
                                    <el-step title="完善企业信息"></el-step>
                                    <el-step title="审核"></el-step>
                                    <el-step title="完成注册"></el-step>
                                </el-steps>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="link-contianer mgt10 mgr10 right">
                                <p style="color: #000; font-size: 13px;">我已注册，立即<el-button type="text" @click="goLogin()">登录</el-button></p>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="loginForm">
                        <el-form ref="form" :model="form" label-width="120px" :rules="rules" status-icon>
                            <el-form-item label="企业名称" prop="enterpriseName">
                                <el-input placeholder="请输入企业名称" v-model.trim="form.enterpriseName" :maxlength="120"></el-input>
                            </el-form-item>
                            <el-form-item label="登录账号" prop="loginAccount">
                                <el-input placeholder="请输入登录账号" v-model.trim="form.loginAccount" :minlength="6" :maxlength="20"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input placeholder="请输入密码" v-model.trim="form.password" type="password" :minlength="6" :maxlength="20"></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="confirmPassword">
                                <el-input placeholder="请输入密码" v-model.trim="form.confirmPassword" type="password" :minlength="6" :maxlength="20"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号码" prop="linkTelphone">
                                <el-input placeholder="请输入手机号码" v-model.trim="form.linkTelphone" :minlength="11" :maxlength="11"></el-input>
                            </el-form-item>
                            <el-form-item label="验证码" class="custom-mgb" prop="verifyCode">
                                <el-row>
                                    <el-col :span="11">
                                        <el-input placeholder="验证码" v-model.trim="form.verifyCode" :maxlength="4" @keyup.enter.native="login"></el-input>
                                    </el-col>
                                    <el-col :span="13" class="verifyimg">
                                        <img id="imageCode" class="textbox" :src="verifyImg" width="80" height="40" alt="验证码" title="点击刷新"/>
                                        <a @click="refreshCode()" href="javascript:void(0)">换一张？</a>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="短信验证码" prop="mobileCode">
                                <el-row :gutter="10">
                                    <el-col :span="17">
                                        <el-input placeholder="请输入短信验证码" v-model.trim="form.mobileCode" :maxlength="6"></el-input>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button type="warning" @click="getMobileVerifyCode" :disabled="countdown != 0 || canVerifyCode===false">获取验证码 <span v-if="countdown != 0">({{countdown}})</span>
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item prop="agree">
                                <el-checkbox v-model="form.agree" :true-label="1" :false-label="0">
                                    我已阅读并确认
                                </el-checkbox>
                                <el-button type="text" @click="showProtocol = true">《供应链服务云协议》</el-button>
                            </el-form-item>
                            <el-form-item class="submit">
                                <el-button type="primary" @click="submit" :disabled="form.agree===0">立即注册</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
        <div class="login-footer text-center">
            <p>&copy;2017版权所有 杭州云医购网络科技有限公司 ICP证书：浙ICP备17033840号</p>
            <p>国家药监局（浙）-经营性-2018-0016 增值电信业务经营许可证浙B2-20180650</p>
            <p><a  href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010602008664" target="_blank"><img src="./img/records.png" alt=""> <span>浙公网安备 33010602008664号</span></a></p>
        </div>
        <Protocal v-if="showProtocol" :show.sync="showProtocol" @update="updateAgree"></Protocal>
    </div>
</template>
<script type="text/javascript">
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { emitter, Tools } from 'ycloud-ui';
import Protocal from './mods/Protocal';
let html = document.getElementsByTagName('html')[0];
const URL = {
    verifyCode: '/verifyCode',
    checkVerifyCode: 'verifyCode/check',
    register: 'scs.ecs.enterprise.register', // 注册
    checkUnionName: 'ddc.ecs.enterprise.checkUnionName', // 验证企业名称唯一性
    checkAccount: 'ddc.uim.userAccount.check', // 验证登录账号
    checkPhone: 'ddc.uim.userAccount.check', // 验证手机号
    checkMobileCode: 'scs.ecs.enterprise.checkMobileCode', // 验证手机短信验证码
    sendMobileCode: 'ddc.uim.verification.sendmobilecode' // 发送手机短信验证码
};
export default {
    mixins: [emitter],
    data () {
        // 登录账号
        const validateLoginAccount = (rule, value, callback) => {
            if (/^(\w+@\w+){1,1}(\.\w+){1,2}$/.test(value)) {
                callback(new Error('登录账号不能是邮箱'));
            } else if (/^([+-]?)\d*\.?\d+$/.test(value)) {
                callback(new Error('登录账号不能是纯数字'));
            } else if (!/^\w{6,20}$/.test(value)) {
                var _limit = '长度为6-20字符';
                if (value.length >= 6 && value.length <= 20) {
                    _limit = '仅支持数字、字母(区分大小写)、下划线“_”';
                } else if (value.length === 0) {
                    _limit = '不能为空';
                }
                callback(new Error('登录账号' + _limit));
            } else {
                callback();
            }
        };

        // 密码校验
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (value.length < 6 || value.length > 20) {
                    callback(new Error('支持特殊字符，长度6-20位'));
                } else {
                    if (this.form.confirmPassword !== '') {
                        this.$refs.form.validateField('confirmPassword');
                    }
                    callback();
                }
            }
        };

        // 确认密码
        const validatePass2 = (rule, value, callback) => {
            if (value.trim() === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };

        // 图片验证码
        const checkVerifyCode = (rule, value, callback) => {
            this.Http(URL.checkVerifyCode, {
                verifyCode: this.form.verifyCode
            }).then(res => {
                this.canVerifyCode = true;
                callback();
            }).catch(error => {
                this.canVerifyCode = false;
                callback(new Error(error.message));
            });
        };

        return {
            countdown: 0,
            canVerifyCode: false,
            verifyImg: '',
            evs: process.env.NODE_ENV, // 环境
            form: {
                loginAccount: '',
                linkTelphone: '',
                enterpriseName: '',
                password: '',
                confirmPassword: '',
                agree: 0,
                verifyCode: '', // 图片验证码
                mobileCode: '' // 手机短信验证码
            },
            rules: {
                loginAccount: [
                    { required: true, validator: validateLoginAccount, trigger: 'blur' },
                    {
                        validator: this.formValid,
                        trigger: 'blur',
                        message: '该账号已被注册',
                        url: URL.checkAccount,
                        params () {
                            return {
                                reverse: true,
                                loginAccount: this.form.loginAccount
                            };
                        }
                    }
                ],
                password: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, validator: validatePass2, trigger: 'blur' }
                ],
                enterpriseName: [
                    { required: true, trigger: 'blur', message: '请输入企业名称' },
                    {
                        validator: this.formValid,
                        trigger: 'blur',
                        message: '企业名称已存在',
                        url: URL.checkUnionName,
                        params () {
                            return {
                                reverse: true,
                                enterpriseName: this.form.enterpriseName,
                                enterpriseNo: null
                            };
                        }
                    }
                ],
                verifyCode: [
                    { required: true, trigger: 'blur', message: '请输入验证码' },
                    { min: 4, max: 4, trigger: 'blur', message: '请输入4位验证码' },
                    { required: true, validator: checkVerifyCode, trigger: 'blur' }
                ],
                linkTelphone: [
                    { required: true, pattern: Tools.regexp.phone, trigger: 'blur', message: '请输入正确的手机号' },
                    {
                        validator: this.formValid,
                        trigger: 'blur',
                        message: '手机号码已存在',
                        url: URL.checkPhone,
                        params () {
                            return {
                                reverse: true,
                                loginAccount: this.form.linkTelphone || ''
                            };
                        }
                    }
                ],
                // 短信验证码
                mobileCode: [
                    { required: true, min: 6, max: 6, trigger: 'blur', message: '请输入6个数字的验证码' }
                ],
                agree: [{
                    required: true,
                    validator: function (rule, value, callback) {
                        if (value === 1 || value === '1') {
                            callback();
                        } else {
                            callback('请阅读并同意用户协议');
                        }
                    },
                    trigger: 'change',
                    message: ''
                }]
            },
            showProtocol: false
        };
    },
    computed: {
        ...mapGetters(['userInfo', 'routers'])
    },
    methods: {
        ...mapMutations(['CHANGEUSER']),
        ...mapActions({
            'userLogin': 'login',
            'currentUser': 'currentUser',
            'getroles': 'getroles'
        }),
        // 刷新验证码
        getRandomImg () {
            this.form.verifyCode = '';
            this.verifyImg = '/gateway' + URL.verifyCode + '?t=' + Math.round(Math.random() * 1000000);
            this.canVerifyCode = false;
        },
        // 获取用户信息
        refreshCode () {
            if (this.userInfo && this.userInfo.token) {
                this.getRandomImg(); // 通过验证码获取token
            } else {
                this.currentUser().then(() => {
                    this.getRandomImg();
                }, () => {
                    this.getRandomImg();
                });
            }
        },
        // 注册
        async submit () {
            if (this.validating) {
                await this.validating;
            }
            this.$refs.form.validate((valid) => {
                let params = {
                    ...this.form,
                    password: Tools.encryption(this.form.password, this.userInfo.clientId, this.userInfo.token)
                };
                params.confirmPassword = params.password;
                params.code = params.mobileCode;

                // 过滤
                // delete params.agree;
                delete params.verifyCode;
                delete params.mobileCode;
                if (valid) {
                    this.Http(URL.register, {
                        registerDto: params
                    }).then(results => {
                        this.$alert('账号注册成功，即将跳转完善企业信息<br />3秒后跳转', '提示信息', {
                            confirmButtonText: '去完善',
                            customClass: 'reg-success-info',
                            dangerouslyUseHTMLString: true,
                            callback: action => {
                                this.$router.push({
                                    name: 'perfectRegister'
                                });
                            }
                        });
                        // 3秒钟后跳转
                        setTimeout(() => {
                            document.querySelector('.reg-success-info .el-button').click();
                        }, 3000);
                    }).catch(_ => {
                        // 注册失败，重新换验证码
                        this.refreshCode();
                    });
                } else {
                    return false;
                }
            });
        },
        goLogin () {
            this.$router.push({
                name: 'login'
            });
        },
        // 倒计时
        minusCount () {
            setTimeout(() => {
                this.countdown--;
                if (this.countdown > 0) {
                    this.minusCount();
                }
            }, 1000);
        },
        // 发送手机验证码
        getMobileVerifyCode () {
            this.$refs.form.validateField('linkTelphone', valid => {
                if (valid === '') {
                    this.$refs.form.validateField('verifyCode', valid => {
                        if (valid === '' && this.countdown === 0) {
                            this.Http(URL.sendMobileCode, {
                                mobilePhone: this.form.linkTelphone
                            }).then(result => {
                                this.countdown = 60;
                                this.minusCount();
                            }).catch(s => {
                                this.countdown = 60;
                                this.minusCount();
                            });
                        }
                    });
                }
            });
        },
        updateAgree () {
            this.form.agree = 1;
        }
    },
    beforeCreate: function () {
        // 解决：body设为overflow: hidden带来的问题
        html.className = 'perfect-register';
    },
    beforeDestroy: function () {
        html.removeAttribute('class', 'perfect-register');
    },
    created () {
        this.refreshCode();
        this.getRandomImg();
    },
    components: {
        Protocal
    }
};

</script>
<style type="text/css">
.perfect-register {
    overflow: visible;
}
.perfect-register body {
    overflow: auto;
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
.w1000 {
    width: 1000px;
    margin: 0 auto;
}
.step-container {
    padding: 20px;

    ::v-deepdiv.el-step__head .el-step__icon {
        background-color: #c1c5cd;
        color: #fff;
        border-color: #c1c5cd;
    }
    ::v-deepdiv.is-process .el-step__icon {
        background-color: #09977c;
        color: #fff;
        border-color: #09977c;
    }
}

.loginpage {
    .login-panal {
        border: #e5e5e5 solid 1px;
    }

    .title {
        font-size: 18px;
        line-height: 40px;
        padding-left: 15px;
        background-color: #fff;
    }

    .login-form {
        background: #fff;
        padding: 30px;

        .loginForm {
            width: 600px;
            margin: 0 auto;
        }

        .textbox {
            float: left;
        }
    }
    @import "./head";
}

.login-footer {
    text-align: center;
    padding: 20px;
    font-size: 14px;
}

</style>
