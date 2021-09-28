<template>
  <div> 用户列表
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    {{ruleForm}}
    <!--用户列表主题部分-->
    <el-card>
      <!-- 搜索区域-->
      <!-- :gutter 间隙属性-->
      <el-row :gutter="25">
        <el-col :span="10">
          <el-input v-model="QueryInfo.query" aria-placeholder="请输入搜索内容" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 搜索按钮  -->
          <el-button type="primary" @click="addDialogVisible = true,selectUserList(null)" >添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" border>
        <el-table-column type="index"></el-table-column> <!-- 索引列-->
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="state" label="状态">
          <!-- 作用域插槽 scope.row存储了当前行的信息 -->
         <template slot-scope="scope">
            <el-switch v-model="scope.row.state" active-text="有效" inactive-text="无效" @change="stateclick(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <el-tooltip placement="top" content="修改" effect="dark" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"  @click="addDialogVisible = true,selectUserList(scope.row.id)"></el-button>
              </el-tooltip>
                <el-tooltip placement="top" content="删除" effect="dark" >
              <el-button type="danger" icon="el-icon-delete" size="mini" :enterable="false" @click="deleteUserid(scope.row.id)"></el-button>
                </el-tooltip>
              <!-- 文字提示 -->
              <el-tooltip placement="top" content="分配权限" effect="dark" >
              <el-button type="warning" icon="el-icon-star-off" size="mini" :enterable="false"></el-button>
              </el-tooltip>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页插件 -->
      <div>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="QueryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </el-card>



    <!-- 新增用户区域 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%">
      <el-form :model="ruleForm" :rules="ruleRules" ref="ruleForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDialogVisible=false,ruleForm={}">取消</el-button>
          <el-button type="primary" @click="addUserList">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserList",
  data(){

    return{
      QueryInfo:{
        query:'', //搜索栏
        pageNum:1, //当前页
        pageSize:5 //每页个数
      },
      userList:[],
      total:0,
      addDialogVisible: false,
      ruleForm:{
      },
      //验证对象
      ruleRules:{
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
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  created(){
    this.getUserList();
    },
  methods:{
    handleSizeChange(val) {
      this.QueryInfo.pageSize = val;
      this.getUserList();

    },
    handleCurrentChange(val) {
      this.QueryInfo.pageNum = val;
      this.getUserList();
    },
    //修改状态
    async stateclick(userList){
      await this.$http.post("user/updateUserList",userList);
      this.$message.success("修改成功")
    },

    //获取所有用户
    async getUserList(){
      console.log(this.QueryInfo)
        const{data:res} = await this.$http.post("user/getUserList",this.QueryInfo);//访问后台
        this.userList=res.data;
        this.total = res.numbars;
      },

    async selectUserList(id){
      if(id!=null){
        const{data:res} = await this.$http.get("user/updateruleForm?id="+id)
        this.ruleForm = res;
      }else{
        this.ruleForm={};
      }
    },

    //删除用户列表
    async deleteUserid(id){
      const{data:res} = await this.$http.get("user/deleteUserid?id="+id);
      if(res.flag="删除成功"){
        this.$message.success(res.flag)
        this.getUserList();
      }
    },

    //新增用户
    async addUserList(){
      if(this.ruleForm.id == undefined){
        //1、验证校验规则
        this.$refs.ruleForm.validate(async valid =>{
         if(!valid) return;
         const{data:res} = await this.$http.post("user/insertUsername",this.ruleForm);
         if(res.flag="添加成功"){
            this.$message.success(res.flag)
            this.ruleForm={};
            this.addDialogVisible=false
            this.getUserList();
          }
       })
      }else{
        //1、验证校验规则
        this.$refs.ruleForm.validate(async valid =>{
          if(!valid) return;
          const{data:res} = await this.$http.post("user/updateUsername",this.ruleForm);
          if(res.flag="修改成功"){
            this.$message.success(res.flag)
            this.ruleForm={};
            this.addDialogVisible=false
            this.getUserList();
          }
        })
      }

    }

  }
}
</script>

<style lang="less" scoped>
 .el-breadcrumb{
   margin-bottom: 15px;
   font-size: 17px;
 }
 .el-table .warning-row {
   background: oldlace;
 }

 .el-table .success-row {
   background: #f0f9eb;
 }
</style>