<template>
  <div style="width: 40%;margin-left: 30%;margin-top: 6%">
    <p style="text-align: center"><img src="../assets/images/logo.png" height="55"/></p>
    <h3 style="text-align: center">学生注册</h3>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="form.password2" type="password"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" @click="onSubmit()">注册</el-button>
        <router-link type="primary" to="/login">
          <el-button type="primary">登录</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ElementUI from 'element-ui';
import axios from "axios";
import {getServerUrl} from "../config/url";

export default {
  name: "register",
  data() {
    return {
      form: {
        userName: '',
        password: '',
        password2: ''
      }
    }
  },
  methods: {
    onSubmit() {
      let userName = this.form.userName;
      let password = this.form.password;
      let password2 = this.form.password2;
      if (userName === '' || userName === null) {
        ElementUI.Message.error("请输入用户名！！");
        return;
      }
      if (password === '' || password === null) {
        ElementUI.Message.error("请输入密码！！");
        return;
      }
      if (password2 === '' || password2 === null) {
        ElementUI.Message.error("请输入确认密码！！");
        return;
      }
      if (password !== password2) {
        ElementUI.Message.error("密码和确认密码不一样，请重新输入！！");
        return;
      }
      let _this = this;
      let param = new URLSearchParams();
      param.append("userName", userName);
      axios
        .post(getServerUrl() +'user/findByUserName', param)
        .then(function (response) {
          if (response.data.success) {
            let __this = _this;
            let param2 = new URLSearchParams();
            param2.append("userName", __this.form.userName);
            param2.append("password", __this.form.password);
            param2.append("type", "学生");
            axios
              .post(getServerUrl() +'user/add', param2)
              .then(function (response) {
                if (response.data.success) {
                  ElementUI.Message.success("注册成功");
                  __this.$router.push("/login");
                }
              })
              .catch(function (error) {
                alert(error);
                console.log(error);
              });
          } else {
            ElementUI.Message.error("用户名已经存在，请重新输入！！");
          }
        })
        .catch(function (error) {
          alert(error);
          console.log(error);
        });
    }
  }
}
</script>

<style scoped>

</style>
