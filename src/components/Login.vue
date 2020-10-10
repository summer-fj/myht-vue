<template>
  <div id="log">
    <!-- 
          model 绑定的数据
          rules  验证规则
          label-width表单域标签的宽度
    -->
    <el-form
      :model="user"
      status-icon
      :rules="rules"
      ref="ruleForm"
      
      class="demo-ruleForm"
    >
      <el-form-item prop="username">
        <h3>登录</h3>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model.number="user.username" placeholder="请输入用户名"></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input type="password" v-model="user.password" placeholder="请输入密码" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    ...mapActions(["userinfoAsyncAdd"]),
    submitForm(formName) {
      console.log(this)
      console.log(this.$store.state)
      console.log(this.$router)
      //   对整个表单进行校验的方法
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert("submit!");
          this.userinfoAsyncAdd(this.user).then((res) => {
            console.log(res);
            if (res.data.code == 200) {
              // 把token存储到sessionStorage
              sessionStorage.setItem("token", res.data.list.token);
              console.log(sessionStorage.getItem("token"))
              this.$router.push('/index')
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
  },
};
</script>
<style scoped>
body {
  background-color: rgb(75, 30, 75) !important;
}

#log{
width: 100%;
height: 100%;
background-color: rgb(174, 196, 183);
}

h3{
  font-weight: bold;
  font-size: 26px;
  margin-top: 30px;
}
.el-form.demo-ruleForm {
  width: 460px;
  height: 300px;
  text-align: center;
  line-height: 300px;
  background-color: white;
  border-radius: 10px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  
}

element.style {
  margin-left: 0px !important;
}
.el-form .el-form-item .el-input {
  margin: 0 auto;
  width: 300px;
}
.el-button {
  width: 300px;
}
</style>


