<template>
  <div>
    <p><img src="../assets/images/logo.png" height="55"/><span style="float: right">当前用户&nbsp;:&nbsp;<span style="color: red">{{ currentUserName }}</span>&nbsp;&nbsp;&nbsp;当前身份&nbsp;:&nbsp;<span style="color: red">{{currentType }}</span></span></p>
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
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-button @click="isCollapse=false" size="mini" v-show="isCollapse">展开菜单栏</el-button>
      <el-button @click="isCollapse=true" size="mini" v-show="!isCollapse">收起菜单栏</el-button>
    </el-radio-group>
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
                  <span slot="title">查看学生成绩</span>
                </el-menu-item>
                <el-submenu index="2">
                  <template slot="title">
                    <i class="el-icon-myPaper"></i>
                    <span>试题管理</span>
                  </template>
                  <el-submenu index="2-1">
                    <template slot="title"><i class="el-icon-myAdd"></i>添加试题</template>
                    <el-menu-item index="2-1-1"><i class="el-icon-myOne"></i><a @click="currentCom='addQuestionSingle'">单选题</a></el-menu-item>
                    <el-menu-item index="2-1-2"><i class="el-icon-myFill"></i><a @click="currentCom='addQuestionFill'">填空题</a></el-menu-item>
                  </el-submenu>
                  <el-submenu index="2-2">
                    <template slot="title"><i class="el-icon-mySearch"></i>查看试题</template>
                    <el-menu-item index="2-2-1"><i class="el-icon-myAllQuestion"></i><a @click="currentCom='allQuestionTeacher'">全部试题</a></el-menu-item>
                    <el-menu-item index="2-2-2"><i class="el-icon-myQuestion"></i><a @click="currentCom='myQuestionTeacher'">我的试题</a></el-menu-item>
                  </el-submenu>
                </el-submenu>
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
import '@/assets/myicon/iconfont.css';
import toModifyPassword from "./toModifyPassword";
import addQuestionSingle from "./addQuestionSingle ";
import addQuestionFill from "./addQuestionFill";
import allQuestionTeacher from "./allQuestionTeacher";
import myQuestionTeacher from "./myQuestionTeacher";

export default {
  name: "teacher",
  data() {
    return {
      currentUserName: sessionStorage.getItem("userName"),
      currentType: sessionStorage.getItem("type"),
      dialogVisible: false,
      currentCom: '',
      isCollapse:false
    }
  },
  components: {
    toModifyPassword,
    addQuestionSingle,
    addQuestionFill,
    allQuestionTeacher,
    myQuestionTeacher
  },
  methods: {
    //注销
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
