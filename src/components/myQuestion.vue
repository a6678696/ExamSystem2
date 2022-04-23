<template>
  <div style="margin-left: -20%">
    <!--查看试题详情-->
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
    <el-dialog title="修改试题" :visible.sync="dialogFormVisible2" fullscreen="fullscreen">
      <el-form :model="formModify" label-width="80px">
        <el-form-item label="问题描述">
          <el-input v-model="formModify.content" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="科目" prop="courseId">
          <el-select v-model="formModify.courseId" placeholder="请选择科目">
            <el-option :label="course.name" :value="course.id"
                       v-for="course in formSearch.allCourse"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-bind:label="'答案'+(index>0?(index+1):'')" v-for="(value,index) in formModify.answers">
          <el-input type="textarea" v-bind:value="value.content" v-bind:id="'answer'+(index+1)"
                    v-model="formModify.answers[index].content"
                    style="margin-top: 5px"></el-input>
        </el-form-item>
        <el-form-item label="正确答案">
          <el-select v-model="formModify.trueAnswerId">
            <el-option :label="'答案'+(index+1)" :value="answer.id"
                       v-for="(answer,index) in formModify.answers"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyQuestion()">确 定</el-button>
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible2"
      width="30%"
      :before-close="handleClose">
      <span>是否要删除这个试题？</span>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="deleteQuestion()">是</el-button>
    <el-button type="danger" @click="dialogVisible2 = false">否</el-button>
  </span>
    </el-dialog>
    <!--搜索-->
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
        <el-button type="info" @click="resetValue()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="myQuestion.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
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
          <el-button
            size="mini" type="warning"
            @click="openModifyDialog(scope.row.id)">修改
          </el-button>
          <el-button
            size="mini" type="danger"
            @click="openDialog(scope.row.id)">删除
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
import {getServerUrl} from "../config/url";

export default {
  name: "myQuestion",
  data() {
    return {
      myQuestion: null,
      search: '',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogVisible2: false,
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
      },
      formModify: {
        content: '',
        courseId: '',
        answers: null,
        trueAnswerId: ''
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
    //确认是否要删除试题
    openDialog: function (id) {
      this.dialogVisible2 = true;
      sessionStorage.setItem("deleteQuestionId", id);
    },
    //打开修改试题界面
    openModifyDialog: function (id) {
      this.dialogFormVisible2 = true;
      let _this = this;
      let param = new URLSearchParams();
      param.append("id", id);
      axios
        .post(getServerUrl() + 'question/findById', param)
        .then(function (response) {
          _this.formModify.content = response.data.question.content;
          _this.formModify.courseId = response.data.question.courseId;
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
          _this.formModify.answers = response.data.rows;
          for (let i = 0; i < _this.formModify.answers.length; i++) {
            if (_this.formModify.answers[i].isTrue === 1) {
              _this.formModify.trueAnswerId = _this.formModify.answers[i].id;
            }
          }
        })
        .catch(function (error) {
          alert(error);
          console.log(error);
        });
      sessionStorage.setItem("modifyId", id);
    },
    //修改试题
    modifyQuestion: function () {
      let _this = this;
      let questionId = sessionStorage.getItem("modifyId");
      let content = this.formModify.content;
      let courseId = this.formModify.courseId;
      let answerString = '';
      let trueAnswerId = this.formModify.trueAnswerId
      for (let i = 0; i < this.formModify.answers.length; i++) {
        if (i == 0) {
          answerString = document.getElementById('answer' + (i + 1)).value;
        } else {
          answerString = answerString + '<<----->>' + document.getElementById('answer' + (i + 1)).value;
        }
      }
      let param = new URLSearchParams();
      param.append("questionId", questionId);
      param.append("content", content);
      param.append("courseId", courseId);
      param.append("answerString", answerString);
      param.append("trueAnswerId", trueAnswerId);
      axios
        .post(getServerUrl() + 'question/update', param)
        .then(function (response) {
          if (response.data.success) {
            _this.dialogFormVisible2 = false;
            ElementUI.Message.success("修改成功");
            _this.reloadData();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //删除试题
    deleteQuestion: function () {
      let id = sessionStorage.getItem("deleteQuestionId");
      let _this = this;
      let param = new URLSearchParams();
      param.append("id", id);
      axios
        .post(getServerUrl() + 'question/deleteById', param)
        .then(function (response) {
          if (response.data.success) {
            _this.dialogVisible2 = false;
            ElementUI.Message.success("删除试题成功！！");
            _this.reloadData();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //搜索试题
    searchQuestion: function () {
      let _this = this;
      let param = new URLSearchParams();
      param.append("content", this.formSearch.searchContent);
      param.append("courseId", this.formSearch.searchCourseId);
      param.append("userId", sessionStorage.getItem("userId"));
      param.append("page", this.pagination.page);
      param.append("size", this.pagination.size);
      axios
        .post(getServerUrl() + 'question/searchQuestion', param)
        .then(function (response) {
          _this.myQuestion = response.data.rows
          _this.pagination.count = response.data.total;
          _this.searchQuestion();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //重置搜索试题条件
    resetValue: function () {
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
        .get(getServerUrl() + 'question/getMyQuestion?userId=' + sessionStorage.getItem("userId") + '&page=' + this.pagination.page + '&size=' + this.pagination.size)
        .then(response => (this.myQuestion = response.data.rows, this.pagination.count = response.data.total))
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
      .get(getServerUrl() + 'question/getMyQuestion?userId=' + sessionStorage.getItem("userId") + '&page=' + this.pagination.page + '&size=' + this.pagination.size)
      .then(response => (this.myQuestion = response.data.rows, this.pagination.count = response.data.total))
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
