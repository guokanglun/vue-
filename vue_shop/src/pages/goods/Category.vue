
<template lang="html">
    <div id="example">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-button type="primary"  @click="openCategory"> 添加分类 </el-button>
            <zk-table
                    ref="table"
                    index-text="#"
                    :data="categoryList"
                    :columns="columns"
                    :stripe="props.stripe"
                    :border="props.border"
                    :show-header="props.showHeader"
                    :show-summary="props.showSummary"
                    :show-row-hover="props.showRowHover"
                    :show-index="props.showIndex"
                    :tree-type="props.treeType"
                    :is-fold="props.isFold"
                    :expand-type="props.expandType"
                    :selection-type="props.selectionType">
                <template slot="effect" scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: blue"></i>
                    <i class="el-icon-error" v-else></i>
                </template>
                <template slot="order" scope="scope">
                    <el-tag size="mini" effect="dark" v-if="scope.row.cat_level==0"> 一级 </el-tag>
                    <el-tag size="mini"  effect="dark" type="success" v-else-if="scope.row.cat_level==1"> 二级 </el-tag>
                    <el-tag size="mini" effect="dark" type="warning" v-else> 三级 </el-tag>
                </template>
                <template slot="caozuo" scope="scope">
                    <el-button type="primary" size="small" @click="openUpdateCateDialog(scope.row)"> 编辑 </el-button>
                    <el-button type="danger"  size="small" @click="deleteCate(scope.row)"> 删除 </el-button>
                </template>
            </zk-table>

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5,10,15]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <el-dialog
                @close="closeDialog"
                title="添加商品分类"
                :visible.sync="dialogVisible"
                width="60%">

            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="ruleForm.cat_name"></el-input>
                </el-form-item>

                <el-form-item label="父级名称">
                    <el-cascader

                            v-model="selectedValue"
                            :options="parentList"
                            :props="{ expandTrigger: 'hover', value:'cat_id', label:'cat_name', children:'children', checkStrictly: true}"
                            @change="handleChange"
                            clearable
                    ></el-cascader>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCategory">确 定</el-button>
  </span>
        </el-dialog>

        <!--修改商品分类-->
        <el-dialog
                title="修改商品分类"
                :visible.sync="updateDialogVisible"
                width="60%">

            <el-form :model="updateRuleForm" :rules="rules" ref="updateRuleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="updateRuleForm.cat_name"></el-input>
                </el-form-item>


            </el-form>

            <span slot="footer" class="dialog-footer">
    <el-button @click="updateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateCategory">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import {Message, Button, Dialog, Cascader} from 'element-ui'
    export default {
        name: 'example',
        components:{
            Message, Button, Dialog, Cascader
        },
        data() {
            return {
                props: {
                    stripe: false,   // 是否显示间隔斑马纹
                    border: true,  // 是否显示纵向边框
                    showHeader: true,   // 是否显示表头
                    showSummary: false,  // 是否显示表尾合计行
                    showRowHover: true,   // 鼠标悬停时，是否高亮当前行
                    showIndex: true,  // 是否显示数据索引
                    treeType: true,   // 是否为树形表格
                    isFold: true,  // 树形表格中父级是否默认折叠
                    expandType: false,  // 是否为展开行类型表格（为 True 时，需要添加名称为 '$expand' 的作用域插槽, 它可以获取到 row, rowIndex)
                    selectionType: false,  // 是否为多选类型表格
                },
                selectedValue:[], // 选中项绑定值
                ruleForm: {
                    cat_name:'',
                },
                updateRuleForm: {
                    cat_id:'',
                    cat_name:'',
                },
                rules:{
                    cat_name:[
                        { required: true, message: '请输入分类名称', trigger: 'blur' }
                    ]
                },
                dialogVisible: false,
                updateDialogVisible: false,
                categoryList:[],
                columns: [
                    {
                        label: '分类名称',  // 列标题名称
                        prop: 'cat_name',  // 对应列内容的属性名
                    },
                    {
                        label: '是否有效',
                        prop: 'cat_deleted',
                        template: 'effect',
                        type: 'template',
                    },
                    {
                        label: '排序',
                        template: 'order',
                        type: 'template',
                        prop: 'cat_level',
                    },
                    {
                        label: '操作',
                        type: 'template',
                        template: 'caozuo',   // 	列类型为 'template'(自定义列模板) 时，对应的作用域插槽（它可以获取到 row, rowIndex, column, columnIndex）名称
                    },
                ],
                queryInfo:{
                    type:3,
                    pagenum:1,
                    pagesize:5
                },
                total:0,
                parentList:[], // 所有父节点名称
                addCateForm:{
                    cat_pid: 0,  // 分类父 ID
                    cat_name:'',   // 分类名称
                    cat_level:0 // 分类层级
                }, // 添加分类表单
            };
        },

        mounted() {
            this.getCategoryList()
        },
        methods:{
            async getCategoryList(){
                const {data} = await this.$http.get('categories', {params:this.queryInfo});
                // debugger
                if(data.meta.status !== 200){
                    Message.error('获取分类失败')
                }

                this.categoryList = data.data.result;

                this.total = data.data.total
            },

            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.queryInfo.pagesize  = val;
                this.getCategoryList()
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.queryInfo.pagenum = val;
                this.getCategoryList()
            },
            // 获取父级节点名称
            async getParentName(){
                const {data} = await this.$http.get('categories', {params:{type:2}});
                if(data.meta.status !== 200){
                    return Message.error('获取失败')
                }

                this.parentList = data.data;


            },
            // 选中节点发生变化时触发
            handleChange(){
                // console.log(this.selectedValue);
                // selectedValue length : 0 一级权限，1,二级权限，2 三级权限

                if(this.selectedValue.length===1){
                    return this.addCateForm = {
                        cat_pid: this.selectedValue[0],  // 分类父 ID
                        cat_name:this.ruleForm.cat_name,   // 分类名称
                        cat_level:1 // 分类层级
                    }
                }
                if(this.selectedValue.length===2){
                    return this.addCateForm = {
                        cat_pid: this.selectedValue[this.selectedValue.length-1],  // 分类父 ID
                        cat_name:this.ruleForm.cat_name,   // 分类名称
                        cat_level:2 // 分类层级
                    }
                }

            },
            // 打开添加分类对话框
            openCategory(){
                this.getParentName();
                this.dialogVisible = true
            },
            // 添加分类
            addCategory(){
                this.$refs.ruleForm.validate(async valid=>{
                    if(valid){
                        this.addCateForm.cat_name = this.ruleForm.cat_name;
                        // console.log(this.addCateForm)
                        const {data} = await this.$http.post('categories', this.addCateForm);
                        // debugger
                        if(data.meta.status !== 201){
                            return Message.error('添加分类失败')
                        }

                        Message.success('添加分类成功');
                        this.getCategoryList();
                        this.dialogVisible = false;
                    }
                });

            },

            // 关闭对话框
            closeDialog(){
                // 重置表单
                this.$refs.ruleForm.resetFields()
            },

            // 打开分类对话框
            openUpdateCateDialog(res){
                // console.log(res);
                this.updateRuleForm.cat_name = res.cat_name;
                this.updateRuleForm.cat_id = res.cat_id;
                // debugger
                this.updateDialogVisible = true;
            },
            // 修改分类
            async updateCategory(){

                const{data} = await this.$http.put('categories/'  + this.updateRuleForm.cat_id * 1, {cat_name:this.updateRuleForm.cat_name})
                // debugger
                if(data.meta.status !== 200){
                    return Message.error('更新失败')
                }

                Message.success('更新成功');
                this.getCategoryList();
                this.updateDialogVisible = false;
            },
            // 删除分类
            async deleteCate(res){
                const {data} = await this.$http.delete('categories/' + res.cat_id);
                if(data.meta.status == 200){
                    Message.success('删除成功')
                    this.getCategoryList();
                }else{
                    Message.error('删除失败')
                }
            }
        }
    }
</script>

<style scoped lang="less">
    * {
        margin: 0;
        padding: 0;
    }
    .switch-list {
        margin: 20px 0;
        list-style: none;
        overflow: hidden;
    }
    .switch-item {
        margin: 20px;
        float: left;
    }
    .zk-table{
        margin-top: 20px;
    }
</style>
