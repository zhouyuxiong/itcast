<template>
  <div class="login">
    <div class="container">
      <img src="../assets/kbs.jpg" alt="" class="avatar">
      <el-form :model="ruleForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" placeholder="输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #2f4050;

  .container {
    width: 400px;
    margin: 200px auto;
    padding: 0px 40px 15px 40px;
    background-color: #fff;

    .login-btn {
      width: 100%;
    }

    .avatar{
      position: relative;
      top: -50%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: -60px;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 10px solid #08c1ce;
    }
  }
}
</style>
