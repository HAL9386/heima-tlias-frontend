<script setup>
import { ref, watch, onMounted } from 'vue'
import { queryAllApi } from '@/api/emp'
import { ElMessage, ElTableColumn } from 'element-plus'

onMounted(() => {
  search()
})

const searchEmp = ref({
  name: '',
  gender: '',
  date: [],
  begin: '',
  end: '',
  page: '',
  pageSize: '',
})

const search = async () => {
  const res = await queryAllApi(searchEmp.value)
  if (res.code) {
    empList.value = res.data.rows
  } else {
    ElMessage.error(res.msg)
  }
}

const clear = () => {
  searchEmp.value = {
    name: '',
    gender: '',
    date: [],
    begin: '',
    end: '',
  } 
  search()
}

watch(() => searchEmp.value.date, (newValue, oldValue) => {
  searchEmp.value.begin = newValue[0]
  searchEmp.value.end = newValue[1]
}) 

const empList = ref([
{
        "id": 1,
        "username": "jinyong",
        "name": "金庸",
        "gender": 1,
        "image": "https://web-framework.oss-cn-hangzhou.aliyuncs.com/2022-09-02-00-27-53B.jpg",
        "job": 2,
        "salary": 8000,
        "entryDate": "2015-01-01",
        "deptId": 2,
        "deptName": "教研部",
        "createTime": "2022-09-01T23:06:30",
        "updateTime": "2022-09-02T00:29:04"
      },
      {
        "id": 2,
        "username": "zhangwuji",
        "name": "张无忌",
        "gender": 1,
        "image": "https://web-framework.oss-cn-hangzhou.aliyuncs.com/2022-09-02-00-27-53B.jpg",
        "job": 2,
        "salary": 6000,
        "entryDate": "2015-01-01",
        "deptId": 2,
        "deptName": "教研部",
        "createTime": "2022-09-01T23:06:30",
        "updateTime": "2022-09-02T00:29:04"
      }
])
</script>

<template>
  <h1>员工管理</h1>
  <!-- 搜索栏 -->
  <div class="container">
    <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="searchEmp.name" placeholder="请输入员工姓名" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="searchEmp.gender" placeholder="请选择" style="width: 200px;">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker
        v-model="searchEmp.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
      />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 功能按钮 -->
  <div class="container">
    <el-button round type="primary"><el-icon><Plus /></el-icon>新增员工</el-button>
    <el-button round type="danger"><el-icon><Minus /></el-icon>批量删除</el-button>
  </div>
  <div class="container">
    <el-table :data="empList" border style="width: 100%">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column label="头像" width="100px" align="center">
        <template #default="scope">
          <img :src="scope.row.image" alt="avatar" class="avatar"/>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="部门名称" align="center"/>
      <el-table-column label="职位" align="center">
        <template #default="scope">
          <span v-if="scope.row.job==1">班主任</span>
          <span v-else-if="scope.row.job==2">讲师</span>
          <span v-else-if="scope.row.job==3">学工主管</span>
          <span v-else-if="scope.row.job==4">教研主管</span>
          <span v-else>咨询师</span>
        </template>
      </el-table-column>
      <el-table-column prop="entryDate" label="入职日期" align="center"/>
      <el-table-column prop="updateTime" label="最后操作时间" align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button size="small" type="primary"><el-icon><Edit /></el-icon>编辑</el-button>
          <el-button size="small" type="danger"><el-icon><Delete /></el-icon>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.container {
  margin: 20px 0;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 90%;
}
</style>