<template>
  <div style="margin-left: -20%">
    <el-dialog title="查看试题详情" :visible.sync="dialogFormVisible" fullscreen="fullscreen">
      <p>题目：</p>
      <p>{{ details.questionDetailsContent }}</p>
      <p>科目：{{ details.questionDetailsCourseName }}</p>
      <p>发布人：{{ details.questionDetailsUserName }}</p>
      <p>试题类型：{{ details.questionDetailsType }}</p>
      <p>添加时间：{{ details.questionDetailsAddDate }}</p>
      <p>答案如下：<span style="color: red">（红色字体的是正确答案）</span></p>
      <p v-for="(value,index) in details.questionDetailsAnswer">答案{{ index + 1 }}：<span
        :style="value.isTrue?'color: red':'color:black'">{{ value.content }}</span></p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-form :inline="true" :model="formSearch" class="demo-form-inline">
      <el-form-item label="科目" prop="courseId">
        <el-select v-model="formSearch.searchCourseId" placeholder="请选择科目">
          <el-option :label="course.name" :value="course.id"
                     v-for="course in formSearch.allCourse"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="试题题目">
        <el-input v-model="formSearch.searchContent" placeholder="试题题目"
                  style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchQuestion()">查询</el-button>
        <el-button type="info" @click="allQuestionTeacherResetValue()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="allQuestionTeacher.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%">
      <el-table-column
        label="添加日期"
        prop="addDate" sortable align="center">
      </el-table-column>
      <el-table-column
        label="科目名称"
        prop="courseName" align="center" sortable>
      </el-table-column>
      <el-table-column
        label="试题类型"
        prop="type" align="center" sortable>
      </el-table-column>
      <el-table-column
        label="试题描述"
        prop="content" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column
        label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini" type="primary"
            @click="handleDetails(scope.row.id)">查看
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
import {getServerUrl} from "../config/url";

export default {
  name: "allQuestionTeacher",
  data() {
    return {
      allQuestionTeacher: null,
      search: '',
      dialogFormVisible: false,
      pagination: {
        page: 1,
        size: 8,
        count: 0,
      },
      details: {
        questionDetailsContent: '',
        questionDetailsCourseName: '',
        questionDetailsAddDate: '',
        questionDetailsAnswer: null,
        questionDetailsType: '',
        questionDetailsUserName: ''
      },
      formSearch: {
        allCourse: null,
        searchContent: '',
        searchCourseId: ''
      }
    }
  },
  methods: {
    //查看试题详情
    handleDetails: function (id) {
      let _this = this;
      let param = new URLSearchParams();
      param.append("id", id);
      axios
        .post(getServerUrl() + 'question/findById', param)
        .then(function (response) {
          _this.details.questionDetailsContent = response.data.question.content;
          _this.details.questionDetailsCourseName = response.data.question.courseName;
          _this.details.questionDetailsAddDate = response.data.question.addDate;
          _this.details.questionDetailsType = response.data.question.type;
          _this.details.questionDetailsUserName = response.data.question.userName;
        })
        .catch(function (error) {
          alert(error);
          console.log(error);
        });
      let param2 = new URLSearchParams();
      param2.append("questionId", id);
      axios
        .post(getServerUrl() + 'answer/getAnswerByQuestionId', param2)
        .then(function (response) {
          _this.details.questionDetailsAnswer = response.data.rows;
        })
        .catch(function (error) {
          alert(error);
          console.log(error);
        });
      this.dialogFormVisible = true;
    },
    //所属试题
    searchQuestion: function () {
      let _this = this;
      let param = new URLSearchParams();
      param.append("content", this.formSearch.searchContent);
      param.append("courseId", this.formSearch.searchCourseId);
      param.append("page", this.pagination.page);
      param.append("size", this.pagination.size);
      axios
        .post(getServerUrl() + 'question/searchQuestion', param)
        .then(function (response) {
          _this.allQuestionTeacher = response.data.rows;
          _this.pagination.count = response.data.total;
          _this.searchQuestion();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //重置搜索条件
    allQuestionTeacherResetValue: function () {
      this.formSearch.searchContent = '';
      this.formSearch.searchCourseId = '';
    },
    //刷新当前页的值
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.reloadData();
    },
    //刷新数据
    reloadData: function () {
      axios
        .get(getServerUrl() + 'question/getAllQuestion?page=' + this.pagination.page + '&size=' + this.pagination.size)
        .then(response => (this.allQuestionTeacher = response.data.rows, this.pagination.count = response.data.total))
        .catch(function (error) {
          console.log(error);
        });
      axios
        .get(getServerUrl() + 'course/getAllCourse')
        .then(response => (this.formSearch.allCourse = response.data.rows))
        .catch(function (error) {
          console.log(error);
        });
    }
  },
  mounted() {
    axios
      .get(getServerUrl() + 'question/getAllQuestion?page=' + this.pagination.page + '&size=' + this.pagination.size)
      .then(response => (this.allQuestionTeacher = response.data.rows, this.pagination.count = response.data.total))
      .catch(function (error) {
        console.log(error);
      });
    axios
      .get(getServerUrl() + 'course/getAllCourse')
      .then(response => (this.formSearch.allCourse = response.data.rows))
      .catch(function (error) {
        console.log(error);
      });
  }
}
</script>

<style scoped>

</style>
