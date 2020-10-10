<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/specs' }">规格列表</el-breadcrumb-item>
      <el-breadcrumb-item>规格{{tip}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :model="info" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="规格名称" prop="specsname">
        <el-input v-model="info.specsname"></el-input>
      </el-form-item>

      <!-- 新增规格属性 -->
      <el-form-item v-for="(item,index) in specsarr" :key="index" label="商品规格">
        <el-input v-model="item.value"></el-input>
        <el-button @click="addspecs" type="primary" v-if="index==0">新增规格属性</el-button>
        <el-button v-else @click.prevent="removeDomain(index)">删除</el-button>
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
export default {
  data() {
    return {
      tip: "添加",
      specsarr: [{ value: "" }],
      info: {
        specsname: "",
        status: true,
      },
      rules: {
        specsname: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 新增规格属性
    addspecs() {
      if (this.specsarr.length <= 5) {
        this.specsarr.push({ value: "" });
      }
    },
    removeDomain(index) {
      this.specsarr.splice(index, 1);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert("submit!");

           // json序列化，防止数据变化，上面的数据跟着变化
          let data = JSON.parse(JSON.stringify(this.info));
          // 默认url为添加
          let url = this.$api.specsaddUrl;
          // 如果能获取到id ，url的值变为修改
          if (this.$route.params.id) {
            url = this.$api.specseditUrl;
            data.id = Number(this.$route.params.id);
          }
          data.status = data.status ? 1 : 2;

          // console.log(this.specsarr);
          let arr = [];
          this.specsarr.forEach(item=>{
            arr.push(item.value);
          })
          // console.log(arr);
          data.attrs = arr? arr.join(','):'';
          // 发送请求
          this.$axios.post(url, data).then((res) => {
            if (res.data.code == 200) {
              this.$router.push('/specs');
            } else {
              this.$message.error(res.data.msg);
            }
          })
        }
      });
    },
  },
  created() {
    let id = this.$route.params.id;
    if(id){
      this.tip="修改";
      this.$axios.get(this.$api.specsinfoUrl, {
        params: { id },
      })
      .then((res) => {
        // console.log(res);
        this.info = res.data.list[0];
        this.info.status = this.info.status==1?true:false;
        this.info.attrs.map((b, i) => {
          if (i == 0) {
            this.specsarr[0].value = b;
          } else {
            this.specsarr.push({ value: b });
          }
        });
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
