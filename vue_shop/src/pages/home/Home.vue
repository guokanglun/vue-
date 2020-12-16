<template>
    <div class="container">
        <el-container>
            <el-header>
                <img src="./img/heima.png" alt="">
                <span>电商后台管理系统</span>
                <button @click="logout">退出</button>
            </el-header>
            <el-container>
                <el-aside :width="isCollapse?'70px':'200px'">
                    <div class="collapse" @click="handleCollapse"> ||| </div>
                    <el-menu
                            router
                            :default-active="$route.path"
                            :collapse-transition="false"
                            :collapse="isCollapse"
                            unique-opened
                            width="200px"

                            class="el-menu-vertical-demo"
                            background-color="#333"
                            text-color="#fff"
                            active-text-color="#ffd04b">
                        <el-submenu :index="item.id + ''" width="200px" v-for="item in menu" :key="item.id">
                            <!-- 一级菜单 -->
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{ item.authName }}</span>
                            </template>
                            <!-- 二级菜单 -->
                            <el-menu-item-group v-for="subItem in item.children" :key="subItem.id">
                                <el-menu-item :index="'/' + subItem.path + ''">
                                    <i class="el-icon-location"></i>
                                    <span>{{ subItem.authName }}</span>
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>

                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>

</template>

<script>
    import {Container, Header, Aside,  Main} from 'element-ui'
    export default {
        name: "Home",
        data(){
          return{
              menu:[],
              isCollapse:false
          }
        },
        components:{
            Container, Header, Aside,  Main
        },
        mounted(){
            this.getMenuList()
            console.log(this.$route.path)
        },
        methods:{
            // 退出登录
            logout(){
                window.sessionStorage.clear();
                this.$router.push('/login')
            },
            async getMenuList(){
                const data = await this.$http.get('menus');
                // console.log(data.data.data);
                this.menu = data.data.data
            },
            handleCollapse(){
                this.isCollapse = !this.isCollapse
            }
        }
    }
</script>

<style lang="less" scoped>
    .container, .el-container{
        height: 100%;
        position: relative;
    }
    .el-header{
        background-color: #333;
        padding-left: 0;
        span{
            color: white;
            vertical-align: middle;
            margin-left: 20px;
            font-size: 20px;
        }
        img{
            vertical-align: middle;
        }
    }
    .el-aside{
        background-color: #333;
        .collapse{
            height: 20px;
            background-color: #2b4b6b;
            text-align: center;
            line-height: 20px;
            color:white;
            cursor: pointer;
            letter-spacing: 5px;
        }
    }
    button{
        position: absolute;
        width: 70px;
        height: 50px;

        right:20px;
        top:5px;
    }
    .el-menu{
        border-right: none;
    }

</style>
