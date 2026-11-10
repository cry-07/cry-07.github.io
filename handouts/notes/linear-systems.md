---
title: "高斯消元、LU 分解与迭代法"
description: "从消元与回代，到 Jacobi、Gauss–Seidel 和谱半径。"
---

# 高斯消元、LU 分解与迭代法

<div class="chapter-meta"><span>NUMERICAL METHODS · 6</span><span>22 分钟阅读</span></div>


## 高斯消元与 LU 分解：

### 求解线性方程组：

给定矩阵 $A\in\mathbb R^{m\times n}$ 和向量 $b\in\mathbb R^m$，求 $x\in\mathbb R^n$，使得：

$$
Ax=b
$$

对于给定的 $A,b$，方程组只有三种可能：唯一解、无解、无穷多解

如果存在两个不同的解 $x,y$，那么任意 $t\in\mathbb R$ 都满足：

$$
A\bigl(x+t(y-x)\bigr)=Ax+t(Ay-Ax)=b
$$

因此，只要有两个不同的解，就有无穷多解

- 当 $m>n$ 时，$A$ 的列向量至多张成 $n$ 维空间，不能覆盖整个 $\mathbb R^m$，因此一定存在 $b$ 使方程无解
- 当 $m<n$ 时，齐次方程 $Ax=0$ 存在非零解，因此只要 $Ax=b$ 有解，就有无穷多解
- 对任意 $b$ 都存在唯一解，当且仅当 $A$ 是可逆方阵

下面讨论 $m=n$ 的情形。**解线性方程组与求矩阵的逆是两回事**：求解 $Ax=b$ 不要求先算出完整的 $A^{-1}$ 

### 初等行变换及其矩阵表示：

高斯消元法（Gaussian elimination）通过行变换，将方程组化为上三角方程组，再从最后一个未知量开始回代

行变换必须同时作用于 $A$ 和 $b$，即对增广矩阵 $[A\mid b]$ 进行操作。三种基本操作都可以写成左乘一个可逆矩阵，因此不会改变解集

#### 交换行：

交换两行相当于交换两个方程，可以用置换矩阵（permutation matrix）表示

令 $\sigma\in S_n$ 为 $[n]$ 上的一个置换，$e_j$ 为第 $j$ 个分量是 1、其余分量为 0 的单位向量，定义：

$$
P_\sigma=
\begin{bmatrix}
e_{\sigma(1)}^\top\\
e_{\sigma(2)}^\top\\
\vdots\\
e_{\sigma(n)}^\top
\end{bmatrix}
$$

则 $P_\sigma A$ 的第 $i$ 行就是 $A$ 的第 $\sigma(i)$ 行，$P_\sigma b$ 也按相同方式重排

#### 给一行乘上非零数：

左乘对角矩阵：

$$
D=\operatorname{diag}(c_1,c_2,\ldots,c_n),\qquad c_i\ne0
$$

相当于给第 $i$ 行乘上 $c_i$。只缩放某一行时，将其余对角元取为 1 即可

要求乘数非零，是为了保证变换可逆；乘以 0 会丢失原方程的约束

#### 在一行上减去另一行的倍数：

在第 $j$ 行减去第 $i$ 行的 $c$ 倍，其中 $i\ne j$，对应：

$$
E=I-ce_je_i^\top
$$

因为 $e_je_i^\top$ 只有第 $(j,i)$ 个元素为 1，所以 $EA$ 只有第 $j$ 行发生变化：

$$
R_j\leftarrow R_j-cR_i
$$

例如，取 $i=1,j=3,c=2$，要实现 $R_3\leftarrow R_3-2R_1$：

$$
e_3e_1^\top=
\begin{bmatrix}0\\0\\1\end{bmatrix}
\begin{bmatrix}1&0&0\end{bmatrix}
=\begin{bmatrix}0&0&0\\0&0&0\\1&0&0\end{bmatrix},
\qquad
E=I-2e_3e_1^\top=
\begin{bmatrix}1&0&0\\0&1&0\\-2&0&1\end{bmatrix}
$$

