<template>
  <div>
    <p>管理员界面</p>
    <p>欢迎你:<span style="color: red">{{currentUserName}}</span></p>
    <p>你的身份:<span style="color: red">{{currentType}}</span></p>
    <el-button type="danger" plain @click="logout()">退出登录</el-button>
  </div>
</template>

<script>
import ElementUI from "element-ui";
export default {
  name: "manager",
  data(){
    return{
      currentUserName: sessionStorage.getItem("userName"),
      currentType: sessionStorage.getItem("type")
    }
  },
  methods:{
    logout: function () {
      ElementUI.Message.error("你已退出登录!!");
      sessionStorage.clear();
      this.$router.replace("/login");
    }
  }
}
</script>

<style scoped>

</style>
