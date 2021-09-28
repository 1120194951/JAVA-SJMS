<template>
  <!--  引入container布局-->
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt=""/>
        <span>个人运动平台</span>
      </div>

      <el-button type="info" @click="logout">安全退出</el-button>
    </el-header>
    <!-- 主体-->
    <el-container>
      <!-- 侧边栏-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapase">||||</div>
         <!-- 当内容多的时候在el-menu标签添加 unique-opened 属性 -->
          <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409eff"
                   unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true"
                    :default-active="activePath">
            <!-- 一级菜单-->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.title}}</span>
              </template>
              <!-- 二级菜单-->
              <el-menu-item :index="sitem.path" v-for="sitem in item.sList" :key="sitem.id" @click="saveNavState(sitem.path)">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{sitem.title}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
      </el-aside>
      <!-- 内容-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  //页面初始加载事件
  data(){
    return {
      //菜单列表
      menuList:[],
      isCollapse:false,//伸缩属性
      activePath:"/Welcome" //默认路径
    }
  },
  created() {
    //查询menuList
    this.getmenuList();
    this.activePath = window.sessionStorage.getItem("saveState");//去出session里的Path,动态修改activePath
  },
  name: "Home",
  methods: {
    logout() {
      this.$message.success("安全退出！！！");
      window.sessionStorage.clear() //清理sessionStorage缓存
      this.$router.push("/");
    },
    //获取导航菜单方法
    async getmenuList(){
      const{data:res} = await this.$http.get("Manu/getAllMenus");//访问后台
      if(res.flag != 200){
        this.$message.error("获取页面失败！！！")
        return
      }
      console.log(res)
      this.menuList = res.manus;
    },
    //控制伸缩
    toggleCollapase(){
      this.isCollapse = !this.isCollapse
    },
    //保存路径
    saveNavState(saveState){
      window.sessionStorage.setItem('saveState',saveState);//保存
      this.activePath = saveState;


    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

//头样式
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between; //左右贴边
  padding-left: 0%; //左边界
  align-items: center;
  color: #fff;
  font-size: 20px;

  div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }

}

.el-aside {
  background-color: #333744;
  .em-menu{
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

img {
  width: 55px;
  height: 55px;
}
.toggle-button{
  background-color: #00eeee;
  font-size:10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;//显示小于


}
</style>