<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/category' }">商品分类</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类{{tip}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form
      :model="info"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="上级分类" prop="pid">
        <el-select v-model="info.pid" placeholder="请选择">
          <el-option label="顶级分类" :value="0"></el-option>
          <el-option :label="item.catename" v-for="item in getcatelist" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类名称" prop="catename">
        <el-input v-model="info.catename"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="img" >
        <!-- 上传图片模块 -->
        <!-- 
          action	必选参数，上传的地址
          auto-upload 是否在选取文件后立即进行上传
          on-change	文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
          上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
         -->
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
        <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      tip:'添加',
      fileList:[],
      img:"", //图片
      info: {
        pid: "",
        catename: "",
        status: true,
      },
      rules: {
        catename: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ],
        pid: [
          { required: true, message: "请选择上级分类", trigger: "change" },
        ],
      },
      //上传图片数据
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  computed:{
    ...mapGetters(['getcatelist']),
  },
  methods: {
    
    //   提交表单方法
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          // json序列化，防止数据变化，上面的数据跟着变化
          let data = JSON.parse(JSON.stringify(this.info));
          // 默认url为添加
          let url = this.$api.cateaddUrl;
          // 如果能获取到id ，url的值变为修改
          if (this.$route.params.id) {
            url = this.$api.cateeditUrl;
            data.id = Number(this.$route.params.id);
          }
          data.status = data.status ? 1 : 2;

          // 获取图片
          // FormData将本地数据(图片, xlsx,.docx)上传或导入数据库
          // FormData可以把所有表单元素的name与value组成一个string提交到后台
          let form = new FormData();
          for(let i in data){
            form.append(i, data[i])
          }
          if(this.img){
            form.append('img', this.img)
          }
          // console.log(form);

          // 发送请求
          this.$axios.post(url, form).then((res) => {
            if (res.data.code == 200) {
              console.log(res);
              // this.$router.push('/category');
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } 
      });
    },

    // 上传图片模块方法
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    filechange(file){
      // console.log(file)
      this.img = file.raw;
    },
  },
  created(){
    let cateid = this.$route.params.id;
    // console.log(cateid);
    if(cateid){
      this.tip="修改",
      // 根据id获取id对应的该条数据 赋值给info
      this.$axios.get(this.$api.cateinfoUrl, {
        params:{id: cateid}
      }).then(res=>{
        console.log(res);
        this.info = res.data.list;
        // console.log(this.info)
        // 把img转化为filelist需要的格式
        this.fileList = this.info.img? [{url: this.$api.baseUrl+this.info.img}] : [];
        this.info.status = this.info.status == 1? true : false
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
