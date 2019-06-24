<template>
  <div class="right">
    <!-- 添加面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="rightList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="props">
          <span>{{props.row.level|levelFormat}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRightList } from '@/api/rights.js';
export default {
  // 过滤器
  filters: {
    levelFormat: level => {
      if (level === '0') {
        return '一级';
      } else if (level === '1') {
        return '二级';
      } else if (level === '2') {
        return '三级';
      } else {
        return '';
      }
    }
  },
  data () {
    return {
      rightList: []
    }
  },
  mounted () {
    getAllRightList('list')
      .then(success => {
        // console.log(success)
        this.rightList = success.data.data
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style lang="less" scoped>
</style>
