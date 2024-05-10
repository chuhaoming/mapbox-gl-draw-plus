---
outline: deep
---

## 快速安装

### @chmpr/draggable 包的安装

> dom的简单拖拽插件

@chmpr/draggable 下载安装：

::: code-group

```sh [npm]
 npm add @chmpr/draggable
```

```sh [pnpm]
 pnpm add @chmpr/draggable
```

```sh [yarn]
 yarn add @chmpr/draggable
```

:::

## 如何使用

#### 1. 创建Draggable实例

```ts
import { Draggable } from '@chmpr/draggable';
const parentDiv = document.createElement('div');
const dragDiv = document.createElement('div');
dragDiv.innerHTML = 'draggable me';
parentDiv.appendChild(btnElement);
const drag = new Draggable({
  dragDiv: dragDiv, //点击拖拽的dom
  target: parentDiv, //主体移动的dom
});
```
