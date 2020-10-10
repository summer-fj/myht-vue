<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" size="medium " class="addbtn" @click="add">添加</el-button>

    <el-table
      :data="menus"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="id" label="菜单编号" width="100"></el-table-column>
      <el-table-column prop="title" label="菜单名称" width="220"></el-table-column>
      <el-table-column prop="icon" label="菜单图标" width="220"></el-table-column>
      <el-table-column prop="url" label="菜单地址" width="220"></el-table-column>
      <el-table-column prop="status" label="状态" width="220">
        <el-button type="primary" size="mini">启用</el-button>
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
import { mapActions } from "vuex";
export default {
  data() {
    return {
      menus: [],
    };
  },
  methods: {
    ...mapActions(["menuAsyncAdd"]),
    // 跳到添加页面
    add() {
      this.$router.push("/menu/add");
    },
    // 跳到编辑页面
    edit(id) {
      this.$router.push("/menu/" + id);
    },
    del(id) {
      //删除
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          // 成功
          this.$axios.post(this.$api.menudeleteUrl, {id}).then((res) => {
            console.log(res);
            if (res.data.code == 200) {
              console.log(res.data);
              this.menus = res.data.list; // 更新页面上的数据
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
    },
  },
  created() {
    // 返回promise实例   结果返回到这里
    this.menuAsyncAdd().then((res) => {
      // console.log(res.data.list, 111);
      this.menus = res.data.list;
    });
  },
};
</script>
<style scoped>
.el-button.el-button--primary.el-button--medium.addbtn {
  margin-top: 30px;
}
</style>