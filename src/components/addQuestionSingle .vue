<template>
  <div>
    <div style="width: 80%;margin-left: -10%">
      <el-form ref="form" :model="fromAddQuestion" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="问题描述" prop="content">
          <el-input v-model="fromAddQuestion.content" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="科目" prop="courseId">
          <el-select v-model="fromAddQuestion.courseId" placeholder="请选择科目">
            <el-option :label="course.name" :value="course.id" v-for="course in fromAddQuestion.allCourse"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="答案1" prop="answer1">
          <el-input v-model="fromAddQuestion.answer1" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="答案2" prop="answer2">
          <el-input v-model="fromAddQuestion.answer2" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="答案3" prop="answer3">
          <el-input v-model="fromAddQuestion.answer3" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="答案4" prop="answer4">
          <el-input v-model="fromAddQuestion.answer4" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="正确答案">
          <el-radio-group v-model="fromAddQuestion.trueAnswer">
            <el-radio label="答案1"></el-radio>
            <el-radio label="答案2"></el-radio>
            <el-radio label="答案3"></el-radio>
            <el-radio label="答案4"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click="addQuestionSingle()">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ElementUI from "element-ui";

export default {
  name: "addQuestionSingle",
  data() {
    return {
      fromAddQuestion: {
        content: '',
        courseId: '',
        answer1: '',
        answer2: '',
        answer3: '',
        answer4: '',
        allCourse: null,
        trueAnswer: '答案1',
        type: '单选题',
        userId: sessionStorage.getItem("userId")
      },
      rules: {
        content: [
          {required: true, message: '请输入问题描述', trigger: 'blur'},
        ],
        courseId: [
          {required: true, message: '请选择科目', trigger: 'blur'},
        ],
        answer1: [
          {required: true, message: '请输入第一个答案', trigger: 'blur'},
        ],
        answer2: [
          {required: true, message: '请输入第二个答案', trigger: 'blur'},
        ],
        answer3: [
          {required: true, message: '请输入第三个答案', trigger: 'blur'},
        ],
        answer4: [
          {required: true, message: '请输入第四个答案', trigger: 'blur'},
        ]
      }
    }
  },
  //页面一加载就执行
  mounted() {
    //获取全部科目
    axios
      .get('http://localhost/course/getAllCourse')
      .then(response => (this.fromAddQuestion.allCourse = response.data.rows))
      .catch(function (error) {
        console.log(error);
      });
  },
  methods: {
    //添加单选题
    addQuestionSingle: function () {
      if (this.fromAddQuestion.content === null || this.fromAddQuestion.content === '') {
        ElementUI.Message.error("请输入问题描述!");
        return null;
      }
      if (this.fromAddQuestion.courseId === null || this.fromAddQuestion.courseId === '') {
        ElementUI.Message.error("请选择科目!");
        return null;
      }
      if (this.fromAddQuestion.answer1 === null || this.fromAddQuestion.answer1 === '') {
        ElementUI.Message.error("请输入第一个答案!");
        return null;
      }
      if (this.fromAddQuestion.answer2 === null || this.fromAddQuestion.answer2 === '') {
        ElementUI.Message.error("请输入第二个答案!");
        return null;
      }
      if (this.fromAddQuestion.answer3 === null || this.fromAddQuestion.answer3 === '') {
        ElementUI.Message.error("请输入第三个答案!");
        return null;
      }
      if (this.fromAddQuestion.answer4 === null || this.fromAddQuestion.answer4 === '') {
        ElementUI.Message.error("请输入第四个答案!");
        return null;
      }
      let _this = this;
      let param = new URLSearchParams();
      param.append("content", this.fromAddQuestion.content);
      param.append("courseId", this.fromAddQuestion.courseId);
      param.append("type", this.fromAddQuestion.type);
      param.append("answer", this.fromAddQuestion.answer1 + "<<----->>" + this.fromAddQuestion.answer2 + "<<----->>" + this.fromAddQuestion.answer3 + "<<----->>" + this.fromAddQuestion.answer4);
      param.append("trueAnswer", this.fromAddQuestion.trueAnswer);
      param.append("userId", this.fromAddQuestion.userId);
      axios
        .post('http://localhost/question/addQuestionSingle', param)
        .then(function (response) {
          if (response.data.success) {
            ElementUI.Message.success("添加单选题成功！！");
            _this.fromAddQuestion.content = '';
            _this.fromAddQuestion.courseId = '';
            _this.fromAddQuestion.answer1 = '';
            _this.fromAddQuestion.answer2 = '';
            _this.fromAddQuestion.answer3 = '';
            _this.fromAddQuestion.answer4 = '';
            _this.fromAddQuestion.trueAnswer = '答案1';
          } else {
            ElementUI.Message.error("修改失败！！");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
}
</script>

<style scoped>

</style>
