---
title: 线性代数笔记（一）：向量和矩阵
date: 2026-11-16
description: 从线性组合、点积与几何出发，理解矩阵乘法的四种视角、CR 分解和秩一矩阵。
tags:
  - 线性代数
  - 学习笔记
---

## 线性组合与几何形态：

同一空间中的向量 $v,w$ 可以先数乘、再相加，得到线性组合（linear combination）$cv+dw$，其中 $c,d$ 为任意实数 

两个核心问题：

- 描述 $A$ 的列向量的所有线性组合
- 对给定的 $b$ ，找出满足 $Ax = b$ 的所有 $x_1,...,x_n$，即求解线性方程组

把向量并排写成矩阵的列，可将线性组合写成矩阵乘法：

$$
A=[v_1\ \cdots\ v_n],\qquad
Ax=x_1v_1+\cdots+x_nv_n
$$

其中 $A$ 为 $m\times n$ 矩阵，$x\in\mathbb R^n$，结果 $Ax\in\mathbb R^m$ 

固定 $A$、改变 $x$，所有输出组成 $A$ 的列空间（column space）；给定目标 $b$ 求解 $Ax=b$，就是寻找产生 $b$ 的组合系数 

### 线性组合集合的仿射性质：

设 $v,w\in\mathbb R^3$ 线性无关，记 $S=\{cv+dw:c,d\in\mathbb R\}$。这里“平坦”可以用仿射子空间的性质精确表达：**取集合中的任意两点，经过它们的整条直线仍在集合中** 

$$
p,q\in S\quad\Longrightarrow\quad (1-t)p+tq\in S,\qquad\forall t\in\mathbb R
$$

因为若 $p=cv+dw,q=Cv+Dw$，则

$$
(1-t)p+tq=((1-t)c+tC)v+((1-t)d+tD)w\in S
$$

这说明集合 $S$ 是仿射的

显然，又因为原点属于 $S$ ，所以 $S$ 是一个 **线性子空间**

## 点积与向量几何：

### 点积与夹角：

#### 单位向量的夹角：

在实欧氏空间中，点积按坐标定义为 $v\cdot u=\sum_i v_i u_i$，长度满足 $\|v\|^2=v\cdot v$。若 $v,u$ 均为单位向量，从同一个原点 $O$ 出发，其终点为 $P,Q$，则 $OP=OQ=1$，$PQ=\|v-u\|$，$\angle POQ=\theta\in[0,\pi]$ 

同一段距离的平方可以分别由几何和代数求出。由平面几何的余弦定理：

$$
\|v-u\|^2=1+1-2\cos\theta
$$

由坐标展开：

$$
\|v-u\|^2
=\sum_i(v_i-u_i)^2
=\|v\|^2+\|u\|^2-2v\cdot u
=2-2v\cdot u
$$

比较得 $v\cdot u=\cos\theta$ 

端点情况 $\theta=0,\pi$ 分别由 $u=v$ 与 $u=-v$ 直接验证

#### 一般非零向量的夹角：

当 $u,v \in R^n$  ，则其夹角等价于单位向量 $\frac{u}{\|u\|}$ 和 $\frac{v}{\|v\|}$ 的夹角

同上理（使用余弦定理），可得到：
$$
v \cdot u = \|u\|\|v\|\cos\theta
$$

### Schwarz 不等式与三角不等式：

对于同一实欧氏空间中的向量 $v,w$，展开和向量的长度平方，交叉项由 Schwarz 不等式控制：

$$
\begin{aligned}
\|v+w\|^2
&=\|v\|^2+2v\cdot w+\|w\|^2\\
&\le\|v\|^2+2\|v\|\|w\|+\|w\|^2\\
&=(\|v\|+\|w\|)^2
\end{aligned}
$$

其中唯一的不等号用到了Schwarz 不等式： $v\cdot w\le |v\cdot w|\le\|v\|\|w\|$  

