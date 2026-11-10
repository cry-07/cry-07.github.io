export const cryptoChapters = [
  { no: '01', slug: 'perfect-secrecy', title: '完美保密', group: '基础理论', file: '完美保密.md', summary: '从条件概率与不可区分游戏出发，理解完美保密、一次一密及其限制。' },
  { no: '02', slug: 'computational-security', title: '计算安全', group: '基础理论', file: '计算安全（Computational Security）.md', summary: '高效敌手、可忽略函数、EAV 安全与 PRG：从信息论走向计算安全。' },
  { no: '03', slug: 'stream-ciphers', title: '流密码', group: '基础理论', file: '流密码（Stream Cipher）.md', summary: '理解密钥流、状态更新、同步与异步模式，以及重复使用掩码带来的问题。' },
  { no: '04', slug: 'cpa-and-prf', title: 'CPA 安全与伪随机函数', group: '基础理论', file: 'CPA安全与伪随机函数（Security and Pseudoradom Functions）.md', summary: '从选择明文攻击到 PRF、PRP，用安全游戏与归约理解加密方案的构造。' },
  { no: '05', slug: 'block-ciphers', title: '分组密码', group: '基础理论', file: '分组密码（Block Cipher）.md', summary: '工作模式、SPN、Feistel、DES 与 AES，把设计思想和结构图连起来。' },
  { no: '06', slug: 'proof-methods', title: '密码学证明题型与解题方法', group: '证明方法', file: '密码学证明题型与解题方法.md', summary: '按证明目标整理概率计算、渐近分析、归约、混合论证、坏事件与反例构造。' },
  { no: '2023', slug: 'midterm-2023', title: '2023 密码学期中考试与解答', group: '历年试卷', file: '2023密码学期中考试（含解答）.md', summary: '从移位密码、可忽略函数和 PRG 变形，到 CPA 安全与 CFB-MAC。' },
  { no: '2025', slug: 'midterm-2025', title: '2025 期中试卷讲解', group: '历年试卷', file: '2025medium.md', summary: '围绕一次一密、PRG、PRF 和 CBC 变体逐题梳理解答与攻击思路。' },
];
