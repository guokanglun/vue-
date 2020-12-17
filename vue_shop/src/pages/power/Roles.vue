<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-button type="primary" @click="dialogVisible=true"> 添加角色 </el-button>
            <el-table
                    :data="roleList"
                    border
                    style="width: 100%">
                <el-table-column
                        type="expand"
                        width="50">
                    <template v-slot="scope">
                        <el-row v-for="(item,index) in scope.row.children"
                                style="margin: 7px; border-bottom: 1px solid #ccc; display: flex; align-items: center" :style="index===0?'border-top: 1px solid #ccc;':''">
                            <!-- 一级权限 -->
                            <el-col :span="6" >
                                <el-tag type="primary" closable  effect="dark" @close="deleteRoleRight(scope.row, item.id)"> {{ item.authName }} </el-tag>
                            </el-col>
                            <!-- 二三级权限 -->
                            <el-col :span="18" >
                                <el-row v-for="item2 in item.children">
                                    <el-col :span="6">
                                        <el-tag  closable effect="dark" type="sucess"
                                        style="margin: 5px" @close="deleteRoleRight(scope.row, item2.id)"

                                        > {{ item2.authName }} </el-tag>
                                    </el-col>
                                    <el-col :span="18">
                                        <span v-for="item3 in item2.children">
                                            <el-tag closable style="margin: 5px" @close="deleteRoleRight(scope.row, item3.id)"
                                                    effect="dark" type="warning"> {{ item3.authName }} </el-tag>
                                        </span>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
<!--                        <pre> {{ scope.row }} </pre>-->
                    </template>
                </el-table-column>
                <el-table-column
                        type="index"
                        label="#"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="roleName"
                        label="角色名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="roleDesc"
                        label="角色描述">
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template v-slot="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" circle @click="getUpdateRoleDialog(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" circle @click="deleteRole(scope.row.id)"></el-button>
                        </el-tooltip>

                        <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" circle @click="openDispathRights(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色 -->
        <el-dialog
                @close="clearDialog"
                title="添加角色"
                :visible.sync="dialogVisible"
                width="60%">

            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="ruleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="ruleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
        </el-dialog>

        <!-- 修改角色 -->
        <el-dialog
                title="修改角色"
                :visible.sync="updateDialogVisible"
                width="60%">

            <el-form :model="updateRuleForm" :rules="rules" ref="updateRuleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="updateRuleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="updateRuleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
    <el-button @click="updateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateRole">确 定</el-button>
  </span>
        </el-dialog>

        <!-- 分配权限 -->
        <el-dialog

                @close="closeDialog"
                title="分配权限"
                :visible.sync="dispatchRights"
                width="60%">

            <el-tree
                    ref="right"
                    default-expand-all
                    :data="rightsList"
                    show-checkbox
                    node-key="id"
                    :default-checked-keys="selectedRights"
                    :props="defaultProps">
            </el-tree>

            <span slot="footer" class="dialog-footer">
    <el-button @click="updateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import {Message, Dialog, MessageBox} from 'element-ui'
    export default {
        name: "Roles",
        components:{
            Message, Dialog,MessageBox
        },
        data(){
            return{
                roleList:[],  // 角色列表
                rightsList:[],  // 权限列表
                selectedRights:[],   // 默认选中的权限
                roleId:'',   // 角色id
                dialogVisible:false,
                updateDialogVisible:false,
                dispatchRights:false,
                defaultProps: {
                    children: 'children',
                    label: 'authName'
                },
                ruleForm: {
                    roleName:'',
                    roleDesc:''
                },
                updateRuleForm:{
                    id:'',
                    roleName:'',
                    roleDesc:''
                },  // 更新角色表单
                rules:{
                    roleName:[
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                    ],
                    roleDesc:[
                        { required: true, message: '请输入角色描述', trigger: 'blur' },
                    ]
                }
            }
        },
        mounted() {
            this.getRoleList();

        },
        methods:{
            // 获取角色列表
            async getRoleList(){
                const {data} = await this.$http.get('roles');
                // console.log(data)
                if(data.meta.status === 200){
                    // Message.success('获取角色成功');
                    this.roleList = data.data;
                    // console.log(this.roleList)
                }else{
                    Message.error('获取角色失败')
                }
            },
            clearDialog(){
                this.$refs.ruleForm.resetFields();
            },
            // 添加角色
            addRole(){
                this.$refs.ruleForm.validate(async (valid)=>{
                    if(valid){  // 表单预验证
                        const {data} = await this.$http.post('roles',  this.ruleForm);
                        if(data.meta.status === 201){
                            Message.success('角色添加成功');

                            this.dialogVisible = false;
                            this.getRoleList()
                        }else{
                            Message.error('角色添加失败')
                        }

                    }
                })
            },

            // 获取更新角色对话框
            getUpdateRoleDialog(data){
                this.updateDialogVisible = true;
                // console.log(data)
                const obj = {
                    id:data.id,
                    roleName:data.roleName,
                    roleDesc:data.roleDesc
                };
                this.updateRuleForm = obj;
            },
            // 修改角色
            async updateRole(){
                const {data} = await this.$http.put('roles/' + this.updateRuleForm.id,  this.updateRuleForm)
                if(data.meta.status === 200){
                    Message.success('修改角色成功');
                    this.updateDialogVisible = false;
                    this.getRoleList();
                }
            },
            //  删除角色
            deleteRole(id){
                // console.log(id)
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const {data}  = await this.$http.delete('roles/'  + id);
                    if(data.meta.status == 200){
                        Message.success('删除角色成功');
                        this.getRoleList();
                    }else{
                        Message.success('删除角色失败')
                    }

                }).catch(() => {
                    MessageBox({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 删除角色指定权限
            async deleteRoleRight(role, rightId){
                console.log(role.id, rightId);
                const {data} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
                if(data.meta.status !== 200){
                    return  Message.error('删除权限失败')
                }
                // 删除权限成功
                // this.getRoleList() //  会刷新页面，导致合并行关闭
                role.children = data.data;  // 将返回数据直接赋值给当前角色
            },

            // 打开分配权限列表
            async openDispathRights(role){
                this.roleId = role.id;
                // 获取权限
                const {data} = await this.$http.get('rights/tree');
                if(data.meta.status !== 200){
                    return Message.error('获取权限失败')
                }
                this.rightsList = data.data;

                this.getLeafKeys(role, this.selectedRights);

                this.dispatchRights = true
            },
            closeDialog(){
                // 关闭对话框是清空已选权限
                this.selectedRights = [];
            },
            // 递归获取所有三级权限
            getLeafKeys(node, arr){
                if(!node.children){
                    // 如果没有children属性，则为最后一层
                    return arr.push(node.id)
                }
                node.children.forEach(item=>{
                    this.getLeafKeys(item, arr)
                })
            },

            // 分配权限
            async allotRights(){
                const keys = [
                    ...this.$refs.right.getHalfCheckedKeys(),
                    ...this.$refs.right.getCheckedKeys(),
                ];
                // console.log(keys); // [101, 104, 105, 116, 117, 150]
                const rids = keys.join(',');
                const {data} = await this.$http.post(`roles/${this.roleId}/rights`, {rids});
                if(data.meta.status !== 200){
                    return Message.error('分配权限失败')
                }
                Message.success('分配权限成功');
                this.getRoleList();
                this.dispatchRights = false;
            }
        }
    }
</script>

<style scoped>

</style>
