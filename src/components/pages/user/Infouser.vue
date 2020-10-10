<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user' }">管理员列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户{{tip}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form
      :model="info"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="所属角色" prop="roleid">
        <el-select v-model="info.roleid" placeholder="请选择">
          <!-- <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option> -->
          <el-option v-for="item in getrolelist" :key="item.id" :label="item.rolename" :value="item.id"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="info.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" hide-required-asterisk="false">
        <el-input v-model="info.password"></el-input>
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
import {mapGetters} from "vuex"
export default {
  data() {
    return {
      tip:"添加",
      info: {
        roleid: "",
        username: "",
        password: "",
        status: true,
      },
      rules: {
        username: [
          { required: true, message: "请输入管理员名称", trigger: "blur" },
        ],
        roleid: [{ required: true, message: "请选择角色", trigger: "change" }],
      },
    };
  },
  computed:{
    ...mapGetters(['getrolelist'])
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert("submit!");
          let data = JSON.parse(JSON.stringify(this.info));
          let url = this.$api.useraddUrl;
          if(this.$route.params.uid){
            url = this.$api.usereditUrl;
          }
          data.status = data.status? 1 : 2;

          this.$axios.post(url, data).then(res=>{
            console.log(res);
            if(res.data.code == 200){
               this.$router.push('/user')
            }else{
              this.$message.error(res.data.msg);
            }
          })
        }
      });
    },
  },
  created(){
    let useruid = this.$route.params.uid;
    if(useruid){
      this.tip = '修改';
      this.$axios.get(this.$api.userinfoUrl, {
        params:{
          uid: useruid
        }
      }).then(res=>{
        // console.log(res);
        this.info = res.data.list;
        this.info.status = this.info.status == 1? true:false;
      })
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
