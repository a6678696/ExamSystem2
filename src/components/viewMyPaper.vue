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
        <p><strong style="font-size: 17px">一、选择题，每题5分，共15题，总分75分。<span style="color: red">(红色字体是正确答案)</span></strong></p>
        <div v-for="(value,index) in singleList">
          <p style="font-size: 15px"><span style="color: blue;font-size: 15px">第{{ index + 1 }}题：</span>{{ value.question.content }}</p>
          <p v-for="(value2,index2) in value.answerList" v-bind:style="value2.isTrue===1?'color: red':'color:black'">
            {{ index2 === 0 ? 'A' : (index2 === 1 ? 'B' : (index2 === 2 ? 'C' : 'D')) }}、
            <span>{{ value2.content }}</span>
          </p>
          <p>你的答案：
            <span style="color: blue" v-if="value.answer===null">本题你没有选择答案</span>
            <span style="color: blue" v-if="value.answer==='1'">A</span>
            <span style="color: blue" v-if="value.answer==='2'">B</span>
            <span style="color: blue" v-if="value.answer==='3'">C</span>
            <span style="color: blue" v-if="value.answer==='4'">D</span>
          </p>
        </div>
        <p><strong style="font-size: 17px">二、填空题，每题5分，共5题，总分25分。</strong></p>
        <div v-for="(value,index) in fillList">
          <p style="font-size: 15px"><span style="color: blue;font-size: 15px">第{{ index + 1 }}题：</span>{{ value.question.content }}</p>
          <p>正确答案：<strong style="color: green">{{value.trueAnswerStr}}</strong></p>
          <p>你的答案：<strong style="color: blue">{{value.answer===null?'本题你没有填写答案':value.answer}}</strong></p>
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
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "viewMyPaper",
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
      }
    }
  },
  methods: {
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
          _this.singleList=response.data.singleList;
          _this.fillList=response.data.fillList;
        });
    }
  },
  mounted() {
    axios
      .get('http://localhost/paper/getListFindByUserId?userId=' + sessionStorage.getItem("userId"))
      .then(response => (this.myPaper = response.data.rows))
      .catch(function (error) {
        console.log(error);
      });
  }
}
</script>

<style scoped>

</style>
