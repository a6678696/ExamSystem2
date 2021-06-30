import Vue from 'vue'
import Router from 'vue-router'
import login from "../components/login";
import register from "../components/register";
import student from "../components/student";
import teacher from "../components/teacher";
import manager from "../components/manager";

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/student',
      name: 'student',
      component: student,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: teacher,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/manager',
      name: 'manager',
      component: manager,
      meta: {
        requireAuth: true
      }
    }
  ]
})

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  //判断该路由是否需要登录权限,不需要直接跳转
  if (!to.meta.requireAuth) {
    next();
  } else {
    let token = sessionStorage.getItem('token');
    //用于判断当前用户身份
    let type = sessionStorage.getItem('type');
    // 本地不存在token,跳转到登录界面
    if (token === null || token === '') {
      next('/login');
    } else {
      next();
      if (type === '学生') {
        next('/student');
      } else if (type === '教师') {
        next('/teacher');
      } else if (type === '管理员') {
        next('/manager');
      }
    }
  }
});

export default router;
