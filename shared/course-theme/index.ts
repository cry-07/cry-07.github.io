import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import ImageZoom from '../../handouts/.vitepress/theme/ImageZoom.vue';
import BlogReturn from '../../handouts/.vitepress/theme/BlogReturn.vue';
import NewtonDemo from '../../handouts/.vitepress/theme/NewtonDemo.vue';
import CourseSidebar from './CourseSidebar.vue';
import CourseLanding from './CourseLanding.vue';
import '../../handouts/.vitepress/theme/custom.css';
export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'sidebar-nav-before': () => h(CourseSidebar),
    'layout-bottom': () => h(ImageZoom),
    'nav-bar-content-after': () => h(BlogReturn),
  }),
  enhanceApp({ app }) { app.component('NewtonDemo', NewtonDemo); app.component('CourseLanding', CourseLanding); },
};
