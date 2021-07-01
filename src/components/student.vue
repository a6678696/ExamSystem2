<template>
  <div>
    <p><img src="../assets/images/logo.png" height="55"/><span style="float: right;margin-top: 20px"><el-tag effect="plain">当前用户&nbsp;:&nbsp;<span style="color: red">{{ currentUserName }}</span></el-tag>&nbsp;&nbsp;&nbsp;<el-tag effect="plain">当前身份&nbsp;:&nbsp;<span style="color: red">{{currentType }}</span></el-tag></span></p>
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-button @click="isCollapse=false" size="mini" v-show="isCollapse">展开菜单栏</el-button>
      <el-button @click="isCollapse=true" size="mini" v-show="!isCollapse">收起菜单栏</el-button>
    </el-radio-group>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="false"
      :before-close="handleClose">
      <span>是否要注销登录？</span>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="logout()">是</el-button>
    <el-button type="danger" @click="dialogVisible = false">否</el-button>
  </span>
    </el-dialog>
    <el-row>
      <el-col :md="8">
        <div class="grid-content bg-purple">
          <el-row class="tac">
            <el-col :span="12">
              <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                :collapse="isCollapse">
                <el-menu-item index="1">
                  <i class="el-icon-myScore"></i>
                  <span slot="title"><a @click="currentCom='viewMyPaper'">查看成绩</a></span>
                </el-menu-item>
                <el-menu-item index="2">
                  <i class="el-icon-myTest"></i>
                  <span slot="title"><a @click="currentCom='toSelectPaperPage'">开始考试</a></span>
                </el-menu-item>
                <el-menu-item index="3">
                  <i class="el-icon-modifyPassword"></i>
                  <span slot="title"><a @click="currentCom='toModifyPassword'">修改密码</a></span>
                </el-menu-item>
                <el-menu-item index="4">
                  <i class="el-icon-switch-button"></i>
                  <span slot="title"><a @click="dialogVisible = true">注销</a></span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :md="16">
        <div class="grid-content bg-purple-light">
          <component :is="currentCom"></component>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ElementUI from "element-ui";
import toModifyPassword from "./toModifyPassword";
import toSelectPaperPage from "./toSelectPaperPage";
import viewMyPaper from "./viewMyPaper";

export default {
  name: "student",
  data() {
    return {
      currentUserName: sessionStorage.getItem("userName"),
      currentType: sessionStorage.getItem("type"),
      isCollapse: false,
      dialogVisible: false,
      currentCom: ''
    }
  },
  components: {
    toModifyPassword,
    toSelectPaperPage,
    viewMyPaper
  },
  methods: {
    //注销登录
    logout: function () {
      ElementUI.Message.error("你已退出登录!!");
      window.sessionStorage.clear();
      this.$router.replace("/login");
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped>

</style>