左乘时，$E$ 的每一行指定如何组合 $A$ 的各行：前两行保持原样，第三行 $[-2,0,1]$ 表示取 $-2R_1+R_3$ 

$$
\underbrace{\begin{bmatrix}1&0&0\\0&1&0\\-2&0&1\end{bmatrix}}_{E}
\underbrace{\begin{bmatrix}2&3&1\\4&7&6\\5&8&9\end{bmatrix}}_{A}
=\underbrace{\begin{bmatrix}2&3&1\\4&7&6\\1&2&7\end{bmatrix}}_{EA}
$$

又因为 $e_i^\top e_j=0$，有 $(e_je_i^\top)^2=0$，所以：

$$
(I+ce_je_i^\top)(I-ce_je_i^\top)=I
$$

即：

$$
E^{-1}=I+ce_je_i^\top
$$

逆变换就是把减去的 $c$ 倍加回来

### 消元与回代：

假设当前主元 $a_{11}\ne0$，为了消去第二行的 $a_{21}$，取：

$$
c=\frac{a_{21}}{a_{11}},\qquad R_2\leftarrow R_2-cR_1
$$

对应的增广矩阵变化为：

$$
\begin{bmatrix}
a_{11}&a_{12}&\cdots&a_{1n}&\mid&b_1\\
a_{21}&a_{22}&\cdots&a_{2n}&\mid&b_2
\end{bmatrix}
\longrightarrow
\begin{bmatrix}
a_{11}&a_{12}&\cdots&a_{1n}&\mid&b_1\\
0&a_{22}-\dfrac{a_{21}}{a_{11}}a_{12}&\cdots&
a_{2n}-\dfrac{a_{21}}{a_{11}}a_{1n}&\mid&
b_2-\dfrac{a_{21}}{a_{11}}b_1
\end{bmatrix}
$$

一般地，在第 $i$ 步，用当前第 $i$ 行消去第 $i$ 列下方的元素：

$$
R_j\leftarrow R_j-\frac{a_{ji}}{a_{ii}}R_i,\qquad j=i+1,\ldots,n
$$

这里的 $a_{ji},a_{ii}$ 都指**经过前面消元后当前矩阵中的元素** 

由于第 $i$ 行在前 $i-1$ 列已经为 0，用它消去下面的元素不会破坏前面已经得到的零元素。依次处理各列后得到：

$$
Ux=y
$$

其中 $U$ 为上三角矩阵，$y$ 为对 $b$ 作相同行变换后的向量

若 $U$ 的对角元都非零，最后一行只含 $x_n$，求出后再逐行向上代入：

$$
x_n=\frac{y_n}{u_{nn}},\qquad
x_i=\frac{y_i-\displaystyle\sum_{j=i+1}^n u_{ij}x_j}{u_{ii}},
\quad i=n-1,\ldots,1
$$

### 从消元得到 LU 分解：

先假设不需要交换行、列，只用下方行减去上方行的倍数进行消元

设依次使用的消元矩阵为 $E_1,E_2,\ldots,E_k$，则：

$$
\begin{align*}
Ax&=b\\
E_1Ax&=E_1b\\
E_2E_1Ax&=E_2E_1b\\
&\ \vdots\\
E_k\cdots E_2E_1Ax&=E_k\cdots E_2E_1b
\end{align*}
$$

记：

$$
M=E_k\cdots E_2E_1,\qquad U=MA
$$

每次消元的形式都是 $I-ce_je_i^\top$，其中 $j>i$，因此每个 $E_r$ 都是对角元为 1 的下三角矩阵，它们的乘积 $M$ 也是这样的下三角矩阵

由 $MA=U$ 得：

$$
\boxed{A=LU},\qquad
L=M^{-1}=E_1^{-1}E_2^{-1}\cdots E_k^{-1}
$$

其中 $L$ 是对角元为 1 的下三角矩阵，$U$ 是上三角矩阵

LU 分解把求解 $Ax=b$ 拆成两个三角方程组：

$$
LUx=b
\quad\Longrightarrow\quad
\begin{cases}
Ly=b\\
Ux=y
\end{cases}
$$

