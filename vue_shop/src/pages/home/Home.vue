<template>
    <div class="container">
        <el-container>
            <el-header>
                <img src="./img/heima.png" alt="">
                <span>电商后台管理系统</span>
                <button @click="logout">退出</button>
            </el-header>
            <el-container>
                <el-aside width="200px">Aside</el-aside>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
    </div>

</template>

<script>
    import {Container, Header, Aside,  Main} from 'element-ui'
    export default {
        name: "Home",
        components:{
            Container, Header, Aside,  Main
        },
        methods:{
            // 退出登录
            logout(){
                window.sessionStorage.clear();
                this.$router.push('/login')
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
    }
    button{
        position: absolute;
        width: 70px;
        height: 50px;

        right:20px;
        top:5px;
    }
</style>
