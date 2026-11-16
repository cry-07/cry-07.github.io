---
title: "方阵情况下求解线性方程组 Ax = b"
description: "围绕消元与可逆性，整理 LU 分解、转置、鞍点矩阵，以及有限差分与三对角矩阵的联系。"
---

# 方阵情况下求解线性方程组 Ax = b

<div class="chapter-meta"><span>LINEAR ALGEBRA · 02</span><span>37 分钟阅读</span></div>

## 消元保持行空间不变

初等行变换产生的新行是原来各行的线性组合，因此新行空间包含于原行空间。例如，把第 $i$ 行减去第 $j$ 行的 $\ell$ 倍： 

$$
r_i'=r_i-\ell r_j,\qquad i\ne j
$$

由于第 $j$ 行不变，这一步可以用 $r_i=r_i'+\ell r_j$ 撤销，原行也能表示为新行的线性组合。因此原行空间也包含于新行空间，两者相等

交换两行、把某行乘以非零常数同样可以撤销，所以每一步初等行变换都保持行空间不变，整个消元过程也保持行空间不变：

$$
\operatorname{Row}(A)=\operatorname{Row}(U)
$$

**行空间不变不意味着列空间也不变**。例如：
$$
A=\begin{bmatrix}1&1\\1&1\end{bmatrix}
\xrightarrow{r_2\leftarrow r_2-r_1}
U=\begin{bmatrix}1&1\\0&0\end{bmatrix}
$$

两者的行空间都是 $\operatorname{span}\{(1,1)\}$，但列空间分别为 

$$
C(A)=\operatorname{span}\left\{\begin{bmatrix}1\\1\end{bmatrix}\right\},
\qquad
C(U)=\operatorname{span}\left\{\begin{bmatrix}1\\0\end{bmatrix}\right\}
$$

两条直线的方向不同，维数相同

## 非零主元与列满秩

### 上三角矩阵列满秩等价于主对角线上没有零元

对角线上的零元必导致前面若干列线性相关

例如，第三个对角元为零的四阶上三角矩阵可以写成

$$
U=\begin{bmatrix}
a&b&c&d\\
0&e&f&g\\
0&0&0&h\\
0&0&0&i
\end{bmatrix}
$$

它的前三列为

$$
u_1=\begin{bmatrix}a\\0\\0\\0\end{bmatrix},\qquad
u_2=\begin{bmatrix}b\\e\\0\\0\end{bmatrix},\qquad
u_3=\begin{bmatrix}c\\f\\0\\0\end{bmatrix}
$$

由于上三角结构和第三个对角元为零，前三列的后两个坐标全为零，因此都位于二维子空间

$$
\left\{\begin{bmatrix}s\\t\\0\\0\end{bmatrix}:s,t\in\mathbb R\right\}
$$

而二维空间中的三个向量必然线性相关。

当 $a,e\ne0$ 时，还可以直接把第三列表示为前两列的线性组合，令 $\alpha u_1+\beta u_2=u_3$ ：

$$
\begin{cases}
a\alpha+b\beta=c,\\
e\beta=f
\end{cases}
\quad\Longrightarrow\quad
\beta=\frac{f}{e},\qquad
\alpha=\frac{c-b\beta}{a}
$$

所以第三列没有提供新的独立方向

综上：
$$
U\text{ 列满秩}
\quad\Longleftrightarrow\quad
u_{11},\ldots,u_{nn}\text{ 全部非零}
$$

### 行变换保持列之间的线性关系

对 $n\times n$ 方阵 $A$，$A$ 列满秩等价于上三角矩阵 $U$ 列满秩（也就是 $U$ 的主对角线上没有零元）

可以把整个消元过程写成
$$
U=EA
$$

其中 $E$ 是各步初等矩阵的乘积，必要的行交换也包含在内。每一步都可以撤销，因此 $E$ 可逆 

设 $A$ 的列为 $a_1,\ldots,a_n$，由矩阵分块乘法规则， $U$ 的对应列为 $Ea_1,\ldots,Ea_n$。考虑它们的线性组合（系数为 $x_1,...,x_n$ ），有： 

$$
x_1Ea_1+\cdots+x_nEa_n
=E(x_1a_1+\cdots+x_na_n)
$$

若原列组合为零，左乘 $E$ 后仍为零；反过来，若变换后的列组合为零，左乘 $E^{-1}$ 就得到 

$$
E^{-1}(x_1Ea_1+\cdots+x_nEa_n)
=x_1a_1+\cdots+x_na_n=0
$$

因此

$$
x_1a_1+\cdots+x_na_n=0
\quad\Longleftrightarrow\quad
x_1Ea_1+\cdots+x_nEa_n=0
$$

所以行变换虽然改变列向量本身，却完整保留了列之间的线性依赖关系，特别地，$A$ 的列线性无关当且仅当 $U$ 的列线性无关 

### 非零对角线保证齐次方程只有零解

若 $U$ 是对角线全非零的上三角矩阵，考虑 $Ux=0$。最后一行给出 

$$
u_{nn}x_n=0
$$

由于 $u_{nn}\ne0$，得到 $x_n=0$；代入倒数第二行，得到 $u_{n-1,n-1}x_{n-1}=0$，从而 $x_{n-1}=0$。逐行向上回代，最终得到 $x=0$ 