先从上到下求解 $Ly=b$，再从下到上求解 $Ux=y$ 

### 主元选择与计算量：

消元时用于除法的元素称为主元（pivot）。如果当前位置为 0，必须先通过交换行或列寻找非零主元，例如：

$$
A=\begin{bmatrix}0&1\\1&1\end{bmatrix}
$$

它的第一个对角元为 0，但交换两行后就可以继续消元，因此**当前主元为 0 不代表矩阵奇异** 

即使主元非零，也可能需要选取更大的主元：除以很小的数会产生较大的消元倍数，使舍入误差更容易被放大

- 交换行对应左乘置换矩阵，同时重排 $b$ 
- 交换列对应右乘置换矩阵，同时改变未知量的排列，最后需要恢复未知量的对应顺序
- 如果在当前尚未处理的部分中，经过允许的交换仍找不到非零主元，方阵 $A$ 才是奇异的（singular），不能得到 $n$ 个非零主元

包含行交换时，分解形式通常写为 $PA=LU$；同时包含列交换时可写为 $PAQ=LU$。前面的 $A=LU$ 推导针对不需要交换的情形

每消去一个元素，需要更新一行中剩余的元素以及右端项，最多使用 $O(n)$ 次算术运算；需要消去的元素有 $O(n^2)$ 个，因此稠密矩阵的高斯消元最坏需要：

$$
O(n^3)
$$

## 线性方程组的迭代法：

### 为什么使用迭代法：

高斯消元适用范围广，但当 $n$ 很大时，$O(n^3)$ 的计算量可能过高。实际问题常常还具有以下特点：

- **矩阵稀疏**：只有 $O(n)$ 个非零元素，而消元过程中原来为 0 的位置可能变成非零，破坏稀疏性
- **已有较好的初始估计**：例如 $A,b$ 随时间变化，可以利用之前的解作为新问题的初始猜测
- **只要求近似解**：不必通过完整消元求出解，可以逐步改进当前估计

迭代法从初始向量 $x_0$ 出发，反复计算 $x_1,x_2,\ldots$，目标是让它们趋近 $Ax=b$ 的解。关键问题除了如何更新，还包括**更新是否收敛** 

### Jacobi 迭代：

#### 从二元方程组理解更新：

考虑：

$$
\begin{cases}
3u+v=5\\
u+2v=5
\end{cases}
\quad\Longrightarrow\quad
\begin{cases}
u=\dfrac{5-v}{3}\\[4pt]
v=\dfrac{5-u}{2}
\end{cases}
$$

Jacobi 迭代在计算新一轮的各个分量时，**全部使用上一轮的值**：

$$
\begin{cases}
u_{k+1}=\dfrac{5-v_k}{3}\\[4pt]
v_{k+1}=\dfrac{5-u_k}{2}
\end{cases}
$$

从 $(u_0,v_0)=(0,0)$ 出发：

$$
\begin{bmatrix}0\\0\end{bmatrix}
\longrightarrow
\begin{bmatrix}5/3\\5/2\end{bmatrix}
\longrightarrow
\begin{bmatrix}5/6\\5/3\end{bmatrix}
\longrightarrow
\begin{bmatrix}10/9\\25/12\end{bmatrix}
\longrightarrow\cdots
$$

最终收敛到 $(1,2)$ 

但将同一个方程组的两行交换，按新的对角元整理为：

$$
\begin{cases}
u+2v=5\\
3u+v=5
\end{cases}
\quad\Longrightarrow\quad
\begin{cases}
u_{k+1}=5-2v_k\\
v_{k+1}=5-3u_k
\end{cases}
$$

仍从 $(0,0)$ 出发，得到：

$$
\begin{bmatrix}0\\0\end{bmatrix}
\longrightarrow
\begin{bmatrix}5\\5\end{bmatrix}
\longrightarrow
\begin{bmatrix}-5\\-10\end{bmatrix}
\longrightarrow
\begin{bmatrix}25\\20\end{bmatrix}
\longrightarrow\cdots
$$

