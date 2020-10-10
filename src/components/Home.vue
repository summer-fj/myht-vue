<template>
  <el-container>
    <el-aside width="150px">
      <Asideel></Asideel>
    </el-aside>
    <el-container>
      <el-header>
        <!-- 退出 -->
        <el-dropdown   @command="loginout">
          <span class="el-dropdown-link">
            {{getuserinfo.username}}
            <i class="el-icon-arrow-down el-icon-setting"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Asideel from "./view/Asideel";
import {mapGetters, mapActions} from 'vuex'
export default {
  components: {
    Asideel,
  },
  computed:{
    ...mapGetters(['getuserinfo'])
  },
  methods:{
    ...mapActions(['loginOutSync']),
    loginout(){
      console.log(66666)
      this.loginOutSync();
      this.$router.push('/login')
    }
  }
};
</script>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #444;
  color: #ffffff;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
.el-header{
  text-align: right;
}
html > body > .app > .el-container {
  height: 100%;
}
</style>