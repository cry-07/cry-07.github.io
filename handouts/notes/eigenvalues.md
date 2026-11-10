---
title: "特征值、谱分解与幂迭代"
description: "沿着特征方向理解矩阵，并用迭代估计特征值。"
---

# 特征值、谱分解与幂迭代

<div class="chapter-meta"><span>NUMERICAL METHODS · 7</span><span>28 分钟阅读</span></div>


## 特征值与实对称矩阵：

求解线性方程组时，可以构造迭代 $x^{(k+1)}=Bx^{(k)}+c$。设 $x^*$ 为不动点，误差为 $e^{(k)}=x^{(k)}-x^*$，则：

$$
e^{(k)}=B^ke^{(0)}
$$

对任意初值都收敛到唯一不动点，当且仅当 $B^k\to0$，等价于谱半径 $\rho(B)<1$ 

### 特征值、重数与谱定理：

若非零向量 $v$ 满足：

$$
Av=\lambda v
$$

则称 $\lambda$ 为特征值（eigenvalue），$v$ 为对应的特征向量（eigenvector）

定义特征多项式：

$$
\chi_A(t)=\det(tI-A)
$$

特征值恰好是它的根，即 $\chi_A(\lambda)=0$ 

| 概念 | 含义 | 
| --- | --- | 
| 代数重数 | $\lambda$ 作为特征多项式根的重数 | 
| 几何重数 | 对应特征空间的维数 $\dim\ker(A-\lambda I)$ | 

如果 $A$ 可对角化，每个特征值的代数重数与几何重数相等

## 实对称矩阵的谱分解：

### 谱定理：

任意实对称矩阵 $A$ ，一定可以正交对角化

即：存在正定矩阵 $V$ 和特征对角矩阵 $D$ ：
$$
V=(v_1,\ldots,v_n),\qquad
D=\operatorname{diag}(\lambda_1,\ldots,\lambda_n)
$$

使得：

$$
AV=VD
\quad\Longrightarrow\quad
\boxed{A=VDV^\top}
$$

这称为谱分解（spectral decomposition）。计算 $Ax$ 可以分成三个动作：

$$
x\ \xrightarrow{\ V^\top\ }\ y
\ \xrightarrow{\ D\ }\ Dy
\ \xrightarrow{\ V\ }\ Ax
$$

- $y=V^\top x$：求出 $x$ 在各个特征方向上的坐标
- $Dy$：第 $i$ 个坐标单独乘以 $\lambda_i$ 
- $VDy$：将结果转换回原坐标系

因此，谱分解将矩阵乘法化成了特征坐标上彼此独立的缩放

### 用正交投影表示：

对单位向量 $v_i$，矩阵 $v_iv_i^\top$ 表示 $v_i$ 所在直线的投影矩阵。因为矩阵乘法满足结合律，所以有：

$$
(v_iv_i^\top)x = v_i(v^T_ix) = c_iv_i
$$

考虑 $x$ 的展开式 ：
$$
\begin{align*}
x &= c_1v_1 + ... + c_nv_n \\
&= (v_1^Tx)v_1 + ... + (v_n^Tx)v_n \\
&= (v_1v_1^T)x + ... + (v_nv^T_n)x \\
&= \left( \sum_{i=1}^{n} v_i v_i^\top \right) x
\end{align*}
$$
所以有：
$$
I=\sum_{i=1}^n v_iv_i^\top,\qquad
\boxed{A=\sum_{i=1}^n\lambda_i v_iv_i^\top}
$$

于是：

$$
Ax=\sum_{i=1}^n\lambda_i(v_i^\top x)v_i
$$

也就是先把 $x$ 分解为各个方向上的投影，再分别缩放并相加

### 逆矩阵与伪逆：

如果所有 $\lambda_i\ne0$，每个特征方向上的缩放都可以还原，因此：

$$
A^{-1}=VD^{-1}V^\top
=\sum_{i=1}^n\frac{1}{\lambda_i}v_iv_i^\top
$$

如果某些特征值为 0，对应方向的信息会被消去，不能求逆

Moore–Penrose 伪逆只对非零特征值取倒数，零特征值对应部分仍取 0：
$$
\boxed{A^+=\sum_{i:\lambda_i\ne0}\frac{1}{\lambda_i}v_iv_i^\top}
$$

