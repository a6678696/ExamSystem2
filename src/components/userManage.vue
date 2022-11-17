<template>
  <div style="margin-left: -20%">
    <!--添加用户信息-->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisibleAdd"
      width="30%"
      :before-close="handleClose">
      <el-form ref="form" :model="formAdd" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="formAdd.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formAdd.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="formAdd.password2" type="password"></el-input>
        </el-form-item>
        <el-form-item label="选择身份">
          <el-radio-group v-model="formAdd.type">
            <el-radio label="学生"></el-radio>
            <el-radio label="教师"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="addUser()">添加</el-button>
    <el-button type="danger" @click="dialogVisibleAdd = false">取消</el-button>
      </span>
    </el-dialog>
    <!--修改用户信息-->
    <el-dialog
      title="修改用户"
      :visible.sync="dialogVisibleModify"
      width="30%"
      :before-close="handleClose">
      <el-form ref="form" :model="formModify" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="formModify.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formModify.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="formModify.password2" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="modifyUser()">修改</el-button>
    <el-button type="danger" @click="dialogVisibleModify = false">取消</el-button>
      </span>
    </el-dialog>
    <!--查看用户信息-->
    <el-dialog
      title="用户详情"
      :visible.sync="dialogVisibleDetails"
      width="30%"
      :before-close="handleClose">
      <p>用户名：<span style="color: red">{{ details.userName }}</span></p>
      <p>用户类型：<span style="color: red">{{ details.type }}</span></p>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisibleDetails = false">关闭</el-button>
  </span>
    </el-dialog>
    <!--搜索-->
    <el-form :inline="true" :model="formSearch" class="demo-form-inline">
      <el-form-item label="用户类型" prop="courseId">
        <el-select v-model="formSearch.type" placeholder="请选择科目">
          <el-option label="教师" value="教师"></el-option>
          <el-option label="学生" value="学生"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="formSearch.userName" style="width: 255px" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-tooltip class="item" effect="dark" content="搜索" placement="top">
          <el-button type="primary" @click="searchUser()"><i class="el-icon-search"></i></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="重置条件" placement="top">
          <el-button type="info" @click="resetValue()"><i class="el-icon-refresh-left"></i></el-button>
        </el-tooltip>
        <el-button type="primary" @click="dialogVisibleAdd=true" plain><i class="el-icon-plus"></i> 添加用户</el-button>
      </el-form-item>
    </el-form>
    <el-table border="true"
      :data="userList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%">
      <el-table-column
        label="用户名"
        prop="userName" sortable align="center">
      </el-table-column>
      <el-table-column
        label="用户类型"
        prop="type" sortable align="center">
      </el-table-column>
      <el-table-column
        label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
            <el-button circle="true"
                       size="medium" type="primary"
                       @click="openDetailsDialog(scope.row.id)"><i class="el-icon-search"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button circle="true"
                       size="medium" type="warning"
                       @click="openModifyDialog(scope.row.id)"><i class="el-icon-edit"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      align="center"
      style="margin-top: 8px"
      background
      layout="prev, pager, next"
      :current-page.sync="pagination.page"
      :page-size.sync="pagination.size"
      :total="pagination.count"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
import axios from "axios";
import ElementUI from "element-ui";
import {getServerUrl} from "../config/url";