因此，无论点积正负，交叉项都可以用 $2\|v\|\|w\|$ 作上界

两边非负，开平方得到 $\|v+w\|\le\|v\|+\|w\|$

### 法向量与过原点的平面：

设 $n=(n_1,n_2,n_3)^T\ne0$，则

$$
S=\{x\in\mathbb R^3:n\cdot x=0\}
$$

是一个过原点、与 $n$ 垂直的二维平面

关键在于 $n\ne0$：至少有一个坐标非零，因此方程给出了一个有效的线性约束 

例如 $n_3\ne0$ 时，

$$
n_1x_1+n_2x_2+n_3x_3=0
\quad\Longleftrightarrow\quad
x_3=-\frac{n_1}{n_3}x_1-\frac{n_2}{n_3}x_2
$$

$x_1,x_2$ 可以自由选取，$x_3$ 随之确定；等价地，

$$
x=x_1\begin{bmatrix}1\\0\\-n_1/n_3\end{bmatrix}
+x_2\begin{bmatrix}0\\1\\-n_2/n_3\end{bmatrix}
$$

这两个方向线性无关，因此集合恰好是二维平面

**法向量不必是单位向量：平面只取决于法向量的方向，不取决于其长度** 

**将 $n$ 乘以任意非零常数，不改变解集** 

令 $\widehat n=n/\|n\|$，因为 $\|n\|>0$，有

$$
n\cdot x=0
\quad\Longleftrightarrow\quad
\widehat n\cdot x=\frac{n\cdot x}{\|n\|}=0
$$

因此单位化前后描述的是同一个平面

## 矩阵乘向量的行、列视角：

设 $A=(a_{ij})\in\mathbb R^{m\times n}$，$x\in\mathbb R^n$，则 $Ax\in\mathbb R^m$。记 $A$ 的列为 $a_1,\ldots,a_n$ 

**从行来看，$Ax$ 的每个分量是 $x$ 与 $A$ 相应行向量的点积；从列来看，整个 $Ax$ 是 $A$ 的列向量以 $x$ 的分量为系数的线性组合** 
$$
\underbrace{(Ax)_i=\sum_{j=1}^n a_{ij}x_j}_{\text{行视角：计算第 }i\text{ 个分量}},
\qquad
\underbrace{Ax=\sum_{j=1}^n x_j a_j}_{\text{列视角：组合整个向量}}
$$

两种视角完全一致：列组合 $\sum_j x_j a_j$ 的第 $i$ 个分量正是 $\sum_j x_j a_{ij}$，也就是第 $i$ 行与 $x$ 的点积。行视角把结果按分量拆开，列视角把结果按来源向量合成

例如

$$
A=\begin{bmatrix}1&2\\3&4\\5&6\end{bmatrix},
\qquad x=\begin{bmatrix}7\\8\end{bmatrix}
$$

按行计算：

$$
Ax=\begin{bmatrix}1\cdot7+2\cdot8\\3\cdot7+4\cdot8\\5\cdot7+6\cdot8\end{bmatrix}
=\begin{bmatrix}23\\53\\83\end{bmatrix}
$$

按列组合：

$$
Ax=7\begin{bmatrix}1\\3\\5\end{bmatrix}
+8\begin{bmatrix}2\\4\\6\end{bmatrix}
=\begin{bmatrix}23\\53\\83\end{bmatrix}
$$

具体计算时，行视角便于逐项得到输出；理解列空间及方程 $Ax=b$ 时，列视角直接说明输出由哪些向量组合而来，以及 $x$ 如何提供组合系数

## 矩阵乘法的四种视角：

设 $A\in\mathbb R^{m\times n}$，$B\in\mathbb R^{n\times p}$，则 $AB\in\mathbb R^{m\times p}$。矩阵乘法可以按元素、按列、按行计算，也可以分解成列乘行的外积之和

### 矩阵乘法的定义（行乘列）：

