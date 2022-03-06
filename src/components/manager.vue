<template>
  <div>
    <p><img src="../assets/images/logo.png" height="55"/><span style="float: right;margin-top: 20px"><el-tag
      effect="plain">当前用户&nbsp;:&nbsp;<span style="color: red">{{ currentUserName }}</span></el-tag>&nbsp;&nbsp;&nbsp;<el-tag
      effect="plain">当前身份&nbsp;:&nbsp;<span style="color: red">{{ currentType }}</span></el-tag></span></p>
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
                <a @click="currentCom='userManage'">
                  <el-menu-item index="1">
                    <i class="el-icon-myUser"></i>
                    <span slot="title">用户管理</span>
                  </el-menu-item>
                </a>
                <a @click="currentCom='courseManage'">
                  <el-menu-item index="2">
                    <i class="el-icon-myCourse"></i>
                    <span slot="title">科目管理</span>
                  </el-menu-item>
                </a>
                <a @click="currentCom='viewAllPaper'">
                  <el-menu-item index="3">
                    <i class="el-icon-myScore"></i>
                    <span slot="title">查看学生成绩</span>
                  </el-menu-item>
                </a>
                <el-submenu index="4">
                  <template slot="title">
                    <i class="el-icon-myPaper"></i>
                    <span>试题管理</span>
                  </template>
                  <el-submenu index="4-1">
                    <template slot="title"><i class="el-icon-myAdd"></i>添加试题</template>
                    <a @click="currentCom='addQuestionSingle'">
                      <el-menu-item index="4-1-1">
                        <i class="el-icon-myOne"></i>单选题
                      </el-menu-item>
                    </a>
                    <a @click="currentCom='addQuestionFill'">
                      <el-menu-item index="4-1-2">
                        <i class="el-icon-myFill"></i>填空题
                      </el-menu-item>
                    </a>
                  </el-submenu>
                  <el-submenu index="4-2">
                    <template slot="title"><i class="el-icon-mySearch"></i>查看试题</template>
                    <a @click="currentCom='allQuestionManager'">
                      <el-menu-item index="4-2-1">
                        <i class="el-icon-myAllQuestion"></i>全部试题
                      </el-menu-item>
                    </a>
                    <a @click="currentCom='myQuestion'">
                      <el-menu-item index="4-2-2">
                        <i class="el-icon-myQuestion"></i>我的试题
                      </el-menu-item>
                    </a>
                  </el-submenu>
                </el-submenu>
                <a @click="currentCom='toModifyPassword'">
                  <el-menu-item index="5">
                    <i class="el-icon-modifyPassword"></i>
                    <span slot="title">修改密码</span>
                  </el-menu-item>
                </a>
                <a @click="dialogVisible = true">
                  <el-menu-item index="6">
                    <i class="el-icon-switch-button"></i>
                    <span slot="title">注销</span>
                  </el-menu-item>
                </a>
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
import addQuestionSingle from "./addQuestionSingle ";
import addQuestionFill from "./addQuestionFill";
import allQuestionManager from "./allQuestionManager";
import myQuestion from "./myQuestion";
import viewAllPaper from "./viewAllPaper";
import userManage from "./userManage";
import courseManage from "./courseManage";

export default {
  name: "manager",
  data() {
    return {
      currentUserName: sessionStorage.getItem("userName"),
      currentType: sessionStorage.getItem("type"),
      currentCom: '',
      dialogVisible: false,
      isCollapse: false
    }
  },
  components: {
    toModifyPassword,
    addQuestionSingle,
    addQuestionFill,
    allQuestionManager,
    myQuestion,
    viewAllPaper,
    userManage,
    courseManage
  },
  methods: {
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