export default {
  name: "userManage",
  data() {
    return {
      dialogVisibleDetails: false,
      dialogVisibleAdd: false,
      dialogVisibleModify: false,
      userList: null,
      pagination: {
        page: 1,
        size: 8,
        count: 0,
      },
      formSearch: {
        userName: '',
        type: ''
      },
      details: {
        userName: '',
        type: ''
      },
      formAdd: {
        userName: '',
        password: '',
        password2: '',
        type: ''
      },
      formModify: {
        userName: '',
        password: '',
        password2: ''
      }
    }
  },
  methods: {
    //刷新当前页的值
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.reloadData();
    },
    reloadData: function () {
      axios
        .get(getServerUrl() + 'user/list?page=' + this.pagination.page + '&size=' + this.pagination.size)
        .then(response => (this.userList = response.data.userList, this.pagination.count = response.data.total))
        .catch(function (error) {
          console.log(error);
        });
    },
    resetValue: function () {
      this.formSearch.userName = '';
      this.formSearch.type = '';
    },
    searchUser: function () {
      let _this = this;
      let param = new URLSearchParams();
      param.append("userName", this.formSearch.userName);
      param.append("type", this.formSearch.type);
      param.append("page", this.pagination.page);
      param.append("size", this.pagination.size);
      axios
        .post(getServerUrl() + 'user/list', param)
        .then(function (response) {
          _this.userList = response.data.userList;
          _this.pagination.count = response.data.total;
          _this.searchUser();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    openDetailsDialog: function (id) {
      this.dialogVisibleDetails = true;
      axios
        .get(getServerUrl() + 'user/findById?id=' + id)
        .then(response => (this.details.userName = response.data.user.userName, this.details.type = response.data.user.type, this.details.password = response.data.user.password))
        .catch(function (error) {
          console.log(error);
        });
    },
    addUser: function () {
      let userName = this.formAdd.userName;
      let password = this.formAdd.password;
      let password2 = this.formAdd.password2;
      let type = this.formAdd.type;
      if (userName === null || userName === '') {
        ElementUI.Message.error("用户名不能为空！");
        return;
      }
      if (password === null || password === '') {
        ElementUI.Message.error("密码不能为空！");
        return;
      }
      if (password2 === null || password2 === '') {
        ElementUI.Message.error("确认密码不能为空！");
        return;
      }
      if (type === null || type === '') {
        ElementUI.Message.error("用户类型不能为空！");
        return;
      }
      if (password !== password2) {
        ElementUI.Message.error("密码和确认密码不一样，请重新输入！");
        return;
      }
      let _this = this;
      let param = new URLSearchParams();
      param.append("userName", userName);
      axios
        .post(getServerUrl() + 'user/findByUserName', param)
        .then(function (response) {
          if (response.data.success) {
            let __this = _this;
            let param2 = new URLSearchParams();
            param2.append("userName", __this.formAdd.userName);
            param2.append("password", __this.formAdd.password);
            param2.append("type", __this.formAdd.type);
            axios
              .post(getServerUrl() + 'user/add', param2)
              .then(function (response) {
                if (response.data.success) {
                  ElementUI.Message.success("添加成功");
                  __this.dialogVisibleAdd = false;
                  __this.resetValueAdd();
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
    },
    resetValueAdd: function () {
      this.formAdd.userName = '';
      this.formAdd.password = '';
      this.formAdd.password2 = '';
      this.formAdd.type = '';
    },
    openModifyDialog: function (id) {
      this.dialogVisibleModify = true;
      axios
        .get(getServerUrl() + 'user/findById?id=' + id)
        .then(response => (this.formModify.userName = response.data.user.userName, this.formModify.password = response.data.user.password, this.formModify.password2 = response.data.user.password))
        .catch(function (error) {
          console.log(error);
        });
    },
    modifyUser: function () {
      let userName = this.formModify.userName;
      let password = this.formModify.password;
      let password2 = this.formModify.password2;
      if (password === null || password === '') {
        ElementUI.Message.error("密码不能为空！");
        return;
      }
      if (password2 === null || password2 === '') {
        ElementUI.Message.error("确认密码不能为空！");
        return;
      }
      if (password !== password2) {
        ElementUI.Message.error("密码和确认密码不一样，请重新输入！");
        return;
      }
      let _this = this;
      let param = new URLSearchParams();
      param.append("userName", userName);
      param.append("password", password);
      axios
        .post(getServerUrl() + 'user/modifyPassword', param)
        .then(function (response) {
          let status = response.data.status;
          if (status === 1) {
            ElementUI.Message.success("修改成功！！");
            _this.dialogVisibleModify = false;
          } else {
            ElementUI.Message.error("修改失败！！");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  },
  mounted() {
    axios
      .get(getServerUrl() + 'user/list?page=' + this.pagination.page + '&size=' + this.pagination.size)
      .then(response => (this.userList = response.data.userList, this.pagination.count = response.data.total))
      .catch(function (error) {
        console.log(error);
      });
  }
}
</script>

<style scoped>

</style>