**逐元素看，$AB$ 的第 $i$ 行、第 $j$ 列元素，是 $A$ 的第 $i$ 行与 $B$ 的第 $j$ 列的点积** 

$$
(AB)_{ij}=\sum_{k=1}^n a_{ik}b_{kj}
$$

### 列视角：

**按列看，$AB$ 的第 $j$ 列是 $A$ 乘以 $B$ 的第 $j$ 列；它是 $A$ 各列以 $B$ 第 $j$ 列的分量为系数的线性组合** 
$$
B=[b_1\ \cdots\ b_p]
\quad\Longrightarrow\quad
AB=[Ab_1\ \cdots\ Ab_p],
\qquad
Ab_j=\sum_{k=1}^n b_{kj}a_k
$$

其中 $a_k$ 是 $A$ 的第 $k$ 列。矩阵乘矩阵因此可以看成对 $B$ 的每一列分别进行矩阵乘向量运算

右乘看列，列给列赋权重

### 行视角：

**按整行看，$AB$ 的第 $i$ 行是 $A$ 的第 $i$ 行乘以 $B$；它是 $B$ 各行以 $A$ 第 $i$ 行的分量为系数的线性组合** 
$$
(AB)_{i,:}=A_{i,:}B=\sum_{k=1}^n a_{ik}B_{k,:}
$$

三种表达给出的第 $(i,j)$ 个元素都是 $\sum_k a_{ik}b_{kj}$，所以它们描述的是同一运算：行乘列给出一个数，按列组合给出一整列，按行组合给出一整行

左乘看行，行给行赋权重

### 列乘行：

**将 $A$ 的第 $k$ 列与 $B$ 的第 $k$ 行相乘，得到一个完整的矩阵，再对所有 $k$ 相加** 

记 $A$ 的第 $k$ 列为 $a_k$，$B$ 的第 $k$ 行为 $B_{k,:}$，则

$$
\boxed{AB=\sum_{k=1}^n a_k B_{k,:}}
$$

每项是 $(m\times1)$ 的列乘以 $(1\times p)$ 的行，结果为 $m\times p$ 矩阵，称为外积

非零列与非零行的外积秩为 1；若其中一个为零，结果为零矩阵

第 $k$ 个外积在位置 $(i,j)$ 的元素是 $a_{ik}b_{kj}$，因而

$$
\left(\sum_{k=1}^n a_k B_{k,:}\right)_{ij}
=\sum_{k=1}^n a_{ik}b_{kj}=(AB)_{ij}
$$

### 四种视角的计算对照：

取

$$
A=\begin{bmatrix}1&2\\3&4\end{bmatrix},\qquad
B=\begin{bmatrix}5&6\\7&8\end{bmatrix}
$$

**逐元素计算四个行列点积：** 
$$
AB=\begin{bmatrix}
1\cdot5+2\cdot7&1\cdot6+2\cdot8\\
3\cdot5+4\cdot7&3\cdot6+4\cdot8
\end{bmatrix}
=\begin{bmatrix}19&22\\43&50\end{bmatrix}
$$

**按列计算，分别用 $B$ 的两列提供系数，组合 $A$ 的列：** 
$$
\begin{aligned}
Ab_1&=5\begin{bmatrix}1\\3\end{bmatrix}
+7\begin{bmatrix}2\\4\end{bmatrix}
=\begin{bmatrix}5\\15\end{bmatrix}+\begin{bmatrix}14\\28\end{bmatrix}
=\begin{bmatrix}19\\43\end{bmatrix}\\
Ab_2&=6\begin{bmatrix}1\\3\end{bmatrix}
+8\begin{bmatrix}2\\4\end{bmatrix}
=\begin{bmatrix}6\\18\end{bmatrix}+\begin{bmatrix}16\\32\end{bmatrix}
=\begin{bmatrix}22\\50\end{bmatrix}
\end{aligned}
$$

将这两列并排拼成 $AB$：

$$
AB=[Ab_1\ Ab_2]=\begin{bmatrix}19&22\\43&50\end{bmatrix}
$$

