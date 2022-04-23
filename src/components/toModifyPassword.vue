<template>
  <div>
    <p style="margin-left: 18%">修改密码</p>
    <div style="width: 40%;margin-top: 6%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input type="password" v-model="form.password2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click="modifyPassword()">修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import ElementUI from "element-ui";
import axios from "axios";
import {getServerUrl} from "../config/url";

export default {
  name: "toModifyPassword",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.password2 !== '') {
          this.$refs.form.validateField('password2');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form: {
        userName: sessionStorage.getItem("userName"),
        password: '',
        password2: ''
      },
      rules: {
        password: [
          {validator: validatePass, required: true, trigger: 'blur'}
        ],
        password2: [
          {validator: validatePass2, required: true, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    //修改密码
    modifyPassword: function () {
      if (this.form.password === null || this.form.password === '') {
        ElementUI.Message.error("请输入密码!");
        return null;
      }
      if (this.form.password2 === null || this.form.password2 === '') {
        ElementUI.Message.error("请输入确认密码!");
        return null;
      }
      if (this.form.password !== this.form.password2) {
        ElementUI.Message.error("新密码和确认密码不一致，请重新输入！！");
      } else {
        let _this = this;
        let param = new URLSearchParams();
        param.append("userName", this.form.userName);
        param.append("password", this.form.password);
        axios
          .post(getServerUrl() + 'user/modifyPassword', param)
          .then(function (response) {
            let status = response.data.status;
            if (status === 1) {
              ElementUI.Message.success("修改成功，下一次登录时生效！！");
              _this.form.password = '';
              _this.form.password2 = '';
            } else {
              ElementUI.Message.error("修改失败！！");
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  }
}
</script>

<style scoped>

</style>
