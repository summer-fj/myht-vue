<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table
      :data="member"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="id" label="用户编号" width="120"></el-table-column>
      <el-table-column prop="nickname" label="昵称" ></el-table-column>
      <el-table-column prop="phone" label="手机号" ></el-table-column>
      <el-table-column prop="status" label="状态" >
         <template slot-scope="item">
          <el-button type="primary" v-if="item.row.status==1"  size="mini">启用</el-button>
        <el-button type="danger" v-else size="mini">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" >
        <!-- 插槽 -->
        <template slot-scope="item">
          <el-button type="primary" size="small" @click="edit(item.row.uid)">编辑</el-button>
        </template>
      </el-table-column>
     
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      member:[],
      tableData1: [
        // {
        //   id: 1,
        //   num: "1",
        //   name: "小星",
        //   phone: "15078302843",
        // },
        // {
        //   id: 2,
        //   num: "2",    
        //   name: "小张",
        //   phone: "14453423323",
        // },
      ],
    };
  },
  methods: {
    // 跳转到编辑页面
    edit(uid){
      this.$router.push('/member/'+uid )
    },
  },
  created(){
    this.$axios.get(this.$api.memberlistUrl).then(res=>{
      // console.log(res);
      this.member = res.data.list
    })
  }
};
</script>

<style scoped>
.el-table{
    margin-top: 30px;
}
</style>