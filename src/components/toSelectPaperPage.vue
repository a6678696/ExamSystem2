<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <p>你选择的科目是：<span style="color: red">{{ this.form.courseName }}</span>，是否要开始考试？</p>
      <span slot="footer" class="dialog-footer">
       <el-button type="primary" @click="createPaper()">确 定</el-button>
       <el-button type="danger" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="正在考试"
      :visible.sync="dialogVisible2"
      width="30%"
      fullscreen="fullscreen"
      :show-close="false"
      :before-close="handleClose">
      <div style="margin-left: 10%">
        <p>当前考试的科目是：<span style="color: red">{{ this.form.courseName }}</span>，剩余考试时间：<span
          style="color: red"><span v-show="count>=59">{{ minutes }}分</span>{{ seconds }}秒</span>，考试结束时间如果到了系统将强制自动交卷</p>
        <hr>
        <strong style="font-size: 17px">一、选择题，每题5分，共15题，总分75分。(剩余考试时间：<span
          style="color: red"><span v-show="count>=59">{{ minutes }}分</span>{{ seconds }}秒</span>)</strong>
        <div v-for="(value,index) in questionSingleList">
          <p style="font-size: 15px"><span style="color: blue;font-size: 15px">第{{
              index + 1
            }}题：</span>{{ value.question.content }}</p>
          <p v-for="(value2,index2) in value.answerList">
            {{ index2 === 0 ? 'A' : (index2 === 1 ? 'B' : (index2 === 2 ? 'C' : 'D')) }}、
            <span>{{ value2.content }}</span></p>
          <p>
            <span style="color: #55a532">你的答案：</span>
            <input type="radio" v-bind:name="'answerSingle'+(index+1)" :id="'answerSingle'+'_'+(index+1)+'_1'" value="1"
                   style="vertical-align:middle;margin-top:-2px;margin-bottom:1px;"
                   @click="selectSingleAnswer(index+1,1)">A
            <input type="radio" v-bind:name="'answerSingle'+(index+1)" :id="'answerSingle'+'_'+(index+1)+'_2'" value="2"
                   style="vertical-align:middle;margin-top:-2px;margin-bottom:1px;"
                   @click="selectSingleAnswer(index+1,2)">B
            <input type="radio" v-bind:name="'answerSingle'+(index+1)" :id="'answerSingle'+'_'+(index+1)+'_3'" value="3"
                   style="vertical-align:middle;margin-top:-2px;margin-bottom:1px;"
                   @click="selectSingleAnswer(index+1,3)">C
            <input type="radio" v-bind:name="'answerSingle'+(index+1)" :id="'answerSingle'+'_'+(index+1)+'_4'" value="4"
                   style="vertical-align:middle;margin-top:-2px;margin-bottom:1px;"
                   @click="selectSingleAnswer(index+1,4)">D
          </p>
        </div>
        <strong style="font-size: 17px">二、填空题，每题5分，共5题，总分25分。(剩余考试时间：<span
          style="color: red"><span v-show="count>=59">{{ minutes }}分</span>{{ seconds }}秒</span>)</strong>
        <div v-for="(value,index) in questionFillList">
          <p style="font-size: 15px"><span style="color: blue;font-size: 15px">第{{
              index + 1
            }}题：</span>{{ value.question.content }}</p>
          <p>
            <span style="color: #55a532">你的答案：</span><input type="text" style="width: 44%"
                                                            v-model="questionFillAnswers[index]"
                                                            :id="'answerFill'+'_'+(index+1)">
          </p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
       <el-button type="primary" @click="submitPaper()">交卷</el-button>
       <el-button type="danger" @click="dialogVisible3 = true">强制交卷</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible3"
      width="30%"
      :before-close="handleClose">
      <span>你确定要强制交卷吗?(即使你有试题未选择或填写答案也会交卷)</span>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submitPaperCompulsory()">确 定</el-button>
    <el-button @click="dialogVisible3 = false">取 消</el-button>
  </span>
    </el-dialog>
    <div style="width: 40%;margin-top: 6%">
      <el-form :model="form" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="选择科目" prop="courseId">
          <el-select v-model="form.courseId" placeholder="请选择科目">
            <el-option :label="course.name" :value="course.id"
                       v-for="course in form.allCourse"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click="openDialog()">开始考试</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ElementUI from "element-ui";
