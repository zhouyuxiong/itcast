<template>
  <div class="role">
    <!-- 添加面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮 -->
    <el-button type="success" plain>添加角色</el-button>
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
            <el-button type="success" icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllRoles, delRights } from '@/api/roles.js'
export default {
  data () {
    return {
      rolesList: [],
      roleId: ''
    }
  },
  mounted () {
    // 渲染角色
    getAllRoles()
      .then(success => {
        // console.log(success)
        this.rolesList = success.data.data
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
