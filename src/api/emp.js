import requset from '@/utils/request'

// 查询员工列表
export const queryAllApi = (searchEmp) => requset.get(`/emps
?name=${searchEmp.name}
&gender=${searchEmp.gender}
&begin=${searchEmp.begin}
&end=${searchEmp.end}
`)