这说明 $U$ 的列只有零系数的组合才能得到零向量，因此各列线性无关。又因为

$$
Ax=0\quad\Longleftrightarrow\quad EAx=Ux=0
$$

所以 $A$ 的列也线性无关，即 $A$ 列满秩 

若缺少非零主元条件，例如

$$
U=\begin{bmatrix}1&1\\0&0\end{bmatrix},
\qquad
U\begin{bmatrix}1\\-1\end{bmatrix}=0
$$

虽然 $U$ 是上三角矩阵，但齐次方程存在非零解，两列线性相关，对应的原矩阵 $A$ 也不列满秩 

## 逆矩阵及其性质：

### 方阵可逆的等价条件

对 $n\times n$ 方阵 $A$，以下条件等价： 

| 视角 | 条件 |
|---|---|
| 逆运算 | 存在矩阵 $A^{-1}$，使 $AA^{-1}=A^{-1}A=I$ |
| 消元 | 允许行交换时，消元能得到 $n$ 个非零主元 |
| 列向量 | $A$ 的列向量线性无关，即列满秩 |
| 齐次方程 | $Ax=0$ 只有零解 |
| 一般方程 | 对每个 $b\in\mathbb R^n$，$Ax=b$ 都有唯一解，且 $x=A^{-1}b$ |
| 行列式 | $\det A\ne0$ |

其中，$Ax=0$ 存在非零解就意味着有一组不全为零的系数使 $A$ 的列组合为零，因此列向量线性相关，$A$ 不可逆。行列式判据适用于任意阶方阵，其具体理论在后续展开 

### 方阵列满秩等价于方阵可逆

#### 充分性：

先构造矩阵 $B$，再证明它同时满足 $AB=I$ 和 $BA=I$，最后才能把它记为 $A^{-1}$ 

<strong>构造右逆 $AB=I$</strong> 

$A$ 的 $n$ 个列向量是 $\mathbb R^n$ 中的 $n$ 个线性无关向量，因此构成一组基，能唯一表示 $\mathbb R^n$ 中的每个向量。特别地，对单位矩阵的每一列 $e_j$，都存在唯一的系数向量 $b_j$，满足 

$$
Ab_j=e_j,\qquad j=1,\ldots,n
$$

将这些系数向量排成矩阵，利用矩阵乘法的列视角得到

$$
B=\begin{bmatrix}b_1&\cdots&b_n\end{bmatrix},\qquad
AB=\begin{bmatrix}Ab_1&\cdots&Ab_n\end{bmatrix}
=\begin{bmatrix}e_1&\cdots&e_n\end{bmatrix}=I
$$

<strong>证明同一个 $B$ 也是左逆</strong> 

由结合律和 $AB=I$，有 

$$
A(BA-I)=(AB)A-A=IA-A=0
$$

设 $BA-I$ 的第 $j$ 列为 $z_j$，则上式意味着每一列都满足 $Az_j=0$。由于 $A$ 的列线性无关，齐次方程只有零解，所以所有 $z_j=0$，从而 

$$
BA-I=0,\qquad BA=I
$$

因此 $AB=BA=I$，构造出的 $B$ 就是 $A^{-1}$ 

#### 必要性

反过来，若 $A^{-1}$ 存在，则 

$$
Ax=0\quad\Longrightarrow\quad
x=A^{-1}Ax=A^{-1}0=0
$$

所以 $A$ 的列线性无关，双边逆存在与列满秩确实等价 

### 逆矩阵的唯一性

逆矩阵一旦存在就唯一。更具体地，如果 $B$ 是左逆、$C$ 是右逆，即 $BA=I$、$AC=I$，那么 

$$
B=BI=B(AC)=(BA)C=IC=C
$$

因此左逆与右逆必然是同一个矩阵

### 高斯-若尔当消元法求逆矩阵：

对 $n\times n$ 方阵 $A$，将单位矩阵放在右侧，对整个增广矩阵做相同的初等行变换。若 $A$ 可逆，则可以将左边化成 $I$，此时右边就是逆矩阵： 

$$
[A\mid I]\longrightarrow[I\mid A^{-1}]
$$

#### 求逆原理

把所有行变换合起来记为左乘矩阵 $E$，则 

$$
[A\mid I]\longrightarrow[EA\mid EI]=[EA\mid E]
$$

当左边变为 $I$ 时，$EA=I$

由于 $E$ 是初等矩阵的乘积，它可逆，故 $A=E^{-1}$，从而 $E=A^{-1}$。右边从 $I$ 出发，记录了整个消元变换，所以最终恰好得到 $A^{-1}$ 

从解方程的角度看，我们实际在求矩阵方程 $AX=I$，即同时求解 $Ax_j=e_j$（$j=1,\ldots,n$），这与前文构造 $A^{-1}$ 的思路相同

#### **消元步骤**

1. 构造增广矩阵 $[A\mid I]$ 
2. 在左边选取非零主元，必要时交换行；将主元所在行除以主元，使主元变为 $1$ 
3. 用主元行消去该列其他行的元素，使主元上下都为零；所有操作同时作用于右边
4. 若左边得到 $I$，读出右边的 $A^{-1}$ 

#### 矩阵不可逆的情况

