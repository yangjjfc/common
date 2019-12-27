<template>
	<section class="container" id="perfectRegister">
		<div class="header-mumber">
            <h1 class="login-logo"><img src="../layout/img/logo.png" alt="logo"/></h1>
            <div class="c-right">
                <div class="userinfo-inner">
                    <span class="userinfo-link">您好，{{userInfo.userName}}</span>
                </div>
                <div class="logout" title="退出">
                    <yl-icon class="svg" icon="icon-tuichufffpx" @click.native="exit"></yl-icon>
                </div>
            </div>
        </div>
        <div class="cont">
            3333
        </div>
	</section>
</template>

<script>
import { emitter } from 'ycloud-ui';
import { mapGetters, mapActions } from 'vuex';

let html = document.getElementsByTagName('html')[0];
export default {
    mixins: [emitter],
    name: 'perfectRegister',
    data () {
        return {
            isInit: false,
            user: {
                name: ''
            },
            auditStatus: '',
            loginAccount: '',
            enterpriseDetail: {}
        };
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    
    watch: {
    },
    components: {
       
    },
    beforeCreate: function () {
        // 解决：body设为overflow: hidden带来的问题
        html.className = 'perfect-register';
    },
    beforeDestroy: function () {
          
    },
    created () {
        this.currentUser().then(() => {
            this.isInit = true;
        });
    },
    methods: {
        ...mapActions({
            'userLoginout': 'logout',
            'userLogin': 'login',
            'currentUser': 'currentUser',
            'getroles': 'getroles'
        }),
        // 退出登录
        exit () {
            this.$confirm('确认退出该系统吗？', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.userLoginout().then(result => {
                    localStorage.removeItem('vuex');
                    window.location.href = '/login';
                });
            });
        }
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
<style lang="scss" scoped>
.container {
    @import "../register/head";

    .step-container {
        padding: 20px;

        ::v-deep div.el-step__head .el-step__icon {
            background-color: #c1c5cd;
            color: #fff;
            border-color: #c1c5cd;
        }
        ::v-deep div.is-process .el-step__icon {
            background-color: #09977c;
            color: #fff;
            border-color: #09977c;
        }
    }
    .cont{
        margin:0 50px;
        padding: 30px 0;
        .line {
            text-align: center;
        }
        .center {
            text-align: center;
        }
        .right {
            text-align: right;
        }
        .col-role {
            text-align: center;
        }
        .col-step {
            margin: 30px 0;
        }
        .title {
            font-size: 14px;
            font-weight: bold;
        }
        .info {
            line-height: 2.2; padding-right: 20px;
            dt {
                clear: left; float: left; text-align: right; width: 120px; margin-right: 10px;
            }
        }
    }
}
@media screen and (min-width: 1400px){
    .container .cont {
        width: 80%;
        margin: 0 auto;
    }
}
</style>