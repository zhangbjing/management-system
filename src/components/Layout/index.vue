<template>
    <el-container class='main' v-if="!$route.meta.isFull">
        <el-header style="height: 100px">
            <div class="head-left">
                <img src="http://p8lzo644o.bkt.clouddn.com/logo.png" alt="">
                <p>动亮健康</p>
            </div>
            <div class="head-cent">
                <h1>运营管理系统</h1>
            </div>
            <div class="head-right">
                <p class="imgs"><img class="imgs" src="http://p8lzo644o.bkt.clouddn.com/min.png" alt=""><b>欢迎您，{{name}}</b></p>
                <ul class="uls">
                    <li><router-link to="/password">修改密码</router-link></li>
                    <li><a href="javascript:;" @click='signOut'>退出</a></li>
                </ul>
            </div>
        </el-header>
        <el-container v-if="!$route.meta.isPwd">
            <el-aside width="200px">
                <MenuSlider/>
            </el-aside>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
        <div v-else style="height: 100%">
            <router-view/>
        </div>
    </el-container>
    <div class='main' v-else>
        <router-view/>
    </div>
</template>
<script>
    import MenuSlider from './MenuSlider.vue'
    import localhost from '../../util/localhost'
    export default {
        data () {
            return {
                name: ''
            }
        },
        created () {
            this.name = localStorage.getItem('phone')
        },
        methods: {
            signOut () {
                $.ajax({
                    type: 'get',
                    url: localhost + 'backstage/logout',
                    dataType: 'json',
                    xhrFields:{withCredentials:true},
                    headers: {
                        'Login_Authorization': localStorage.getItem('token'),
                        'User_Id': localStorage.getItem('id')
                    },
                    success: (data) => {
                        if (data.code == '200') {
                            this.$router.replace('/login')
                        } else {

                        }
                    }
                })
            }
        },
        components: {
            MenuSlider
        }
    }
</script>
<style lang='less' scoped>
    .el-container{
        background-color: #EEEEEE;
    }
    .el-header{
        width: 100%;
        padding: 0;
        display: -webkit-flex;
        align-items: center;
        background: linear-gradient(to bottom, #82DCF9, #04B4ED);
        .head-left{
            flex: 1.5;
            height: 100%;
            display: -webkit-flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img{
                width: 60px;
                height: 60px;
                border-radius: 50%;
                margin-bottom: 5px;
            }
            p{
                font-size: 14px;
                color: #ffffff;
            }
        }
        .head-cent{
            flex: 5;
            height: 100%;
            display: -webkit-flex;
            align-items: center;
            h1{
                font-size: 28px;
                color: #ffffff;
            }
        }
        .head-right{
            flex: 3;
            height: 100%;
            color: #ffffff;
            display: -webkit-flex;
            align-items: center;
            justify-content: center;
            p{
                height: 100%;
                color: #ffffff;
                display: -webkit-flex;
                align-items: center;
                justify-content: center;
                .imgs{
                    width: 24px;
                    height: 28px;
                    margin-right: 5px;
                }
                b{
                    font-size: 14px;
                    color: rgb(255, 255, 255);
                }
            }
            .uls{
                margin-left: 100px;
                display: -webkit-flex;
                li{
                    margin-left: 10px;
                    a{
                        color: rgb(255, 255, 255);
                        font-size: 14px;
                        text-decoration: none;
                    }
                    &:nth-child(1){
                        border-right: 1px solid #fff;
                        padding-right: 10px;
                    }
                }
            }
        }
    }
    .el-aside {
        color: #333;
        line-height: 200px;
    }
    .el-main{
        padding: 0px;
        overflow-x: hidden;
    }
    .main{
        width: 100%;
        height: 100%;
    }
</style>