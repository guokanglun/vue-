<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form class="login_form" :model="loginForm" :rules="loginRules" ref="validForm">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-connection" type="password" v-model="loginForm.password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" disabled>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import { Form , FormItem,  Input, Icon, Message} from 'element-ui';
    export default {
        data(){
          return{
              // 登录表单数据
              loginForm: {
                  username:'admin',
                  password: '123456'
              },
              // 登录校验
              loginRules:{
                  username:[
                      { required: true, message: '请输用户名', trigger: 'blur' },
                      { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                  ],
                  password:[
                      { required: true, message: '请输入密码', trigger: 'blur' },
                      { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
                  ]
              }
          }
        },
        methods:{
           login(){
              // 验证表单数据是否合法
              this.$refs.validForm.validate(async (valid)=>{
                  if(valid){
                      // 如果验证成功，通过axios请求后台登录接口，获取响应数据
                      const result = await this.$http.post('login', this.loginForm);
                      // console.log(result.data);
                      if(result.data.meta.status === 200) {

                          Message.success('登录成功');
                          // 将token保存到当前会话
                          window.sessionStorage.setItem('token', result.data.data.token);
                          // 登录成功访问首页
                          this.$router.push('/home')
                      }else{
                          Message.error('登录失败');
                      }
                  }
              })
          }
        },
        components:{
            Form, FormItem, Input, Icon
        }

    }
</script>

<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        top:0;
        bottom: 0;
        left:0;
        right:0;
        margin: auto;

        .avatar_box {
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }
</style>
