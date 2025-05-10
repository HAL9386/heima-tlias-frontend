import requset from '@/utils/request'

// 查询员工列表
export const queryAllApi = (searchEmp, page, pageSize) => requset.get(`/emps
?name=${searchEmp.name}
&gender=${searchEmp.gender}
&begin=${searchEmp.begin}
&end=${searchEmp.end}
&page=${page}
&pageSize=${pageSize}
`)

// 新增员工
export const addApi = (emp) => requset.post('/emps', emp)

// 根据id查询员工
export const queryByIdApi = (id) => requset.get(`/emps/${id}`)

// 修改员工
export const updateApi = (emp) => requset.put('/emps', emp)