若 $A$ 不可逆，左边的主元不足 $n$ 个，完成左边的行化简后至少有一行全零，无法化成 $I$。例如 

$$
\left[\begin{array}{cc|cc}
1&2&1&0\\
2&4&0&1
\end{array}\right]
\xrightarrow{r_2\leftarrow r_2-2r_1}
\left[\begin{array}{cc|cc}
1&2&1&0\\
0&0&-2&1
\end{array}\right]
$$

左边第二行全零，无法找到第二个主元；右边第二行分别使两个方程组出现 $0=-2$、$0=1$ 的矛盾，因此无法解出逆矩阵的两列 


## 矩阵乘积的可逆性与逆矩阵运算

### 同阶方阵的乘积可逆等价于各因子可逆

设 $A,B$ 都是 $n\times n$ 方阵，则 

$$
AB\text{ 可逆}\quad\Longleftrightarrow\quad A,B\text{ 均可逆}
$$

**由各因子可逆推出乘积可逆** 

若 $A,B$ 均可逆，构造 $B^{-1}A^{-1}$，利用结合律验证两个乘法顺序： 

$$
\begin{aligned}
(AB)(B^{-1}A^{-1})&=A(BB^{-1})A^{-1}=I,\\
(B^{-1}A^{-1})(AB)&=B^{-1}(A^{-1}A)B=I
\end{aligned}
$$

因此 $AB$ 可逆，且 $(AB)^{-1}=B^{-1}A^{-1}$ 

**由乘积可逆推出各因子可逆** 

先看 $B$：如果 $Bx=0$，则 $ABx=0$。由于 $AB$ 可逆，必有 $x=0$，因此 $B$ 的列线性无关。$B$ 是方阵，所以 $B$ 可逆 

再看 $A$：对任意 $y\in\mathbb R^n$，由于 $AB$ 可逆，都存在 $x$ 使 $ABx=y$。令 $z=Bx$，便有 $Az=y$，因此 $A$ 的列能张成整个 $\mathbb R^n$。$A$ 只有 $n$ 列，这 $n$ 列必须线性无关，所以 $A$ 也可逆 

### 乘积求逆时因子顺序反转

对同阶可逆方阵，有

$$
(AB)^{-1}=B^{-1}A^{-1},\qquad
(ABC)^{-1}=C^{-1}B^{-1}A^{-1}
$$

一般地，若 $A_1,\ldots,A_k$ 均为同阶可逆方阵，则 

$$
(A_1A_2\cdots A_k)^{-1}
=A_k^{-1}\cdots A_2^{-1}A_1^{-1}
$$

因为 $ABx$ 先对 $x$ 作用 $B$，再作用 $A$，恢复时必须先撤销 $A$，再撤销 $B$

## LU 分解

### 下三角矩阵记录消元倍数

LU 分解将方阵写成

$$
A=LU
$$

其中 $L$ 是主对角线全为 $1$ 的下三角矩阵，$U$ 是上三角矩阵。在不换行的消元过程中，$U$ 是消元结果，$L$ 的下三角元素 $\ell_{ij}$ 是用第 $j$ 个主元行消去第 $i$ 行元素时所用的倍数： 

$$
r_i\leftarrow r_i-\ell_{ij}r_j,\qquad i>j
$$

例如三阶情形为

$$
L=\begin{bmatrix}
1&0&0\\
\ell_{21}&1&0\\
\ell_{31}&\ell_{32}&1
\end{bmatrix},\qquad
U=\begin{bmatrix}
p_1&*&*\\
0&p_2&*\\
0&0&p_3
\end{bmatrix}
$$

这里先讨论不换行且所有主元非零的情形。将消元操作合起来记为 $E$，则 $EA=U$，反向撤销得到 

$$
A=E^{-1}U=LU,\qquad L=E^{-1}
$$

分解后求解 $Ax=b$ 可以分两步完成：先解下三角方程 $Lc=b$，再回代求解 $Ux=c$ 

例如，取矩阵：
$$
A=\begin{bmatrix}2&1&1\\4&5&3\\-2&5&6\end{bmatrix}
$$

第一个主元为 $2$。消去第一列下方的 $4$ 和 $-2$，倍数分别为 

$$
\ell_{21}=\frac42=2,\qquad \ell_{31}=\frac{-2}{2}=-1
$$

执行行变换：

$$
\begin{bmatrix}2&1&1\\4&5&3\\-2&5&6\end{bmatrix}
\xrightarrow{r_2\leftarrow r_2-2r_1}
\begin{bmatrix}2&1&1\\0&3&1\\-2&5&6\end{bmatrix}
\xrightarrow{r_3\leftarrow r_3-(-1)r_1}
\begin{bmatrix}2&1&1\\0&3&1\\0&6&7\end{bmatrix}
$$

第二个主元为 $3$，用当前第二行消去第三行中的 $6$，倍数为 $\ell_{32}=6/3=2$： 

$$
\begin{bmatrix}2&1&1\\0&3&1\\0&6&7\end{bmatrix}
\xrightarrow{r_3\leftarrow r_3-2r_2}
\begin{bmatrix}2&1&1\\0&3&1\\0&0&5\end{bmatrix}=U
$$

将三个倍数放在 $L$ 的对应位置，主对角线填 $1$，得到 

