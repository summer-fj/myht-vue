<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>秒杀列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" size="medium " class="addbtn" @click="add">添加</el-button>

    <el-table
      :data="seckill"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="title" label="活动名称" width="200"></el-table-column>
      <el-table-column prop="status" label="状态" width="220">
        <el-button type="success" size="small">启用</el-button>
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
export default {
  data() {
    return {
      seckill: []
    };
  },
  methods: {
    // 跳到添加页面
    add() {
      this.$router.push("/seckill/add");
    },
    // 跳转到编辑页面
    edit(id) {
      this.$router.push("/seckill/"+id);
    },
    del(id){
      //删除
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          // 成功
          this.$axios.post(this.$api.seckdeleteUrl, {id}).then((res) => {
            console.log(res);
            if (res.data.code == 200) {
              console.log(res.data);
              this.seckill = res.data.list; // 更新页面上的数据
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
    this.$axios.get(this.$api.secklistUrl).then(res=>{
      console.log(res);
      this.seckill = res.data.list
    })
  }
};
</script>
<style scoped>
.el-table{
margin-top: 30px;
}
.el-button.el-button--primary.el-button--medium.addbtn {
  margin-top: 30px;
}
</style>