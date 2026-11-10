export const chapters = [
  { no: '1.1', slug: 'error-analysis', title: '误差分析', group: '分析与求根', file: '计算方法 1.1 误差分析.md', summary: '从前向误差、后向误差到条件数，理解计算结果为什么会偏离真实值。' },
  { no: '1.2', slug: 'root-finding', title: '二分法、牛顿法', group: '分析与求根', file: '计算方法 1.2 二分法、牛顿法.md', summary: '在区间收缩与切线迭代中，理解求根算法的直觉、收敛速度和局限。' },
  { no: '2', slug: 'interpolation', title: '插值、秘密分享、自纠错码', group: '插值与逼近', file: '计算方法 2 插值、秘密分享、自纠错码.md', summary: '用有限个点恢复多项式，再走向秘密分享与纠删码。' },
  { no: '3', slug: 'approximation', title: 'Chebyshev 多项式与函数逼近', group: '插值与逼近', file: '计算方法 3 Chebyshev多项式与函数逼近.md', summary: '从插值误差出发，理解最优节点、极小极大性质与函数空间。' },
  { no: '4', slug: 'least-squares', title: '最小二乘法与 QR 分解', group: '插值与逼近', file: '计算方法 4 最小二乘法与 QR 分解.md', summary: '把拟合写成投影问题，用正交分解寻找最接近的解。' },
  { no: '5', slug: 'fft', title: '快速傅里叶变换（FFT）', group: '变换与矩阵', file: '计算方法 5 快速傅里叶变换（FFT）.md', summary: '在系数与点值之间切换，循着单位根理解 FFT 的分治结构。' },
  { no: '6', slug: 'linear-systems', title: '高斯消元、LU 分解与迭代法', group: '变换与矩阵', file: '计算方法 6 高斯消元、LU分解与迭代法.md', summary: '从消元与回代，到 Jacobi、Gauss–Seidel 和谱半径。' },
  { no: '7', slug: 'eigenvalues', title: '特征值、谱分解与幂迭代', group: '变换与矩阵', file: '计算方法 7 特征值、谱分解与幂迭代.md', summary: '沿着特征方向理解矩阵，并用迭代估计特征值。' },
  { no: '8', slug: 'svd', title: '奇异值分解（SVD）', group: '变换与矩阵', file: '计算方法 8 奇异值分解（SVD）.md', summary: '把矩阵作用拆成建系、伸缩与摆放，理解低秩近似和图像压缩。' },
];