$$
L=\begin{bmatrix}1&0&0\\2&1&0\\-1&2&1\end{bmatrix}
$$

注意 $\ell_{31}=-1$：虽然实际操作是第三行加上第一行，$L$ 中记录的仍是公式 $r_3\leftarrow r_3-\ell_{31}r_1$ 中的倍数 $-1$，不额外变号。$\ell_{32}$ 则由第一轮消元后的 $6/3$ 得到，不能用原矩阵中的元素直接相除 

按行相乘可验证：

$$
LU=\begin{bmatrix}
u_1\\2u_1+u_2\\-u_1+2u_2+u_3
\end{bmatrix}
=\begin{bmatrix}
2&1&1\\
4&2+3&2+1\\
-2&-1+6&-1+2+5
\end{bmatrix}
=\begin{bmatrix}2&1&1\\4&5&3\\-2&5&6\end{bmatrix}=A
$$

其中 $u_1,u_2,u_3$ 为 $U$ 的三行。可见 $L$ 中的倍数正好给出从消元结果重建原矩阵各行的系数 

### 第一种证明：逐行重建原矩阵

设 $A$ 的第 $i$ 行为 $a_i$，$U$ 的第 $j$ 行为 $u_j$，均视为行向量 

不换行消元时，第 $j$ 行在被用作主元行之前，已消去了前 $j-1$ 列的元素，此时它就是最终的 $u_j$；之后的消元只改变更下面的行，不再改变这一行。因此，对原来的第 $i$ 行，依次减去的是已经确定的 $u_1,\ldots,u_{i-1}$ 的倍数： 

$$
u_i=a_i-\sum_{j=1}^{i-1}\ell_{ij}u_j
$$

移项便得到原行的重建公式：

$$
a_i=\ell_{i1}u_1+\cdots+\ell_{i,i-1}u_{i-1}+u_i
$$

例如第三行为

$$
a_3=\ell_{31}u_1+\ell_{32}u_2+u_3
$$

这恰好是 $LU$ 的第 $i$ 行：$L$ 的第 $i$ 行给出组合系数，$U$ 提供被组合的行。每一行都满足这个等式，所以 $A=LU$ 

### 第二种证明：逐次减去列乘行的秩一矩阵

每一轮消元也可以看成从剩余矩阵中减去一个秩一矩阵：$L$ 的一列乘以 $U$ 的一行 

第一轮取 $u_1$ 为 $A$ 的第一行，并令 

$$
\ell_1=\begin{bmatrix}1&\ell_{21}&\cdots&\ell_{n1}\end{bmatrix}^{T},\qquad
\ell_{i1}=\frac{a_{i1}}{a_{11}}
$$

外积 $\ell_1u_1$ 的第一行就是 $u_1$，第 $i$ 行为 $\ell_{i1}u_1$。因此 

$$
R_2=A-\ell_1u_1
=\left[\begin{array}{c|cccc}
0&0&0&\cdots&0\\\hline
0&*&*&\cdots&*\\
0&*&*&\cdots&*\\
\vdots&\vdots&\vdots&&\vdots\\
0&*&*&\cdots&*
\end{array}\right]
$$

$R_2$ 的第一行、第一列全为零，右下角留下第一轮消元后尚待处理的部分

第二轮取 $R_2$ 的第二行为 $u_2$，它的第一个分量为零；令 

$$
\ell_2=\begin{bmatrix}0&1&\ell_{32}&\cdots&\ell_{n2}\end{bmatrix}^{T}
$$

其中下面的倍数由当前剩余部分的第二列除以第二个主元得到。再作

$$
R_3=R_2-\ell_2u_2
=\left[\begin{array}{cc|ccc}
0&0&0&\cdots&0\\
0&0&0&\cdots&0\\\hline
0&0&*&\cdots&*\\
\vdots&\vdots&\vdots&&\vdots\\
0&0&*&\cdots&*
\end{array}\right]
$$

$R_3$ 前两行、前两列便全为零，右下角只剩 $(n-2)\times(n-2)$ 的部分待处理

一般地，令 $R_1=A$，第 $k$ 轮取当前 $R_k$ 的第 $k$ 行为 $u_k$，令 $\ell_k$ 的前 $k-1$ 个分量为零、第 $k$ 个分量为 $1$，下方为本轮消元倍数，则 
$$
R_{k+1}=R_k-\ell_ku_k
$$

每轮去掉剩余部分的一行一列，最后 $R_{n+1}=0$，所以 

$$
A=\ell_1u_1+\ell_2u_2+\cdots+\ell_nu_n
=\begin{bmatrix}\ell_1&\cdots&\ell_n\end{bmatrix}
\begin{bmatrix}u_1\\\vdots\\u_n\end{bmatrix}
=LU
$$

$\ell_k$ 的前 $k-1$ 个分量为零且第 $k$ 个分量为 $1$，保证 $L$ 是单位下三角矩阵；$u_k$ 的前 $k-1$ 个分量为零，保证 $U$ 是上三角矩阵 

### 顺序主子矩阵可逆与无需换行的消元

定义 $A$ 的左上角 $k\times k$ 子矩阵为 

$$
A_k=A_{1:k,\,1:k},\qquad k=1,\ldots,n
$$

它们称为顺序主子矩阵，特别地 $A_n=A$ 

