import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Active from '../views/Active.vue';
import Profile from '../views/Profile.vue';
import Covid from '../views/Covid.vue';
import People from '../views/People.vue';
import Test from '../views/Test.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/activity',
    name: 'activity',
    component: Active
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
  },
  {
    path: '/covid',
    name: 'covie',
    component: Covid
  },
  {
    path: '/people',
    name: 'people',
    component: People
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