此时迭代发散。交换方程不改变解集，但会改变用于更新各个未知量的关系，因此会改变迭代的收敛性

#### 矩阵形式：

将系数矩阵拆成：

$$
A=L+D+U
$$

其中 $L$ 为严格下三角部分，$D$ 为对角部分，$U$ 为严格上三角部分

这里是将 $A$ 的三个部分**相加**，与前面的 $A=LU$ 分解不同；本节的 $L,U$ 均不包含对角元

假设所有 $a_{ii}\ne0$，则：

$$
Ax=b
\quad\Longleftrightarrow\quad
Dx=b-(L+U)x
\quad\Longleftrightarrow\quad
x=D^{-1}\bigl(b-(L+U)x\bigr)
$$

于是得到不动点迭代（fixed-point iteration）：

$$
\boxed{x_{k+1}=D^{-1}\bigl(b-(L+U)x_k\bigr)},\qquad k=0,1,\ldots
$$

按分量写为：

$$
(x_{k+1})_i=
\frac{1}{a_{ii}}\left(b_i-\sum_{j\ne i}a_{ij}(x_k)_j\right),
\qquad i=1,\ldots,n
$$

### Gauss-Seidel 迭代：

#### 立即使用已经更新的值：

Gauss-Seidel 迭代按顺序更新各个分量，**同一轮中已经算出的新值立即用于后续计算** 

对前面的二元方程组，更新规则为：

$$
\begin{cases}
u_{k+1}=\dfrac{5-v_k}{3}\\[4pt]
v_{k+1}=\dfrac{5-u_{k+1}}{2}
\end{cases}
$$

与 Jacobi 的区别在第二式：使用的是 $u_{k+1}$，而不是 $u_k$ 

从 $(0,0)$ 出发：

$$
\begin{bmatrix}0\\0\end{bmatrix}
\longrightarrow
\begin{bmatrix}5/3\\5/3\end{bmatrix}
\longrightarrow
\begin{bmatrix}10/9\\35/18\end{bmatrix}
\longrightarrow
\begin{bmatrix}55/54\\215/108\end{bmatrix}
\longrightarrow\cdots
$$

同样收敛到 $(1,2)$ 

#### 矩阵形式：

仍取 $A=L+D+U$，由：

$$
(L+D)x=b-Ux
$$

得到：

$$
\boxed{(L+D)x_{k+1}=b-Ux_k}
$$

也可以写为：

$$
x_{k+1}=(L+D)^{-1}(b-Ux_k)
$$

或沿用逐分量更新的形式：

$$
x_{k+1}=D^{-1}(b-Ux_k-Lx_{k+1})
$$

虽然等式两边都有 $x_{k+1}$，但计算某个分量时，只会用到前面已经算出的分量，不需要用它自己求自己

具体为：

$$
(x_{k+1})_i=
\frac{1}{a_{ii}}\left(
b_i-\sum_{j<i}a_{ij}(x_{k+1})_j
-\sum_{j>i}a_{ij}(x_k)_j
\right)
$$

计算时只需从上到下解一个下三角方程组，不必显式求出 $(L+D)^{-1}$ 

| 方法 | 同一轮中已更新的分量 | 迭代关系 | 
| --- | --- | --- | 
| Jacobi | 仍使用上一轮的旧值 | $Dx_{k+1}=b-(L+U)x_k$ | 
| Gauss-Seidel | 立即使用这一轮的新值 | $(L+D)x_{k+1}=b-Ux_k$ | 

### 线性迭代的收敛性：

#### 误差由迭代矩阵的幂决定：

一般的线性迭代可以写成：

$$
x_{k+1}=Ax_k+b
$$

<strong>$A$ 表示迭代矩阵（例如，在 Jacobi 变换中，有 $A = -D^{-1}(L+U)$ ），$b$ 表示迭代的常数项</strong> 

设 $x^*$ 为一个不动点，即 $x^*=Ax^*+b$，两式相减得到：

$$
x_{k+1}-x^*=A(x_k-x^*) \iff e_{k+1} = Ae_k
$$

反复代入：
$$
x_k-x^*=A^k(x_0-x^*) \iff e_{k} = A^ke_0
$$