存在等价关系： 
$$
\boxed{
\text{不换行消元得到 }n\text{ 个非零主元}
\quad\Longleftrightarrow\quad
A_1,\ldots,A_n\text{ 全部可逆}
}
$$

**必要性：非零主元保证每个左上角块可逆**

若消元不换行且所有主元非零，得到 $A=LU$。取 $L,U$ 左上角的 $k$ 阶块为 $L_k,U_k$，三角结构保证 

$$
\begin{bmatrix}L_k&0\\ *&*\end{bmatrix}
\begin{bmatrix}U_k&*\\0&*\end{bmatrix}
=\begin{bmatrix}L_kU_k&*\\ *&*\end{bmatrix},\qquad
A_k=L_kU_k
$$

$L_k$ 的对角线全为 $1$，$U_k$ 的对角线为前 $k$ 个非零主元，两者都可逆，所以 $A_k$ 可逆

**充分性：每个左上角块可逆保证下一个主元非零**

使用数学归纳法：

$A_1$ 可逆意味着 $p_1=a_{11}\ne0$，第一轮消元可以不换行进行 

假设前 $k-1$ 个主元都非零，前 $k-1$ 轮消元就能完成。对 $A_k$ 做相同的行变换，得到对角线为 $p_1,\ldots,p_k$ 的上三角矩阵。由于 $A_k$ 可逆，行变换后的矩阵仍可逆，因此 $p_k\ne0$，下一轮也无需换行 

这里对 $A_k$ 的运算与整个 $A$ 左上角块的运算一致：不换行时，前 $k$ 行只用前面的主元行消元，前 $k$ 列的计算不会用到后面的行或列

因此逐步推进，能得到全部非零主元及 $A=LU$ 

**仅有 LU 分解不要求所有顺序主子矩阵可逆**

若预先假设 $A$ 可逆，则：
$$
\boxed{
\text{存在单位下三角 } L \text{ 和上三角 } U \text{ 的分解 } A=LU \iff \text{所有 } A_k \text{ 可逆}
}
$$
如果不要求 $A$ 可逆，仅仅写成 $LU$ 并不足以推出所有 $A_k$ 可逆。例如 

$$
A=\begin{bmatrix}1&0\\0&0\end{bmatrix}
=I\begin{bmatrix}1&0\\0&0\end{bmatrix}
$$

已有 LU 分解，但 $A_2=A$ 不可逆

## 矩阵的转置及其运算性质

### 转置交换行与列

若 $A$ 为 $m\times n$ 矩阵，其转置 $A^T$ 为 $n\times m$ 矩阵，定义为 

$$
(A^T)_{ij}=A_{ji}
$$

即 $A$ 的第 $i$ 行变成 $A^T$ 的第 $i$ 列，原来位于 $(i,j)$ 的元素移到 $(j,i)$。例如 

$$
A=\begin{bmatrix}1&2&3\\0&0&4\end{bmatrix},\qquad
A^T=\begin{bmatrix}1&0\\2&0\\3&4\end{bmatrix}
$$

交换两次行列便恢复原矩阵：

$$
((A^T)^T)_{ij}=(A^T)_{ji}=A_{ij},\qquad (A^T)^T=A
$$

因此下三角矩阵的转置是上三角矩阵，反之亦然。这里讨论实矩阵，转置只交换下标 

### 加法与数乘的转置

对同型矩阵 $A,B$ 及实数 $c$，有 

$$
(A+B)^T=A^T+B^T,\qquad(cA)^T=cA^T
$$

逐元素验证即可：

$$
\begin{aligned}
((A+B)^T)_{ij}&=A_{ji}+B_{ji}=(A^T+B^T)_{ij},\\
((cA)^T)_{ij}&=cA_{ji}=(cA^T)_{ij}
\end{aligned}
$$

### 乘积转置时因子顺序反转

若 $A$ 为 $m\times n$ 矩阵，$B$ 为 $n\times p$ 矩阵，则 

$$
\boxed{(AB)^T=B^TA^T}
$$

先考虑一个列向量 $x\in\mathbb R^n$。设 $A$ 的各列为 $a_1,\ldots,a_n$，则 $Ax$ 是这些列的线性组合： 

$$
Ax=x_1a_1+\cdots+x_na_n
$$

将它转置，利用加法与数乘的转置规律，得到

$$
(Ax)^T=x_1a_1^T+\cdots+x_na_n^T
$$

而 $a_1^T,\ldots,a_n^T$ 正是 $A^T$ 的各行。左乘行向量 $x^T$，就是按相同的系数对这些行作线性组合，因此 

$$
x^TA^T=x_1a_1^T+\cdots+x_na_n^T=(Ax)^T
$$

再把 $B$ 按列写成 $B=[x_1\ x_2\ \cdots\ x_p]$，这里的 $x_j$ 表示 $B$ 的第 $j$ 个列向量。矩阵乘法按列计算为 

$$
AB=\begin{bmatrix}Ax_1&Ax_2&\cdots&Ax_p\end{bmatrix}
$$

转置将这些列变成行，对每一列应用刚证明的关系：