若 $A\succeq0$，且 $b$ 属于 $A$ 的列空间（说明方程有解），则 $x=A^+b$ 是 $Ax=b$ 的**最小范数解** 

这是因为 $b$ 只含非零特征值方向上的分量，$A^+$ 能在这些方向上还原出一个解。所有解均可写成：

$$
x=A^+b+z,\qquad z\in\ker A
$$

$A^+b$ 由非零特征值的特征向量组成，而 $z$ 由零特征值的特征向量组成，两部分正交，所以：

$$
\|A^+b+z\|_2^2=\|A^+b\|_2^2+\|z\|_2^2
$$

取 $z=0$ 时范数最小

### 迹、行列式与 Frobenius 范数：

对实对称矩阵 $A$，由谱分解可得：

$$
\operatorname{tr}(A)=\sum_{i=1}^n A_{ii}=\sum_{i=1}^n\lambda_i,
\qquad
\det(A)=\prod_{i=1}^n\lambda_i
$$

Frobenius 范数是所有矩阵元素平方和的平方根：

$$
\|A\|_F^2
=\sum_{i,j}A_{ij}^2
=\operatorname{tr}(A^\top A)
=\sum_{i=1}^n\lambda_i^2
$$

最后一步使用了实对称性：$A^\top A=A^2=VD^2V^\top$ 

## 正定矩阵与 Cholesky 分解：

### 正定与半正定：

对实对称矩阵 $A=A^\top$，考察二次型 $x^\top Ax$：

$$
\begin{align*}
A\succ0&\quad\Longleftrightarrow\quad x^\top Ax>0\quad(\forall x\ne0)\\
A\succeq0&\quad\Longleftrightarrow\quad x^\top Ax\ge0\quad(\forall x)
\end{align*}
$$

分别称为正定矩阵（positive definite）与半正定矩阵（positive semidefinite，PSD）

例如，$A=\operatorname{diag}(2,1)$ 对应 $x^\top Ax=2x_1^2+x_2^2$，非零 $x$ 的值总为正，因此正定；$A=\operatorname{diag}(1,0)$ 对应 $x_1^2$，在 $x=(0,1)^\top$ 时为 0，因此半正定但不正定

### 用特征值判断正定性：

对实对称矩阵：

$$
\boxed{A\succ0\ \Longleftrightarrow\ \lambda_i(A)>0\quad(\forall i)}
$$

必要性：若 $Av=\lambda v$ 且 $v\ne0$，则左乘 $v^T$ 有：

$$
0<v^\top Av=\lambda\|v\|_2^2
\quad\Longrightarrow\quad\lambda>0
$$

充分性：将非零向量展开为 $x=\sum_i\alpha_i v_i$，则有：
$$
\begin{align*}
Ax &= A(\alpha_1 v_1 + \cdots + \alpha_n v_n) 
\end{align*}
$$
又有：
$$
Av_i = \lambda v_i
$$
代入得：
$$
Ax = \sum_{i} \alpha_i \lambda_i v_i
$$
则有：
$$
\begin{align*}
x^\top Ax &= \left( \sum_{j} \alpha_j v_j^\top \right) \left( \sum_{i} \alpha_i \lambda_i v_i \right) \\
&=\sum_i\lambda_i\alpha_i^2>0
\end{align*}
$$

其中至少一个 $\alpha_i\ne0$，而所有 $\lambda_i>0$，因此总和严格为正

同理：

$$
A\succeq0\ \Longleftrightarrow\ \lambda_i(A)\ge0\quad(\forall i)
$$

### Cholesky 分解与消元：

一般高斯消元可能需要交换行，得到 $PA=LU$。对称正定矩阵则不需要交换行，而且可以分解为：

$$
\boxed{A=R^\top R},\qquad R\text{ 为上三角矩阵},\quad r_{ii}>0
$$

这称为 Cholesky 分解

从消元理解：先进行行消元 $L^{-1}A=U$ 

由于 $A$ 是实对称矩阵，故右乘 $L^{-T}$ 相当于对行做消元，最终可得到对角矩阵 $D$ ：
$$
L^{-1}AL^{-\top}=D
\quad\Longrightarrow\quad
A=LDL^\top
$$

其中 $D=\operatorname{diag}(d_i)$ 且 $d_i>0$ 