**按行计算，分别用 $A$ 的两行提供系数，组合 $B$ 的行：** 
$$
\begin{aligned}
A_{1,:}B&=1\begin{bmatrix}5&6\end{bmatrix}
+2\begin{bmatrix}7&8\end{bmatrix}
=\begin{bmatrix}5&6\end{bmatrix}+\begin{bmatrix}14&16\end{bmatrix}
=\begin{bmatrix}19&22\end{bmatrix}\\
A_{2,:}B&=3\begin{bmatrix}5&6\end{bmatrix}
+4\begin{bmatrix}7&8\end{bmatrix}
=\begin{bmatrix}15&18\end{bmatrix}+\begin{bmatrix}28&32\end{bmatrix}
=\begin{bmatrix}43&50\end{bmatrix}
\end{aligned}
$$

将这两行上下拼成 $AB$：

$$
AB=\begin{bmatrix}A_{1,:}B\\A_{2,:}B\end{bmatrix}
=\begin{bmatrix}19&22\\43&50\end{bmatrix}
$$

**列乘行，分别计算两个外积，再将两个矩阵相加：**

$$
\begin{aligned}
a_1B_{1,:}
&=\begin{bmatrix}1\\3\end{bmatrix}\begin{bmatrix}5&6\end{bmatrix}
=\begin{bmatrix}1\cdot5&1\cdot6\\3\cdot5&3\cdot6\end{bmatrix}
=\begin{bmatrix}5&6\\15&18\end{bmatrix}\\
a_2B_{2,:}
&=\begin{bmatrix}2\\4\end{bmatrix}\begin{bmatrix}7&8\end{bmatrix}
=\begin{bmatrix}2\cdot7&2\cdot8\\4\cdot7&4\cdot8\end{bmatrix}
=\begin{bmatrix}14&16\\28&32\end{bmatrix}
\end{aligned}
$$

$$
AB=a_1B_{1,:}+a_2B_{2,:}
=\begin{bmatrix}5&6\\15&18\end{bmatrix}
+\begin{bmatrix}14&16\\28&32\end{bmatrix}
=\begin{bmatrix}19&22\\43&50\end{bmatrix}
$$

## 矩阵的 CR 分解：

### 定义与构造：

设 $A\in\mathbb R^{m\times n}$ 的秩为 $r$，则可分解为
$$
\boxed{A=CR},\qquad
C\in\mathbb R^{m\times r},\quad R\in\mathbb R^{r\times n}
$$

**$C$ 保存 $A$ 中独立的列，$R$ 记录用这些列重建 $A$ 各列的组合系数** 

- 构造 $C$：从左到右扫描 $A$ 的各列，只有当前列不能由已选列线性表示时才将其加入，最终选出 $r$ 个线性无关列，构成列空间的一组基
- 构造 $R$：将 $A$ 的每一列 $a_j$ 表示为 $C$ 各列的线性组合，系数向量 $r_j$ 满足 $Cr_j=a_j$，把它们并排组成 $R=[r_1\ \cdots\ r_n]$ 

由于 $C$ 的列线性无关，每个 $r_j$ 都唯一

例如：

$$
A=\begin{bmatrix}2&6&4\\4&12&8\\1&3&5\end{bmatrix}
=\underbrace{\begin{bmatrix}2&4\\4&8\\1&5\end{bmatrix}}_{C}
\underbrace{\begin{bmatrix}1&3&0\\0&0&1\end{bmatrix}}_{R}
$$

这里 $C=[a_1\ a_3]$，$R$ 的三列分别表示 $a_1=1a_1+0a_3$、$a_2=3a_1+0a_3$、$a_3=0a_1+1a_3$ 

### 列空间与行空间：

$A$ 与 $C$ 的列空间相同； $A$ 与 $R$ 的行空间相同

可以这样记忆：$C$ 就是 Column（列）， $R$ 就是 Row（行）

