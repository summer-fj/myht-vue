<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/role' }">角色列表</el-breadcrumb-item>
      <el-breadcrumb-item>角色{{tip}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :model="info" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="rolename">
        <el-input v-model="info.rolename"></el-input>
      </el-form-item>
      <el-form-item label="角色权限">
        <!-- 多选框 -->
        <!-- default-checked-keys	默认勾选的节点的 key 的数组 -->
        <el-tree
            :data="menus"
            show-checkbox
            ref="tree"
            node-key="id"
            default-expand-all
            :default-checked-keys="defaultkeys"
            :props="defaultProps">
        </el-tree> 
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-switch v-model="info.status"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">{{tip}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tip: "添加",
      info: {
        rolename: "",
        menus: "",
        status: true,
      },
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 1, max: 20, message: "角色名称长度不符合", trigger: "blur" },
        ],
      },

      //多选框数据
      menus:[], // 多选框数据
      defaultkeys:[],
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  computed: {
    ...mapGetters(['getmenulist']),
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert("submit!");

          // json序列化，防止数据变化，上面的数据跟着变化
          let data = JSON.parse(JSON.stringify(this.info));
          // 默认url为添加
          let url = this.$api.roleaddUrl;
          // 如果能获取到id ，url的值变为修改
          if (this.$route.params.id) {
            url = this.$api.roleeditUrl;
            data.id = Number(this.$route.params.id);
          }
          data.status = data.status ? 1 : 2;

          //  this.$refs.tree.getCheckedKeys()  //获取选中的tree的值  得到的是数组
          // 数据库中存储的是字符串
          data.menus = this.$refs.tree.getCheckedKeys()
            ? this.$refs.tree.getCheckedKeys().join(",")
            : "";
          // console.log(this.$refs.tree.getCheckedKeys(), 111);
          // console.log(data);

          // 发送请求
          this.$axios.post(url, data).then((res) => {
            if (res.data.code == 200) {
              // console.log(res);
              this.$router.push('/role');
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
  },
  created() {
    this.menus = this.getmenulist;
    // 页面刷新 需要数据
    let roleid = this.$route.params.id;
    // console.log(roleid);
    if (roleid) {
      this.tip = "修改";
      // 根据id获取id对应的该条数据 赋值给info
      this.$axios
        .get(this.$api.roleinfoUrl, {
          params: { id: this.$route.params.id },
        })
        .then((res) => {
          this.info = res.data.list;
          // 修改status的值为true或false
          this.info.status = this.info.status == 1 ? true : false;
          // 给选中的tree赋值
          this.defaultkeys = this.info.menus ? this.info.menus.split(",") : [];
        });
    }
  },
};
</script>
<style scoped>
.el-form.demo-ruleForm {
  margin-top: 30px;
}
.el-input {
  width: 60%;
}
</style>