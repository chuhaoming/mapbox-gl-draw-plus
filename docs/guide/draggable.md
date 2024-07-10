---
outline: deep
---

## Quick install

### @chmpr/draggable package install

> dom的简单拖拽插件

@chmpr/draggable download and install:

::: code-group

```sh [npm]
 npm i @chmpr/draggable
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