$$
(AB)^T=
\begin{bmatrix}(Ax_1)^T\\(Ax_2)^T\\\vdots\\(Ax_p)^T\end{bmatrix}
=
\begin{bmatrix}x_1^TA^T\\x_2^TA^T\\\vdots\\x_p^TA^T\end{bmatrix}
=
\begin{bmatrix}x_1^T\\x_2^T\\\vdots\\x_p^T\end{bmatrix}A^T
=B^TA^T
$$

因此，$AB$ 按列计算后再转置，恰好得到 $B^TA^T$ 按行计算的结果

反复应用两因子规律，可得

$$
(ABC)^T=C^TB^TA^T
$$

一般地，乘积各因子只要维度匹配，就有

$$
(A_1A_2\cdots A_k)^T=A_k^T\cdots A_2^TA_1^T
$$

### 转置与求逆可以交换顺序

若方阵 $A$ 可逆，则 $A^T$ 也可逆，且 

$$
\boxed{(A^T)^{-1}=(A^{-1})^T}
$$

分别对两个逆矩阵等式取转置，利用乘积逆序规律：

$$
\begin{aligned}
(A^{-1}A)^T=I&\quad\Longrightarrow\quad A^T(A^{-1})^T=I,\\
(AA^{-1})^T=I&\quad\Longrightarrow\quad (A^{-1})^TA^T=I
\end{aligned}
$$

所以 $(A^{-1})^T$ 是 $A^T$ 的双边逆。反过来，若 $A^T$ 可逆，对它应用同样结论，再利用 $(A^T)^T=A$，便知 $A$ 也可逆。因此 $A$ 与 $A^T$ 同时可逆或同时不可逆 

### 置换矩阵的转置就是逆矩阵

置换矩阵 $P$ 每行、每列恰有一个 $1$，其余元素为零。设各列为 $p_1,\ldots,p_n$，则同一列与自身的点积为 $1$，不同列的 $1$ 位于不同行，点积为 $0$，因此 

$$
(P^TP)_{ij}=p_i^Tp_j=
\begin{cases}1,&i=j,\\0,&i\ne j\end{cases}
$$

所以 $P^TP=I$。同理，各行的点积给出 $PP^T=I$，于是 

$$
P^{-1}=P^T
$$

从位置看，$P_{ij}=1$ 表示把输入的第 $j$ 个分量送到第 $i$ 个位置；转置将这个 $1$ 移到 $(j,i)$，恰好沿原路径送回 

### 从内积角度理解转置：

对向量 $x,y$，内积可写成 $x^Ty$；若 $x,y\in\mathbb R^n$，这是 $1\times n$ 与 $n\times1$ 的乘积，是一个数。外积 $xy^T$ 则为 $n\times n$ 矩阵，两者不同 

设 $A\in\mathbb R^{m\times n}$、$x\in\mathbb R^n$、$y\in\mathbb R^m$，由乘积的转置规律及结合律，得到 

$$
\boxed{(Ax)^Ty=x^T(A^Ty)}
$$

因为

$$
(Ax)^Ty=(x^TA^T)y=x^T(A^Ty)
$$

这表明，转置不仅是一种“交换行列”的操作，它还代表一种确定的作用——把矩阵从内积的一侧移到另一侧，同时保持结果不变。

#### 内积关系唯一确定转置

这个恒等式也可以作为转置的定义：寻找一个 $n\times m$ 矩阵 $B$，使对任意 $x\in\mathbb R^n$、$y\in\mathbb R^m$ 都有 

$$
(Ax)^Ty=x^TBy
$$

取 $x=e_j\in\mathbb R^n$、$y=e_i\in\mathbb R^m$，左边取出 $A$ 第 $j$ 列的第 $i$ 个元素，右边取出 $B$ 的第 $(j,i)$ 个元素，所以 

$$
(Ae_j)^Te_i=A_{ij}=e_j^TBe_i=B_{ji}
$$

由于这对所有 $i,j$ 都成立，必须有 $B=A^T$。因此内积关系与交换行列的定义等价；“对任意 $x,y$”保证这个矩阵被唯一确定 

#### 与列空间垂直等价于被转置映为零

$A$ 的所有可能输出组成列空间 $C(A)=\{Ax:x\in\mathbb R^n\}$。因此，对 $y\in\mathbb R^m$，有 

$$
\begin{aligned}
y\text{ 与 }C(A)\text{ 中所有向量垂直}
&\quad\Longleftrightarrow\quad (Ax)^Ty=0\quad\text{对所有 }x\\
&\quad\Longleftrightarrow\quad x^T(A^Ty)=0\quad\text{对所有 }x
\end{aligned}
$$

由于 $A^Ty\in\mathbb R^n$，可以取 $x=A^Ty$，得到 

$$
(A^Ty)^T(A^Ty)=\|A^Ty\|^2=0
$$

长度平方为零的向量只能是零向量，所以 $A^Ty=0$。反过来，若 $A^Ty=0$，则对任意 $x$ 都有 $(Ax)^Ty=x^T0=0$，因此 $y$ 与整个列空间垂直。综上 

$$
\boxed{
y\text{ 与 }C(A)\text{ 中所有向量垂直}
\quad\Longleftrightarrow\quad A^Ty=0
}
$$

这样，寻找列空间的垂直方向这一几何问题，就转化为求解齐次方程 $A^Ty=0$ 

### 对称矩阵及对称乘积

实方阵 $S$ 称为对称矩阵，当且仅当 

