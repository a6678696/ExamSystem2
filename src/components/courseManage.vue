<template>
  <div style="margin-left: -20%">
    <!--添加科目-->
    <el-dialog
      title="添加科目"
      :visible.sync="dialogVisibleAdd"
      width="30%"
      :before-close="handleClose">
      <el-form ref="form" :model="formAdd" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="formAdd.name"></el-input>
        </el-form-item>
        <el-form-item label="考试时间">
          <el-input v-model="formAdd.minutes" placeholder="分钟"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="addCourse()">添加</el-button>
    <el-button type="danger" @click="dialogVisibleAdd = false">取消</el-button>
      </span>
    </el-dialog>
    <!--删除科目-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleDelete"
      width="30%"
      :before-close="handleClose">
      <span style="color: red">你确认要删除这个科目吗?</span>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="deleteCourse()">删除</el-button>
    <el-button type="danger" @click="dialogVisibleDelete = false">取消</el-button>
      </span>
    </el-dialog>
    <!--搜索-->
    <el-form :inline="true" :model="formSearch" class="demo-form-inline">
      <el-form-item label="科目名称">
        <el-input v-model="formSearch.name" style="width: 255px" placeholder="科目名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchCourse()"><i class="el-icon-search"></i>查询</el-button>
        <el-button type="info" @click="resetValue()"><i class="el-icon-refresh-left"></i>重置</el-button>
        <el-button type="primary" @click="dialogVisibleAdd=true" plain><i class="el-icon-plus"></i>添加科目</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="courseList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%">
      <el-table-column
        label="编号"
        prop="id" sortable align="center">
      </el-table-column>
      <el-table-column
        label="科目名称"
        prop="name" sortable align="center">
      </el-table-column>
      <el-table-column
        label="考试时间(分钟)"
        prop="minutes" sortable align="center">
      </el-table-column>
      <el-table-column
        label="试题数量"
        prop="num" sortable align="center">
      </el-table-column>
      <el-table-column
        label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini" type="primary"
            @click="openDetailsDialog(scope.row.id)">查看
          </el-button>
          <el-button
            size="mini" type="warning"
            @click="openModifyDialog(scope.row.id)">修改
          </el-button>
          <el-button
            size="mini" type="danger"
            @click="openDeleteDialog(scope.row.id)">删除
          </el-button>
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

export default {
  name: "courseManage",
  data() {
    return {
      courseList: null,
      dialogVisibleAdd: false,
      dialogVisibleDelete: false,
      deleteId: 0,
      pagination: {
        page: 1,
        size: 8,
        count: 0,
      },
      formSearch: {
        name: ''
      },
      formAdd: {
        name: '',
        minutes: ''
      }
    }
  },
  methods: {
    //刷新当前页的值
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.reloadData();
    },
    //刷新数据
    reloadData: function () {
      let _this = this;
      let param = new URLSearchParams();
      param.append("page", this.pagination.page);
      param.append("size", this.pagination.size);
      axios
        .post('http://localhost/course/list', param)
        .then(function (result) {
          _this.courseList = result.data.courseList;
          _this.pagination.count = result.data.total;
        })
    },
    //搜索科目
    searchCourse: function () {
      let _this = this;
      let param = new URLSearchParams();
      param.append("name", this.formSearch.name);
      param.append("page", this.pagination.page);
      param.append("size", this.pagination.size);
      axios
        .post('http://localhost/course/list', param)
        .then(function (result) {
          _this.courseList = result.data.courseList;
          _this.pagination.count = result.data.total;
          _this.searchCourse();
        })
    },
    //重置搜索的值
    resetValue: function () {
      this.formSearch.name = '';
    },
    addCourse: function () {
      let _this = this;
      let param = new URLSearchParams();
      param.append("name", this.formAdd.name);
      param.append("minutes", this.formAdd.minutes);
      axios
        .post('http://localhost/course/add', param)
        .then(function (result) {
          if (result.data.success) {
            _this.reloadData();
            ElementUI.Message.success("添加科目(" + _this.formAdd.name + ")成功!!");
            _this.formAdd.name = '';
            _this.formAdd.minutes = '';
            _this.dialogVisibleAdd = false;
          }
        })
    },
    openDeleteDialog: function (id) {
      this.deleteId = id;
      this.dialogVisibleDelete = true;
    },
    deleteCourse: function () {
      let _this = this;
      let param = new URLSearchParams();
      param.append("id", this.deleteId);
      axios
        .post('http://localhost/course/delete', param)
        .then(function (result) {
          if (result.data.success) {
            _this.reloadData();
            ElementUI.Message.success("删除科目成功!!");
            _this.deleteId = 0;
            _this.dialogVisibleDelete = false;
          } else {
            ElementUI.Message.error(result.data.errorInfo);
            _this.deleteId = 0;
            _this.dialogVisibleDelete = false;
          }
        })
    }
  },
  mounted() {
    let _this = this;
    let param = new URLSearchParams();
    param.append("page", this.pagination.page);
    param.append("size", this.pagination.size);
    axios
      .post('http://localhost/course/list', param)
      .then(function (result) {
        _this.courseList = result.data.courseList;
        _this.pagination.count = result.data.total;
      })
  }
}
</script>

<style scoped>

</style>
