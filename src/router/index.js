import Vue from 'vue';
import VueRouter from 'vue-router';
import Profile from '../views/Profile.vue';
import Risk from '../views/Risk.vue';
import Visitor from '../views/Visitor.vue';
import Room from '../views/Room.vue';
import Onboard from '../views/Onboard.vue';
import Home from '../views/Home.vue';
// import ConnectionCard from '@/components/ConnectionCard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
  },
  {
    path: '/risk',
    name: 'risk',
    component: Risk
  },
  {
    path: '/Visitor',
    name: 'Visitor',
    component: Visitor
  },
  {
    path: '/Room',
    name: 'Room',
    component: Room
  },
  {
    path: '/onboard',
    name: 'onboard',
    component: Onboard
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
