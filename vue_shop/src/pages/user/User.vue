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
                    <el-input placeholder="请输入内容"  class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </div></el-col>

                <el-col :span="7"><div class="grid-content bg-purple">
                    <el-button type="primary"  @click="dialogVisible=true"> 添加用户 </el-button>
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
                        <el-switch  v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" circle @click="editUser(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.row.id)"></el-button>
                        </el-tooltip>

                        <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" circle></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>

            </el-table>

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog
                @close="clearForm"
                title="添加用户"
                :visible.sync="dialogVisible"
                width="60%">

            <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="ruleForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog
                @close="editClearForm"
                title="修改用户"
                :visible.sync="editVisible"
                width="60%">

            <el-form :model="editRuleForm" :rules="editRules" ref="editRuleFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editRuleForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editRuleForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editRuleForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
    <el-button @click="editVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserC">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import {Breadcrumb, Input, Button, Icon, Message, Table, Pagination, Dialog, Form, FormItem, MessageBox} from 'element-ui'
    export default {
        name: "User",
        components:{
            Breadcrumb, Input, Button, Icon, Message, Table, Pagination, Dialog,Form, FormItem,  MessageBox
        },
        data(){
            // 自定义验证规则
            const checkEmail = (rule, value, callback) => {
                const myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if(!myreg.test(value)){
                     callback(new Error('邮箱不合法'))
                }else{
                    callback()
                }
            };
            const checkPhone = (rule, value, callback) => {
                const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if(!myreg.test(value)){
                     callback(new Error('手机号不合法'))
                }else{
                    callback()
                }
            };
            return{
                // 用户列表
                userList:[],
                // 用户总数
                total: 0,
                value:false,
                queryInfo:{
                    query:'',
                    pagenum:1,   // 当前页码
                    pagesize:2  // 每页显示条数
                }, // 获取用户列表查询参数
                dialogVisible:false,   // 对话框是否可见
                editVisible:false,
                ruleForm: {
                    username:'',
                    password:'',
                    email:'',
                    mobile:''
                }, // 添加用户提交表单数据
                editRuleForm:{
                    id:'',
                    username:'',
                    email:'',
                    mobile:''
                },   //  修改用户提交表单数据

                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator:checkEmail, trigger: 'blur' },
                    ],
                    phone: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator:checkPhone, trigger: 'blur' },
                    ],

                } , // 添加用户表单数据验证规则
                editRules:{
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator:checkEmail, trigger: 'blur' },
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator:checkPhone, trigger: 'blur' },
                    ],
                },  // 修改用户表单数据验证规则
            }
        },
        methods:{
            // 获取用户列表数据
            async getUserList(){
                const {data} = await this.$http.get('users', {
                    params: this.queryInfo
                });

                // console.log(data);
                if(data.meta.status !== 200){
                    return Message.error('获取数据失败')
                }
                this.userList = data.data.users;
                const {total}  = data.data;
                this.total = total

            },

            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.queryInfo.pagesize  = val;
                this.getUserList()
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.queryInfo.pagenum = val;
                this.getUserList()
            },

            // 修改用户状态
            async changeState(val){
                // console.log(val);
                const data = await this.$http.put(`users/${val.id}/state/${val.mg_state}`);
                // console.log(data);
                if(data.status !== 200){
                    val.mg_state = !val.mg_state
                    Message.error('更新状态失败')
                }
                Message.success('更新状态成功')

            },

            // 重置表单
            clearForm(){
                this.$refs.ruleFormRef.resetFields()
            },
            editClearForm(){
                this.$refs.editRuleFormRef.resetFields()
            },
            // 添加用户
             async addUser(){
                const {data} = await this.$http.post('users', this.ruleForm);
                 if(data.meta.status !== 201){
                     Message.error('添加用户失败')
                 }else{
                     Message.success('添加用户成功');
                     this.dialogVisible = false;
                     this.getUserList()
                 }
            },

            // 修改用户
            editUser(data){
                // alert(1)
                // console.log(data);
                const obj = {
                    id:data.id,
                    email:data.email,
                    mobile:data.mobile,
                    username:data.username
                };
                this.editRuleForm = obj;
                this.editVisible = true
            },
            // 确定修改
             editUserC(){
                this.$refs.editRuleFormRef.validate(async (valid)=>{
                    if(valid){
                        const {data} = await this.$http.put('users/'+this.editRuleForm.id, this.editRuleForm);
                        if(data.meta.status === 200){
                            Message.success('更新用户成功');
                            this.editVisible = false;
                            this.getUserList();
                        }else{
                            Message.error('更新用户失败')
                        }
                    }
                });


            },
            // 删除用户
            deleteUser(id){
                // console.log(id)
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const {data}  = await this.$http.delete('users/'  + id);
                    if(data.meta.status == 200){
                        Message.success('删除用户成功')
                        this.getUserList();
                    }else{
                        Message.success('删除用户失败')
                    }

                }).catch(() => {
                    MessageBox({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        mounted() {
            this.getUserList()
        }
    }
</script>

<style scoped>

</style>
