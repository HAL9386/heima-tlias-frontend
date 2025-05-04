<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// import axios from 'axios'
import { queryAllApi, addApi } from '@/api/dept'

// 表格数据
const deptList = ref([])
async function search() {
  const result = await queryAllApi()
  if (result.code) {
    deptList.value = result.data
  } else {
    console.error('获取部门列表失败')
  }
}

// dialog对话框
const dialogFormVisible = ref(false)
const dept = ref({name: ''})
const formTitle = ref('')
// 点击新增部门按钮
const addDept = () => {
  formTitle.value = '新增部门'
  dialogFormVisible.value = true
  dept.value = {name: ''}
  if (deptFormRef.value) {
    deptFormRef.value.resetFields()
  }
}
// 点击确定按钮保存部门
const save = async () => {
  // 表单校验
  if (!deptFormRef.value) return
  deptFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请确认部门名称合法')
      return false
    }
    // 提交表单，调用后端接口
    const result = await addApi(dept.value)
    if (result.code) {
      // 提示信息
      ElMessage.success('新增部门成功')
      // 关闭对话框
      dialogFormVisible.value = false
      // 重新查询数据
      search()
    } else {
      ElMessage.error(result.msg)
    }
  })
}

// 表单校验
const rules = ref({
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符之间', trigger: 'blur' }
  ]
})
const deptFormRef = ref()

onMounted(() => {
  search()
})

</script>

<template>
  <h1>部门管理</h1>
  <div class="container">
    <el-button type="primary" round @click="addDept">+ 新增部门</el-button>
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
  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item label="部门名称：" label-width="100px" prop="name">
        <el-input v-model="dept.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 10px 0;
}
</style>