$$
S^T=S\quad\Longleftrightarrow\quad s_{ij}=s_{ji}
$$

若 $S$ 可逆且对称，则逆矩阵也对称，因为 

$$
(S^{-1})^T=(S^T)^{-1}=S^{-1}
$$

对任意实矩阵 $A\in\mathbb R^{m\times n}$，$A^TA$ 和 $AA^T$ 都是对称矩阵： 

$$
\begin{aligned}
(A^TA)^T&=A^T(A^T)^T=A^TA,\\
(AA^T)^T&=(A^T)^TA^T=AA^T
\end{aligned}
$$

其中 $A^TA$ 为 $n\times n$，$AA^T$ 为 $m\times m$，两者一般不同。其对角元分别是各列、各行与自身的点积，所以都是非负数

## 鞍点矩阵:

给定实矩阵 $A\in\mathbb R^{m\times n}$，其鞍点矩阵定义为： 

$$
S=\begin{bmatrix}I_m&A\\A^T&0_{n\times n}\end{bmatrix}
$$

$S$ 始终是 $(m+n)\times(m+n)$ 的对称方阵，满足 $S^T=S$ 

### 分块消元与分块 $LDL^T$ 分解 

将第二个块行减去 $A^T$ 乘以第一个块行，得到 

$$
\begin{bmatrix}I_m&0\\-A^T&I_n\end{bmatrix}
\begin{bmatrix}I_m&A\\A^T&0\end{bmatrix}
=
\begin{bmatrix}I_m&A\\0&-A^TA\end{bmatrix}
$$

这是块形式的上三角矩阵。再把上三角矩阵拆成块对角矩阵与单位上三角矩阵：

$$
\begin{aligned}
S
&=\begin{bmatrix}I_m&0\\A^T&I_n\end{bmatrix}
\begin{bmatrix}I_m&A\\0&-A^TA\end{bmatrix}\\
&=\underbrace{\begin{bmatrix}I_m&0\\A^T&I_n\end{bmatrix}}_L
\underbrace{\begin{bmatrix}I_m&0\\0&-A^TA\end{bmatrix}}_D
\underbrace{\begin{bmatrix}I_m&A\\0&I_n\end{bmatrix}}_{L^T}
\end{aligned}
$$

这里 $D$ 是**块对角矩阵**，其中的块为 $I_m$ 和 $-A^TA$，不要求 $-A^TA$ 本身是对角矩阵。这个分块恒等式对任意 $A$ 都成立

### 可逆性等价于 $A$ 列满秩：

$L$ 和 $L^T$ 总是可逆，它们的逆只需将非对角块换成负号

因此 $S$ 可逆当且仅当 $D$ 可逆；而 $D$ 的第一个块 $I_m$ 已可逆，故 
$$
S\text{ 可逆}\quad\Longleftrightarrow\quad A^TA\text{ 可逆}
$$

为了判断 $A^TA$，利用 

$$
x^TA^TAx=(Ax)^T(Ax)=\|Ax\|^2
$$

若 $Ax=0$，则 $A^TAx=0$；反过来，若 $A^TAx=0$，则 $\|Ax\|^2=0$，所以 $Ax=0$。于是 

$$
A^TAx=0\quad\Longleftrightarrow\quad Ax=0
$$

由于 $A^TA$ 是 $n\times n$ 方阵，它可逆等价于齐次方程只有零解，因此 

$$
\boxed{
S\text{ 可逆}
\quad\Longleftrightarrow\quad A^TA\text{ 可逆}
\quad\Longleftrightarrow\quad
\text{对所有 }x\in\mathbb R^n\setminus\{0\},\ Ax\ne0
}
$$

最后一个条件正是 $A$ 的列线性无关，即列满秩。它不要求 $A$ 为方阵

若 $m<n$，$A$ 不可能列满秩，此时 $S$ 必不可逆

## 有限差分与差分矩阵

### 中心差分与非中心差分

有限差分用有限个采样点的函数值近似导数。步长 $h>0$，“中心”指采样点相对求导位置是否对称

| 类型 | 采样位置 | 对 $u'(x)$ 的近似 |
|---|---|---|
| 向前差分 | $x,x+h$ | $\displaystyle\frac{u(x+h)-u(x)}h$ |
| 向后差分 | $x-h,x$ | $\displaystyle\frac{u(x)-u(x-h)}h$ |
| 中心差分 | $x-h,x+h$ | $\displaystyle\frac{u(x+h)-u(x-h)}{2h}$ |

在函数足够光滑时，泰勒展开给出

$$
\begin{aligned}
\frac{u(x+h)-u(x)}h&=u'(x)+\frac h2u''(x)+O(h^2),\\
\frac{u(x)-u(x-h)}h&=u'(x)-\frac h2u''(x)+O(h^2)
\end{aligned}
$$

从上述公式可以看出，两个单侧差分的误差为 $O(h)$ 

将两式相减，可得：
$$
u''(x)\approx\frac{u(x+h)-2u(x)+u(x-h)}{h^2}
$$

该公式的采样位置与系数关于 $x$ 对称，它的误差为 $O(h^2)$ 

### 四个内点上的负二阶差分矩阵

考虑如下函数，$f(x)$ 是 $u(x)$ 的负二阶导数，$u(x)$ 的边界值为 0 ：

