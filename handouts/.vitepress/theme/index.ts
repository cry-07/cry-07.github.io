import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import ImageZoom from './ImageZoom.vue';
import NewtonDemo from './NewtonDemo.vue';
import CourseHome from './CourseHome.vue';
import BlogReturn from './BlogReturn.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'layout-bottom': () => h(ImageZoom), 'nav-bar-content-after': () => h(BlogReturn) }),
  enhanceApp({ app }) { app.component('NewtonDemo', NewtonDemo); app.component('CourseHome', CourseHome); },
};