定理：迭代方程对于任意初始值都收敛到同一个不动点，当且仅当 $A^k\to0$ 

证明：

- 如果 $A^k\to0$，那么对任意固定的 $x_0-x^*$，都有 $A^k(x_0-x^*)\to0$，因此 $x_k\to x^*$ 
- 反过来，如果任意初始值都收敛到 $x^*$，分别令 $x_0=x^*+e_j$，则 $A^ke_j\to0$。而 $A^ke_j$ 就是 $A^k$ 的第 $j$ 列，所有列都趋于 0，因此 $A^k\to0$ 

#### 不动点的存在与唯一性：

当 $A^k\to0$ 时，$I-A$ 一定可逆

否则存在 $v\ne0$ 使 $(I-A)v=0$，即 $Av=v$，进而 $A^kv=v$，与 $A^k\to0$ 矛盾

将迭代展开：

$$
\begin{align*}
x_k
&=A^kx_0+(I+A+\cdots+A^{k-1})b\\
&=A^kx_0+(I-A)^{-1}(I-A^k)b
\end{align*}
$$

其中有限等比求和来自：

$$
(I-A)(I+A+\cdots+A^{k-1})=I-A^k
$$

令 $k\to\infty$，得到：

$$
x_k\longrightarrow x^*=(I-A)^{-1}b
$$

这也说明极限与 $x_0$ 无关，且不动点唯一

### 用谱半径判断收敛：

#### 特征值与谱半径：

若 $\lambda\in\mathbb C$ 和非零向量 $v$ 满足：

$$
Av=\lambda v
$$

则称 $\lambda$ 为 $A$ 的特征值（eigenvalue），$v$ 为对应的特征向量（eigenvector）

因为 $(A-\lambda I)v=0$ 存在非零解，求特征值可以转化为求方程：

$$
\det(A-\lambda I)=0
$$

设 $A$ 的特征值为 $\lambda_1,\ldots,\lambda_n$，谱半径（spectral radius）定义为：

$$
\rho(A):=\max\{|\lambda_1|,|\lambda_2|,\ldots,|\lambda_n|\}
$$

它描述各个特征方向上最大的伸缩倍数的模

#### 收敛判据及理由：

$$
\boxed{\rho(A)<1\quad\Longleftrightarrow\quad\lim_{k\to\infty}A^k=0}
$$

先证明必要性。若 $A^k\to0$，对任意特征值 $\lambda$ 及对应的非零特征向量 $v$，都有：

$$
A^kv=\lambda^kv\longrightarrow0
$$

由于 $v\ne0$，必须有 $\lambda^k\to0$，也就是 $|\lambda|<1$。对所有特征值都成立，因此 $\rho(A)<1$ 

再看充分性。先假设 $A$ 可对角化，即特征向量 $v_1,\ldots,v_n$ 能在复数域上组成一组基，则任意向量 $u$ 可以写为：

$$
u=a_1v_1+\cdots+a_nv_n
$$

于是：

$$
A^ku=a_1\lambda_1^kv_1+\cdots+a_n\lambda_n^kv_n\longrightarrow0
$$

因为每个 $|\lambda_i|<1$，每一项都趋于 0。取 $u=e_j$，即可得到 $A^k$ 的每一列都趋于 0

因此，对线性迭代 $x_{k+1}=Ax_k+b$：

$$
\boxed{
\text{对任意初始值都收敛到唯一不动点}
\ \Longleftrightarrow\ A^k\to0
\ \Longleftrightarrow\ \rho(A)<1
}
$$

### 严格对角占优与两种迭代的收敛：

#### 严格对角占优：

回到原方程组 $Ax=b$，仍令 $A=L+D+U$ 

如果对每一行都有：

$$
\boxed{|a_{ii}|>\sum_{j\ne i}|a_{ij}|},\qquad i=1,\ldots,n
$$

则称 $A$ 严格对角占优（strictly diagonally dominant），注意比较的是**绝对值** 

例如：