这个结论的前半部分是显然的，接下来证明后半部分：

- 证明 $\operatorname{Row}(A)\subseteq\operatorname{Row}(R)$ ：

  这是显然的。因为从矩阵乘法“行”的视角来看，$A$ 的所有行都是 $R$ 行的线性组合

- 证明 $\operatorname{Row}(A)\supseteq\operatorname{Row}(R)$ ：

  对 $C$ 作可逆的初等行变换，可以把它化成上部为 $I_r$、下部为零的矩阵；用 $E$ 表示这些变换，则
  $$
  EC=\begin{bmatrix}I_r\\0\end{bmatrix},\qquad
  EA=(EC)R=\begin{bmatrix}R\\0\end{bmatrix}
  $$
  初等行变换只重新组合各行，且变换可逆，所以行空间保持不变

  因此 $R$ 的各行都能由 $A$ 的行组合出来，即：
  $$
  \operatorname{Row}(A)\supseteq\operatorname{Row}(R)
  $$
  更进一步说：$R$ 是由 $A$ 的 **简化行阶梯形矩阵** 的非零行组成的，记为 $rref(A)$ 
  
  可以这样理解：
  
  - 若 $A$ 的第 $k$ 列 $a_k$ 被选作 $C$ 的第 $j$ 列，那么 $R$ 的第 $k$ 列一定是 $e_j$ ，即“主元”为 1 
  
  - 由于 $C$ 是 **从左到右** 依次选取线性无关的列，所以当有一列与前面的列线性相关时，它只能被它左边的列线性表出.对应在矩阵上就是： $R$ 一定具有行阶梯形结构（不要求是方阵）
  
  这实际上就是进行高斯消元的过程

综上，有：
$$
\operatorname{Row}(A)=\operatorname{Row}(R)
$$

具体看上例，记 $A$ 的三行为 $\alpha_1,\alpha_2,\alpha_3$，$R$ 的两行为 $\rho_1,\rho_2$。按 $C$ 各行提供的系数，有

$$
\alpha_1=2\rho_1+4\rho_2,\qquad
\alpha_2=4\rho_1+8\rho_2,\qquad
\alpha_3=\rho_1+5\rho_2
$$

反过来可以恢复：

$$
\begin{aligned}
\rho_2&=\frac13\left(\alpha_3-\frac12\alpha_1\right)
=\frac13\left(\begin{bmatrix}1&3&5\end{bmatrix}-\begin{bmatrix}1&3&2\end{bmatrix}\right)
=\begin{bmatrix}0&0&1\end{bmatrix}\\
\rho_1&=\frac12\alpha_1-2\rho_2
=\begin{bmatrix}1&3&2\end{bmatrix}-\begin{bmatrix}0&0&2\end{bmatrix}
=\begin{bmatrix}1&3&0\end{bmatrix}
\end{aligned}
$$

因此两组行向量能够互相生成。**$R$ 的行不必是 $A$ 原有的行，但它们张成同一个子空间**

## 秩一矩阵：

### 行秩与列秩相等：

列秩是列空间的维数，行秩是行空间的维数，也分别是最多能选出的线性无关列、行的数量。**秩一矩阵只有一个独立的列方向，同时也只有一个独立的行方向；两种方向所在的空间可以不同，但维数都为 1** 

设非零矩阵 $A\in\mathbb R^{m\times n}$ 的列秩为 1。选取任意非零列 $u\in\mathbb R^m$，则每一列都能写成 $u$ 的倍数。把这些倍数记为 $r_1,\ldots,r_n$，就有

$$
A=[r_1u\ \cdots\ r_nu]
=u\begin{bmatrix}r_1&\cdots&r_n\end{bmatrix}
=ur^T,\qquad u\ne0,\quad r\ne0
$$

观察第 $i$ 行：

$$
A_{i,:}=u_i\begin{bmatrix}r_1&\cdots&r_n\end{bmatrix}=u_i r^T
$$

