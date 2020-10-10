<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理{{tip}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :model="info" :rules="rules" ref="ruleForm" label-width="100px" class="demo-info">
      <el-form-item label="一级分类" prop="first_cateid">
        <el-select v-model="info.first_cateid" placeholder="请选择" @change="catechange">
          <el-option label="请选择" value></el-option>
          <el-option
            v-for="item in firstcatearr"
            :key="item.id"
            :label="item.catename"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" prop="second_cateid">
        <el-select v-model="info.second_cateid" placeholder="请选择">
          <el-option label="请选择" value></el-option>
          <el-option
            v-for="item in secondcatearr"
            :key="item.id"
            :label="item.catename"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsname">
        <el-input v-model="info.goodsname"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="info.price"></el-input>
      </el-form-item>
      <el-form-item label="市场价格">
        <el-input v-model="info.market_price"></el-input>
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

      <el-form-item label="商品规格">
        <el-select v-model="info.specsid" placeholder="请选择" @change="specschange">
          <el-option label="请选择" value></el-option>
          <el-option
            v-for="item in specsarr"
            :key="item.id"
            :label="item.specsname"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>


       <el-form-item label="规格属性" >
        <el-select v-model="info.specsattr" placeholder="请选择" multiple>
          <el-option label="请选择" value></el-option>
          <el-option
            v-for="(item,index) in specsattrarr"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="是否新品">
        <el-radio-group v-model="info.isnew">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否热卖">
        <el-radio-group v-model="info.ishot">
          <el-radio :label="1" >是</el-radio>
          <el-radio :label="2" >否</el-radio>
          <!-- <el-radio :flag="1" >是</el-radio>
          <el-radio :flag="2" >否</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="info.status"></el-switch>
      </el-form-item>
      <el-form-item label="活动形式">
        <div id="desc"></div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">{{tip}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import E from 'wangeditor'
export default {
  data() {
    return {
      tip:'添加',
      editor:null, //文本
      fileList:[], //图片数组
      img: "",
      firstcatearr: [], //一级分类数组
      secondcatearr: [], //二级分类数组
      specsarr: [], //商品规格
      specsattrarr: [], //规格属性
      info: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        specsid:  "", //规格
        specsattr:[],
        status: true,
        isnew: 1,
        ishot: 1,
        description: "",
      },
      rules: {
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        first_cateid: [
          { required: true, message: "请选择一级分类", trigger: "change" },
        ],
        second_cateid: [
          { required: true, message: "请选择二级分类", trigger: "change" },
        ],
      },

      //上传图片数据
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  mounted(){
    this.editor = new E("#desc");
    this.editor.create();
  },
  methods: {
    // 根据一级分类的id获取二级分类
    catechange(val) {
      // val为下拉列表的value属性值
      if(val==""){
        return false
      }
      // console.log(val);
      this.$axios
        .get(this.$api.catelistUrl, {
          params: { pid: val },
        })
        .then((res) => {
          // console.log(res);
          this.secondcatearr = res.data.list;
        });
    },
    // 根据商品规格, 获取下级对应的规格属性
    specschange(val) {
      this.info.specsattr = [];
      // val为下拉列表的value属性值
      // console.log(val)
      if(val==""){
        return false
      }
      // console.log(val);
      this.$axios
        .get(this.$api.specsinfoUrl,{
          params: { id: val },
        })
        .then((res) => {
          // console.log(res);
          if(res.data.code==200){
            
            this.specsattrarr = res.data.list[0].attrs;
          }
          
        });
    },

    //   提交表单方法
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.info)
          // json序列化，防止数据变化，上面的数据跟着变化
          let data = JSON.parse(JSON.stringify(this.info));
          // 默认url为添加
          let url = this.$api.goodsaddUrl;
          // 如果能获取到id ，url的值变为修改
          if (this.$route.params.id) {
            url = this.$api.goodseditUrl;
            data.id = Number(this.$route.params.id);
          }
          data.status = data.status ? 1 : 2;
          console.log(data);
          data.specsattr = data.specsattr? data.specsattr.join(','):'';
          // 富文本
          //获取内容
          data.description = this.editor.txt.html();

          console.log(data)
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
              console.log(res)
              // this.$router.push('/goods');
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
    // 添加图片时,触发的函数
    filechange(file){
      // console.log(file)
      // 取到图片信息,以便上传的时候用
      this.img = file.raw;
    },
  },
  created() {
    // 获取一级分类
    this.$axios
      .get(this.$api.catelistUrl, {
        params: { pid: 0 },
      })
      .then((res) => {
        // console.log(res);
        this.firstcatearr = res.data.list;
      });

    // 获取商品规格
    this.$axios
      .get(this.$api.specslistUrl,)
      .then((res) => {
        // console.log(res);
        this.specsarr = res.data.list;
      });

    // 获取一条数据信息
    if(this.$route.params.id){
      this.tip="修改",
      // 根据id获取id对应的该条数据 赋值给info
      this.$axios.get(this.$api.goodsinfoUrl, {
        params:{id: this.$route.params.id}
      }).then(res=>{
        this.info = res.data.list;
        // 让二级分类的列表全部展示出来
        this.catechange(res.data.list.first_cateid);
        // 具体的某一条数据应选中的规格属性值
        this.info.specsattr = this.info.specsattr?this.info.specsattr.split(','):[]
 
        this.info.status = this.info.status == 1? true : false
  
        // 把img转化为filelist需要的格式
        this.fileList = this.info.img? [{url: this.$api.baseUrl+this.info.img}] : [];

        this.editor.txt.html(this.info.description);
        
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
