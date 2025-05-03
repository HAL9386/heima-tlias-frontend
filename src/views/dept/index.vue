<script setup>
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<template>
  <h1>部门管理</h1>
  <div class="container">
    <el-button type="primary" round>+ 新增部门</el-button>
  </div>
  <div class="container">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="100"/>
      <el-table-column prop="name" label="部门名称" align="center"/>
      <el-table-column prop="address" label="最后操作时间" align="center"/>
      <el-table-column prop="address" label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small"><el-icon><Edit /></el-icon> 编辑</el-button>
          <el-button type="danger" size="small"><el-icon><Delete /></el-icon> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
</template>

<style scoped>
.container {
  margin: 10px 0;
}
</style>