因此所有行都由同一个行向量 $r^T$ 数乘而来，行秩至多为 1；又因为 $u\ne0$，至少有一个 $u_i\ne0$，对应行非零，所以行秩至少为 1。由此得到

$$
\boxed{\operatorname{rank}_{\mathrm{row}}(A)
=\operatorname{rank}_{\mathrm{col}}(A)=1}
$$

例如：
$$
A_6=\begin{bmatrix}1&3&-2\\4&12&-8\\2&6&-4\end{bmatrix}
=\begin{bmatrix}1\\4\\2\end{bmatrix}
\begin{bmatrix}1&3&-2\end{bmatrix}
$$

各列是 $(1,4,2)^T$ 的 $1,3,-2$ 倍，各行是 $(1,3,-2)$ 的 $1,4,2$ 倍。列空间是 $\mathbb R^3$ 中沿 $(1,4,2)^T$ 的直线，行空间是 $\mathbb R^3$ 中沿 $(1,3,-2)^T$ 的直线；**行秩等于列秩不表示行空间等于列空间**。对一般 $m\times n$ 矩阵，两者甚至分别位于 $\mathbb R^n$ 与 $\mathbb R^m$ 中 

### 两个秩一矩阵的乘积：

设 $A=uv^T$、$B=st^T$，其中 $u\in\mathbb R^m$，$v,s\in\mathbb R^n$，$t\in\mathbb R^p$ 均非零，则

$$
AB=(uv^T)(st^T)=u(v^Ts)t^T=(v^Ts)ut^T
$$

**中间的 $v^Ts$ 是一个标量，它决定乘积是否为零** 

$ut^T$ 的每列都是 $u$ 的倍数，且 $t\ne0$ 保证至少有一列非零，所以其秩恰为 1。于是
$$
\boxed{\operatorname{rank}(AB)=
\begin{cases}
1,&v^Ts\ne0,\\
0,&v^Ts=0
\end{cases}}
$$

当 $v$ 与 $s$ 正交时，两个非零秩一矩阵也可能相乘得到零矩阵。例如

$$
A=\begin{bmatrix}1&0\\0&0\end{bmatrix},\qquad
B=\begin{bmatrix}0&0\\0&1\end{bmatrix},\qquad
AB=\begin{bmatrix}0&0\\0&0\end{bmatrix}
$$

### 所有矩阵都能表示为秩一矩阵的和：

**秩为 $r>0$ 的矩阵，最少需要 $r$ 个秩一矩阵相加才能表示** 

- 证明：存在 $r$ 个秩一矩阵，它们的和等于 $A$ ：

  设 $A\in\mathbb R^{m\times n}$，由 CR 分解，

  $$
  A=CR,
  \qquad C=[c_1\ \cdots\ c_r],
  \qquad R=\begin{bmatrix}\rho_1\\\vdots\\\rho_r\end{bmatrix}
  $$

  按列乘行展开：

  $$
  A=c_1\rho_1+\cdots+c_r\rho_r
  $$

  $C$ 的各列非零，$R$ 的各行也非零（它们在相应主元列处含有 1），所以每项都是秩一矩阵

- 证明：至少需要 $r$ 个秩一矩阵，它们的和等于 $A$ ：

  若存在含 $k$ 个秩一矩阵的表示
  $$
  A=\sum_{i=1}^k u_i v_i^T,
  $$

  则 $A$ 的第 $j$ 列为 $\sum_{i=1}^k (v_i)_j u_i$，因此所有列都属于 $\operatorname{span}\{u_1,\ldots,u_k\}$，从而

  $$
  r=\dim\operatorname{Col}(A)
  \le\dim\operatorname{span}\{u_1,\ldots,u_k\}
  \le k
  $$

  所以不可能用少于 $r$ 项表示

---

下一篇：[线性代数笔记（二）：方阵情况下求解线性方程组 Ax = b](/posts/linear-algebra-02-solving-linear-systems/)
