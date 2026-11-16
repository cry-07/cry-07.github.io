import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import ImageZoom from '../../../handouts/.vitepress/theme/ImageZoom.vue';
import BlogReturn from '../../../handouts/.vitepress/theme/BlogReturn.vue';
import '../../../handouts/.vitepress/theme/custom.css';

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'layout-bottom': () => h(ImageZoom), 'nav-bar-content-after': () => h(BlogReturn) }),
};