将正对角元开平方，令 $R=D^{1/2}L^\top$，就有：
$$
A=(D^{1/2}L^\top)^\top(D^{1/2}L^\top)=R^\top R
$$

因此正定二次型也能写成欧氏范数的平方：

$$
x^\top Ax=x^\top R^\top Rx=\|Rx\|_2^2
$$

#### 为什么每一步都能继续消元：

将对称正定矩阵分块为：

$$
A=\begin{bmatrix}a&r^\top\\r&B\end{bmatrix},\qquad a>0
$$

第一步消元可写为：

$$
A=
\begin{bmatrix}1&0\\r/a&I\end{bmatrix}
\begin{bmatrix}a&0\\0&B-rr^\top/a\end{bmatrix}
\begin{bmatrix}1&r^\top/a\\0&I\end{bmatrix}
$$

关键在于剩余部分 $S=B-rr^\top/a$ 仍然正定。对任意 $y\ne0$，取非零向量 $z=(-r^\top y/a,\ y^\top)^\top$，则：

$$
y^\top Sy=
\begin{bmatrix}-r^\top y/a\\y\end{bmatrix}^{\!\top}
A
\begin{bmatrix}-r^\top y/a\\y\end{bmatrix}>0
$$

因此可以对 $S$ 重复同样的过程，每次主元都为正，不需要通过交换行寻找非零主元

#### 计算例子：

设：

$$
A=\begin{bmatrix}4&2\\2&5\end{bmatrix},\qquad
R=\begin{bmatrix}r_{11}&r_{12}\\0&r_{22}\end{bmatrix}
$$

比较 $R^\top R=A$ 的元素：

$$
r_{11}^2=4,\qquad r_{11}r_{12}=2,\qquad r_{12}^2+r_{22}^2=5
$$

要求对角元为正，依次得到 $r_{11}=2,r_{12}=1,r_{22}=2$，所以：

$$
\begin{bmatrix}4&2\\2&5\end{bmatrix}
=\begin{bmatrix}2&0\\1&2\end{bmatrix}
\begin{bmatrix}2&1\\0&2\end{bmatrix}
$$

如果将右下角的 5 改为 1，则 $r_{22}^2=1-1=0$，不能得到正对角元。此时剩余部分为 0，矩阵只是半正定，不再正定

### Loewner 偏序：

对同阶实对称矩阵 $A,B$，定义：

$$
\boxed{A\succeq B\ \Longleftrightarrow\ A-B\succeq0
\ \Longleftrightarrow\ x^\top Ax\ge x^\top Bx\quad(\forall x)}
$$

它比较的是**所有方向上二次型的大小**，不是逐个比较矩阵元素

- 若 $\lambda_{\min}(A)\ge\lambda_{\max}(B)$，则 $A\succeq B$，这是充分条件

- 若 $A,B$ 有一组共同的标准正交特征向量，则 $A\succeq B$ 当且仅当每个共同方向上 $A$ 的特征值不小于 $B$ 的对应特征值

  证明：假设 $A,B$ 有共同的标准正交特征向量 $v_i,i = 1,...,n$ 

  那么与 3.2 同理：
  $$
  x^T A x = \sum c_i^2 \lambda_i(A), \quad x^T B x = \sum c_i^2 \lambda_i(B)
  $$
  要使得任意系数 $c_i$ ，都有 $x^\top Ax\ge x^\top Bx$ ，则当且仅当对每个方向 $i$ ，都有 $\lambda_i(A) \ge \lambda_i(B)$  

常见写法：

$$
\alpha I\preceq A\preceq\beta I
\quad\Longleftrightarrow\quad
\lambda_i(A)\in[\alpha,\beta]\quad(\forall i)
$$

## 特征值的范围：Gershgorin 圆盘定理

### Gershgorin 圆盘定理：

对任意 $A=(a_{ij})\in\mathbb C^{n\times n}$，定义：

$$
R_i=\sum_{j\ne i}|a_{ij}|,\qquad
D_i=\{z\in\mathbb C:|z-a_{ii}|\le R_i\}
$$

第 $i$ 个圆盘的圆心是对角元 $a_{ii}$，半径是该行所有非对角元的绝对值之和

Gershgorin 圆盘定理指出，所有特征值都位于这些圆盘的并集中：

$$
\boxed{\operatorname{spec}(A)\subseteq\bigcup_{i=1}^nD_i}
$$

