<template>
  <div style="margin-left: -20%">
    <el-dialog
      title="试卷详情"
      :visible.sync="dialogVisible"
      width="30%"
      fullscreen="fullscreen"
      :before-close="handleClose">
      <div style="margin-left: 10%">
        <p>
          <span><i class="el-icon-time"></i>考试时间&nbsp;:&nbsp;{{ paperDetails.createDate }}</span>&nbsp;&nbsp;&nbsp;
          <span><i class="el-icon-tickets"></i>考试科目&nbsp;:&nbsp;{{ paperDetails.courseName }}</span>&nbsp;&nbsp;&nbsp;
          <span><i class="el-icon-collection-tag"></i>考试分数&nbsp;:&nbsp;{{ paperDetails.score }}分</span>
        </p>
        <p><strong style="font-size: 17px">一、选择题，每题5分，共15题，总分75分。<span style="color: red">(红色字体是正确答案)</span></strong>
        </p>
        <div v-for="(value,index) in singleList">
          <div>
            <p style="font-size: 15px"><span style="color: blue;font-size: 15px">第{{
                index + 1
              }}题：</span>{{ value.question.content }}</p>
            <p v-for="(value2,index2) in value.answerList" v-bind:style="value2.isTrue===1?'color: red':'color:black'">
              {{ index2 === 0 ? 'A' : (index2 === 1 ? 'B' : (index2 === 2 ? 'C' : 'D')) }}、
              <span>{{ value2.content }}</span>
            </p>
            <p>考生答案：
              <strong style="color: blue" v-if="value.answer==='0'">本题没有选择答案</strong>
              <strong style="color: blue" v-if="value.answer==='1'">A</strong>
              <strong style="color: blue" v-if="value.answer==='2'">B</strong>
              <strong style="color: blue" v-if="value.answer==='3'">C</strong>
              <strong style="color: blue" v-if="value.answer==='4'">D</strong>
            </p>
          </div>
        </div>
        <p><strong style="font-size: 17px">二、填空题，每题5分，共5题，总分25分。</strong></p>
        <div v-for="(value,index) in fillList">
          <p style="font-size: 15px"><span style="color: blue;font-size: 15px">第{{
              index + 1
            }}题：</span>{{ value.question.content }}</p>
          <p>正确答案：<strong style="color: green">{{ value.trueAnswerStr }}</strong></p>
          <p>考生答案：<strong
            style="color: blue">{{ value.answer === 'answerIsNull' ? '本题没有填写答案' : value.answer }}</strong></p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
  </span>
    </el-dialog>
    <el-table
      :data="myPaper.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%">
      <el-table-column
        label="添加日期"
        prop="createDate" sortable align="center">
      </el-table-column>
      <el-table-column
        label="科目名称"
        prop="courseName" align="center" sortable>
      </el-table-column>
      <el-table-column
        label="分数"
        prop="score" align="center" sortable>
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

export default {
  name: "viewAllPaper",
  data() {
    return {
      myPaper: null,
      dialogVisible: false,
      singleList: null,
      fillList: null,
      paperDetails: {
        courseName: '',
        createDate: '',
        score: ''
      },
      pagination: {
        page: 1,
        size: 8,
        count: 0,
      }
    }
  },
  methods: {
    //查看试卷详情
    handleDetails: function (id) {
      this.dialogVisible = true;
      let _this = this;
      let param = new URLSearchParams();
      param.append("id", id);
      axios
        .post('http://localhost/paper/findById', param)
        .then(function (response) {
          _this.paperDetails.courseName = response.data.paper.courseName;
          _this.paperDetails.createDate = response.data.paper.createDate;
          _this.paperDetails.score = response.data.paper.score;
          _this.singleList = response.data.singleList;
          _this.fillList = response.data.fillList;
        });
    },
    //刷新当前页的值
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.reloadData();
    },
    //刷新页面数据
    reloadData: function () {
      axios
        .get('http://localhost/paper/getListFindByUserId?page=' + this.pagination.page + '&size=' + this.pagination.size)
        .then(response => (this.myPaper = response.data.rows, this.pagination.count = response.data.total))
        .catch(function (error) {
          console.log(error);
        });
    }
  },
  mounted() {
    axios
      .get('http://localhost/paper/getListFindByUserId?page=' + this.pagination.page + '&size=' + this.pagination.size)
      .then(response => (this.myPaper = response.data.rows, this.pagination.count = response.data.total))
      .catch(function (error) {
        console.log(error);
      });
  }
}
</script>

<style scoped>

</style>
