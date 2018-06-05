<template>
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      :router="true"
      @open="handleOpen"
      @close="handleClose"
      text-color="rgb(51, 51, 51)"
      active-text-color="rgb(102, 102,102)"
      >
      <template v-for='(item, index) in routes' v-if='item.component && !item.isFull'>
        <el-submenu v-if='item.children' :key='index' :index='item.path'>
            <template slot="title">
                <img :src="item.imgUrl" alt="">
                <span>{{item.title}}</span>
            </template>
            <el-menu-item v-for='(list, idx) in item.children' :key='idx' :index="item.path + '/' + list.path">
                {{list.title}}
            </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index='item.path' :key='index'>
            <img :src="item.imgUrl" alt="">
            <span>{{item.title}}</span>
        </el-menu-item>
      </template>
    </el-menu>
</template>
<script>
  export default {
    methods: {
      handleOpen(key, keyPath) {
        
      },
      handleClose(key, keyPath) {
        
      }
    },
    created(){
        // console.log(this.$router.options.routes)
    },
    computed: {
        routes () {
            return this.$router.options.routes
        }
    }
  }
</script>
<style lang="less" scoped>
    .el-menu{
        box-shadow: 0 0 20px #D5D5D5;
        border-right: none;
        padding-bottom: 200px;
        // .el-submenu__title:focus .el-submenu__title:hover{
        //     background-color: #CCF0FB;
        // }
        .el-menu-item:focus, .el-menu-item:hover{
            outline: 0;
            background-color: #CCF0FB;
        }
        img{
            width: 20px;
            height: 20px;
        }
    }
</style>