这里 $\operatorname{spec}(A)$ 表示特征值的集合。非对角元越小，对应圆盘越小，特征值就只能出现在对角元附近；但不是说每个圆盘都必定包含一个特征值

### 证明：选择特征向量中最大的分量：

取任意特征值 $\lambda$ 及非零特征向量 $v$，选择 $|v_i|=\max_j|v_j|>0$。由 $Av=\lambda v$ 的第 $i$ 行：

$$
\sum_{j\ne i}a_{ij}v_j=(\lambda-a_{ii})v_i
$$

除以 $v_i$ 并取绝对值：

$$
\begin{align*}
|\lambda-a_{ii}|
&=\left|\sum_{j\ne i}a_{ij}\frac{v_j}{v_i}\right|\\
&\le\sum_{j\ne i}|a_{ij}|\frac{|v_j|}{|v_i|}\\
&\le\sum_{j\ne i}|a_{ij}|=R_i
\end{align*}
$$

最后一步来自 $|v_j/v_i|\le1$，因此 $\lambda\in D_i$。特征值任取，结论成立

### 用圆盘判断正定性：

例如：

$$
A=\begin{bmatrix}4&-1&0\\-1&3&-1\\0&-1&2\end{bmatrix}
$$

三个圆盘的圆心分别为 $4,3,2$，半径分别为 $1,2,1$，与实轴的交集为：

$$
D_1\cap\mathbb R=[3,5],\qquad
D_2\cap\mathbb R=[1,5],\qquad
D_3\cap\mathbb R=[1,3]
$$

由于 $A$ 实对称，特征值均在实轴上，因此 $\operatorname{spec}(A)\subseteq[1,5]$，得到：

$$
\lambda_{\min}(A)\ge1,\qquad A\succeq I\succ0
$$

一般地，若实对称矩阵满足：

$$
a_{ii}>\sum_{j\ne i}|a_{ij}|\qquad(\forall i)
$$

则所有圆盘与实轴的交集都在正半轴，因而矩阵正定

这里要求对角元本身为正，仅有 $|a_{ii}|>\sum_{j\ne i}|a_{ij}|$ 还不足以保证正定

## Rayleigh(瑞利) 商与 Courant–Fischer 定理：

### Rayleigh 商是特征值的加权平均：

对实对称矩阵 $A$，定义 Rayleigh 商（Rayleigh quotient）：

$$
R_A(x)=\frac{x^\top Ax}{x^\top x},\qquad x\ne0
$$

将 $x=\sum_i\alpha_i v_i$ 代入，有：

$$
R_A(x)=\frac{\sum_i\lambda_i\alpha_i^2}{\sum_i\alpha_i^2}
=\sum_i\frac{\alpha_i^2}{\sum_j\alpha_j^2}\lambda_i
$$

各权重非负且总和为 1，因此：

$$
\lambda_{\min}(A)\le R_A(x)\le\lambda_{\max}(A)
$$

取 $x = \lambda_i$ 时，等号成立

另一方面，定义残差 $r=Ax-R_A(x)x$，则：

$$
x^\top r=x^\top Ax-R_A(x)x^\top x=0
$$

所以 $R_A(x)x$ 正是 $Ax$ 在 $x$ 所在直线上的正交投影

那么 $R_A(x)x$ 代表的就是在 $x$ 这条直线上，与 $Ax$ 距离最近的向量

### 最大、最小与中间特征值：

不妨将特征值按代数大小排序：$\lambda_1\le\cdots\le\lambda_n$ 

由加权平均的上下界及取等条件，得到：
$$
\lambda_1=\min_{x\ne0}R_A(x),\qquad
\lambda_n=\max_{x\ne0}R_A(x)
$$

Rayleigh 商与 $x$ 的长度无关，故可令 $\| x \| = 1$ ，例如：

$$
\lambda_1=\min_{x^\top x=1}x^\top Ax
$$

若想得到中间的 $\lambda_k$，我们可以寻找一些特殊的 $x$ ：

- 令 $x$ 与 $v_1,...,v_{k-1}$ 垂直，排除更小特征值对应的方向，求得最小值
- 令 $x$ 与 $v_{k+1},...,v_n$ 垂直，排除更大特征值对应的方向，求得最大值