import {getServerUrl} from "../config/url";

export default {
  name: "toSelectPaperPage",
  data() {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      count: '',
      minutes: '',
      seconds: '',
      testMinutes: 10,
      questionSingleList: null,
      questionFillList: null,
      questionSingleAnswers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      questionFillAnswers: ['', '', '', '', ''],
      form: {
        courseId: '',
        courseName: '',
        allCourse: null
      }
    };
  },
  methods: {
    //打开考试界面
    openDialog: function () {
      if (this.form.courseId === '') {
        ElementUI.Message.error("请选择科目");
        return;
      }
      for (let i = 0; i < this.form.allCourse.length; i++) {
        if (this.form.allCourse[i].id === this.form.courseId) {
          this.form.courseName = this.form.allCourse[i].name;
          break;
        }
      }
      this.dialogVisible = true;
    },
    //创建试卷
    createPaper: function () {
      this.dialogVisible = false;
      this.dialogVisible2 = true;
      this.count = 0;
      this.getCode();
      let _this = this;
      let param = new URLSearchParams();
      param.append("userId", sessionStorage.getItem("userId"));
      param.append("courseId", this.form.courseId);
      param.append("courseName", this.form.courseName);
      axios
        .post(getServerUrl() + 'paper/add', param)
        .then(function (response) {
          _this.questionSingleList = response.data.resultSingleQuestionList;
          _this.questionFillList = response.data.resultFillQuestionList;
        })
        .catch(function (error) {
          alert(error);
          console.log(error);
        });
    },
    //系统自动交卷和倒计时
    getCode: function () {
      let _this = this;
      axios
        .get(getServerUrl() + 'course/findById?id=' + this.form.courseId)
        .then(function (response) {
          _this.testMinutes = response.data.course.minutes;
          ElementUI.Message.warning("本场考试时间为: " + _this.testMinutes + " 分钟");
          let TIME_COUNT = _this.testMinutes * 60;
          if (_this.count === '' || _this.count === 0) {
            _this.count = TIME_COUNT;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      let interval = setInterval(function () {
        //Math.floor去整数
        _this.minutes = Math.floor(_this.count / 60);
        _this.seconds = _this.count % 60;
        if (_this.count > 0) {
          _this.count--;
        } else if (_this.count === 0) {
          ElementUI.Message.error("考试时间到了，系统自动交卷！");
          _this.dialogVisible2 = false;
          clearInterval(interval);
          let answerSingleStr = '';
          let answerFillStr = '';
          for (let i = 0; i < _this.questionSingleAnswers.length; i++) {
            if (i === 0) {
              answerSingleStr = answerSingleStr + _this.questionSingleAnswers[i];
            } else {
              answerSingleStr = answerSingleStr + "," + _this.questionSingleAnswers[i];
            }
          }
          for (let i = 0; i < _this.questionFillAnswers.length; i++) {
            if (_this.questionFillAnswers[i] === '') {
              _this.questionFillAnswers[i] = 'answerIsNull';
            }
            if (i === 0) {
              answerFillStr = answerFillStr + _this.questionFillAnswers[i];
            } else {
              answerFillStr = answerFillStr + "," + _this.questionFillAnswers[i];
            }
          }
          let param = new URLSearchParams();
          param.append("userId", sessionStorage.getItem("userId"));
          param.append("questionSingleStr", answerSingleStr);
          param.append("questionFillStr", answerFillStr);
          axios
            .post(getServerUrl() + 'paper/submitPaper', param)
            .then(function (response) {
              if (response.data.success) {
              }
            })
            .catch(function (error) {
              alert(error);
              console.log(error);
            });
          setTimeout(function () {
            location.reload();
          }, 1500);
        }
      }, 1000);
    },
    //交卷(要完成全部试题)
    submitPaper: function () {
      let answerSingleStr = '';
      let answerFillStr = '';
      let flag1 = true;
      let flag2 = true;
      for (let i = 0; i < this.questionSingleAnswers.length; i++) {
        if (this.questionSingleAnswers[i] === 0) {
          ElementUI.Message.error("第" + (i + 1) + "道选择题没有选择答案！如果要继续交卷，就请选择强制交卷吧！！");
          flag1 = false;
          break;
        }
        if (i === 0) {
          answerSingleStr = answerSingleStr + this.questionSingleAnswers[i];
        } else {
          answerSingleStr = answerSingleStr + "," + this.questionSingleAnswers[i];
        }
      }
      if (flag1 === true) {
        for (let i = 0; i < this.questionFillAnswers.length; i++) {
          if (this.questionFillAnswers[i] === '') {
            ElementUI.Message.error("第" + (i + 1) + "道填空题没有填写答案！如果要继续交卷，就请选择强制交卷吧！！");
            flag2 = false;
            break;
          }
          if (i === 0) {
            answerFillStr = answerFillStr + this.questionFillAnswers[i];
          } else {
            answerFillStr = answerFillStr + "," + this.questionFillAnswers[i];
          }
        }
      }
      if (flag1 === true && flag2 === true) {
        let _this = this;
        let param = new URLSearchParams();
        param.append("userId", sessionStorage.getItem("userId"));
        param.append("questionSingleStr", answerSingleStr);
        param.append("questionFillStr", answerFillStr);
        axios
          .post(getServerUrl() + 'paper/submitPaper', param)
          .then(function (response) {
            if (response.data.success) {
              ElementUI.Message.success("交卷成功！！");
              _this.dialogVisible2 = false;
              setTimeout(function () {
                location.reload();
              }, 1500);
            }
          });
      }
    },
    //强制交卷(有试题未完成也交卷)
    submitPaperCompulsory: function () {
      let answerSingleStr = '';
      let answerFillStr = '';
      for (let i = 0; i < this.questionSingleAnswers.length; i++) {
        if (i === 0) {
          answerSingleStr = answerSingleStr + this.questionSingleAnswers[i];
        } else {
          answerSingleStr = answerSingleStr + "," + this.questionSingleAnswers[i];
        }
      }
      for (let i = 0; i < this.questionFillAnswers.length; i++) {
        if (this.questionFillAnswers[i] === '') {
          this.questionFillAnswers[i] = 'answerIsNull';
        }
        if (i === 0) {
          answerFillStr = answerFillStr + this.questionFillAnswers[i];
        } else {
          answerFillStr = answerFillStr + "," + this.questionFillAnswers[i];
        }
      }
      let _this = this;
      let param = new URLSearchParams();
      param.append("userId", sessionStorage.getItem("userId"));
      param.append("questionSingleStr", answerSingleStr);
      param.append("questionFillStr", answerFillStr);
      axios
        .post(getServerUrl() + 'paper/submitPaper', param)
        .then(function (response) {
          if (response.data.success) {
            ElementUI.Message.success("强制交卷成功！！");
            _this.dialogVisible3 = false;
            _this.dialogVisible2 = false;
            setTimeout(function () {
              location.reload();
            }, 1500);
          }
        })
        .catch(function (error) {
          alert(error);
          console.log(error);
        });
    },
    //点击radio单选框时更新questionSingleAnswers数组的值
    selectSingleAnswer: function (index1, index2) {
      this.questionSingleAnswers[index1 - 1] = index2;
    },
  },
  mounted() {
    axios
      .get(getServerUrl() + 'course/getCourseCanTest')
      .then(response => (this.form.allCourse = response.data.rows))
      .catch(function (error) {
        console.log(error);
      });
  }
}
</script>

<style scoped>

</style>
