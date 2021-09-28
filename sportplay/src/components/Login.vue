<template>
    <div class="login_container">
        <!-- 登录块 -->
        <div class="login_box">
            <!--头像-->
            <div class="avatar_box">
                <img src="../assets/logo.png"/>
            </div>
            <!-- 表单区域 -->
            <el-form ref="loginFormRef" :rules="loginRules" :model="loginForm" label-width="0" class="login_form">
                <!--用户名-->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-yonghuming"  placeholder="输入用户名"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-mima" placeholder="密码"></el-input>
                </el-form-item>
                <!--按钮-->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login()">提交</el-button>
                    <el-button type="info" @click="resetLoginFrom()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return{
              //表单数据
                loginForm:{
                    username:"",
                    password:""
                },
              //验证对象
              loginRules:{
                /**
                 * required:是否必填
                 * message：提示用户信息
                 * trigger：触发时间
                 */
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                  ],
                  password: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
                  ]
              }

            }
        },
        methods:{
          //重置表单内容
          resetLoginFrom(){
            this.$refs.loginFormRef.resetFields();
          },
          //登录方法
          login(){
            //1、验证校验规则
            this.$refs.loginFormRef.validate(async valid =>{
              if(!valid) return;//校验失败
              const{data:res} = await this.$http.post("login",this.loginForm);//访问后台
              if(res != "" ){
                this.$message.success("操作成功！！！");//信息提示
                window.sessionStorage.setItem("user",res.username);//存储user对象
                this.$router.push({path:"/home"});//页面路由跳转
             }else {
               this.$message.error("操作失败！！！");//错误提示
               this.$refs.loginFormRef.resetFields();
                return;
             }
            });
          },
        },
        mounted() {
          let that = this
          document.onkeydown=function (e) {
            if (e.keyCode == 13){
              if(that.$route.path == '/' || that.$route.path =='/login'){
                that.login();
              }
            }

          }
        }

    }
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  .avatar_box{
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 5px;
    box-shadow: 0 0 2px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #0ee;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
  .login_form{
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;

  }
}

</style>