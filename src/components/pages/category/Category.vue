<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" size="medium " class="addbtn" @click="add">添加</el-button>

    <el-table
      :data="category"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="id" label="分类编号" width="100"></el-table-column>
      <el-table-column prop="catename" label="分类名称" width="220"></el-table-column>

      <!-- <el-table-column prop="img" label="图片">
<template slot-scope="item" v-if="item.row.img">
<img :src="api.baseUrl+item.row.img">
</template>
</el-table-column> -->

      <el-table-column prop="img" label="图片" >
        <template slot-scope="item" v-if="item.row.img">
         <img :src="$api.baseUrl + item.row.img" >
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="220">
        <el-button type="primary" size="small">启用</el-button>
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
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      category:[],
      tableData1: [{
      //     id: 1,
      //     num: "1",
      //     name: "家用电器",
      //     img: "",
      //     children: [
      //       {
      //         id: 11,
      //         num: "6",
      //         name: "电视",
      //         img: "",
      //       }
      //     ],
      }],
    };
  },
  methods: {
    ...mapActions(['cateAsyncAdd']),
    // 跳到添加页面
    add(){
      this.$router.push('/category/add')
    },
    // 跳转到编辑页面
    edit(id){
      this.$router.push('/category/'+id )
    },
    // 删除
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
          this.$axios.post(this.$api.catedeleteUrl, {id}).then((res) => {
            if (res.data.code == 200) {
              this.category = res.data.list; // 更新页面上的数据
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
  created(){
    this.cateAsyncAdd().then(res=>{
      // console.log(res);
      this.category = res.data.list;
    
    })
  }
};
</script>
<style scoped>
.el-button.el-button--primary.el-button--medium.addbtn{
    margin-top: 30px;
}
img{
  width: 100px;
  height: 100px;

}
</style>