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
        <el-button type="primary" @click="onSubmit">注册</el-button>
        <router-link type="primary" to="/login"><el-button type="primary">登录</el-button></router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
  methods:{
    onSubmit() {
      console.log('submit!');
    }
  }
}
</script>

<style scoped>

</style>
