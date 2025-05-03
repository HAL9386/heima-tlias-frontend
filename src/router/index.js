import { createRouter, createWebHistory } from 'vue-router'

import IndexView from '@/views/index/index.vue'
import ClazzView from '@/views/clazz/index.vue';
import StuView from '@/views/stu/index.vue';
import DeptView from '@/views/dept/index.vue';
import EmpView from '@/views/emp/index.vue';
import EmpReportView from '@/views/report/emp/index.vue';
import StuReportView from '@/views/report/stu/index.vue';
import LogView from '@/views/log/index.vue';
import LoginView from '@/views/login/index.vue';
import LayoutView from '@/views/layout/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  {
    path: '/',
    component: LayoutView,
    redirect: '/index',
    children: [
      { path: '/index', component: IndexView },
      { path: '/clazz', component: ClazzView },
      { path: '/stu', component: StuView },
      { path: '/dept', component: DeptView },
      { path: '/emp', component: EmpView },
      { path: '/empReport', component: EmpReportView },
      { path: '/stuReport', component: StuReportView },
      { path: '/log', component: LogView },
    ]
  },
  { path: '/login', component: LoginView },
  ]
})

export default router
