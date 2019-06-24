<template>
  <div>
    <!-- 添加面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="userKey"
        class="input-with-select"
        style="width:300px;margin-right:15px"
        @keyup.enter.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" plain @click="addDialogFormVisible=true">添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="userList" border style="width: 100%;margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handlezt(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="info" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配" placement="top">
            <el-button type="success" icon="el-icon-share" @click="handleGrant(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total-0"
    ></el-pagination>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible" :show-close="false">
      <el-form :model="addForm" :label-width="'120px'" :rules="rules" ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :label-width="'120px'" :rules="rules" ref="editForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
      <el-form :model="grantForm" :label-width="'120px'">
        <el-form-item label="用户名">
          <el-input v-model="grantForm.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="grantForm.rid" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantrolesubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllList,
  addUser,
  editUser,
  delUser,
  updateUserStatus,
  grantRoles
} from '@/api/users.js'
import { getAllRoles } from '@/api/roles.js'
export default {
  data () {
    return {
      userKey: '',
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: '',
      userList: [],
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      grantDialogFormVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      grantForm: {},
      rolesList: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /\w+[@]+\w+[.]\w/,
            message: '请输入正确邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 渲染数据
    init () {
      getAllList({
        query: this.userKey,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
        .then(success => {
          // console.log(success)
          this.total = success.data.data.total
          this.userList = success.data.data.users
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 编辑页面显示并渲染数据
    handleEdit (obj) {
      this.editDialogFormVisible = true
      // console.log(obj)
      this.editForm = obj
    },
    // 每页条数
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.init()
    },
    // 页码
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.init()
    },
    // 添加用户
    add () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUser(this.addForm)
            .then(success => {
              // console.log(success)
              if (success.data.meta.status === 201) {
                this.$message({
                  type: 'success',
                  message: success.data.meta.msg
                })
                this.addDialogFormVisible = false
                this.init()
                this.$refs.addForm.resetFields()
              }
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '错误'
              })
            })
        } else {
          return false
        }
      })
    },
    // 取消添加
    addCancel () {
      this.addDialogFormVisible = false
      this.$refs.addForm.resetFields()
    },
    // 编辑用户
    edit () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editUser(this.editForm)
            .then(success => {
              // console.log(success)
              if (success.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: success.data.meta.msg
                })
                this.editDialogFormVisible = false
                this.init()
              }
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '更新失败'
              })
            })
        } else {
          /* this.$message({
            type: 'error',
            message: '出错'
          }) */
          return false
        }
      })
    },
    // 删除用户
    del (id) {
      this.$confirm(`此操作将永久删除id为${id}的数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUser(id)
            .then(success => {
              // console.log(success)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.init()
            })
            .catch(() => {
              // console.log(err)
              this.$message({
                type: 'error',
                message: '删除出错'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 更改用户状态
    handlezt (id, type) {
      // console.log(id, type)
      updateUserStatus(id, type)
        .then(success => {
          // console.log(success)
          if (success.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: success.data.meta.msg
            })
            this.init()
          } else {
            this.$message({
              type: 'error',
              message: success.data.meta.msg
            })
            return false
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '修改出错'
          })
        })
    },
    // 显示分配角色框
    handleGrant (obj) {
      this.grantDialogFormVisible = true
      // console.log(obj)
      this.grantForm = obj
    },
    // 更改角色
    grantrolesubmit () {
      grantRoles(this.grantForm.id, this.grantForm.rid)
        .then(success => {
          // console.log(success)
          if (success.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: success.data.meta.msg
            })
            this.grantDialogFormVisible = false
          } else {
            this.$message({
              type: 'error',
              message: success.data.meta.msg
            })
          }
        })
        .catch(err => {
          console.log(err)
          return false
        })
    }
  },
  mounted () {
    this.init()
    // 获取全部角色
    getAllRoles()
      .then(success => {
        // console.log(success)
        this.rolesList = success.data.data
      })
      .catch(err => {
        console.log(err)
        return false
      })
  }
}
</script>

<style lang="less" scoped>
</style>
