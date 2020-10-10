<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" size="medium " class="addbtn" @click="add">添加</el-button>

    <el-table
      :data="users"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="id" label="用户编号" width="120"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="rolename" label="所属角色"></el-table-column>
      <el-table-column prop="status" label="状态">
        <el-button type="primary" size="mini">启用</el-button>
      </el-table-column>
      <el-table-column prop="operation" label="操作">
        <!-- 插槽 -->
        <template slot-scope="item">
          <el-button type="primary" size="small" @click="edit(item.row.uid)">编辑</el-button>
          <el-button type="danger" size="small" @click="del(item.row.uid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!-- 
      current-page： 当前页 
      current-change: 当前页数(currentPage) 改变时会触发
    -->
    <el-pagination
      background
      @current-change="pagechange"
      :current-page="nowpage"
      layout="prev, pager, next"
      :page-size="size"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      size: 3, // 每页显示条目数
      total: 0, // 总条目数
      nowpage: 1,
      users: [],
    };
  },
  methods: {
    pagechange(n) {
      //当前页数改变会被触发
      // alert(n);
      this.nowpage = n;
      this.getusers().then((res) => {
        if (res.data.code == 200) {
          this.users = res.data.list;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    getusers() {
      return this.$axios.get(this.$api.userlistUrl, {
        params: { size: this.size, page: this.nowpage },
      });
    },

    // 跳到添加页面
    add() {
      this.$router.push("/user/add");
    },
    // 跳转到编辑页面
    edit(uid) {
      this.$router.push("/user/" + uid);
    },
    // 删除
    del(uid) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          // 成功
          this.$axios.post(this.$api.userdeleteUrl, { uid }).then((res) => {
            if (res.data.code == 200) {
              this.users = res.data.list; // 更新页面上的数据
              this.$message({
                type: "success",
                message: "删除成功!",
              });

              this.total--;
              this.pagechange(1);

              // 自动刷新页面
              // window.location.reload();
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
    // 请求列表数据
    this.getusers().then((res) => {
      if (res.data.code == 200) {
        this.users = res.data.list;
      } else {
        this.$message.error(res.data.msg);
      }
    });

    // 获取管理员总数
    this.$axios.get(this.$api.usercountUrl).then((res) => {
      this.total = res.data.list[0].total;
    });
  },
};
</script>
<style scoped>
.el-button.el-button--primary.el-button--medium.addbtn {
  margin-top: 30px;
}
</style>