$$
\begin{bmatrix}3&1\\1&2\end{bmatrix}
\quad\text{严格对角占优},\qquad
\begin{bmatrix}1&2\\3&1\end{bmatrix}
\quad\text{不严格对角占优}
$$

严格对角占优保证 $a_{ii}\ne0$，也保证 $A$ 可逆

证明可逆性：假设 $Av=0$ 有非零解，选取满足 $|v_m|=\max_j|v_j|>0$ 的分量。由第 $m$ 行：

$$
a_{mm}v_m=-\sum_{j\ne m}a_{mj}v_j
$$

得到：

$$
|a_{mm}||v_m|
\le\sum_{j\ne m}|a_{mj}||v_j|
\le\left(\sum_{j\ne m}|a_{mj}|\right)|v_m|
<|a_{mm}||v_m|
$$

产生矛盾，因此 $Av=0$ 只有零解，$A$ 可逆

#### Jacobi 迭代的谱半径：

Jacobi 迭代写为：

$$
x_{k+1}=-D^{-1}(L+U)x_k+D^{-1}b
$$

因此迭代矩阵为 $-D^{-1}(L+U)$。矩阵整体乘以 $-1$ 只会使特征值变号，不改变模，所以收敛条件为：

$$
\rho\bigl(D^{-1}(L+U)\bigr)<1
$$

若 $A$ 严格对角占优，设 $\lambda$ 为 $D^{-1}(L+U)$ 的任意特征值，$v\ne0$ 为对应特征向量，则：

$$
(L+U)v=\lambda Dv
$$

缩放 $v$，使最大的分量模为 1，并选取 $|v_m|=1$。第 $m$ 个分量满足：

$$
\lambda a_{mm}v_m=\sum_{j\ne m}a_{mj}v_j
$$

由于所有 $|v_j|\le1$，有：

$$
|\lambda||a_{mm}|
\le\sum_{j\ne m}|a_{mj}||v_j|
\le\sum_{j\ne m}|a_{mj}|
<|a_{mm}|
$$

所以 $|\lambda|<1$。特征值任取，因此谱半径小于 1

由此得到：<strong>若 $A$ 严格对角占优，则对任意 $b$ 和初始猜测，Jacobi 迭代都收敛到 $Ax=b$ 的唯一解</strong> 

#### Gauss-Seidel 迭代的谱半径：

Gauss-Seidel 迭代写为：

$$
x_{k+1}=-(L+D)^{-1}Ux_k+(L+D)^{-1}b
$$

因此其收敛条件为：

$$
\rho\bigl((L+D)^{-1}U\bigr)<1
$$

同样可以证明严格对角占优保证这个条件成立

设 $\lambda$ 是 $(L+D)^{-1}U$ 的特征值，$v\ne0$ 为对应特征向量，则：

$$
Uv=\lambda(L+D)v
$$

假设 $|\lambda|\ge1$，选择 $|v_m|=\max_j|v_j|>0$。第 $m$ 行给出：

$$
\lambda a_{mm}v_m
=\sum_{j>m}a_{mj}v_j-\lambda\sum_{j<m}a_{mj}v_j
$$

取绝对值，除以 $|\lambda|$，再利用 $1/|\lambda|\le1$：

$$
\begin{align*}
|a_{mm}||v_m|
&\le\frac{1}{|\lambda|}\sum_{j>m}|a_{mj}||v_j|
+\sum_{j<m}|a_{mj}||v_j|\\
&\le\sum_{j\ne m}|a_{mj}||v_j|\\
&\le\left(\sum_{j\ne m}|a_{mj}|\right)|v_m|\\
&<|a_{mm}||v_m|
\end{align*}
$$

产生矛盾，所以所有特征值都满足 $|\lambda|<1$ 

因此，<strong>若 $A$ 严格对角占优，则对任意 $b$ 和初始猜测，Gauss-Seidel 迭代也都收敛到唯一解</strong> 

严格对角占优是这两种迭代收敛的**充分条件**，不能把“不严格对角占优”直接等同于“迭代发散”；对任意初始值收敛的充要条件仍是对应迭代矩阵的谱半径小于 1
