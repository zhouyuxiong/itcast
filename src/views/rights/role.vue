<template>
  <div class="role">
    <!-- 添加面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮 -->
    <el-button type="success" plain @click="addDialogFormVisible=true">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="rolesList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row
            v-for="one in props.row.children"
            :key="one.id"
            style="margin-bottom:15px;border-bottom:1px dashed #ccc"
          >
            <el-col :span="4">
              <el-tag closable type="primary" @close="delRight(props.row,one.id)">{{one.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="two in one.children" :key="two.id" style="margin-bottom:15px">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="success"
                    @close="delRight(props.row,two.id)"
                    v-if="two.children.length!==0"
                  >{{two.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="info"
                    v-for="three in two.children"
                    :key="three.id"
                    style="margin:0 5px 15px 0"
                    @close="delRight(props.row,three.id)"
                  >{{three.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-if="props.row.children.length===0">无数据</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="info" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配" placement="top">
            <el-button type="success" icon="el-icon-share" @click="showGrant(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色授权 -->
    <el-dialog title="角色授权" :visible.sync="grantdialogFormVisible">
      <div class="grant">
        <el-tree
          ref="tree"
          :data="rightsList"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="checkedArr"
          :props="defaultProps"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" :label-width="'120px'" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllRoles, delRights, grantRights, addRoles } from '@/api/roles.js';
import { getAllRightList } from '@/api/rights.js';
export default {
  data () {
    return {
      rolesList: [],
      roleId: '',
      rightsList: [],
      checkedArr: [],
      grantdialogFormVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      addDialogFormVisible: false,
      addForm: {},
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // 渲染角色
    this.init()
  },
  methods: {
    // 获取数据
    init () {
      getAllRoles()
        .then(success => {
          // console.log(success)
          this.rolesList = success.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 删除下拉角色权限
    delRight (row, rightId) {
      // console.log(row, rightId)
      delRights(row.id, rightId)
        .then(success => {
          // console.log(success)
          if (success.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: success.data.meta.msg
            })
            row.children = success.data.data
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
    },
    // 显示分配权限框
    showGrant (row) {
      this.grantdialogFormVisible = true
      // console.log(row)
      this.roleId = row.id
      getAllRightList('tree')
        .then(success => {
          // console.log(success)
          if (success.data.meta.status === 200) {
            this.rightsList = success.data.data
          }
        })
        .catch(err => {
          console.log(err)
          return false
        })
      // 清空原本checkedArr数据
      this.checkedArr.length = 0
      row.children.forEach(one => {
        if (one.children.length > 0) {
          // 遍历二级权限
          one.children.forEach(two => {
            if (two.children.length > 0) {
              // 遍历三级权限
              two.children.forEach(three => {
                this.checkedArr.push(three.id)
              })
            }
          })
        }
      })
    },
    // 角色授权
    grantSubmit () {
      var HalfArr = this.$refs.tree.getHalfCheckedKeys()
      var arr = this.$refs.tree.getCheckedKeys()
      // console.log(HalfArr, arr)

      var str = [...HalfArr, ...arr].join(',')
      // console.log(str)
      grantRights(this.roleId, str)
        .then(success => {
          // console.log(success)
          if (success.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: success.data.meta.msg
            })
            this.grantdialogFormVisible = false
          } else {
            this.$message({
              type: 'warning',
              message: success.data.meta.msg
            })
          }
        })
        .catch(err => {
          console.log(err)
          return false
        })
    },
    // 添加角色
    addRole () {
      addRoles(this.addForm)
        .then(success => {
          // console.log(success)
          if (success.data.meta.status === 201) {
            this.$message({
              type: 'success',
              message: success.data.meta.msg
            })
          } else {
            this.$message({
              type: 'error',
              message: success.data.meta.msg
            })
          }
          this.addDialogFormVisible = false
          this.init()
        })
        .catch(err => {
          console.log(err)
          return false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.grant {
  height: 400px;
  overflow: scroll;
}
</style>
