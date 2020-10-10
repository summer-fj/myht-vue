<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/member' }">会员列表</el-breadcrumb-item>
      <el-breadcrumb-item>会员修改</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form
      :model="info"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="手机号" prop="phone">
          <el-input v-model="info.phone"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="info.nickname"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <!-- <el-input v-model="info.password" type="password"></el-input> -->
        <el-input v-model="info.password"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="info.status"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        nickname: "",
        role: "",
        password: "",
        status: true,
      },
      rules: {
        nickname: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert("submit!");

          // json序列化，防止数据变化，上面的数据跟着变化
          let data = JSON.parse(JSON.stringify(this.info));
          // console.log(data)
          data.status = data.status ? 1 : 2
        
          // 发送请求
          this.$axios.post(this.$api.membereditUrl, data).then((res) => {
            if (res.data.code == 200) {
              console.log(res);
              this.$router.push('/member');
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
  },
  created(){
    let uid = this.$route.params.uid
    if(uid){
      this.$axios.get(this.$api.memberinfoUrl, {
        params:{uid}
      }).then(res=>{
        this.info = res.data.list
        this.info.status = this.info.status==1? true:false
      })
    }
  }
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
