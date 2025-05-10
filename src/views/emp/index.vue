<script setup>
import { ref, watch, onMounted } from 'vue'
import { queryAllApi, addApi, queryByIdApi, updateApi } from '@/api/emp'
import { queryAllApi as queryAllDeptApi } from '@/api/dept'
import { ElMessage, ElTableColumn } from 'element-plus'

onMounted(() => {
  search()
  getDepts()
})

//职位列表数据
const jobs = ref([
  { name: '班主任', value: 1 }, 
  { name: '讲师', value: 2 }, 
  { name: '学工主管', value: 3 }, 
  { name: '教研主管', value: 4 }, 
  { name: '咨询师', value: 5 }, 
  { name: '其他', value: 6 },
])
//性别列表数据
const genders = ref([
  { name: '男', value: 1 }, 
  { name: '女', value: 2 },
])
// 部门列表数据
const depts = ref([])
const getDepts = async () => {
  const res = await queryAllDeptApi()
  if (res.code) {
    depts.value = res.data
  }
}

// 查询所有员工
const searchEmp = ref({
  name: '',
  gender: '',
  date: [],
  begin: '',
  end: '',
})

// 搜索栏查询按钮
const search = async () => {
  const res = await queryAllApi(searchEmp.value, currentPage.value, pageSize.value)
  if (res.code) {
    empList.value = res.data.rows
    empListTotal.value = res.data.total
  } else {
    ElMessage.error(res.msg)
  }
}
// 搜索栏清空按钮
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
// 监听员工查询数据中的date变化，封装到begin和end中
watch(() => searchEmp.value.date, (newValue, oldValue) => {
  if (newValue.length === 2) {
    searchEmp.value.begin = newValue[0]
    searchEmp.value.end = newValue[1]
  } else {
    searchEmp.value.begin = ''
    searchEmp.value.end = ''
  }
})

// 分页
const empList = ref([])
const empListTotal = ref(0)
const pageBackground = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)
const handleSizeChange = (val) => {
  pageSize.value = val
  search()
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  search()
}

//新增/修改表单
const employee = ref({
  username: '',
  name: '',
  gender: '',
  phone: '',
  job: '',
  salary: '',
  deptId: '',
  entryDate: '',
  image: '',
  exprList: []
})
// 表单校验规则
const rules = ref({
  username: [
    { required: true, message: '请输入员工用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符之间', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入员工姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符之间', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入员工手机号', trigger: 'blur' },
    { pattern: /^[1][3-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
})
const employeeFormRef = ref()
// 新增员工
const addEmp = () => {
  if (employeeFormRef.value) {
    employeeFormRef.value.resetFields()
  }
  dialogVisible.value = true
  dialogTitle.value = '新增员工'
  employee.value = {
    username: '',
    name: '',
    gender: '',
    phone: '',
    job: '',
    salary: '',
    deptId: '',
    entryDate: '',
    image: '',
    exprList: []
  }
}

// 控制弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增员工')

//文件上传
// 图片上传成功后触发
const handleAvatarSuccess = (response) => {
  console.log(response);
}
// 文件上传之前触发
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持上传图片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('只能上传10M以内图片')
    return false
  }
  return true
}
// 添加员工工作经历
const addEmpExprItem = () => {
  employee.value.exprList.push({
    begin: '',
    end: '',
    company: '',
    job: '',
    exprDate: [],
  })
}
const deleteExpr = (index) => {
  employee.value.exprList.splice(index, 1)
}
// 监听员工工作经历数据中的exprDate变化，封装到begin和end中
watch(() => employee.value.exprList, (newValue, oldValue) => {
  if (newValue.length <= 0) {
    return
  }
  newValue.forEach((item) => {
    item.begin = item.exprDate[0]
    item.end = item.exprDate[1]
  })
}, {deep: true})

// 保存员工
const save = async () => {
  // 表单校验
  if (!employeeFormRef.value) { 
    return 
  }
  employeeFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请确认员工信息合法')
      return false
    }
    let result
    if (employee.value.id) {
      result = await updateApi(employee.value)
    } else {
      result = await addApi(employee.value)
    }
    if (result.code) {
      // 提示信息
      ElMessage.success('操作成功')
      // 关闭对话框
      dialogVisible.value = false
      // 重新查询数据
      search()
    } else {
      ElMessage.error(result.msg)
    }
  })
}

