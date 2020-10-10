<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/menu' }">菜单列表</el-breadcrumb-item>
      <el-breadcrumb-item>菜单{{tip}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="info" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="info.title"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="pid">
        <el-select v-model="info.pid" placeholder="请选择">
          <el-option label="顶级菜单" :value="0"></el-option>
          <el-option v-for="item in getmenulist" :key="item.id" :label="item.title" :value="item.id" ></el-option>  
          <!-- 单选获取的是value值, 所以每一条要给他绑定value, value的值为id, 是因为提交的时候需要提交pid, 第二级内容的pid,就是一级菜单的id值 . 先绑定一个顶级菜单, 是因为添加一级菜单的话, 是需要一个上级菜单的,这个上级菜单就为顶级菜单 一级菜单的pid为0, 所以顶级菜单的value值绑定为0, 表示顶级菜单-->
        </el-select>
      </el-form-item>

      <el-form-item label="菜单类型">
        <el-radio-group v-model="info.type">
          <el-radio :label="1">目录</el-radio>
          <el-radio :label="2">菜单</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单图标" v-show="info.type==1">
        <el-input v-model="info.icon"></el-input>
      </el-form-item>

      <el-form-item label="菜单地址" v-show="info.type==2">
        <el-input v-model="info.url"></el-input>
      </el-form-item>

      <!-- <el-form-item label="状态" prop="status">
        <el-switch v-model="info.status"></el-switch>
      </el-form-item>-->
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
        title: "",
        pid: "",
        type: 1,
        icon: "",
        url: "",
        status: true,
      },
      rules: {
        title: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          { min: 1, max: 20, message: "菜单名称长度不符合", trigger: "blur" },
        ],
        //  上级菜单
        pid: [{ required: true, message: "请输入上级菜单", trigger: "change" }],
      },
    };
  },
  computed: {
    ...mapGetters(["getmenulist"]),
  },
  methods: {
    submitForm(formName) {
      //提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //  验证规则都满足时，会执行这里
          //  不管是添加还是修改都在这里操作
          // json序列化，防止数据变化，上面的数据跟着变化
          let data = JSON.parse(JSON.stringify(this.info));
          // 默认url为添加
          let url = this.$api.menuaddUrl;
          // 如果能获取到id ，url的值变为修改
          if(this.$route.params.id){
            url = this.$api.menueditUrl;
            data.id = Number(this.$route.params.id);
          }
          data.status=data.status?1:2;


          this.$axios.post(url, data).then(res=>{
            if(res.data.code==200){
              this.$router.push('/role')
            }else{
              this.$message.error(res.data.msg);
            }
          })

        }
      });
    },
  },

  created() {
    let menuid = Number(this.$route.params.id);
    console.log(menuid)
    //思路: 判断动态路由是否有id, 有id的话, 就是修改页面, 并把点击的那条数据请求回来, 赋值给修改页面
    if (menuid) {
      this.tip = "修改";
      // 根据id获取id对应的该条数据 赋值给info
      this.$axios
        .get(this.$api.menuinfoUrl, {
          params: { id: menuid },
        })
        .then((res) => {
          console.log(res);
          this.info = res.data.list;
          // 修改status的值为true或false
          this.info.status = this.info.status == 1 ? true : false;
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
