<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>规格列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" size="medium " class="addbtn" @click="add">添加</el-button>

    <el-table
      :data="specs"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="id" label="规格编号" width="120"></el-table-column>
      <el-table-column prop="specsname" label="规格名称" width="150"></el-table-column>
      <el-table-column prop="attrs" label="规格属性">
        <!-- 插槽 -->
        <template slot-scope="item">
          <el-button
            type="primary"
            size="small"
            v-for="(val, index) in item.row.attrs"
            :key="index"
          >{{val}}</el-button>
        </template>
        <!-- 下面这种写法没有作用 应该必须得用插槽-->
        <!-- <el-button type="primary" plain size="small" v-for="(item, index) in specs.attrs" :key="index">{{item}}</el-button> -->
        <!-- <el-button type="primary" plain  size="small"></el-button> -->
      </el-table-column>
      <el-table-column prop="status" label="状态" width="150">
        <el-button type="primary" size="mini">启用</el-button>
      </el-table-column>
      <el-table-column prop="operation" label="操作" width="300">
        <!-- 插槽 -->
        <template slot-scope="item">
          <el-button type="primary" size="small" @click="edit(item.row.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="del(item.row.id)">删除</el-button>
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
import { mapActions } from "vuex";
export default {
  data() {
    return {
      size: 1, // 每页显示条目数
      total: 0, // 总条目数
      nowpage: 1,
      specs: [],
    };
  },
  methods: {
    // ...mapActions(['specsAsyncAdd']),
    pagechange(n) {
      this.nowpage = n;
      this.getspecslist().then((res) => {
        if (res.data.code == 200) {
          this.specs = res.data.list;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    getspecslist() {
      return this.$axios.get(this.$api.specslistUrl, {
        params: {
          size: this.size,
          page: this.nowpage,
        },
      });
    },
    // 跳到添加页面
    add() {
      this.$router.push("/specs/add");
    },
    // 跳转到编辑页面
    edit(id) {
      this.$router.push("/specs/" + id);
    },
    // 删除
    del(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          // 成功
          this.$axios.post(this.$api.specsdeleteUrl, { id }).then((res) => {
            if (res.data.code == 200) {
              this.specs = res.data.list; // 更新页面上的数据
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              // 自动刷新页面
              // window.location.reload();
              this.total--;
              this.pagechange(1);
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
    // 获取总数
    this.$axios.get(this.$api.specscountUrl).then((res) => {
      this.total = res.data.list[0].total;
      // console.log(this.total);
    });
    // 获取列表
    this.getspecslist().then((res) => {
      if (res.data.code == 200) {
        this.specs = res.data.list;
      } else {
        this.$message.error(res.data.msg);
      }
    });
  },
};
</script>
<style scoped>
.el-button.el-button--primary.el-button--medium.addbtn {
  margin-top: 30px;
}
</style>