// 表格中编辑员工按钮
const editEmp = async (id) => {
  if (employeeFormRef.value) {
    employeeFormRef.value.resetFields()
  }
  dialogVisible.value = true
  dialogTitle.value = '编辑员工'
  const result = await queryByIdApi(id)
  if (result.code) {
    employee.value = result.data
    employee.value.exprList.forEach((expr) => {
      expr.exprDate = [expr.begin, expr.end]
    })
  } else {
    ElMessage.error('获取员工信息失败')
  }
}
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
        <el-date-picker v-model="searchEmp.date" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 功能按钮 -->
  <div class="container">
    <el-button round type="primary" @click="addEmp"><el-icon>
        <Plus />
      </el-icon>新增员工</el-button>
    <el-button round type="danger"><el-icon>
        <Minus />
      </el-icon>批量删除</el-button>
  </div>
  <!-- 表格 -->
  <div class="container">
    <el-table :data="empList" border style="width: 100%">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column label="头像" width="100px" align="center">
        <template #default="scope">
          <img :src="scope.row.image" alt="avatar" class="avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="部门名称" align="center" />
      <el-table-column label="职位" align="center">
        <template #default="scope">
          <span v-if="scope.row.job == 1">班主任</span>
          <span v-else-if="scope.row.job == 2">讲师</span>
          <span v-else-if="scope.row.job == 3">学工主管</span>
          <span v-else-if="scope.row.job == 4">教研主管</span>
          <span v-else>咨询师</span>
        </template>
      </el-table-column>
      <el-table-column prop="entryDate" label="入职日期" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="editEmp(scope.row.id)"><el-icon><Edit /></el-icon>编辑</el-button>
          <el-button size="small" type="danger" @click="delEmp(scope.row.id)"><el-icon><Delete /></el-icon>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 分页 -->
  <div class="container">
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 40, 50]"
      :background="pageBackground" layout="total, sizes, prev, pager, next, jumper" :total="empListTotal"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
  <!-- 新增/修改员工的对话框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form :model="employee" label-width="80px" :rules="rules" ref="employeeFormRef">
      <!-- 基本信息 -->
      <!-- 第一行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="employee.username" placeholder="请输入员工用户名，2-20个字"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="employee.name" placeholder="请输入员工姓名，2-10个字"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 第二行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别">
            <el-select v-model="employee.gender" placeholder="请选择性别" style="width: 100%;">
              <el-option v-for="gender in genders" :key="gender.value" :label="gender.name" :value="gender.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="employee.phone" placeholder="请输入员工手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 第三行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="职位">
            <el-select v-model="employee.job" placeholder="请选择职位" style="width: 100%;">
              <el-option v-for="job in jobs" :key="job.value" :label="job.name" :value="job.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="薪资">
            <el-input v-model="employee.salary" placeholder="请输入员工薪资"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 第四行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属部门">
            <el-select v-model="employee.deptId" placeholder="请选择部门" style="width: 100%;">
              <el-option v-for="dept in depts" :key="dept.id" :label="dept.name" :value="dept.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职日期">
            <el-date-picker v-model="employee.entryDate" type="date" style="width: 100%;" placeholder="选择日期"
              format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 第五行 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="头像">
            <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="employee.image" :src="employee.image" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 工作经历 -->
      <!-- 第六行 -->
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="工作经历">
            <el-button type="success" size="small" @click="addEmpExprItem">+ 添加工作经历</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 第七行 ...  工作经历 -->
      <el-row :gutter="3" v-for="(expr, exprIndex) in employee.exprList">
        <el-col :span="10">
          <el-form-item size="small" label="时间" label-width="80px">
            <el-date-picker type="daterange" v-model="expr.exprDate" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
              format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small" label="公司" label-width="60px">
            <el-input placeholder="请输入公司名称" v-model="expr.company"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small" label="职位" label-width="60px">
            <el-input placeholder="请输入职位" v-model="expr.job"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item size="small" label-width="0px">
            <el-button type="danger" @click="deleteExpr(exprIndex)">- 删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 10px 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 90%;
}

.avatar-uploader .avatar {
  width: 78px;
  height: 78px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  border-radius: 10px;
  /* 添加灰色的虚线边框 */
  border: 1px dashed var(--el-border-color);
}
</style>