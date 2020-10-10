<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/banner' }">商品分类</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图{{tip}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form
      :model="info"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="info.title"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="img">
        <!-- 上传图片模块 -->
       <el-upload
          action="#"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :auto-upload="false"
          :on-change="filechange"
          :file-list="fileList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
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
      tip:'添加',
      fileList:[],
      img:"", //图片
      info: {
        title: "",
        status: true,
      },
      rules: {
        title: [{ required: true, message: "请输入轮播图名称", trigger: "blur" }]
      },

      //上传图片数据
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  methods: {
    //   提交表单方法
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          // json序列化，防止数据变化，上面的数据跟着变化
          let data = JSON.parse(JSON.stringify(this.info));
          // 默认url为添加
          let url = this.$api.banneraddUrl;
          // 如果能获取到id ，url的值变为修改
          if (this.$route.params.id) {
            url = this.$api.bannereditUrl;
            data.id = Number(this.$route.params.id);
          }
          console.log(data);
          data.status = data.status ? 1 : 2;

          // 获取图片
          // FormData将本地数据(图片, xlsx,.docx)上传或导入数据库
          // FormData可以把所有表单元素的name与value组成一个string提交到后台
          let from = new FormData();
          for(let i in data){
            from.append(i, data[i])
          }
          if(this.img){
            from.append('img', this.img);
          }

          this.$axios.post(url, from).then(res=>{
             if (res.data.code == 200) {
              // console.log(res);
              this.$router.push('/banner');
            } else {
              this.$message.error(res.data.msg);
            }
          })



          // for(let i in data){
          //   form.append(i, data[i])
          // }
          // if(this.img){
          //   form.append('img', this.img)
          // }
          // // console.log(form);

          // // 发送请求
          // this.$axios.post(url, form).then((res) => {
          //   if (res.data.code == 200) {
          //     console.log(res);
          //     // this.$router.push('/category');
          //   } else {
          //     this.$message.error(res.data.msg);
          //   }
          // });
        } 
      });
    },

    // 上传图片模块方法
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    filechange(file){
      console.log(file);
      this.img = file.raw;
    }
  },
  created(){
    let id = this.$route.params.id;
    if(id){
      this.tip="修改",
      // 根据id获取id对应的该条数据 赋值给info
      this.$axios.get(this.$api.bannerinfoUrl, {
        params:{id}
      }).then(res=>{
        console.log(res);
        this.info = res.data.list;

        // 把img转化为filelist虚需要的格式
        this.fileList = this.info.img? [{url:this.$api.baseUrl+this.info.img}]:[];
        this.info.status = this.info.status? true:false

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
