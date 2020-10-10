<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" size="medium " class="addbtn" @click="add">添加</el-button>

    <el-table
      :data="roles"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="id" label="角色编号" width="120"></el-table-column>
      <el-table-column prop="rolename" label="角色名称" ></el-table-column>
      <el-table-column prop="status" label="状态" >
        <template slot-scope="item">
          <el-button type="primary" v-if="item.row.status==1"  size="mini">启用</el-button>
        <el-button type="danger" v-else size="mini">禁用</el-button>
        </template>
        
      </el-table-column>
     <el-table-column prop="operation" label="操作">
        <!-- 插槽 -->
        <template slot-scope="item">
          <el-button type="primary" size="small" @click="edit(item.row.id)">编辑</el-button>
        <el-button type="danger" size="small" @click="del(item.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {mapActions} from "vuex"
export default {
  data() {
    return {
      roles:[
      ],
      
    };
  },
  methods: {
    ...mapActions(['roleAsyncAdd']),
    // 跳到添加页面
    add(){
      this.$router.push('/role/add')
    },
    // 跳转到编辑页面
    edit(id){
      // id+=2;
      this.$router.push('/role/'+id)
    },
    // 删除
    del(id){
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          // 成功
          this.$axios.post(this.$api.roledeleteUrl, {id}).then((res) => {
            if (res.data.code == 200) {
              this.roles = res.data.list; // 更新页面上的数据
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    }
   
  },
  created(){
    // 返回promise实例   结果返回到这里
    this.roleAsyncAdd().then((res) => {
      // console.log(res.data.list, 111);
      this.roles = res.data.list;
      // console.log(this.roles)
    });
  }
};
</script>
<style scoped>
.el-button.el-button--primary.el-button--medium.addbtn{
    margin-top: 30px;
}
</style>