$$
\lambda_k=
\min_{\substack{x\ne0\\x\perp v_1,\ldots,v_{k-1}}}R_A(x)
=\max_{\substack{x\ne0\\x\perp v_{k+1},\ldots,v_n}}R_A(x)
$$

### Courant–Fischer 定理：

定理：矩阵的每一个特征值，都可以看作是瑞利商 $R_A(x)$ 在某个特定维度的子空间中“寻找最大值”和“寻找最小值”的结果

可以表述为：
$$
\lambda_k=
\min_{\substack{U\le\mathbb R^n\\\dim U=k}}
\ \max_{x\in U\setminus\{0\}}R_A(x)
$$

$$
\lambda_k=
\max_{\substack{U\le\mathbb R^n\\\dim U=n-k+1}}
\ \min_{x\in U\setminus\{0\}}R_A(x)
$$

$U\le\mathbb R^n$ 表示 $U$ 为子空间

第一式是先固定一个 $k$ 维子空间，在其中寻找最大的 Rayleigh 商，再从所有这样的子空间中选择这个最大值最小的一个

证明第一式，需要分别说明“任何选择都不能低于 $\lambda_k$”和“存在一种选择恰好达到 $\lambda_k$”

对任意 $k$ 维子空间 $U$，令 $S=\operatorname{span}(v_k,\ldots,v_n)$，则：

$$
\dim U+\dim S=k+(n-k+1)=n+1>n
$$

因此 $U\cap S$ 必有非零向量，因为 $\dim(U\cap S)=\dim U+\dim S-\dim(U+S)$，而 $\dim(U+S)\le n$ 

取其中的非零 $x$，它只含 $v_k,\ldots,v_n$ 的分量，所以 $R_A(x)\ge\lambda_k$，从而：

$$
\max_{y\in U\setminus\{0\}}R_A(y)\ge\lambda_k
$$

另一方面，选择 $U_*=\operatorname{span}(v_1,\ldots,v_k)$，其中所有向量的 Rayleigh 商都不超过 $\lambda_k$，且在 $v_k$ 处取等，因此：

$$
\max_{y\in U_*\setminus\{0\}}R_A(y)=\lambda_k
$$

下界可以达到，第一式得证

第二式同理：任意 $n-k+1$ 维子空间 $W$ 都与 $\operatorname{span}(v_1,\ldots,v_k)$ 有非零交向量，因此其中的最小 Rayleigh 商不超过 $\lambda_k$；选择 $W_*=\operatorname{span}(v_k,\ldots,v_n)$ 时恰好取等

### 谱范数、条件数与正规方程：

对任意实矩阵 $A$，$A^\top A$ 是实对称矩阵，而且：

$$
x^\top A^\top Ax=\|Ax\|_2^2\ge0
$$

因此 $A^\top A$ 总是半正定；当 $A$ 列满秩时，$x\ne0$ 保证 $Ax\ne0$，从而 $A^\top A$ 正定

由 Rayleigh 商的极值刻画：

$$
\|A\|_2^2
=\max_{\|x\|_2=1}x^\top A^\top Ax
=\lambda_{\max}(A^\top A)
$$

若 $A$ 可逆，则：

$$
\min_{\|x\|_2=1}\|Ax\|_2^2
=\lambda_{\min}(A^\top A)
=\|A^{-1}\|_2^{-2}
$$

最后一个等式来自变量替换 $y=Ax$：

$$
\|A^{-1}\|_2
=\max_{y\ne0}\frac{\|A^{-1}y\|_2}{\|y\|_2}
=\max_{x\ne0}\frac{\|x\|_2}{\|Ax\|_2}
=\frac{1}{\min_{x\neq0}\frac{\|Ax\|_2}{\|x\|_2}} 
=\frac{1}{\min_{x \neq 0}\|Ax\|_2}
$$

记矩阵条件数 $\kappa_2(A)=\|A\|_2\|A^{-1}\|_2$ 

对于正定矩阵 $A$，谱范数等于最大特征值，因此：
$$
\|A\|_2=\lambda_{\max}(A),\qquad
\kappa_2(A)=\frac{\lambda_{\max}(A)}{\lambda_{\min}(A)}
$$

把这个结论用于 $A^\top A$，由于 $A^TA$ 的特征值是 $A$ 特征值的平方，得到：

