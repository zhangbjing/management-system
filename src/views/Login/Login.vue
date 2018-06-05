<template>
    <div class="login">
        <div class="login_box">
            <div class="logo">
                <img src="http://p8lzo644o.bkt.clouddn.com/LOG.png" alt="">
            </div>
            <h1>运营管理系统</h1>
            <div class="main">
                <div class="userName cent">
                    <img class="imag" src="http://p8lzo644o.bkt.clouddn.com/name_icon.png" alt="">
                    <input v-model="username" class="ipt" placeholder="请输入用户名" type="text" v-on:input='inputData'>
                    <p :style="nameFlag == true ? 'display: block;' : 'display: none;'" class="show">
                        <img src="http://p8lzo644o.bkt.clouddn.com/hint_icon.png"/>
                        {{useName}}
                    </p>
                </div>
                <div class="password cent">
                    <img class="imag" src="http://p8lzo644o.bkt.clouddn.com/password_icon.png" alt="">
                    <input v-model="password" class="ipt" placeholder="请输入密码" type="password" v-on:input='inputData'>
                    <p :style="pwdFlag == true ? 'display: block;' : 'display: none;'" class="show">
                        <img src="http://p8lzo644o.bkt.clouddn.com/hint_icon.png"/>
                        {{pwd}}
                    </p>
                </div>
                <div class="check-box">
                    <el-checkbox v-model="checked">记住我</el-checkbox>
                </div>
                <div class="button">
                    <button class="btn" @click="submitForm" :class="disabledFlag == true ? 'on' : ''">登录</button>
                </div>
            </div>
        </div>
        <div class="foo">
            <p>Copyright@北京动亮健康科技有限公司.All Right Service.</p>
        </div>
    </div>
</template>
<script>
import hex_md5 from 'js-md5'
import localhost from '../../util/localhost'
import $ from 'jQuery'
export default {
    name: "Login",
    data() {
        return {
            useName: '请输入用户名',
            pwd: '请输入密码',
            username: '',
            password: '',
            checked: false,
            disabledFlag: false,
            nameFlag: false,
            pwdFlag: false
        };
    },
    created () {
        this.username = localStorage.getItem('phone')
        // const jwt = require('jsonwebtoken');
        // const secret = "20170821";
        // async create (userInfo) {
        //     let token = jwt.sign(userInfo, secret);
        //     return token;
        // }
        // async parse() {
        //     if (think.token) {
        //         try {
        //             return jwt.verify(think.token, secret);
        //         } catch (err) {
        //             return null;
        //         }
        //     }
        //     return null;
        // }

        // async verify() {
        //     let result = await this.parse();
        //     if (think.isEmpty(result)) {
        //         return false;
        //     }
        //     return true;
        // }
    },
    methods: {
        inputData() {
            let reg = /^[1][3-9][0-9]{9}$/
            if (reg.test(this.username) && this.password.length == '6'){
               this.disabledFlag = true 
            } else {
                this.disabledFlag = false
            }
        },
        submitForm() {
            let reg = /^[1][3-9][0-9]{9}$/
            if (!reg.test(this.username) || this.username.length < 1) {
                this.nameFlag = true
                setInterval(() => {
                    this.nameFlag = false
                }, 2000)
            } else if (this.password.length < 1) {
                this.pwdFlag = true
                setInterval(() => {
                    this.pwdFlag = false
                }, 2000)
            } else {
                    let obj = {
                        'telephone': this.username,
                        'password': hex_md5(this.password).toUpperCase()
                    }
                $.ajax({
                    type: "post",
                    url: localhost + "backstage/login/user",
                    dataType: "json",
                    xhrFields:{cookie:true},
                    xhrFields:{withCredentials:true},
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify(obj),
                    success: (data) => {
                        console.log(data)
                        let code = data.code
                        let msg = data.msg
                        if (code === '200'){
                            let id = data.data.id
                            let token = data.data.token
                            localStorage.setItem('id', id)
                            localStorage.setItem('token', token)
                            this.$router.replace('/statistics')
                            if(this.checked) {
                                localStorage.setItem('phone', this.username)
                            } else {
                                localStorage.setItem('phone', '')
                            }
                        } else if (code === '202') {
                            if (msg === '没有此用户') {
                                this.useName = '没有此用户'
                                this.nameFlag = true
                                setInterval(() => {
                                    this.nameFlag = false
                                }, 2000)
                            } else if (msg === '密码错误') {
                                this.pwd = '密码错误'
                                this.pwdFlag = true
                                setInterval(() => {
                                    this.pwdFlag = false
                                }, 2000)
                            }
                        }
                    }
                });
            }
            
        }
    }
}
</script>
<style lang="less" scoped>
    .login{
        width: 100%;
        height: 100%;
        background: url(http://p8lzo644o.bkt.clouddn.com/login.png) no-repeat;
        background-size: cover;
        background-position: center top;
    }
    .login_box{
        width: 500px;
        height: 650px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 30px #999999;
        border-radius: 20px;
        background: #F3F3FB;
        .logo{
            width: 100%;
            height: 200px;
            display: -webkit-flex;
            justify-content: center;
            align-items: center;
            img{
                width: 125px;
                height: 125px;
            }
        }
        h1{
            display: -webkit-flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
        }
        .main{
            padding: 30px;
            .cent{
                display: -webkit-flex;
                align-items: center;
                height: 50px;
                border-bottom: 1px solid #dddddd;
                margin-top: 20px;
                .imag{
                    width: 22px;
                    height: 30px;
                    margin-left: 10px;
                }
                .ipt{
                    height: 100%;
                    border: none;
                    outline: none;
                    background: none;
                    padding-left: 10px;
                    margin-left: 20px;
                    font-size: 19px;
                    color: #bbbbbb;
                }
                .show{
                    margin-left: 20px;
                    color: #f75050;
                    font-size: 13px;
                    img{
                        width: 18px;
                        height: 18px;
                        margin-right: 10px;
                        margin-bottom: -4px;
                    }
                }
            }
            .button{
                height: 68px;
                .btn{
                    width: 100%;
                    height: 68px;
                    background: #999999;
                    color: #ffffff;
                    border: none;
                    outline: none;
                    border-radius: 5px;
                    font-size: 28px;
                    cursor: pointer;
                }
                .on{
                    background: #02B3ED;
                }
            }
            .check-box{
                width: 100%;
                height: 40px;
                margin-bottom: 20px;
                display: -webkit-flex;
                justify-content: flex-end;
                align-items: center;
            }
        }
    }
    .foo{
        position: absolute;
        bottom: 5%;
        width: 100%;
        display: -webkit-flex;
        justify-content: center;
        p{
            color: #676767;
        }
    }
</style>
