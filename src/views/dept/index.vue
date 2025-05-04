<script setup>
import { ref, onMounted } from 'vue'
// import axios from 'axios'
import { queryAllApi } from '@/api/dept'

const deptList = ref([])
async function search() {
  // const result = await axios.get('https://m1.apifoxmock.com/m1/6270372-5964539-default/depts?apifoxApiId=291715989&apifoxToken=OO_sn0SVdz6Y48zdxRJw-')
  // if (result.data.code) {
  //   deptList.value = result.data.data
  // } else {
  //   console.error('获取部门列表失败')
  // }

  const result = await queryAllApi()
  if (result.code) {
    deptList.value = result.data
  } else {
    console.error('获取部门列表失败')
  }
}

onMounted(() => {
  search()
})

</script>

<template>
  <h1>部门管理</h1>
  <div class="container">
    <el-button type="primary" round>+ 新增部门</el-button>
  </div>
  <div class="container">
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="100"/>
      <el-table-column prop="name" label="部门名称" align="center"/>
      <el-table-column prop="updateTime" label="最后操作时间" align="center"/>
      <el-table-column fixed="right" label="操作" align="center">
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
