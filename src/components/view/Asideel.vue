<template>
  <!-- router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
  <el-col>
    <el-menu
      :default-active="defaultActive"
      router
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="/index">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu :index="item.id.toString()" v-for="item in getuserinfo.menus" :key="item.id">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{item.title}}</span>
        </template>
        <el-menu-item :index="val.url" v-for="val in item.children" :key="val.id">{{val.title}}</el-menu-item>
      </el-submenu>
      <!-- <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-s-goods"></i>
          <span>商城管理</span>
        </template>
        <router-link to="/category">
          <el-menu-item index="2-1">商品分类</el-menu-item>
        </router-link>
        <router-link to="/specs">
          <el-menu-item index="2-2">商品规格</el-menu-item>
        </router-link>
      </el-submenu>-->
    </el-menu>
  </el-col>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      defaultActive: "",
    };
  },
  computed: {
    ...mapGetters(["getuserinfo"]),
  },
  mounted() {
    // console.log(this.$route);
    this.defaultActive = this.$route.meta.select;
  },
};
</script>
<style scoped>
.el-submenu .el-menu-item {
  height: 50px;
  line-height: 50px;
  padding: 0 45px;
  min-width: 150px;
}
a {
  color: #fff;
  text-decoration: none;
}
</style>