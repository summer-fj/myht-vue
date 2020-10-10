<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/seckill' }">秒杀列表</el-breadcrumb-item>
      <el-breadcrumb-item>秒杀{{tip}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :model="info" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="活动名称" prop="title">
        <el-input v-model="info.title"></el-input>
      </el-form-item>

      <el-form-item label="活动时间" required>
        <el-date-picker
          v-model="dateval"
          value-format="timestamp"
          type="datetimerange" 
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="timechange"
        ></el-date-picker>
      </el-form-item>

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
        <el-select v-model="info.second_cateid" placeholder="请选择" @change="catetwochange">
          <el-option label="请选择" value></el-option>
          <el-option
            v-for="item in secondcatearr"
            :key="item.id"
            :label="item.catename"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品">
        <el-select v-model="info.goodsid" placeholder="请选择">
          <el-option label="请选择" value></el-option>
          <el-option
            v-for="item in goodsarr"
            :key="item.id"
            :label="item.goodsname"
            :value="item.id"
          ></el-option>

          <!-- <el-option label="1" value="shanghai"></el-option>
          <el-option label="2" value="beijing"></el-option>-->
        </el-select>
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
      dateval:[],
      firstcatearr: [], //一级分类数组
      secondcatearr: [], //二级分类数组
      goodsarr: [],
      info: {
        title: "",
        begintime:'',
        endtime:'',
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: true,
      },

      // 选择时间数据
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },


      rules: {
        title: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
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
          let url = this.$api.seckaddUrl;
          // 如果能获取到id ，url的值变为修改
          if (this.$route.params.id) {
            url = this.$api.seckeditUrl;
            data.id = Number(this.$route.params.id);
          }
          data.status = data.status ? 1 : 2;

          // 发送请求
          this.$axios.post(url, data).then(res => {
            if (res.data.code == 200) {
              console.log(res);
              this.$router.push('/seckill');
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },

    // 根据一级分类的id获取二级分类
    catechange(val) {
      // val为下拉列表的value属性值 此下拉列表的value属性值绑定的是一级分类的id, 一级分类的id就是二级分类的pid
      // console.log(val);
      if (val == "") {
        return false;
      }
      this.$axios
        .get(this.$api.catelistUrl, {
          params: { pid: val },
        })
        .then((res) => {
          // console.log(res); //得到的是二级分类列表的内容
          this.secondcatearr = res.data.list;
        });
    },
    // 根据二级分类的id获取其下的商品列表
    catetwochange(val) {
      this.goodsarr = [];
      this.$axios.get(this.$api.goodslistUrl).then((res) => {
        res.data.list.forEach((item) => {
          if (item.second_cateid == val) {
            this.goodsarr.push(item);
          }
        });
        // console.log(this.goodsarr)
      });
    },

    // 时间
    timechange(timearr){
      console.log(timearr);
      this.info.begintime = timearr[0];
      this.info.endtime = timearr[1];
    }
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

    let id = this.$route.params.id;
    if (id) {
      (this.tip = "修改"),
        // 根据id获取id对应的该条数据 赋值给info
        this.$axios
          .get(this.$api.seckinfoUrl, {
            params: { id },
          })
          .then((res) => {
            // console.log(res.data.list);
            this.info = res.data.list;
            this.info.status = this.info.status == 1 ? true : false;
            // 让二级列表显示对应的内容(自己理解的)
            this.catechange(this.info.first_cateid);
            //让对应的商品显示出来
            this.catetwochange(res.data.list.second_cateid);

            // 时间
            this.dateval = [this.info.begintime, this.info.endtime]
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
.el-col-11 {
  width: 28%;
}
.line.el-col.el-col-2 {
  width: 4%;
  text-align: center;
}
</style>