$$
-u''(x)=f(x),\qquad 0<x<1,\qquad u(0)=u(1)=0
$$

将区间分成五段，取 $h=1/5$，网格为 

$$
x_i=ih,\qquad i=0,\ldots,5
$$

边界值 $u_0=u_5=0$ 已知，只把四个内点的值作为未知量： 

$$
U=\begin{bmatrix}u_1\\u_2\\u_3\\u_4\end{bmatrix},\qquad
F=\begin{bmatrix}f(h)\\f(2h)\\f(3h)\\f(4h)\end{bmatrix}
$$

其中 $u_i$ 代表“原函数值”，$f(ih)$ 代表“负二阶导数值” 

在每个内点用中心差分近似负二阶导数，得到差分方程： 
$$
\frac{-u_{i-1}+2u_i-u_{i+1}}{h^2}=f(ih),\qquad i=1,\ldots,4
$$

四个方程展开为

$$
\begin{cases}
(2u_1-u_2)/h^2=f(h),\\
(-u_1+2u_2-u_3)/h^2=f(2h),\\
(-u_2+2u_3-u_4)/h^2=f(3h),\\
(-u_3+2u_4)/h^2=f(4h)
\end{cases}
$$

首尾方程省略了为零的 $u_0,u_5$ 。把各行的系数排起来，便得到 
$$
\frac1{h^2}
\underbrace{\begin{bmatrix}
2&-1&0&0\\
-1&2&-1&0\\
0&-1&2&-1\\
0&0&-1&2
\end{bmatrix}}_K
\begin{bmatrix}u_1\\u_2\\u_3\\u_4\end{bmatrix}
=
\begin{bmatrix}f(h)\\f(2h)\\f(3h)\\f(4h)\end{bmatrix},\qquad
\frac{K}{h^2}U=F
$$

矩阵的每一行就是一个网格点处的差分方程，其中的 $[-1,2,-1]$ 依次作用于左邻点、当前点、右邻点；每个方程只涉及这三个位置，所以 $K$ 是三对角矩阵 

我们可以从如下两个方面考虑这个差分方程组：

#### 已知 U 时计算负二阶导数的近似值

给定内点值 $U$ ，也就是已知原函数值，目标是求出二阶导数的近似解 $F$ ：

$$
(F_{\mathrm{diff}})_i=\left(\frac{K}{h^2}U\right)_i=\frac{-u_{i-1}+2u_i-u_{i+1}}{h^2}
\approx-u''(ih)
$$

因此 $K/h^2$ 的作用是近似负二阶求导算子，用差分代替了求二阶导的计算：

$$
u\xrightarrow{-d^2/dx^2}-u'',\qquad
U\xrightarrow{K/h^2}F_{\mathrm{diff}}
$$

#### 已知 F 时反求原函数值的近似值

给定 $F$ ，也就是已知二阶导数值，目标是求出原函数值的近似解 $U$ ：

$$
\frac{K}{h^2}U=F
\quad\Longleftrightarrow\quad
KU=h^2F
$$

解这个线性方程组，就是在逆向求解差分方程，得到原函数近似值

### 矩阵 $K$ 的性质：

这里讨论两端固定、零边界条件下的 $n\times n$ 矩阵 

$$
K_n=\begin{bmatrix}
2&-1&&\\
-1&2&\ddots&\\
&\ddots&\ddots&-1\\
&&-1&2
\end{bmatrix}
$$

#### 三个直观的结构性质

1. **对称**：关于主对角线对称，$K_n^T=K_n$ 
2. **带状且稀疏**：只有主对角线及其上下相邻的两条对角线非零，是三对角矩阵；在 $n^2$ 个位置中只有 $3n-2$ 个非零元 
3. **各条对角线上的元素相同**：主对角线全为 $2$，相邻两条全为 $-1$，其余为零，称为托普利茨矩阵；这反映各内点使用相同的差分规则 

#### 可逆性与正定性：

可以通过对 $K_n$ 进行消元的方式来判断它的性质

对 $K_n$ 消元时，三对角结构使每一步只需消去紧邻下一行的一个元素。第一个主元为 $p_1=2$，第一次消元的倍数为 $-1/2$，因此第二个主元为 
$$
p_2=2-\frac12=\frac32
$$

一般地，第 $k-1$ 行的主元为 $p_{k-1}$，右邻元素仍为 $-1$，消去下一行的 $-1$ 所用倍数为 $-1/p_{k-1}$，所以 

$$
p_k=2-\frac1{p_{k-1}}
$$

依次得到：

$$
p_1=2,\qquad p_2=\frac32,\qquad
p_3=\frac43,\qquad p_4=\frac54,\qquad
\boxed{p_k=\frac{k+1}{k}}
$$

所有主元都为正，因此 $K_n$ 可逆且正定（因为 $K_n$ 是对称的）

消元只使用某行减去另一行的倍数，不改变行列式；最终上三角矩阵的行列式为主元之积，因此 

$$
\det K_n
=\prod_{k=1}^{n}p_k
=\frac21\cdot\frac32\cdot\frac43\cdots\frac{n+1}{n}
=\boxed{n+1}
$$

特别地，四个内点对应的矩阵满足 $\det K_4=5$