$$
\boxed{
\kappa_2(A^\top A)
=\frac{\lambda_{\max}(A^\top A)}{\lambda_{\min}(A^\top A)}
=\kappa_2(A)^2
}
$$

所以，虽然可逆方程组 $Ax=b$ 能转化为对称正定的正规方程 $A^\top Ax=A^\top b$，但条件数会变成原来的平方

例如 $A=\operatorname{diag}(1,10^{-3})$，有 $\kappa_2(A)=10^3$，而 $\kappa_2(A^\top A)=10^6$。这也是最小二乘问题通常采用 QR 分解，避免显式构造正规方程来放大数值误差的原因

## 矩阵多项式：

### 多项式作用于特征值：

给定多项式 $p(t)=c_0+c_1t+\cdots+c_mt^m$，定义：

$$
p(A)=c_0I+c_1A+\cdots+c_mA^m
$$

注意常数项对应 $c_0I$。如果 $Av=\lambda v$，则 $A^kv=\lambda^kv$，因此：

$$
\boxed{p(A)v=p(\lambda)v}
$$

对实对称矩阵 $A=VDV^\top$，有：

$$
\begin{align*}
p(A) &= Vp(D)V^\top \\
&=V 
\begin{pmatrix}
p(\lambda_1) & & \\
 & \ddots & \\
 & & p(\lambda_n)
\end{pmatrix}
V^T  \\
&= [p(\lambda_1)v_1, p(\lambda_2)v_2, \cdots, p(\lambda_n)v_n]V^T \\
&= p(\lambda_1)v_1 v_1^\top + p(\lambda_2)v_2 v_2^\top + \cdots + p(\lambda_n)v_n v_n^\top \\
&=\sum_i p(\lambda_i)v_iv_i^\top
\end{align*}
$$

将 $x=\sum_i\alpha_i v_i$ 代入：

$$
\begin{align*}
Ax&=\sum_i\alpha_i\lambda_i v_i\\
A^kx&=\sum_i\alpha_i\lambda_i^k v_i\\
p(A)x&=\sum_i\alpha_i p(\lambda_i)v_i
\end{align*}
$$

这说明矩阵多项式不改变原特征向量的特征向量身份，只把对应特征值从 $\lambda_i$ 变成 $p(\lambda_i)$。分析它对向量的作用时，可以直接考察各方向上的缩放，无须先展开 $p(A)$ 的所有元素

### 不同特征空间可能合并：

不同特征值经过多项式映射后，可能变成同一个数。例如：

$$
A=\operatorname{diag}(1,-1),\qquad p(t)=t^2,\qquad p(A)=I
$$

原来两个特征值分别为 $1,-1$，经过平方后都变为 1。于是原特征向量仍是 $p(A)$ 的特征向量，但 $p(A)$ 对应特征值 1 的特征空间扩大为整个 $\mathbb R^2$ 

## 幂迭代：

### 为什么不直接求特征多项式的根：

理论上可以求 $\det(\lambda I-A)=0$，但数值计算有两个困难：

- 多项式系数的小扰动可能使根显著偏移，例如 Wilkinson 多项式 $\prod_{j=1}^{20}(t-j)$ 
- 使用牛顿法或割线法时，需要反复计算特征多项式、导数或行列式，计算代价较高

而且，$|\det(\mu I-A)|$ 很小，并不保证 $\mu$ 接近某个特征值。例如 $A=0_{n\times n}$、$\mu=1/2$ 时：

$$
|\det(\mu I-A)|=2^{-n}\to0
$$

但所有特征值都是 0，与 $\mu$ 的距离始终为 $1/2$ 

幂迭代（power method）转而只做矩阵与向量的乘法，让某个特征方向逐渐占主导，以此求出矩阵的“主特征值”和对应的特征向量

### 具体过程：

假设 $A\in\mathbb R^{n\times n}$ 可在实数域对角化，并且有一个特征值的绝对值严格大于其余特征值：

$$
|\lambda_1|>|\lambda_2|\ge\cdots\ge|\lambda_n|
$$

**这里改为按特征值的绝对值排序**，与 Courant–Fischer 部分的代数大小排序不同

将初值展开为：

$$
x^{(0)}=\sum_{i=1}^n\alpha_i v_i,\qquad\alpha_1\ne0
$$

连续乘 $A$，得到：

