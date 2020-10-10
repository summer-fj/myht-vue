<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" size="medium " class="addbtn" @click="add">添加</el-button>

    <el-table
      :data="goods"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="id" label="商品编号" width="100"></el-table-column>
      <el-table-column prop="goodsname" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="商品价格"></el-table-column>
      <el-table-column prop="market_price" label="市场价格"></el-table-column>
      <el-table-column prop="img" label="图片">
        <template slot-scope="item" v-if="item.row.img">
          <img :src="$api.baseUrl + item.row.img" />
        </template>
      </el-table-column>
      <el-table-column prop="isnew" label="是否新品">
        <template slot-scope="item">
          <el-button type="primary" size="mini" v-if="item.row.isnew==1">是</el-button>
          <el-button type="danger" size="mini" v-else>否</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="ishot" label="是否热卖">
        <template slot-scope="item">
          <el-button type="primary" size="mini" v-if="item.row.ishot==1">是</el-button>
          <el-button type="danger" size="mini" v-else>否</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <el-button type="primary" size="mini">启用</el-button>
      </el-table-column>
      <el-table-column prop="operation" label="操作" width="200">
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
export default {
  data() {
    return {
      size: 2, // 每页显示条目数
      total: 0, // 总条目数
      nowpage: 1,
      goods: [],
      tableData1: [
        {
          id: 1,
          num: "1",
          name: "小米10",
          proprice: "3999",
          socprice: "3999",
        },
        {
          id: 2,
          num: "2",
          name: "联想小新",
          proprice: "4599",
          socprice: "4899",
        },
      ],
    };
  },
  methods: {
    pagechange(n) {
      this.nowpage = n;
      this.getgoodslist().then((res) => {
        if (res.data.code == 200) {
          this.goods = res.data.list;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    // 获取商品列表请求函数
    getgoodslist() {
      return this.$axios.get(this.$api.goodslistUrl, {
        params: {
          size: this.size,
          page: this.nowpage,
        },
      });
    },
    // 跳到添加页面
    add() {
      this.$router.push("/goods/add");
    },
    // 编辑
    edit(id) {
      this.$router.push("/goods/" + id);
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
          this.$axios.post(this.$api.goodsdeleteUrl, {id}).then((res) => {
            console.log(res);
            if (res.data.code == 200) {
              console.log(res.data);
              this.goods = res.data.list; // 更新页面上的数据
              this.$message({
                type: "success",
                message: "删除成功!",
              });
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
    }
  },
  created() {
    // 获取总数
    this.$axios.get(this.$api.goodscountUrl).then((res) => {
      this.total = res.data.list[0].total;
      console.log(this.total);
    });
    // 获取商品列表
    this.getgoodslist().then((res) => {
        console.log(res);
        this.goods = res.data.list;
      });
  },
};
</script>
<style scoped>
.el-button.el-button--primary.el-button--medium.addbtn {
  margin-top: 30px;
}
img {
  width: 100px;
}
</style>