import { chapters } from './chapters.mjs';
import { cryptoChapters } from './crypto-chapters.mjs';
import { linearChapters } from './linear-chapters.mjs';
import { notesHref, cryptoHref, linearHref } from './site.config.mjs';

// 新专题在这里登记，首页专题入口与课程笔记列表同步生成。
export const courses = [
  { id: 'numerical', title: '计算方法', english: 'NUMERICAL METHODS', symbol: '∑', description: '从一个近似值，走向更清晰的答案。', detail: '公式推导 · 交互演示', chapters, link: notesHref },
  { id: 'crypto', title: '密码学原理', english: 'CRYPTOGRAPHY', symbol: '⊕', description: '从安全定义，走向证明与构造。', detail: '证明方法 · 历年试卷', chapters: cryptoChapters, link: cryptoHref },
  { id: 'linear', title: '线性代数', english: 'LINEAR ALGEBRA', symbol: 'ℝⁿ', description: '在线性组合与矩阵之间，连接代数与几何。', detail: '向量与矩阵 · 消元与分解', chapters: linearChapters, link: linearHref },
];
