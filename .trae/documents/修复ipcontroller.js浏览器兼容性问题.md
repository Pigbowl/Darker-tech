## 优化目标

针对sitedashboard.html页面的手机端布局，优化顶部统计卡片：

1. 去除手机端卡片中的logo和额外信息
2. 仅保留标题和值
3. 降低手机端卡片内标题和值的字体大小下限

## 优化方案

### 1. 调整网格布局

**修改位置：** 第166行
**当前代码：**

```html
<div class="grid grid-cols-3 gap-4 sm:gap-6">
```

**修改后：**

```html
<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-6">
```

**说明：**

* 手机端从3列改为2列，减少拥挤感

* 调整间距，手机端使用更小的gap-3

### 2. 隐藏手机端不必要元素

**修改位置：** 每个卡片的图标和底部信息区域
**具体修改：**

#### 隐藏卡片图标

**当前代码：**

```html
<div class="p-2 sm:p-3 bg-neon/10 rounded-full">
    <i class="fa fa-line-chart text-neon text-lg sm:text-xl"></i>
</div>
```

**修改后：**

```html
<div class="hidden sm:flex p-2 sm:p-3 bg-neon/10 rounded-full">
    <i class="fa fa-line-chart text-neon text-lg sm:text-xl"></i>
</div>
```

#### 隐藏底部额外信息

**当前代码：**

```html
<div class="mt-auto flex items-center text-xs sm:text-sm">
    <span class="text-green-400 flex items-center">
        <i class="fa fa-arrow-up mr-1"></i> 12%
    </span>
    <span class="text-gray-500 ml-2">相比上月</span>
</div>
```

**修改后：**

```html
<div class="hidden sm:flex mt-auto items-center text-xs sm:text-sm">
    <span class="text-green-400 flex items-center">
        <i class="fa fa-arrow-up mr-1"></i> 12%
    </span>
    <span class="text-gray-500 ml-2">相比上月</span>
</div>
```

### 3. 优化字体大小

**修改位置：** 每个卡片的标题和值
**具体修改：**

#### 优化标题字体大小

**当前代码：**

```html
<p class="text-gray-400 text-xs sm:text-sm">总访问次数</p>
```

**修改后：**

```html
<p class="text-gray-400 text-[10px] sm:text-xs md:text-sm">总访问次数</p>
```

#### 优化值字体大小

**当前代码：**

```html
<h3 id="visit-count" class="text-2xl sm:text-3xl font-bold mt-
```

