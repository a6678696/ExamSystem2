<template>
  <div class="bjimg">
    <div  style="width: 40%;margin-left: 30%;margin-top: 6%">
      <p style="text-align: center"><img src="../assets/images/logo.png" height="55"/></p>
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <strong><strong style="color: #a768db">{{ form.type }}</strong>登录</strong>
          <router-link type="primary" to="/register">
            <el-button style="float: right; padding: 3px 0" type="text">去注册<i class="el-icon-caret-right
"></i></el-button>
          </router-link>
        </div>
        <div class="text item">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="选择身份">
              <el-radio-group v-model="form.type">
                <el-radio label="学生"></el-radio>
                <el-radio label="教师"></el-radio>
                <el-radio label="管理员"></el-radio>
              </el-radio-group>
            </el-form-item>
            <div style="text-align: center">
              <el-button type="primary" @click="onSubmit()" size="medium">登录</el-button>
            </div>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import ElementUI from "element-ui";
import axios from "axios";
import {getServerUrl} from "../config/url";

export default {
  name: "login",
  data() {
    return {
      form: {
        userName: '',
        password: '',
        type: '学生'
      },
      rules: {
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    //登录
    onSubmit() {
      if (this.form.userName === null || this.form.userName === '') {
        ElementUI.Message.error("请输入用户名!");
        return null;
      }
      if (this.form.password === null || this.form.password === '') {
        ElementUI.Message.error("请输入密码!");
        return null;
      }
      let _this = this;
      let param = new URLSearchParams();
      param.append("userName", this.form.userName);
      param.append("password", this.form.password);
      param.append("type", this.form.type);
      axios
        .post(getServerUrl() +'user/login', param)
        .then(function (response) {
          let status = response.data.status;
          let userId = response.data.userId;
          if (status === 1) {
            ElementUI.Message.success("登录成功!" + "(当前身份:" + _this.form.type + ")");
            sessionStorage.setItem('token', status)
            sessionStorage.setItem("userName", _this.form.userName);
            sessionStorage.setItem("type", _this.form.type);
            sessionStorage.setItem("userId", userId);
            if (_this.form.type === '学生') {
              _this.$router.push('/student');
            } else if (_this.form.type === '教师') {
              _this.$router.push('/teacher');
            } else if (_this.form.type === '管理员') {
              _this.$router.push('/manager');
            }
          } else {
            ElementUI.Message.error("用户名、密码或身份错误，请重新输入！");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
}
</script>

<style scoped>
.bjimg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-width: 1000px;
  z-index: -10;
  zoom: 1;
  background-color: #fff;
  background-image: url(../assets/images/bg.jpeg);
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
}
</style>
