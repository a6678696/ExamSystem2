<template>
  <div>
    <div style="width: 80%;margin-left: -10%">
      <el-form ref="form" :model="fromAddQuestionFill" :rules="rules" rel="fromAddQuestionFill" label-width="80px" class="demo-ruleForm">
        <el-form-item label="问题描述" prop="content">
          <el-input v-model="fromAddQuestionFill.content" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="科目" prop="courseId">
          <el-select v-model="fromAddQuestionFill.courseId" placeholder="请选择科目">
            <el-option :label="course.name" :value="course.id"
                       v-for="course in fromAddQuestionFill.allCourse"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input v-model="fromAddQuestionFill.answer" type="textarea"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click="addQuestionFill()">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import ElementUI from "element-ui";
import axios from "axios";

export default {
  name: "addQuestionFill",
  data() {
    return {
      fromAddQuestionFill: {
        content: '',
        courseId: '',
        answer: '',
        allCourse: null,
        type:'填空题',
        userId: sessionStorage.getItem("userId")
      },
      rules:{
        content: [
          {required: true, message: '请输入问题描述', trigger: 'blur'},
        ],
        answer: [
          {required: true, message: '请输入答案', trigger: 'blur'}
        ],
        courseId: [
          {required: true, message: '请选择科目', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    //添加填空题
    addQuestionFill: function () {
      if (this.fromAddQuestionFill.content === null || this.fromAddQuestionFill.content === '') {
        ElementUI.Message.error("请输入问题描述!");
        return null;
      }
      if (this.fromAddQuestionFill.courseId === null || this.fromAddQuestionFill.courseId === '') {
        ElementUI.Message.error("请选择科目!");
        return null;
      }
      if (this.fromAddQuestionFill.answer === null || this.fromAddQuestionFill.answer === '') {
        ElementUI.Message.error("请输入答案!");
        return null;
      }
      let _this = this;
      let param = new URLSearchParams();
      param.append("content", this.fromAddQuestionFill.content);
      param.append("courseId", this.fromAddQuestionFill.courseId);
      param.append("type", this.fromAddQuestionFill.type);
      param.append("answer", this.fromAddQuestionFill.answer);
      param.append("userId", this.fromAddQuestionFill.userId);
      axios
        .post('http://localhost/question/addQuestionFill', param)
        .then(function (response) {
          if (response.data.success) {
            ElementUI.Message.success("添加填空题成功！！");
            _this.fromAddQuestionFill.content = '';
            _this.fromAddQuestionFill.courseId = '';
            _this.fromAddQuestionFill.answer = '';
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
      .get('http://localhost/course/getAllCourse')
      .then(response => (this.fromAddQuestionFill.allCourse = response.data.rows))
      .catch(function (error) {
        console.log(error);
      });
  }
}
</script>

<style scoped>

</style>
