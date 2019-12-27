<template>
    <div class="loginpage">
        <div class="header-mumber">
            <h1 class="login-logo"><img src="../layout/img/logo.png" alt="logo"/></h1>
        </div>
        <div class="login">
            <div class="w1000  login-panal">
                <el-steps :active="activeName" align-center>
                    <el-step title="填写帐号"></el-step>
                    <el-step title="验证身份"></el-step>
                    <el-step title="修改成功"></el-step>
                </el-steps>
                <div class="step-cont">
                    <div v-if="activeName == 1">
                        <el-form :model="form" ref="form" label-width="100px" :rules="rules">
                            <el-form-item label="账号" prop="loginAccount">
                                <el-input placeholder="请输入" v-model.trim="form.loginAccount"></el-input>
                            </el-form-item>
                            <el-form-item label="验证码" class="custom-mgb" prop="verifycode">
                                <el-row>
                                    <el-col :span="11">
                                        <el-input placeholder="请输入验证码" v-model.trim="form.verifycode" :maxlength="4"></el-input>
                                    </el-col>
                                    <el-col :span="13" class="verifyimg">
                                        <img id="imageCode" class="textbox" :src="verifyImg" width="80" height="40" alt="验证码" title="点击刷新"/>
                                        <el-button @click="refreshCode" type="text">换一张？</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="validUserName">提交</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="activeName == 2">
                        <el-form :model="msg" label-width="140px">
                            <el-form-item label="找回密码帐号为">
                                <span v-text="msg.loginAccount"></span>
                            </el-form-item>
                            <el-form-item label="已绑定手机">
                                <span v-text="msg.mobilePhone"></span>
                            </el-form-item>
                            <el-form-item label="验证码" class="custom-mgb" prop="verifycode">
                                <el-row :gutter="5">
                                    <el-col :span="15">
                                        <el-input placeholder="请输入验证码" v-model.trim="msg.verifycode" :maxlength="6"></el-input>
                                    </el-col>
                                    <el-col :span="8" class="verifyimg">
                                        <el-button @click="getRefreshCode" type="primary" :disabled="surplusTime > 0" v-text="verifyMsg"></el-button>
                                    </el-col>
                                    <el-col :span="24" v-if="sendSuccess">
                                        <span class="text-success" style="color: #67c23a">验证码已发送到手机，请注意查看</span>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="validVerifyCode">提交</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="activeName == 3">
                        <div class="text-center text-danger" style="font-size: 15px">
                            <p>新密码已发送至：{{ msg.mobilePhone }} </p>
                            <p> 请登陆系统后修改密码</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="login-footer">
            <p>CopyRight 2003-2014版权所有 杭州迪安控股有限公司 技术支持：杭州迪安控股有限公司</p>
            <P><img src="../login/img/footer.jpg" alt="12"/></P>
        </div>
    </div>
</template>
<script>
import { emitter } from 'ycloud-ui';
import { mapGetters, mapActions } from 'vuex';
const URL = {
    VERIFY_CODE: '/verifyCode',
    getAccountInfoByCheck: 'ypt.user.findMobileVerifyAccount',
    sendCode: 'ypt.verification.sendMobileVerificationCodeEx',
    checkSendVerifyCode: 'ypt.user.changePassword' // 检验手机验证码
};
export default {
    mixins: [emitter],
    data () {
        return {
            activeName: 1,
            verifyImg: '',
            sendSuccess: false,
            form: {
                loginAccount: '',
                verifycode: ''
            },
            verifyMsg: '获取验证码',
            surplusTime: 0,
            msg: {
                mobilePhone: '',
                loginAccount: '',
                verifycode: '' // 验证码
            },
            rules: {
                loginAccount: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' }
                ],
                verifycode: [
                    { required: true, message: '验证码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        ...mapActions({
            'userLogin': 'login',
            'currentUser': 'currentUser',
            'getroles': 'getroles'
        }),
        _countDown () {
            this.surplusTime--;

            if (this.surplusTime <= 0) {
                this.sendSuccess = false;
                this.verifyMsg = '获取验证码';
            } else {
                this.verifyMsg = `重新获取验证码(${this.surplusTime})`;
                setTimeout(() => {
                    this._countDown();
                }, 1000);
            }
        },
        // 获取手机验证码
        getRefreshCode () {
            this.Http(URL.sendCode, {
                params: {
                    loginAccount: this.msg.loginAccount
                }
            }).then((res) => {
                this.sendSuccess = true;
                this.surplusTime = 60;
                this._countDown();
            }, () => {
            });
        },
        // 刷新验证码
        getRandomImg () {
            this.form.verifycode = '';
            this.verifyImg = '/gateway' + URL.VERIFY_CODE + '?t=' + Math.round(Math.random() * 1000000);
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
        // 验证用户名
        validUserName () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.Http(URL.getAccountInfoByCheck, {
                        loginAccount: this.form.loginAccount,
                        verifycode: this.form.verifycode
                    }).then((res) => {
                        let msg = res.data;
                        this.$set(this, 'msg', msg);
                        this.activeName = 2;
                    });
                } else {
                    return false;
                }
            });
        },
        // 验证验证码
        validVerifyCode () {
            if (this.msg.verifycode) {
                this.Http(URL.checkSendVerifyCode, {
                    verifyCode: this.msg.verifycode,
                    loginAccount: this.msg.loginAccount
                }).then((res) => {
                    this.activeName = 3;
                }, () => {});
            }
        }
    },
    props: {
        /* show: {
            type: Boolean,
            required: true,
            default: false
        } */
    },
    computed: {
        /* shows: {
            get() {
                return this.show;
            },
            set(newValue) {
                this.$emit('update:show', newValue);
            }
        }, */
        ...mapGetters(['userInfo', 'routers'])
    },
    mounted () {
        this.refreshCode();
    }
};

</script>
<style lang="scss" scoped>
.dictionary-btns {
    cursor: pointer;
}

.step-cont {
    width: 600px;
    padding: 60px 20px;
    margin: auto;
}

.w1000 {
    width: 1000px;
    margin: 0 auto;
}

.loginpage {
    .login-panal {
        padding-top: 50px;
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

    .header-mumber {
        height: 60px;
        background: -webkit-gradient(linear, left top, right top, from(#038b8d), to(#13a967));
        background: linear-gradient(to right, #038b8d, #13a967);
        color: #fff;
        font-size: 16px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;

        .nav {
            float: right;
            overflow: hidden;
            zoom: 1;
            padding-top: 20px;

            li {
                float: left;
                margin-left: 36px;
                font-size: 16px;
            }
        }

        .login-logo {
            float: left;
            padding: 0 15px;

            img {
                height: 20px;
                width: auto;
            }
        }
    }
}

.login-footer {
    text-align: center;
    padding: 20px;
    font-size: 14px;
}

</style>
