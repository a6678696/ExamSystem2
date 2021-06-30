<template>
  <div style="width: 40%;margin-left: 30%;margin-top: 6%">
    <p style="text-align: center"><img src="../assets/images/logo.png" height="55"/></p>
    <h3 style="text-align: center"><span style="color: #a768db">{{ form.type }}</span>登录</h3>
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
      <el-form-item style="text-align: center">
        <el-button type="primary" @click="onSubmit">登录</el-button>
        <router-link type="primary" to="/register">
          <el-button type="primary">注册</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ElementUI from "element-ui";
import axios from "axios";

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
    onSubmit() {
      if (this.form.userName === null || this.form.userName === '') {
        alert("请输入用户名!");
        return null;
      }
      if (this.form.password === null || this.form.password === '') {
        alert("请输入密码!");
        return null;
      }
      let _this = this;
      let param = new URLSearchParams();
      param.append("userName", this.form.userName);
      param.append("password", this.form.password);
      param.append("type", this.form.type);
      axios
        .post('http://localhost/user/login', param)
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
            ElementUI.Message.error("用户名、密码或身份错误,请重新输入!");
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

</style>