$$
\boxed{
A^kx^{(0)}=\lambda_1^k\left(
\alpha_1v_1+\sum_{i=2}^n\alpha_i
\left(\frac{\lambda_i}{\lambda_1}\right)^k v_i
\right)
}
$$

由于 $|\lambda_i/\lambda_1|<1$，括号中除第一项外的其他分量都趋于 0。因此 $A^kx^{(0)}$ 的方向趋近 $v_1$ 所在的直线，最终可以得到关于 $\lambda_1$ 的一个特征向量

### 归一化幂迭代：

用上述方法得到的特征向量长度不固定，可能造成上溢或下溢，且我们无法求出 $\lambda_1$ 的值

可以使用归一化来解决这个问题：
$$
\boxed{
w^{(k+1)}=Ax^{(k)},\qquad
x^{(k+1)}=\frac{w^{(k+1)}}{\|w^{(k+1)}\|_2}
}
$$

归一化幂迭代收敛后，最终会得到一个单位特征向量 $v_i$ 

也可以用其他向量范数归一化，因为除以非零标量不改变方向

### 收敛速度与失效情况：

第 $i$ 个特征方向的系数为：

$$
\frac{\alpha_i}{\alpha_1}\left(\frac{\lambda_i}{\lambda_1}\right)^k
$$

因此非主导方向相对成分的衰减由 $|\lambda_2/\lambda_1|^k$ 控制

需要注意两种情况：

- **初值缺少主导方向**：若 $\alpha_1=0$，乘多少次 $A$ 都不会产生 $v_1$ 的分量，无法依靠这个初值得到目标方向
- **最大模并列**：例如 $A=\operatorname{diag}(2,-2)$，从 $(1,1)^\top$ 出发有 $A^kx^{(0)}=2^k(1,(-1)^k)^\top$，归一化后在两条不同直线间交替，方向不收敛

### 与线性方程组迭代的区别：

线性方程组迭代要求误差整体趋于 0，所以判断 $\rho(B)<1$ 

幂迭代通过归一化寻找主导方向，因此关注其他方向相对主导方向的比例 $|\lambda_i/\lambda_1|$，不要求 $\rho(A)<1$ 

## 用 Rayleigh 商估计特征值与误差：

### 由近似特征向量估计特征值：

幂迭代得到近似特征向量 $x\ne0$ 后，希望选取 $\mu$ 使 $Ax$ 尽量接近 $\mu x$，即：

$$
\min_{\mu\in\mathbb R}\|Ax-\mu x\|_2^2 \iff
\min_{\mu\in\mathbb R}\|x \mu - Ax \|_2^2
$$

这是一个只有一个未知系数 $\mu$ 的最小二乘问题。展开：
$$
\|Ax-\mu x\|_2^2
=\|Ax\|_2^2-2\mu x^\top Ax+\mu^2\|x\|_2^2
$$

使用最小二乘的通解： $x^\top(x\mu - Ax)=0$，得到：

$$
\boxed{\mu^*=\frac{x^\top Ax}{x^\top x}=R_A(x)}
$$

因此特称向量 $x$ 的 Rayleigh 商使残差最小

这个最小二乘推导本身对实矩阵都成立，不要求 $A$ 对称

### 利用残差估计特征值误差：

对实对称矩阵 $A$，取 $\|x\|_2=1$、$\mu\in\mathbb R$，定义残差：

$$
r=Ax-\mu x
$$

则至少存在一个特征值 $\lambda_j$，满足：

$$
\boxed{|\lambda_j-\mu|\le\|r\|_2}
$$

证明：将 $x=\sum_i\alpha_i v_i$ 展开，且 $\sum_i\alpha_i^2=1$，有：

$$
\begin{align*}
\|r\|_2^2
&=\left\|\sum_i\alpha_i(\lambda_i-\mu)v_i\right\|_2^2\\
&=\sum_i\alpha_i^2(\lambda_i-\mu)^2\\
&\ge\min_j|\lambda_j-\mu|^2\sum_i\alpha_i^2\\
&=\min_j|\lambda_j-\mu|^2
\end{align*}
$$

取平方根即可得到结论

令 $\mu=R_A(x)$ 后，就能利用可计算的残差判断这个估计值离某个真实特征值有多近

但这个结论只保证靠近**某个特征值**，不能仅凭残差小就断定找到了绝对值最大的特征值
