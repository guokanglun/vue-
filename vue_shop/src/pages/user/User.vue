<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row :gutter="20">
                <el-col :span="7"><div class="grid-content bg-purple">
                    <el-input placeholder="请输入内容"  class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div></el-col>

                <el-col :span="7"><div class="grid-content bg-purple">
                    <el-button type="primary"> 添加用户 </el-button>
                </div></el-col>
            </el-row>

            <el-table
                    :data="userList"
                    border
                    style="width: 100%">
                <el-table-column
                        type="index"
                        label="#"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="姓名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="电话">
                </el-table-column>
                <el-table-column
                        prop="role_name"
                        label="角色">
                </el-table-column>
                <el-table-column
                        label="状态">
                    <!-- 作用域插槽 -->
                    <template v-slot="scope">
                         <!-- {{ scope.row }} 当前行数据 -->
                        <el-switch  v-model="scope.row.mg_state"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" circle></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" circle></el-button>
                        </el-tooltip>

                        <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" circle></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>

            </el-table>

        </el-card>
    </div>
</template>

<script>
    import {Breadcrumb, Input, Button, Icon, Message, Table} from 'element-ui'
    export default {
        name: "User",
        components:{
            Breadcrumb, Input, Button, Icon, Message, Table
        },
        data(){
            return{
                // 用户列表
                userList:[],
                // 用户总数
                total: '',
                value:false
            }
        },
        methods:{
            async getUserList(){
                const {data} = await this.$http.get('users', {
                    params:{
                        query:'',
                        pagenum:1,
                        pagesize:2
                    }
                });

                // console.log(data);
                if(data.meta.status !== 200){
                    return Message.error('获取数据失败')
                }
                this.userList = data.data.users;
                const {total}  = data.data;
                this.total = total

            }
        },
        mounted() {
            this.getUserList()
        }
    }
</script>

<style scoped>

</style>
